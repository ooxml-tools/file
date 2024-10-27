import { openAsBlob } from "fs";
export async function openAsArrayBuffer(filepath: string) {
  return await (await openAsBlob(filepath)).arrayBuffer();
}
