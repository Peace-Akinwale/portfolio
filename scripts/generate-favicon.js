const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '../public/images/peace-akinwale.jpg');
const outputDir = path.join(__dirname, '../app');

async function generateFavicons() {
  try {
    // Generate 32x32 favicon (PNG format for modern browsers)
    await sharp(inputImage)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(outputDir, 'icon.png'));

    console.log('✓ Generated app/icon.png (32x32)');

    // Generate Apple icon (180x180)
    await sharp(inputImage)
      .resize(180, 180, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(outputDir, 'apple-icon.png'));

    console.log('✓ Generated app/apple-icon.png (180x180)');

    // Generate larger icon for better quality
    await sharp(inputImage)
      .resize(192, 192, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(outputDir, 'icon-192.png'));

    console.log('✓ Generated app/icon-192.png (192x192)');

    console.log('\nFavicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
