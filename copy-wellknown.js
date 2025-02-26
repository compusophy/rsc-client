const fs = require('fs');
const path = require('path');

// Create wellknown directory in dist (without the dot)
const wellKnownDir = path.join(__dirname, 'dist', '.wellknown');
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

// Copy farcaster.json
const sourceFile = path.join(__dirname, '.well-known', 'farcaster.json');
const destFile = path.join(wellKnownDir, 'farcaster.json');
fs.copyFileSync(sourceFile, destFile);

console.log('Copied .well-known/farcaster.json to dist/wellknown/farcaster.json'); 