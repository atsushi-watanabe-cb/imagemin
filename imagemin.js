import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminMozJpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import { program } from "commander";

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

  await imagemin([`${srcSubDir}/*.{jpg,jpeg,JPG,png}`], {
    destination: distSubDir,
    plugins: [
      imageminMozJpeg({ quality: options.jpgQuality }),
      imageminPngquant({
        quality: options.pngQuality.map((v) => parseFloat(v)),
      }),
    ],
  });

  console.log(`Compression of images in ${srcSubDir} completed`);
});
