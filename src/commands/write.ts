import { writeFile } from "fs/promises";
import JSZip from "jszip";
import { formatFromFilename, open } from "../";
import { ArgumentsCamelCase, Argv } from "yargs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "write <ooxmlpath> <filepath>";
export const desc = "create/override file in docx";
export const builder = (yargs: Argv) => {
  yargs
    .positional("ooxmlpath", {
      type: "string",
      describe: "",
    })
    .positional("filepath", {
      type: "string",
      describe: "",
    });
};
export async function handler({
  ooxmlpath,
  filepath,
}: ArgumentsCamelCase<{ ooxmlpath: string; filepath: string }>) {
  const buffers = [];
  for await (const data of process.stdin) {
    buffers.push(data);
  }
  const inputData = new Blob([Buffer.concat(buffers)]);

  const zip = new JSZip();
  await zip.loadAsync(openAsArrayBuffer(ooxmlpath));
  const doc = open(formatFromFilename(ooxmlpath), zip);

  doc.writeFile(filepath, await inputData.arrayBuffer());

  const buffer = await doc.pack("uint8array");
  await writeFile(ooxmlpath, buffer);
}
