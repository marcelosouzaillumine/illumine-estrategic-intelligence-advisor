const fs = require('fs');
const path = require('path');

const RUNTIME_DIR = path.join(__dirname, 'src', 'core', 'runtime');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      callback(fullPath);
    }
  }
}

walkDir(RUNTIME_DIR, (filePath) => {
  if (filePath.endsWith('.test.ts') || filePath.endsWith('.spec.ts') || filePath.endsWith('-adapter.ts')) {
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace 'as any as' with 'as unknown as'
  content = content.replace(/as\s+any\s+as/g, 'as unknown as');
  
  // Replace 'as any;' or 'as any,' with 'as unknown;' or 'as unknown,'
  // but wait, 'as unknown' might not compile if it's assigned to a typed variable/property.
  // So let's see where 'as any' is used.
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Replaced 'as any as' with 'as unknown as' in ${filePath}`);
  }
});
