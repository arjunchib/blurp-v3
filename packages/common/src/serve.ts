import { Orchestrator } from "./orchestrator";
import { Options } from "./types";

export function serve(options: Options) {
  const { runtimeAdapter, networkAdapter } = options;
  const orchestrator = new Orchestrator(
    options,
    runtimeAdapter,
    networkAdapter
  );
  return orchestrator.start();
}
