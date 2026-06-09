const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  });
  return filelist;
};

const tsxFiles = walkSync(path.join(process.cwd(), 'src'));
const regex = />\s*([A-Z0-9_]{4,})\s*</g;

let count = 0;
for (const file of tsxFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (regex.test(content)) {
    content = content.replace(/>\s*([A-Z0-9_]{4,})\s*</g, (match, p1) => {
      // Replaces > ENUM < with >{"ENUM"}<
      return '>{String("' + p1 + '")}<';
    });
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
}
console.log('Fixed files: ' + count);
