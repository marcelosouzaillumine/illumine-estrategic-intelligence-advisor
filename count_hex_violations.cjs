const fs = require('fs');
const path = require('path');

function getFilesRecursively(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  }
  return results;
}

const tsxFiles = getFilesRecursively('src', '.tsx').filter(f => !f.includes('/pdf/') && !f.includes('\\pdf\\'));
const hexColorRegex = /#[0-9A-Fa-f]{3,6}\b/g;

let violationsByFile = {};

for (const file of tsxFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  let count = 0;
  
  const lines = content.split('\n');
  lines.forEach((line) => {
    if (line.includes('href="') || line.includes("href='") || line.includes('`#')) return;
    const hexMatches = line.match(hexColorRegex);
    if (hexMatches) count += hexMatches.length;
  });

  if (count > 0) {
    violationsByFile[file] = count;
  }
}

const sorted = Object.entries(violationsByFile).sort((a, b) => b[1] - a[1]);
console.log('Top 10 Offenders:');
for (let i = 0; i < Math.min(10, sorted.length); i++) {
  console.log(`${sorted[i][0]}: ${sorted[i][1]} violations`);
}
