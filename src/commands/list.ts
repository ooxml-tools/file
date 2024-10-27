import JSZip from "jszip";
import { formatFromFilename, open } from "../";
import { ArgumentsCamelCase, Argv } from "yargs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "list <docxpath>";
export const desc = "list files in docx";
export const builder = (yargs: Argv) => {
  yargs.positional("docxpath", {
    type: "string",
    describe: "",
  });
};
export async function handler({
  docxpath,
}: ArgumentsCamelCase<{ docxpath: string }>) {
  const zip = new JSZip();
  await zip.loadAsync(await openAsArrayBuffer(docxpath));
  const doc = open(formatFromFilename(docxpath), zip);
  console.log(doc.list().join("\n"));
}
