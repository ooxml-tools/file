import { readFile, stat, writeFile } from "fs/promises";
import JSZip from "jszip";
import { open } from "src";
import { ArgumentsCamelCase, Argv } from "yargs";
import { glob } from 'glob'
import { relative } from "path";

export const cmd = "pack <docxpath> <dirpath>";
export const desc = "pack directory to docx file";
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
    {docxpath, dirpath}: ArgumentsCamelCase<{ docxpath: string, dirpath: string; }>
) {
    const zip = new JSZip();
    const doc = open(zip);
    const files = await glob(`${dirpath}/**/*`, { ignore: '**/.DS_Store', dot: true });

    for (const localFilepath of files) {
        const filepath = relative(dirpath, localFilepath);
        const isDir = (await stat(localFilepath)).isDirectory();

        if (isDir) {
            // doc.writeFile(filepath, await readFile(localFilepath));
        } else {
            doc.writeFile(filepath, await readFile(localFilepath));
        }
    }
    const buffer = await zip.generateAsync({
        type: "nodebuffer",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        compression: "DEFLATE",
    });
    await writeFile(docxpath, buffer);
}