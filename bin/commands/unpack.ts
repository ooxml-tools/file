import JSZip from "jszip";
import {writeFile, mkdir} from "fs/promises"
import { open } from "src";
import { join } from "path"
import { ArgumentsCamelCase, Argv } from "yargs";

export const cmd = "unpack <docxpath> <dirpath>";
export const desc = "unpack docx to a directory";
export const builder = (yargs: Argv) => {
    yargs
        .positional("docxpath", {
            type: "string",
            describe: "",
        })
        .positional("dirpath", {
            type: "string",
            describe: "",
        })
};
export async function handler (
    {docxpath, dirpath}: ArgumentsCamelCase<{ docxpath: string, dirpath: string }>
) {
    const zip = new JSZip()
    await zip.loadAsync(docxpath)
    const doc = open(zip);
    for (const docxpath of doc.list()) {
        const outpath = join(docxpath, docxpath);
        await mkdir(outpath, {recursive: true});
        const data = await doc.readFile(docxpath)
        await writeFile(outpath, data)
    }
}