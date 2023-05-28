import { Router } from "@blurp/common";
import { SendController } from "./controllers/send.controller";
import { SendSchema } from "./schema/send.schema";
import { WalletController } from "./controllers/wallet.controller";
import { WalletSchema } from "./schema/wallet.schema";

export const router = new Router([
  {
    schema: SendSchema,
    controller: SendController,
  },
  {
    schema: WalletSchema,
    controller: WalletController,
  },
]);
