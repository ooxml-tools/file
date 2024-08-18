import { readFile } from "fs/promises";
import JSZip from "jszip";
import { open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";

export const cmd = "list <docxpath>";
export const desc = "list files in docx";
export const builder = (yargs: Argv) => {
    yargs
        .positional("docxpath", {
            type: "string",
            describe: "",
        })
};
export async function handler (
    {docxpath}: ArgumentsCamelCase<{ docxpath: string; }>
) {
    const zip = new JSZip()
    const data = await readFile(docxpath)
    await zip.loadAsync(data)
    const doc = open(zip);
    console.log(doc.list().join("\n"))
}