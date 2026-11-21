// Reads, resizes, crops, rotates and converts images with Rebel's built-in sharp. Usage:
//   node image.cjs info <image>
//   node image.cjs edit <input> <output> [--width N] [--height N] [--fit inside|cover|contain|fill]
//                       [--crop left,top,width,height] [--rotate 90|180|270] [--grayscale] [--quality 1-100]
// The output format follows the output's extension: .jpg, .png, .webp, .avif, .tiff or .gif.
const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));
const sharp = bundled('sharp');

const FORMATS = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp', '.avif': 'avif', '.tif': 'tiff', '.tiff': 'tiff', '.gif': 'gif' };

function open(file, options = {}) {
  if (/\.(heic|heif)$/i.test(file)) {
    throw new Error('HEIC photos are not supported by the built-in library. Ask the user to save or export the photo as a JPEG and share that.');
  }
  return sharp(file, options);
}

async function info(file) {
  const meta = await open(file).metadata();
  // EXIF orientations 5 to 8 are turned a quarter: the picture shows width and height swapped.
  const turned = (meta.orientation ?? 1) >= 5;
  return {
    format: meta.format,
    width: turned ? meta.height : meta.width,
    height: turned ? meta.width : meta.height,
    pages: meta.pages ?? 1,
    hasTransparency: Boolean(meta.hasAlpha),
    bytes: fs.statSync(file).size,
  };
}

function number(name, value, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`--${name} must be a whole number from ${min} to ${max}, got ${value}`);
  return n;
}

async function edit(input, output, args) {
  const format = FORMATS[path.extname(output).toLowerCase()];
  if (!format) throw new Error(`Unsupported output type ${path.extname(output) || '(none)'}: use ${Object.keys(FORMATS).join(', ')}`);
  if (path.resolve(input) === path.resolve(output)) throw new Error('Write to a new file: the output must not be the input.');
  if (fs.existsSync(output)) throw new Error(`${output} already exists: choose a new name, so nothing the user has is overwritten.`);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--grayscale') { options.grayscale = true; continue; }
    const value = args[++i];
    if (value === undefined) throw new Error(`${flag} needs a value`);
    if (flag === '--width') options.width = number('width', value, 1, 20000);
    else if (flag === '--height') options.height = number('height', value, 1, 20000);
    else if (flag === '--quality') options.quality = number('quality', value, 1, 100);
    else if (flag === '--rotate') options.rotate = number('rotate', value, 0, 359);
    else if (flag === '--fit') {
      if (!['inside', 'cover', 'contain', 'fill'].includes(value)) throw new Error('--fit must be inside, cover, contain or fill');
      options.fit = value;
    } else if (flag === '--crop') {
      const parts = value.split(',');
      if (parts.length !== 4) throw new Error('--crop needs left,top,width,height in pixels');
      const [left, top, width, height] = parts.map((part, n) => number('crop', part, n < 2 ? 0 : 1, 100000));
      options.crop = { left, top, width, height };
    } else throw new Error(`Unknown option ${flag}`);
  }
  // Animation survives only into formats that can hold it.
  const animated = format === 'gif' || format === 'webp';
  // Two passes: in one pipeline sharp crops and turns before or after resizing by its own fixed
  // order, not the order asked for. First upright (the way the camera said), crop and turn...
  // sharp stacks the frames into one tall picture: a turn would reorder them, not turn each one.
  if (options.rotate && animated && ((await open(input).metadata()).pages ?? 1) > 1) {
    throw new Error('An animated image can be resized and cropped but not turned. To turn its first frame, write a .png or .jpg instead.');
  }
  let image = open(input, { animated }).autoOrient();
  if (options.crop) image = image.extract(options.crop);
  if (options.rotate) image = image.rotate(options.rotate, { background: '#ffffff' });
  const shaped = await (animated ? image.webp({ lossless: true }) : image.png()).toBuffer();
  // ...then resize the shaped picture, so --width is the width of what the user sees.
  image = sharp(shaped, { animated });
  if (options.width || options.height) {
    image = image.resize({ width: options.width, height: options.height, fit: options.fit ?? 'inside', withoutEnlargement: !options.fit || options.fit === 'inside', background: '#ffffff' });
  }
  if (options.grayscale) image = image.grayscale();
  // JPEG has no transparency: transparent areas become white, not black.
  if (format === 'jpeg') image = image.flatten({ background: '#ffffff' });
  // sharp writes TIFF with JPEG compression by default, which drops transparency.
  const settings = { ...(options.quality ? { quality: options.quality } : {}), ...(format === 'tiff' ? { compression: 'deflate' } : {}) };
  await image.toFormat(format, settings).toFile(output);
  return { output: path.resolve(output), ...(await info(output)) };
}

async function main() {
  const [command, input, output, ...rest] = process.argv.slice(2);
  if (command === 'info' && input) return info(input);
  if (command === 'edit' && input && output) return edit(input, output, rest);
  throw new Error('Usage: image.cjs info <image> | image.cjs edit <input> <output> [options]');
}

main().then(
  result => console.log(JSON.stringify(result, null, 2)),
  error => {
    console.error(`[image] ${error.message}`);
    process.exit(1);
  },
);
