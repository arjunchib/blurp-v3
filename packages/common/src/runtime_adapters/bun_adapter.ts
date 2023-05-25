import { Serve } from "bun";
import { RuntimeAdapter } from "./runtime_adapter";
import { WebhookAdapter } from "../network_adapters/webhook_adapter";

export class BunAdapter extends RuntimeAdapter {
  file(path: string): Blob {
    return Bun.file(path);
  }

  async write(destination: string, input: string): Promise<any> {
    return await Bun.write(destination, input);
  }

  serve(webhookAdapter: WebhookAdapter) {
    return {
      port: 8787,
      fetch: (req: Request) => {
        return webhookAdapter.onRequest(req);
      },
    } satisfies Serve;
  }
}
