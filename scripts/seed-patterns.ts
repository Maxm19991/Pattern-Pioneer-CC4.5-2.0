import fs from 'fs';
import path from 'path';

const PATTERNS_DIR = path.join(process.cwd(), 'public', 'patterns');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generatePatternData() {
  const files = fs.readdirSync(PATTERNS_DIR).filter(file =>
    file.toLowerCase().endsWith('.webp')
  );

  const patterns = files.map((file, index) => {
    const name = file.replace(/\.webp$/i, '');
    const slug = slugify(name);

    return {
      id: `pattern-${index + 1}`,
      name,
      slug,
      description: `Beautiful seamless ${name.toLowerCase()} pattern, perfect for your creative projects. Commercial use allowed.`,
      image_url: `/patterns/${file}`,
      price: 6.99,
      is_active: true,
    };
  });

  // Write to JSON file for development
  const outputPath = path.join(process.cwd(), 'lib', 'data', 'patterns.json');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(patterns, null, 2));

  console.log(`✓ Generated data for ${patterns.length} patterns`);
  console.log(`✓ Saved to ${outputPath}`);
}

generatePatternData();
