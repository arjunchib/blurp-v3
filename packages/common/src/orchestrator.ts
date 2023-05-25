import { DiscordRestService } from "./discord_rest_service";
import { InteractionHandler } from "./interaction_handler";
import { ModelGenerator } from "./model_generator";
import { NetworkAdapter } from "./network_adapters/network_adapter";
import { WebhookAdapter } from "./network_adapters/webhook_adapter";
import { RuntimeAdapter } from "./runtime_adapters/runtime_adapter";
import { SchemaProcessor } from "./schema_processor";
import { Options } from "./types";

export class Orchestrator {
  private networkAdapter: NetworkAdapter;

  constructor(
    private options: Options,
    private runtimeAdapter: RuntimeAdapter,
    networkAdapter?: NetworkAdapter,
    private interactionHandler = new InteractionHandler(),
    private discordRestService = new DiscordRestService(),
    private modelGenerator = new ModelGenerator(runtimeAdapter),
    private schemaProcessor = new SchemaProcessor(
      options,
      discordRestService,
      modelGenerator
    )
  ) {
    this.networkAdapter =
      networkAdapter ?? new WebhookAdapter(interactionHandler, runtimeAdapter);
  }

  start() {
    this.schemaProcessor.process();
    return this.networkAdapter.start();
  }
}
