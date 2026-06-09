const fs = require('fs');
const path = require('path');

const directory = '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace Math.random().toString(36).substr(2, 9)
  const regex1 = /Math\.random\(\)\.toString\(36\)\.substr\(2,\s*9\)/g;
  if (regex1.test(content)) {
    content = content.replace(regex1, 'crypto.randomUUID()');
    changed = true;
  }

  // Replace Math.random().toString(36).substring(2, 9)
  const regex2 = /Math\.random\(\)\.toString\(36\)\.substring\(2,\s*9\)/g;
  if (regex2.test(content)) {
    content = content.replace(regex2, 'crypto.randomUUID()');
    changed = true;
  }

  // Replace Math.random().toString()
  const regex3 = /Math\.random\(\)\.toString\(\)/g;
  if (regex3.test(content)) {
    content = content.replace(regex3, 'crypto.randomUUID()');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(directory);
console.log('Done!');
