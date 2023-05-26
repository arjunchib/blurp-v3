import { BunAdapter, serve } from "@blurp/common";
import { default as add } from "./schema/add.schema";

export default serve({ schema: { add }, runtimeAdapter: new BunAdapter() });
