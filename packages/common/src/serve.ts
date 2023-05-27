import { RuntimeAdapter } from "@blurp/runtime";
import { OrchestratorService } from "./services/orchestrator_service";
import { NetworkAdapter } from "./network_adapters/network_adapter";
import { Router } from "./router";

export interface ServeOptions {
  router: Router;
  runtimeAdapter: RuntimeAdapter;
  networkAdapter?: NetworkAdapter;
}

export async function serve(options: ServeOptions) {
  const { runtimeAdapter, networkAdapter, router } = options;
  const orchestrator = new OrchestratorService(
    router,
    runtimeAdapter,
    networkAdapter
  );
  return await orchestrator.start();
}
