import { type } from "os";
import nacl from "tweetnacl";

/** Converts a hexadecimal string to Uint8Array. */
export function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}

export async function sleep(ms: number = 1000) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

/** A partial, deep comparison between the source object and the target. The source must match every property in the target, but may have properties not in the target. */
export function isMatch(source: any, target: any): boolean {
  if (source === target) return true;
  if (typeof source !== "object" || typeof target !== "object") return false;
  for (const key of Object.keys(target)) {
    if (!isMatch(source[key], target[key])) return false;
  }
  return true;
}
