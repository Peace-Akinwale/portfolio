// Export the approved signature artwork to the app's browser and home-screen icons.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

const source = path.join(__dirname, '../public/brand/pa-signature.png');
const outputDir = path.join(__dirname, '../app');

async function icon(size, rounded = true) {
  const resized = await sharp(source).resize(size, size).png().toBuffer();
  if (!rounded) return resized;
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.18}" fill="white"/></svg>`);
  return sharp(resized).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

async function generateLogoFavicon() {
  const sizes = [16, 32, 48, 256];
  const images = await Promise.all(sizes.map(size => icon(size)));
  // ICO directory followed by PNG payloads; 0 represents 256 in its byte fields.
  const directory = Buffer.alloc(6 + sizes.length * 16);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  sizes.forEach((size, i) => {
    const entry = 6 + i * 16;
    directory[entry] = size % 256;
    directory[entry + 1] = size % 256;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(images[i].length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += images[i].length;
  });
  await Promise.all([
    fs.writeFile(path.join(outputDir, 'favicon.ico'), Buffer.concat([directory, ...images])),
    fs.writeFile(path.join(outputDir, 'icon.png'), images[1]),
    icon(192).then(data => fs.writeFile(path.join(outputDir, 'icon-192.png'), data)),
    // iOS applies its own corner mask.
    icon(180, false).then(data => fs.writeFile(path.join(outputDir, 'apple-icon.png'), data)),
  ]);
  console.log('Exported PA signature: favicon.ico (16/32/48/256), icon.png, icon-192.png, apple-icon.png');
}

generateLogoFavicon().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
