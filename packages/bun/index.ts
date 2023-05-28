import { Serve } from "bun";
import { RuntimeAdapter, Requestable } from "@blurp/runtime";
import fs from "fs/promises";

export class BunAdapter<
  Env extends Record<string, any>
> extends RuntimeAdapter<Env> {
  init(): void {
    this.env = process.env as any;
  }

  file(path: string): Blob {
    return Bun.file(path);
  }

  async write(destination: string, input: string): Promise<any> {
    return await Bun.write(destination, input);
  }

  async readDir(path: string): Promise<string[]> {
    return await fs.readdir(path);
  }

  serve(webhookAdapter: Requestable) {
    return {
      port: 8787,
      fetch: (req: Request) => {
        return webhookAdapter.onRequest(req);
      },
    } satisfies Serve;
  }
}
