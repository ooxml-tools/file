import { writeFile } from "fs/promises";
import JSZip from "jszip";
import {
  formatFromFilename,
  FORMATS,
  OfficeOpenXml,
  docxBlankFiles,
  xlsxBlankFiles,
} from "../";
import { ArgumentsCamelCase, Argv } from "yargs";

const blankContents: Record<"docx" | "xlsx", Record<string, string>> = {
  docx: docxBlankFiles,
  xlsx: xlsxBlankFiles,
  // pptx: pptxBlankFiles,
};

export const cmd = "init <ooxmlpath>";
export const desc = `initializes a blank file (${FORMATS.join(", ")})`;
export const builder = (yargs: Argv) => {
  yargs.positional("ooxmlpath", {
    type: "string",
    describe: "",
  });
};
export async function handler({
  ooxmlpath,
}: ArgumentsCamelCase<{ ooxmlpath: string }>) {
  const zip = new JSZip();
  const format = formatFromFilename(ooxmlpath);

  if (format !== "docx") {
    throw new Error(`${format} not currently supported`);
  }

  const doc = new OfficeOpenXml(format, zip);
  doc.writeFiles(blankContents[format]);
  const buffer = await doc.pack("uint8array");
  await writeFile(ooxmlpath, buffer);
}
