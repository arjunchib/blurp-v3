import { APIInteraction } from "discord-api-types/v10";
import { NetworkAdapter } from "./network_adapter";
import nacl from "tweetnacl";
import { hexToUint8Array } from "../utils";

export class WebhookAdapter extends NetworkAdapter {
  start(): any {
    return this.runtimeAdapter.serve?.(this);
  }

  async onRequest(request: Request): Promise<Response> {
    // validate method
    if (request.method !== "POST") {
      return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      });
    }

    // validate headers
    if (
      !request.headers.has("X-Signature-Ed25519") ||
      !request.headers.has("X-Signature-Timestamp")
    ) {
      return new Response(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    //  verify signature
    const { valid, body } = await this.verifySignature(request);
    if (!valid) {
      return new Response(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const interaction = JSON.parse(body) as APIInteraction;
    const res = await this.callback?.(interaction);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  private async verifySignature(
    request: Request
  ): Promise<{ valid: boolean; body: string }> {
    // Discord sends these headers with every request.
    const signature = request.headers.get("X-Signature-Ed25519")!;
    const timestamp = request.headers.get("X-Signature-Timestamp")!;
    const body = await request.text();
    const valid = nacl.sign.detached.verify(
      new TextEncoder().encode(timestamp + body),
      hexToUint8Array(signature),
      hexToUint8Array(process.env.PUBLIC_KEY!)
    );
    return { valid, body };
  }
}
