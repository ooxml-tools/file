import JSZip from "jszip";
import { open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";
import { readFile } from "fs/promises"

export const cmd = "write <docxpath> <filepath>";
export const desc = "create/override file in docx";
export const builder = (yargs: Argv) => {
    yargs
        .positional("docxpath", {
            type: "string",
            describe: "",
        })
        .positional("filepath", {
            type: "string",
            describe: "",
        })
};
export async function handler (
    {docxpath, filepath}: ArgumentsCamelCase<{ docxpath: string, filepath: string }>
) {
    const buffers = [];
    for await (const data of process.stdin) {
      buffers.push(data);
    }    
    const data = Buffer.concat(buffers);

    const zip = new JSZip();
    await zip.loadAsync(docxpath);
    const doc = open(zip);
    await doc.writeFile(filepath, data);
}