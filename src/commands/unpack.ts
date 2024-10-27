import JSZip from "jszip";
import { writeFile, mkdir } from "fs/promises";
import { formatFromFilename, open } from "../";
import { dirname, join } from "path";
import { ArgumentsCamelCase, Argv } from "yargs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "unpack <docxpath> <dirpath>";
export const desc = "unpack docx to a directory";
export const builder = (yargs: Argv) => {
  yargs
    .positional("docxpath", {
      type: "string",
      describe: "",
    })
    .positional("dirpath", {
      type: "string",
      describe: "",
    });
};
export async function handler({
  docxpath,
  dirpath,
}: ArgumentsCamelCase<{ docxpath: string; dirpath: string }>) {
  const zip = new JSZip();
  await zip.loadAsync(openAsArrayBuffer(docxpath));
  const doc = open(formatFromFilename(docxpath), zip);
  for (const docxpath of doc.list()) {
    if (doc.isDirectory(docxpath)) {
      await mkdir(docxpath, { recursive: true });
    } else {
      const outpath = join(dirpath, docxpath);
      await mkdir(dirname(outpath), { recursive: true });
      const data = await doc.readFile(docxpath, "uint8array");
      await writeFile(outpath, data);
    }
  }
}
