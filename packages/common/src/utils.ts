import nacl from "tweetnacl";

/** Converts a hexadecimal string to Uint8Array. */
export function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}

export async function sleep(ms: number = 1000) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}
