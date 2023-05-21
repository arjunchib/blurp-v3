import { serve } from "@blurp/common";
import { schema } from "./blurp.gen";

await serve({ schema });
