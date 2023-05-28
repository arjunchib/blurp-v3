import { RuntimeAdapter, Requestable } from "@blurp/runtime";

export class CloudflareAdapter<
  Env extends Record<string, any>
> extends RuntimeAdapter<Env> {
  serve(webhookAdapter: Requestable) {
    return {
      fetch: async (req: Request, env: any) => {
        try {
          this.env = env;
          return await webhookAdapter.onRequest(req);
        } catch (e) {
          console.error(e);
          return new Response();
        }
      },
    };
  }
}
