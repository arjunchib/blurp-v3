import {
  RESTPostAPIApplicationCommandsJSONBody,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  APIInteraction,
  InteractionType,
  APIInteractionResponsePong,
  InteractionResponseType,
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  RESTPutAPIApplicationCommandsJSONBody,
  ComponentType,
  RESTGetAPIApplicationCommandsResult,
} from "discord-api-types/v10";
import { format } from "prettier";
import pascalcase from "pascalcase";
import { verifySignature } from "./utils";
import { Controller } from "./controller";
import type {
  ActionRow,
  InteractionResponse,
  MessageComponent,
  Model,
} from "./types";
import { Button } from "./index";
import { readdir } from "node:fs/promises";
import { isMatch } from "lodash-es";

interface Options {
  schema: {
    [name: string]: RESTPostAPIApplicationCommandsJSONBody;
  };
}

let gen = "";

export async function serve(options: Options) {
  if (globalThis.count >= 0) {
    globalThis.count += 1;
  } else {
    globalThis.count = 0;
  }
  console.log(globalThis.count);
  await processSchema(options);
  await generateSchema();
  await saveGen();
  const serverOptions = {
    fetch: handler,
    port: 8787,
  };
  if (!globalThis.server) {
    globalThis.server = Bun.serve(serverOptions);
  } else {
    // reload server
    globalThis.server.reload(serverOptions);
  }
}

async function generateSchema() {
  const dirs = await readdir("./schema");
  gen += "\n";
  gen += dirs
    .map((name, i) => {
      const nameNoExt = name.split(".").slice(0, -1).join(".");
      return `import { default as $${i} } from './schema/${nameNoExt}'`;
    })
    .join("\n");
  gen += "\n";
  gen += `export const schema = { ${dirs.map((_, i) => `$${i}`).join(",")} }`;
}

async function handler(req: Request) {
  // validate method
  if (req.method !== "POST") {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  // validate headers
  if (
    !req.headers.has("X-Signature-Ed25519") ||
    !req.headers.has("X-Signature-Timestamp")
  ) {
    return new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  //  verify signature
  const { valid, body } = await verifySignature(req);
  if (!valid) {
    return new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  // process request
  const interaction = JSON.parse(body) as APIInteraction;
  if (interaction.type === InteractionType.Ping) {
    const res: APIInteractionResponsePong = {
      type: InteractionResponseType.Pong,
    };
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    if (interaction.type !== InteractionType.ApplicationCommand)
      return {} as any;
    const name = interaction.data.name;
    const mod = await import(
      `${process.cwd()}/controllers/${name}.controller.ts`
    );
    const controller = new mod.default() as Controller<Model>;
    var respondWith: (res: InteractionResponse) => void;
    const promise = new Promise<InteractionResponse>((resolve, reject) => {
      respondWith = (res) => {
        resolve(res);
      };
    });
    waitUntil(
      controller.chatInput({
        raw: interaction as any,
        options: createOptions(interaction),
        respondWith,
        defer: () => {},
        followUp: () => {},
      })
    );
    const res = createResponse(await promise);
    console.log(res);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function createResponse(res: InteractionResponse): APIInteractionResponse {
  if (!res.components) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: res as any,
    };
  }
  let rawComponents: MessageComponent[][];
  if (!(res.components instanceof Array)) {
    rawComponents = [[res.components]];
  } else if (!(res.components[0] instanceof Array)) {
    rawComponents = [res.components];
  } else {
    rawComponents = res.components as any;
  }
  const components = rawComponents.map((row) => {
    const rowComponents = row.map((c) => (c as Button).raw);
    return {
      type: ComponentType.ActionRow,
      components: rowComponents,
    } satisfies ActionRow;
  }) as any;
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { ...res, components },
  };
}

function waitUntil(promise: Promise<any> | any): void {
  if (!(promise instanceof Promise)) return;
  promise.catch(console.error);
}

function createOptions(interaction: APIApplicationCommandInteraction) {
  if (interaction.data.type !== ApplicationCommandType.ChatInput) return {};
  const options = {};
  for (const opt of interaction.data.options) {
    if (
      opt.type === ApplicationCommandOptionType.Subcommand ||
      opt.type === ApplicationCommandOptionType.SubcommandGroup
    )
      continue;
    options[opt.name] = opt.value;
  }
  return options;
}

async function processSchema(options: Options) {
  const schema = Object.values(options.schema);
  const commands = await getGuildApplicationCommands();
  const hasMismatch = commands.some((command) => {
    const currentSchema = schema.find((s) => s.name === command.name);
    const isMismatch = !currentSchema || !isMatch(command, currentSchema);
    return isMismatch;
  });
  if (hasMismatch) {
    const res = await bulkOverwriteGuildApplicationCommands(schema);
    console.log("Uploaded application commands");
  }
  gen += schema.map((s) => createModel(s)).join("\n");
}

function createModel(schema: RESTPostAPIApplicationCommandsJSONBody) {
  const name = pascalcase(schema.name);
  const options = modelOptions(schema);
  return `export interface ${name} {
      options: {
        ${options}
      }
    }`;
}

async function saveGen() {
  const file = await Bun.file("blurp.gen.ts").text();
  const formattedGen = format(gen, { parser: "babel" });
  if (file !== formattedGen) {
    await Bun.write("blurp.gen.ts", formattedGen);
  }
}

function modelOptions(schema: RESTPostAPIApplicationCommandsJSONBody) {
  return schema.options
    .map(
      (opt) =>
        `
        /** ${opt.description} */
        ${opt.name}${opt.required ? "" : "?"}: ${dataTypeFrom(opt.type)}`
    )
    .join(",");
}

function interactionTypeFrom(type: ApplicationCommandType) {
  switch (type) {
    case ApplicationCommandType.Message:
      return "APIMessageApplicationCommandInteraction";
    case ApplicationCommandType.User:
      return "APIUserApplicationCommandInteraction";
    case ApplicationCommandType.ChatInput:
    default:
      return "APIChatInputApplicationCommandInteraction";
  }
}

function dataTypeFrom(type: ApplicationCommandOptionType) {
  switch (type) {
    case ApplicationCommandOptionType.String:
      return "string";
    case ApplicationCommandOptionType.Number:
      return "number";
    default:
      return "unknown";
  }
}

async function bulkOverwriteGuildApplicationCommands(
  commands: RESTPutAPIApplicationCommandsJSONBody
) {
  const { APPLICATION_ID, GUILD_ID, TOKEN } = process.env;
  return await fetch(
    `https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
    {
      headers: {
        Authorization: `Bot ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      method: "PUT",
    }
  );
}

async function getGuildApplicationCommands() {
  const { APPLICATION_ID, GUILD_ID, TOKEN } = process.env;
  return await fetch(
    `https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
    {
      headers: {
        Authorization: `Bot ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  ).then(async (res) => await res.json<RESTGetAPIApplicationCommandsResult>());
}
