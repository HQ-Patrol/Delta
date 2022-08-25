import fs from "fs";
import path from "path";

const allFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (file.startsWith("@")) return;
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) arrayOfFiles = allFiles(`${dirPath}/${file}`, arrayOfFiles);
    else arrayOfFiles.push(path.join(dirPath, "/", file));
  });
  return arrayOfFiles;
};

export default allFiles;
