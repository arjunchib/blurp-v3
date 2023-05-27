import { Router } from "@blurp/common";
import { AddSchema } from "./schema/add.schema";
import { AddController } from "./controllers/add.controller";

export default new Router([
  {
    schema: AddSchema,
    controller: AddController,
  },
]);
