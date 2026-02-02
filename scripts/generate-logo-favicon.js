const sharp = require('sharp');
const path = require('path');

const outputDir = path.join(__dirname, '../app');

// Brand colors
const navy = '#1a1f36';
const orange = '#e07a5f';
const white = '#ffffff';

async function generateLogoFavicon() {
  try {
    // Create SVG for the logo - PA initials on navy background
    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="${navy}" rx="64"/>
        <text
          x="50%"
          y="50%"
          font-family="Georgia, serif"
          font-size="280"
          font-weight="bold"
          fill="${white}"
          text-anchor="middle"
          dominant-baseline="central"
        >PA</text>
      </svg>
    `;

    const svgBuffer = Buffer.from(svg);

    // Generate 32x32 favicon
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'icon.png'));

    console.log('✓ Generated app/icon.png (32x32)');

    // Generate Apple icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, 'apple-icon.png'));

    console.log('✓ Generated app/apple-icon.png (180x180)');

    // Generate larger icon for better quality
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(outputDir, 'icon-192.png'));

    console.log('✓ Generated app/icon-192.png (192x192)');

    // Also save the SVG directly (best for modern browsers)
    const fs = require('fs');
    fs.writeFileSync(path.join(outputDir, 'icon.svg'), svg);
    console.log('✓ Generated app/icon.svg (scalable)');

    console.log('\nLogo favicons generated successfully!');
    console.log('Design: White "PA" initials on navy blue background');
  } catch (error) {
    console.error('Error generating logo favicons:', error);
    process.exit(1);
  }
}

generateLogoFavicon();
