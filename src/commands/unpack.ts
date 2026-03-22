import JSZip from "jszip";
import { writeFile, mkdir } from "fs/promises";
import { formatFromFilename, open } from "../";
import { dirname, join } from "path";
import { ArgumentsCamelCase, Argv } from "yargs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "unpack <ooxmlpath> <dirpath>";
export const desc = "unpack docx to a directory";
export const builder = (yargs: Argv) => {
  yargs
    .positional("ooxmlpath", {
      type: "string",
      describe: "",
    })
    .positional("dirpath", {
      type: "string",
      describe: "",
    });
};
export async function handler({
  ooxmlpath,
  dirpath,
}: ArgumentsCamelCase<{ ooxmlpath: string; dirpath: string }>) {
  const zip = new JSZip();
  await zip.loadAsync(openAsArrayBuffer(ooxmlpath));
  const doc = open(formatFromFilename(ooxmlpath), zip);
  for (const ooxmlpath of doc.list()) {
    if (doc.isDirectory(ooxmlpath)) {
      await mkdir(ooxmlpath, { recursive: true });
    } else {
      const outpath = join(dirpath, ooxmlpath);
      await mkdir(dirname(outpath), { recursive: true });
      const data = await doc.readFile(ooxmlpath, "uint8array");
      await writeFile(outpath, data);
    }
  }
}
