import shebang from "rollup-plugin-preserve-shebang";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import dts from "rollup-plugin-dts";
import { join } from "path";

const outputDir = join(import.meta.dirname, "/dist/npm/");

export default [
  {
    input: {
      index: "src/index.ts",
      "bin/ooxml-file": "bin/ooxml-file.ts",
      commands: "src/commands/index.ts",
    },
    output: {
      dir: outputDir,
      format: "es",
    },
    external: ["yargs/yargs", "yargs/helpers", "fs/promises"],
    plugins: [
      shebang({
        shebang: "#!/usr/bin/env node",
      }),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: `${outputDir}/index.d.ts`, format: "es" }],
    plugins: [json(), typescriptPaths({ preserveExtensions: true }), dts()],
  },
  {
    input: "src/commands/index.ts",
    output: [{ file: `${outputDir}/commands.d.ts`, format: "es" }],
    plugins: [json(), typescriptPaths({ preserveExtensions: true }), dts()],
  },
];
