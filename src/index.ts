import JSZip from "jszip";

export class OpenOfficeXml {
  public zip: JSZip;

  constructor (zip: JSZip) {
    this.zip = zip;
  }

  pack () {
    return this.zip.generateAsync({type:"blob"})
  }

  unpack () {
    const obj = this;
    return {
      async *[Symbol.asyncIterator]() {
        const files = await obj.list();

        for (const filepath of files) {
          if (obj.zip.files[filepath]!.dir) {
            yield {type: "directory", filepath};
          } else {
            const buffer = obj.zip.file(filepath);
            yield {type: "file", filepath, buffer};
          }
        }
      }
    }
  }
    
  list () {
    return Object.keys(this.zip.files);
  }

  readdir (dirpath: string) {
    const obj = this.zip.file(dirpath);
    if (!obj) throw new Error();
    if (!obj.dir) throw new Error();
    return obj;
  }

  mkdir (dirpath: string) {
    this.zip.folder(dirpath);
  }
  
  writeFile (filepath: string, data: string | Buffer) {
    this.zip.file(filepath, data);
  }

  async readFile (filepath: string) {
    const obj = this.zip.file(filepath);
    if (!obj) throw new Error();
    if (obj.dir) throw new Error();
    return await obj.async("uint8array");
  }
  
}

export function open (zip: JSZip) {
  return new OpenOfficeXml(zip)
}

export function init () {
  const zip = new JSZip();
  return new OpenOfficeXml(zip)
}
