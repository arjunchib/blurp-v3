import { DiscordRestService } from "./discord_rest_service";
import { InteractionService } from "./interaction_service";
import { ModelService } from "./model_service";
import { NetworkAdapter } from "../network_adapters/network_adapter";
import { WebhookAdapter } from "../network_adapters/webhook_adapter";
import { RuntimeAdapter } from "../runtime_adapters/runtime_adapter";
import { SchemaService } from "./schema_service";
import { Options } from "../types";

export class OrchestratorService {
  constructor(
    private runtimeAdapter: RuntimeAdapter,
    private networkAdapter: NetworkAdapter = new WebhookAdapter(runtimeAdapter),
    private interactionService = new InteractionService(networkAdapter),
    private discordRestService = new DiscordRestService(),
    private modelService = new ModelService(runtimeAdapter),
    private schemaService = new SchemaService(discordRestService)
  ) {}

  start(schema: Options["schema"]) {
    this.schemaService.updateDiscord(schema);
    this.modelService.generateModels(Object.values(schema));
    return this.interactionService.start();
  }
}
