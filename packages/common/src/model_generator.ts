import {
  ApplicationCommandOptionType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { RuntimeAdapter } from "./runtime_adapters/runtime_adapter";
import pascalcase from "pascalcase";
import { format } from "prettier";

export class ModelGenerator {
  constructor(private runtimeAdapter: RuntimeAdapter) {}

  async generate(schema: RESTPostAPIApplicationCommandsJSONBody[]) {
    const gen = schema.map((s) => this.createModel(s)).join("\n");
    const file = await this.runtimeAdapter.file?.("blurp.gen.ts").text();
    const formattedGen = format(gen, { parser: "babel" });
    if (file !== formattedGen) {
      await this.runtimeAdapter.write?.("blurp.gen.ts", formattedGen);
    }
  }

  private createModel(schema: RESTPostAPIApplicationCommandsJSONBody) {
    const name = pascalcase(schema.name);
    const options = this.modelOptions(schema);
    return `export interface ${name} {
        ${options},
      }`;
  }

  private modelOptions(schema: RESTPostAPIApplicationCommandsJSONBody) {
    if (!schema.options) {
      return "";
    }
    const options = schema.options
      .map(
        (opt) =>
          `
          /** ${opt.description} */
          ${opt.name}${opt.required ? "" : "?"}: ${this.dataTypeFrom(opt.type)}`
      )
      .join(",");
    return `options: {
      ${options}
    }`;
  }

  private dataTypeFrom(type: ApplicationCommandOptionType) {
    switch (type) {
      case ApplicationCommandOptionType.String:
        return "string";
      case ApplicationCommandOptionType.Number:
        return "number";
      default:
        return "unknown";
    }
  }
}
