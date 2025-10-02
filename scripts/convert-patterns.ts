import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = path.join(process.cwd(), 'Patterns 72DPI');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'patterns');

async function convertPatterns() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all PNG files
  const files = fs.readdirSync(SOURCE_DIR).filter(file =>
    file.toLowerCase().endsWith('.png')
  );

  console.log(`Found ${files.length} patterns to convert...`);

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const outputFileName = file.replace(/\.png$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    try {
      await sharp(inputPath)
        .webp({ quality: 85 }) // High quality for previews
        .toFile(outputPath);

      console.log(`✓ Converted: ${file} -> ${outputFileName}`);
    } catch (error) {
      console.error(`✗ Failed to convert ${file}:`, error);
    }
  }

  console.log(`\nConversion complete! ${files.length} patterns converted.`);
}

convertPatterns();
