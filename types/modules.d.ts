type ShebangArgs = {
  shebang: string;
};

declare module "rollup-plugin-preserve-shebang" {
  function shebang(args: ShebangArgs): void;
  export = shebang;
}
