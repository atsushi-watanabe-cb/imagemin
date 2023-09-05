import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminMozJpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";

function getSubDirectories(srcPath) {
  return fs.readdirSync(srcPath).filter((file) => {
    return fs.statSync(path.join(srcPath, file)).isDirectory();
  });
}

const srcDir = "src";
const distDir = "dist";

const subDirs = getSubDirectories(srcDir);

subDirs.forEach(async (dir) => {
  const srcSubDir = path.join(srcDir, dir);
  const distSubDir = path.join(distDir, dir);

  if (!fs.existsSync(distSubDir)) {
    fs.mkdirSync(distSubDir, { recursive: true });
  }

  await imagemin([`${srcSubDir}/*.{jpg,jpeg,png}`], {
    destination: distSubDir,
    plugins: [
      imageminMozJpeg({ quality: 50 }),
      imageminPngquant({
        quality: [0.5, 0.8],
      }),
    ],
  });

  console.log(`Compression of images in ${srcSubDir} completed`);
});
