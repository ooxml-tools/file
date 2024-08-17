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
    await zip.loadAsync(docxpath)
    const doc = open(zip);
    return doc.list()
}