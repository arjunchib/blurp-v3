import { BunAdapter, serve } from "@blurp/common";

export default await serve({ runtimeAdapter: new BunAdapter() });
