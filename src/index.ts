import JSZip from "jszip";
import { extname } from "path";

export const FORMATS = [
  "docx",
  // "xlsx",
  // "pptx"
] as const;

export type OfficeOpenXmlType = (typeof FORMATS)[number];

interface OutputByType {
  base64: string;
  string: string;
  text: string;
  binarystring: string;
  array: number[];
  uint8array: Uint8Array;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  nodebuffer: Buffer;
}

export const MIME_TYPES: Record<OfficeOpenXmlType, string> = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export { default as docxBlankFiles } from "./blank/docx";
export { default as xlsxBlankFiles } from "./blank/xlsx";
export { default as pptxBlankFiles } from "./blank/pptx";

export function getMimeType(type: OfficeOpenXmlType) {
  return MIME_TYPES[type];
}

export function formatFromFilename(filepath: string): OfficeOpenXmlType {
  const ext = extname(filepath).replace(/^./, "") as OfficeOpenXmlType;
  if (!FORMATS.includes(ext)) {
    throw new Error(`Invalid type: ${ext}`);
  }
  return ext;
}

export function assertValidType(type: string): OfficeOpenXmlType {
  if (!FORMATS.includes(type as OfficeOpenXmlType)) {
    throw new Error(`Invalid type: ${type}`);
  }
  return type as OfficeOpenXmlType;
}

export class OfficeOpenXml {
  public zip: JSZip;
  public type: OfficeOpenXmlType;

  constructor(type: OfficeOpenXmlType, zip: JSZip) {
    this.type = assertValidType(type);
    this.zip = zip;
  }

  mimeType() {
    return getMimeType(this.type);
  }

  async pack<T extends keyof OutputByType>(type: T): Promise<OutputByType[T]> {
    return await this.zip.generateAsync({
      type: type,
      mimeType: this.mimeType(),
      compression: "DEFLATE",
    });
  }

  unpack() {
    const obj = this;
    return {
      async *[Symbol.asyncIterator]() {
        const files = await obj.list();

        for (const filepath of files) {
          if (obj.zip.files[filepath]!.dir) {
            yield { type: "directory", filepath };
          } else {
            const buffer = obj.zip.file(filepath);
            yield { type: "file", filepath, buffer };
          }
        }
      },
    };
  }

  list() {
    return Object.keys(this.zip.files);
  }

  readdir(dirpath: string) {
    const obj = this.zip.file(dirpath);
    if (!obj) throw new Error();
    if (!obj.dir) throw new Error();
    return obj;
  }

  isDirectory(dirpath: string) {
    const obj = this.zip.files[dirpath];
    if (!obj) throw new Error(`Doesn't exist ${dirpath}`);
    return obj.dir;
  }

  mkdir(dirpath: string) {
    this.zip.folder(dirpath);
  }

  writeFile(filepath: string, data: string | ArrayBuffer) {
    // TODO: Validation of input
    this.zip.file(filepath, data);
  }

  writeFiles(files: Record<string, string | ArrayBuffer>) {
    for (const [filepath, data] of Object.entries(files)) {
      this.writeFile(filepath, data);
    }
  }

  async readFile<T extends keyof OutputByType>(
    filepath: string,
    format: T,
  ): Promise<OutputByType[T]> {
    const obj = this.zip.file(filepath);
    if (!obj) throw new Error(`Missing file: ${filepath}`);
    if (obj.dir) throw new Error();
    return await obj.async(format);
  }
}

export function open(type: OfficeOpenXmlType, zip: JSZip) {
  return new OfficeOpenXml(type, zip);
}

export function init(
  type: OfficeOpenXmlType,
  files: Record<string, string | ArrayBuffer>,
) {
  const zip = new JSZip();
  const doc = new OfficeOpenXml(type, zip);
  doc.writeFiles(files);
  return doc;
}
