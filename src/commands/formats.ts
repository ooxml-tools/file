import { FORMATS } from "../";
import { Argv } from "yargs";

export const cmd = "formats";
export const desc = `list valid formats`;
export const builder = (yargs: Argv) => {
  yargs;
};
export async function handler() {
  console.log(FORMATS.join("\n"));
}
