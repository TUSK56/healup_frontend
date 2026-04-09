const fs = require('fs');
const path = require('path');

const targets = ['.next', '.turbo', path.join('node_modules', '.cache')];

for (const target of targets) {
  const fullPath = path.join(process.cwd(), target);
  try {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`removed ${target}`);
  } catch (err) {
    console.warn(`failed to remove ${target}:`, err.message);
  }
}

console.log('next cache cleanup complete');
