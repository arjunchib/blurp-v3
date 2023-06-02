import { RuntimeAdapter } from "@blurp/runtime";
import { DiscordRestService } from "./discord_rest_service";
import { InteractionService } from "./interaction_service";
import { ModelService } from "./model_service";
import { NetworkAdapter } from "../network_adapters/network_adapter";
import { WebhookAdapter } from "../network_adapters/webhook_adapter";
import { SchemaService } from "./schema_service";
import { Router } from "..";

export class OrchestratorService {
  constructor(
    private router: Router,
    private runtimeAdapter: RuntimeAdapter,
    private networkAdapter: NetworkAdapter = new WebhookAdapter(runtimeAdapter),
    private discordRestService = new DiscordRestService(),
    private interactionService = new InteractionService(
      networkAdapter,
      router,
      discordRestService
    ),
    private modelService = new ModelService(runtimeAdapter),
    private schemaService = new SchemaService(discordRestService)
  ) {
    this.runtimeAdapter.init?.();
  }

  async start() {
    if (this.runtimeAdapter.hasFilesystem()) {
      await this.build();
    }
    return this.interactionService.start();
  }

  async build() {
    const schema = this.router.getSchema();
    await this.schemaService.updateDiscord(schema);
    this.modelService.generateModels(schema);
  }
}
