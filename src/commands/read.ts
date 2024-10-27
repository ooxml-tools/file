import JSZip from "jszip";
import { formatFromFilename, open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "read <docxpath> <filepath>";
export const desc = "read file inside docx to sdtout";
export const builder = (yargs: Argv) => {
  yargs
    .positional("docxpath", {
      type: "string",
      describe: "",
    })
    .positional("filepath", {
      type: "string",
      describe: "",
    });
};
export async function handler({
  docxpath,
  filepath,
}: ArgumentsCamelCase<{ docxpath: string; filepath: string }>) {
  const zip = new JSZip();
  await zip.loadAsync(openAsArrayBuffer(docxpath));
  const doc = open(formatFromFilename(docxpath), zip);

  if (!doc.list().includes(filepath)) {
    console.error(`Missing file: ${filepath}`);
    process.exit(1);
  } else {
    const content = await doc.readFile(filepath, "uint8array");
    const stringContent = new TextDecoder().decode(content);
    console.log(stringContent);
    process.exit(0);
  }
}
