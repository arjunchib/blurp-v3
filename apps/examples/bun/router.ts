import { Router } from "@blurp/common";
import { MultiplySchema } from "./schema/multiply.schema";
import { MultiplyController } from "./controllers/multiply.controller";

export default new Router([
  {
    schema: MultiplySchema,
    controller: MultiplyController,
  },
]);
