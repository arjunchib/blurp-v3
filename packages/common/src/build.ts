import { RuntimeAdapter } from "@blurp/runtime";
import { Router } from ".";
import { OrchestratorService } from "./services/orchestrator_service";

export interface BuildOptions {
  router: Router;
  runtimeAdapter: RuntimeAdapter;
}

export async function build(options: BuildOptions) {
  const { runtimeAdapter, router } = options;
  const orchestrator = new OrchestratorService(router, runtimeAdapter);
  return await orchestrator.build();
}
