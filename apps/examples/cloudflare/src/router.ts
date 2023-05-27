import { Router } from "@blurp/common";
import { AddController } from "./controllers/add.controller";
import { AddSchema } from "./schema/add.schema";

export default new Router([
  {
    schema: AddSchema,
    controller: AddController,
  },
]);
