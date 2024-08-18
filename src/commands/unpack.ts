import JSZip from "jszip";
import {writeFile, mkdir, readFile} from "fs/promises"
import { open } from "src";
import { dirname, join } from "path"
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
    const data = await readFile(docxpath)
    await zip.loadAsync(data)
    const doc = open(zip);
    for (const docxpath of doc.list()) {
        if (doc.isDirectory(docxpath)) {
            await mkdir(docxpath, {recursive: true});
        } else {
            const outpath = join(dirpath, docxpath);
            await mkdir(dirname(outpath), {recursive: true});
            const data = await doc.readFile(docxpath)
            await writeFile(outpath, data)
        }
    }
}