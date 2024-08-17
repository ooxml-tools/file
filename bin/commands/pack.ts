import JSZip from "jszip";
import { open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";

export const cmd = "pack <docxpath> <filepath>";
export const desc = "pack directory to docx file";
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
    {filepath, dirpath}: ArgumentsCamelCase<{ filepath: string, dirpath: string; }>
) {
    const zip = new JSZip()
    const doc = open(zip);
    // TODO:
}