const { FuseBox, WebIndexPlugin, SourceMapPlainJsPlugin } = require("fuse-box");
const { task, tsc } = require("fuse-box/sparky");
const fuse = FuseBox.init({
  homeDir: "src",
  sourceMaps: true,
  globals: { d3: "d3" },
  target: "browser@es6",
  output: "$name.js",
  plugins: [SourceMapPlainJsPlugin()]
});
fuse.dev({ port: 3000 }); // launch http server
fuse
  .bundle("app")
  .instructions(" > index.ts ")
  .hmr({ reload: true })
  .watch();
fuse.run();
