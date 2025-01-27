import { writeFile } from "fs/promises";
import JSZip from "jszip";
import {
  formatFromFilename,
  FORMATS,
  OfficeOpenXml,
  docxBlankFiles,
  // xlsxBlankFiles,
  // pptxBlankFiles,
  OfficeOpenXmlType,
} from "../";
import { ArgumentsCamelCase, Argv } from "yargs";

const blankContents: Record<OfficeOpenXmlType, Record<string, string>> = {
  docx: docxBlankFiles,
  // xlsx: xlsxBlankFiles,
  // pptx: pptxBlankFiles,
};

export const cmd = "init <docxpath>";
export const desc = `initializes a blank file (${FORMATS.join(", ")})`;
export const builder = (yargs: Argv) => {
  yargs.positional("docxpath", {
    type: "string",
    describe: "",
  });
};
export async function handler({
  docxpath,
}: ArgumentsCamelCase<{ docxpath: string }>) {
  const zip = new JSZip();
  const format = formatFromFilename(docxpath);

  if (format !== "docx") {
    throw new Error(`${format} not currently supported`);
  }

  const doc = new OfficeOpenXml(format, zip);
  doc.writeFiles(blankContents[format]);
  const buffer = await doc.pack("uint8array");
  await writeFile(docxpath, buffer);
}
