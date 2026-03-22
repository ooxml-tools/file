import JSZip from "jszip";
import { formatFromFilename, open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "read <docxpath> <ooxmlpath>";
export const desc = "read file inside docx to sdtout";
export const builder = (yargs: Argv) => {
  yargs
    .positional("docxpath", {
      type: "string",
      describe: "",
    })
    .positional("ooxmlpath", {
      type: "string",
      describe: "",
    });
};
export async function handler({
  docxpath,
  ooxmlpath,
}: ArgumentsCamelCase<{ docxpath: string; ooxmlpath: string }>) {
  const zip = new JSZip();
  await zip.loadAsync(openAsArrayBuffer(docxpath));
  const doc = open(formatFromFilename(docxpath), zip);

  if (!doc.list().includes(ooxmlpath)) {
    console.error(`Missing file: ${ooxmlpath}`);
    process.exit(1);
  } else {
    const content = await doc.readFile(ooxmlpath, "uint8array");
    const stringContent = new TextDecoder().decode(content);
    console.log(stringContent);
    process.exit(0);
  }
}
