import { join, relative } from "path";
import { glob } from "glob";
import { readFile, stat, writeFile } from "fs/promises";
import { OfficeOpenXmlType, FORMATS } from "src";

const rootDir = join(import.meta.dirname, "../src/blank");

async function genFile(format: OfficeOpenXmlType) {
  const baseDir = join(rootDir, format);
  const files = await glob(`${baseDir}/**/*`, {
    ignore: "**/.DS_Store",
    dot: true,
  });
  const data: Record<string, string> = {};
  for (const filepath of files) {
    if ((await stat(filepath)).isFile()) {
      const relFilepath = relative(baseDir, filepath);
      data[relFilepath] = (await readFile(filepath)).toString();
    }
  }
  return data;
}

async function run() {
  for (const format of FORMATS) {
    const data = await genFile(format);
    await writeFile(
      join(rootDir, `${format}.ts`),
      `export default ${JSON.stringify(data, null, 2)} as const;`,
    );
  }
}
run();
