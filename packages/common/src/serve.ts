import { OrchestratorService } from "./services/orchestrator_service";
import { Options } from "./types";

export async function serve(options: Options) {
  const { runtimeAdapter, networkAdapter } = options;
  const orchestrator = new OrchestratorService(runtimeAdapter, networkAdapter);
  return await orchestrator.start();
}
