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
} from "discord-api-types/v10";
import {
  ActionRow,
  Button,
  Controller,
  InteractionResponse,
  MessageComponent,
  Model,
  Router,
} from "..";
import { NetworkAdapter } from "../network_adapters/network_adapter";

export class InteractionService {
  constructor(private networkAdapter: NetworkAdapter, private router: Router) {}

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
      this.waitUntil(
        controller.chatInput?.({
          raw: interaction as any,
          options: this.createOptions(interaction),
          respondWith,
          defer: () => {},
          followUp: () => {},
        })
      );
      return this.createResponse(await promise);
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

  private createResponse(res: InteractionResponse): APIInteractionResponse {
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
