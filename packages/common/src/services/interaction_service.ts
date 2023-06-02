import {
  APIApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponsePong,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ComponentType,
  InteractionResponseType,
  InteractionType,
  RESTPostAPIInteractionFollowupJSONBody,
} from "discord-api-types/v10";
import {
  ActionRow,
  Button,
  InteractionResponse,
  MessageComponent,
  Router,
} from "..";
import { NetworkAdapter } from "../network_adapters/network_adapter";
import { DiscordRestService } from "./discord_rest_service";

export class InteractionService {
  constructor(
    private networkAdapter: NetworkAdapter,
    private router: Router,
    private discordRestService: DiscordRestService
  ) {}

  start() {
    this.networkAdapter.onInteraction(this.onInteraction.bind(this));
    return this.networkAdapter.start();
  }

  async onInteraction(
    interaction: APIInteraction
  ): Promise<APIInteractionResponse> {
    if (interaction.type === InteractionType.Ping) {
      return {
        type: InteractionResponseType.Pong,
      } satisfies APIInteractionResponsePong;
    } else {
      if (interaction.type !== InteractionType.ApplicationCommand)
        return {} as any;
      console.log(`Received ${interaction.data.name}`);
      const name = interaction.data.name;
      const controller = this.router.createController(name);
      if (!controller) {
        return this.createResponse({ content: "Error!" });
      }
      var respondWith: (res: InteractionResponse) => void = () => {};
      const promise = new Promise<InteractionResponse>((resolve, reject) => {
        respondWith = (res) => {
          resolve(res);
        };
      });
      var defer: () => void = () => {};
      const promiseDefer = new Promise<null>((resolve, reject) => {
        defer = () => {
          resolve(null);
        };
      });
      interaction.token;
      this.waitUntil(
        controller.chatInput?.({
          raw: interaction as any,
          options: this.createOptions(interaction),
          respondWith,
          defer,
          followup: (res: InteractionResponse) => {
            this.discordRestService.createFollowupMessage(
              interaction.token,
              this.createFollowup(res)
            );
          },
        })
      );
      // wait for respondWith or defer to be called
      const res = await Promise.any([promise, promiseDefer]);
      return this.createResponse(res);
    }
  }

  private waitUntil(promise: Promise<any> | any): void {
    if (!(promise instanceof Promise)) return;
    promise.catch(console.error);
  }

  private createOptions(interaction: APIApplicationCommandInteraction) {
    if (
      interaction.data.type !== ApplicationCommandType.ChatInput ||
      !interaction.data.options
    )
      return {};
    const options: Record<string, any> = {};
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

  private createFollowup(
    res: InteractionResponse
  ): RESTPostAPIInteractionFollowupJSONBody {
    if (typeof res === "string") {
      return {
        content: res,
      };
    }
    if (typeof res === "number") {
      return {
        content: res.toString(),
      };
    }
    if (!res.components) {
      return res as any;
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
    return { ...res, components };
  }

  private createResponse(
    res: InteractionResponse | null
  ): APIInteractionResponse {
    if (res === null) {
      return { type: InteractionResponseType.DeferredChannelMessageWithSource };
    }
    if (typeof res === "string") {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: res },
      };
    }
    if (typeof res === "number") {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: res.toString() },
      };
    }
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
}
