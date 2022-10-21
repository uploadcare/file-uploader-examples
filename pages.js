import fg from "fast-glob";
import fs from "fs";
import path from "path";

const examples = fg.sync("./examples/*", {
  onlyFiles: false,
  markDirectories: true,
});

for (const examplePath of examples) {
  const exampleName = path.relative("./examples", examplePath);
  const distPath = path.resolve(path.join(examplePath, "dist"));
  const newPath = path.resolve(`./public/${exampleName}`);
  fs.cpSync(distPath, newPath, { recursive: true });
}

const html = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>@uploadcare/blocks examples</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <ul>
    ${examples
      .map((examplePath) => path.relative("./examples", examplePath))
      .map(
        (example) => /*html*/ `<li><a href="./${example}/">${example}</a></li>`
      ).join('\n    ')}
  </ul>
</body>
</html>
`;

fs.writeFileSync(path.resolve(`./public/index.html`), html)
