const fs = require("fs");
const path = require("path");

const allFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    if (file.startsWith("@")) return;
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) arrayOfFiles = allFiles(`${dirPath}/${file}`, arrayOfFiles);
    else arrayOfFiles.push(path.join(dirPath, "/", file));
  });
  return arrayOfFiles;
};

module.exports = allFiles;
