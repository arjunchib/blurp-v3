import nacl from "tweetnacl";

/** Converts a hexadecimal string to Uint8Array. */
export function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}

/** Verify whether the request is coming from Discord. */
export async function verifySignature(
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

export async function sleep(ms: number = 1000) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}
