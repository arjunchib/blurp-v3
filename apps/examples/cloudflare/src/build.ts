import { build } from "@blurp/common";
import { BunAdapter } from "@blurp/bun";
import router from "./router";

await build({
  router,
  runtimeAdapter: new BunAdapter(),
});
