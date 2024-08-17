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
    await zip.loadAsync(docxpath)
    const doc = open(zip);
    
    if (doc.list().includes(filepath)) {
        process.exit(1);
    } else {
        console.log(doc.readFile(filepath))
        process.exit(0);
    }
}