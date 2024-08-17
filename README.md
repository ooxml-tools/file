# @ooxml-tools/file
Inspect Office Open XML files (currently only `.docx`) in nodejs/browser.

## Usage

```js
import { open } from "@ooxml-tools/file";

const docx = await open("./test.docx");
console.log(await docx.list());
```


## CLI
```
./ooxml-file <command> [args]

Commands:
  pack <docxpath> <filepath>   pack directory to docx file
  unpack <docxpath> <dirpath>  unpack docx to a directory
  list <docxpath>              list files in docx
  read <docxpath> <filepath>   read file inside docx to sdtout
  write <docxpath> <filepath>  create/override file in docx

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Examples:
  ./ooxml-file unpack ./test.docx test.docx.unpacked
  ./ooxml-file pack ./test.docx test.docx.unpacked
  ./ooxml-file list ./test.docx
  ./ooxml-file read ./test.docx word/document.xml
  ./ooxml-file write ./test.docx word/document.xml < input.xml
```

## License
MIT