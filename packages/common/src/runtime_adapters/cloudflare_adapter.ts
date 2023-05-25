import { RuntimeAdapter } from "./runtime_adapter";
import { WebhookAdapter } from "../network_adapters/webhook_adapter";

export class CloudflareAdapter extends RuntimeAdapter {
  serve(webhookAdapter: WebhookAdapter) {
    return {
      port: 8787,
      fetch: (req: Request) => {
        return webhookAdapter.onRequest(req);
      },
    };
  }
}
