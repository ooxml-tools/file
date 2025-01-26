#!/usr/bin/env ./node_modules/.bin/tsx
import { relative } from "path";
import yargs from "yargs/yargs";
import * as commands from "../src/commands";

const scriptName = relative(process.cwd(), process.argv[1] ?? "");

yargs(process.argv.slice(2))
  .usage(`${scriptName} <command> [args]`)
  // HACK to remove script-name from commands
  .scriptName("")
  .example([
    [`${scriptName} init ./test.docx`],
    [`${scriptName} unpack ./test.docx test.docx.unpacked`],
    [`${scriptName} pack ./test.docx test.docx.unpacked`],
    [`${scriptName} list ./test.docx`],
    [`${scriptName} read ./test.docx word/document.xml`],
    [`${scriptName} write ./test.docx word/document.xml < input.xml`],
  ])
  .command(
    commands.formats.cmd,
    commands.formats.desc,
    commands.formats.builder,
    commands.formats.handler,
  )
  .command(
    commands.init.cmd,
    commands.init.desc,
    commands.init.builder,
    commands.init.handler,
  )
  .command(
    commands.pack.cmd,
    commands.pack.desc,
    commands.pack.builder,
    commands.pack.handler,
  )
  .command(
    commands.unpack.cmd,
    commands.unpack.desc,
    commands.unpack.builder,
    commands.unpack.handler,
  )
  .command(
    commands.list.cmd,
    commands.list.desc,
    commands.list.builder,
    commands.list.handler,
  )
  .command(
    commands.read.cmd,
    commands.read.desc,
    commands.read.builder,
    commands.read.handler,
  )
  .command(
    commands.write.cmd,
    commands.write.desc,
    commands.write.builder,
    commands.write.handler,
  )
  .demand(1)
  .help().argv;
