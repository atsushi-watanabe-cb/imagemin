import fs from "fs";
import path from "path";
import { program } from "commander";
import convert from "heic-convert";

program
  .option("-i, --inputDir <inputDir>", "input directory", "src")
  .option("-o, --outputDir <outputDir>", "output directory", "dist")
  .option("-jq, --jpgQuality <jpgQuality>", "jpg quality", 50)
  .option("-pq, --pngQuality <pngQuality...>", "png quality", [0.5, 0.8]);

program.parse();

const options = program.opts();

function getSubDirectories(srcPath) {
  return fs.readdirSync(srcPath).filter((file) => {
    return fs.statSync(path.join(srcPath, file)).isDirectory();
  });
}

const srcDir = options.inputDir;
const distDir = `${options.inputDir}/dist`;
const noSubdirectories = srcDir.split("/").pop();

const subDirs =
  getSubDirectories(srcDir).length > 0
    ? getSubDirectories(srcDir)
    : [noSubdirectories];

subDirs.forEach(async (directory) => {
  const dir = getSubDirectories(srcDir).length > 0 ? directory : "";
  const srcSubDir = path.join(srcDir, dir);
  const distSubDir = path.join(distDir, dir);

  if (!fs.existsSync(distSubDir)) {
    fs.mkdirSync(distSubDir, { recursive: true });
  }

  fs.readdir(srcSubDir, (_err, files) => {
    files.forEach((file) => {
      const stats = fs.statSync(`${srcSubDir}/${file}`);
      if (!stats.isFile()) {
        return;
      }
      const inputBuffer = fs.readFileSync(`${srcSubDir}/${file}`);

      if (file.includes(".heic") || file.includes(".HEIC")) {
        convert({
          buffer: inputBuffer,
          format: "JPEG",
          quality: 0.5,
        }).then((data) => {
          fs.writeFileSync(
            `${distSubDir}/${file.replace("heic", "jpg")}`,
            data
          );
        });
      }
      if (!file.includes(".heic")) {
        fs.writeFileSync(`${distSubDir}/${file}`, inputBuffer);
      }
    });
  });

  console.log(`Convert HEIC to JPG in ${srcSubDir} completed`);
});
