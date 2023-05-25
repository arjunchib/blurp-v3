import { APIInteraction, APIInteractionResponse } from "discord-api-types/v10";
import { InteractionHandler } from "../interaction_handler";
import { RuntimeAdapter } from "../runtime_adapters/runtime_adapter";

export abstract class NetworkAdapter {
  constructor(
    protected interactionHandler: InteractionHandler,
    protected runtimeAdapter: RuntimeAdapter
  ) {}

  abstract start(): void;
}
