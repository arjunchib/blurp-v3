import { APIInteraction, APIInteractionResponse } from "discord-api-types/v10";
import { RuntimeAdapter } from "@blurp/runtime";

export abstract class NetworkAdapter {
  protected callback?: (
    interaction: APIInteraction
  ) => Promise<APIInteractionResponse>;

  constructor(protected runtimeAdapter: RuntimeAdapter) {}

  abstract start(): void;

  onInteraction(
    callback: (interaction: APIInteraction) => Promise<APIInteractionResponse>
  ): void {
    this.callback = callback;
  }
}
