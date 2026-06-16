const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/pages/balance-sheet');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = content.replace(/text-[0-9]xl/g, '');
  content = content.replace(/font-black/g, '');
  content = content.replace(/font-bold/g, '');
  content = content.replace(/tracking-\[.*?\]|tracking-[a-z]+/g, '');
  content = content.replace(/leading-\[.*?\]|leading-[a-z]+/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  }
}

walk(dir);
