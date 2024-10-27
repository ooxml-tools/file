import { readFile, stat, writeFile } from "fs/promises";
import JSZip from "jszip";
import { formatFromFilename, open } from "../";
import { ArgumentsCamelCase, Argv } from "yargs";
import { glob } from "glob";
import { relative } from "path";
import { openAsBlob } from "fs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "pack <docxpath> <dirpath>";
export const desc = "pack directory to docx file";
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
  const doc = open(formatFromFilename(docxpath), zip);
  const files = await glob(`${dirpath}/**/*`, {
    ignore: "**/.DS_Store",
    dot: true,
  });

  for (const localFilepath of files) {
    const filepath = relative(dirpath, localFilepath);
    const isFile = (await stat(localFilepath)).isFile();

    if (isFile) {
      doc.writeFile(filepath, await openAsArrayBuffer(localFilepath));
    }
  }
  const buffer = await doc.pack("uint8array");
  await writeFile(docxpath, buffer);
}
