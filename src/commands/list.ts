import JSZip from "jszip";
import { formatFromFilename, open } from "../";
import { ArgumentsCamelCase, Argv } from "yargs";
import { openAsArrayBuffer } from "./helper";

export const cmd = "list <filepath>";
export const desc = "list files in docx";
export const builder = (yargs: Argv) => {
  yargs.positional("ooxmlpath", {
    type: "string",
    describe: "",
  });
};
export async function handler({
  ooxmlpath,
}: ArgumentsCamelCase<{ ooxmlpath: string }>) {
  const zip = new JSZip();
  await zip.loadAsync(await openAsArrayBuffer(ooxmlpath));
  const doc = open(formatFromFilename(ooxmlpath), zip);
  console.log(doc.list().join("\n"));
}
