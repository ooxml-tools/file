import { readFile, writeFile } from "fs/promises";
import JSZip from "jszip";
import { open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";

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
    const inputData = Buffer.concat(buffers);

    const zip = new JSZip();
    const data = await readFile(docxpath)
    await zip.loadAsync(data);
    const doc = open(zip);
    await doc.writeFile(filepath, inputData);

    const buffer = await zip.generateAsync({
        type: "nodebuffer",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        compression: "DEFLATE",
    });
    await writeFile(docxpath, buffer);
}