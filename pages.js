import fg from "fast-glob";
import fs from 'fs';
import path from 'path';

const examples = fg.sync("./examples/*", {
  onlyFiles: false,
  markDirectories: true
});

for(const examplePath of examples) {
  const exampleName = path.relative("./examples", examplePath);
  const distPath = path.resolve(path.join(examplePath, "dist"));
  const newPath = path.resolve(`./public/${exampleName}`);
  fs.cpSync(distPath, newPath,  {recursive: true});
}
