import { readFile } from "fs/promises";
import JSZip from "jszip";
import { open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";

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
        })
};
export async function handler (
    {docxpath, filepath}: ArgumentsCamelCase<{ docxpath: string, filepath: string }>
) {
    const zip = new JSZip()
    const data = await readFile(docxpath)
    await zip.loadAsync(data)
    const doc = open(zip);
    
    if (!doc.list().includes(filepath)) {
        console.error(`Missing fike: ${filepath}`)
        process.exit(1);
    } else {
        const content = await doc.readFile(filepath);
        const stringContent = new TextDecoder().decode(content);
        console.log(stringContent);
        process.exit(0);
    }
}