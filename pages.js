import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const examplePaths = fg.sync('./examples/*/*', {
  onlyFiles: false,
  markDirectories: true,
});

for (const examplePath of examplePaths) {
  const exampleDir = path.relative('./examples', examplePath);
  const distPath = path.resolve(examplePath, 'dist');
  const newPath = path.resolve(`./public/${exampleDir}`);
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
    ${examplePaths
      .map((examplePath) => path.relative('./examples', examplePath))
      .map(exampleDir => /*html*/ `<li><a href="./${exampleDir}/">${exampleDir}</a></li>`)
      .join('\n    ')}
  </ul>
</body>
</html>
`;

fs.writeFileSync(path.resolve(`./public/index.html`), html)
