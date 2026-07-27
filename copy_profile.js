const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\musta\\.gemini\\antigravity-ide\\brain\\7251d800-ba19-4dbb-bbe2-af4403264bc7\\media__1785152900826.png';
const dest = path.join(__dirname, 'public', 'assets', 'muskz-profile.png');

try {
  fs.copyFileSync(src, dest);
  console.log('Successfully copied profile photo to ' + dest);
} catch (err) {
  console.error('Error copying file:', err);
}
