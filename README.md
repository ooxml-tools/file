# <img alt="@ooxml-tools/file" height="56" src="https://github.com/user-attachments/assets/4984e7de-7f42-41e4-830b-775ba8361365" />

Inspect Office Open XML files in nodejs/browser.

Support for reading and writing to

- 👷 `.docx` — [WordprocessingML](http://officeopenxml.com/anatomyofOOXML.php) (coming soon)
- 👷 `.xlsx` — [SpreadsheetML](http://officeopenxml.com/anatomyofOOXML-xlsx.php) (coming soon)
- ✅ `.pptx` — [PresentationML](http://officeopenxml.com/anatomyofOOXML-pptx.php)

## Usage

The module accepts a [JSZip](https://github.com/Stuk/jszip) instance and adds some additional functionality

```js
import { open, openAsArrayBuffer } from "@ooxml-tools/file";

await zip.loadAsync(openAsArrayBuffer(docxpath));
const doc = open("docx", zip);
console.log(await docx.list());
```

## CLI

```bash
# ooxml-file <command> [args]
#
# Commands:
#   formats                      list valid formats
#   init <docxpath>              initializes a blank file (docx)
#   pack <docxpath> <dirpath>    pack directory to docx file
#   unpack <docxpath> <dirpath>  unpack docx to a directory
#   list <docxpath>              list files in docx
#   read <docxpath> <filepath>   read file inside docx to sdtout
#   write <docxpath> <filepath>  create/override file in docx
#
# Options:
#   --version  Show version number                                       [boolean]
#   --help     Show help                                                 [boolean]
#
# Examples:
#   ooxml-file init ./test.docx
#   ooxml-file unpack ./test.docx test.docx.unpacked
#   ooxml-file pack ./test.docx test.docx.unpacked
#   ooxml-file list ./test.docx
#   ooxml-file read ./test.docx word/document.xml
#   ooxml-file write ./test.docx word/document.xml < input.xml
```

## License

MIT
