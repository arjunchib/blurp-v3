import { OrchestratorService } from "./services/orchestrator_service";
import { Options } from "./types";

export function serve(options: Options) {
  const { runtimeAdapter, networkAdapter, schema } = options;
  const orchestrator = new OrchestratorService(runtimeAdapter, networkAdapter);
  return orchestrator.start(schema);
}
