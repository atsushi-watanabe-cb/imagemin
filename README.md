# Image compression script

## Usage

1. Install

```bash
$ git clone git@github.com:atsushi-watanabe-cb/imagemin.git
$ npm i
```

2. Place the image you want to compress in the src directory.

3. Compress the image. Please specify the directory containing the image files to be compressed using option `-i`.

```bash
$ node imagemin.js -i ~/Desktop/images
```

4. Compressed images are placed in the dist directory.

## Options

```bash
# example
node imagemin.js -i ~/Desktop/images -jq 50 -pq 0.1 -pq 0.3
```

- input directory
  - `-i`, `--inputDir`
  - value: image file directory path
- quality
  - jpg
    - `-jq`, `--jpgQuality`
    - value: from `0` to `100`
  - png
    - `-pq`, `--pngQuality`
    - value: Specify the minimum and maximum values between 0 and 100. For example `-pq 0.5 -pq 0.8`
