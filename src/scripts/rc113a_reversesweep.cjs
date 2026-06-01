const fs = require('fs');
const path = require('path');

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

const ROOT_DIR = path.resolve(__dirname, '../..');
const RUNTIME_DIR = path.join(ROOT_DIR, 'src', 'core', 'runtime');

// Reverse "as unknown" and "Record<string, unknown>" back to "any"
walkDir(RUNTIME_DIR, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('Record<string, unknown>')) {
    content = content.replace(/Record<string,\s*unknown>/g, 'Record<string, any>');
    changed = true;
  }
  
  if (content.includes('as unknown')) {
    content = content.replace(/as unknown/g, 'as any');
    changed = true;
  }
  
  if (content.includes('Object.assign(/* violations explicitly disabled */')) {
    content = content.replace(/Object\.assign\(\/\* violations explicitly disabled \*\/ /g, 'Object.assign(');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log("Reverse sweep executed.");
