const fs = require('fs');
const path = require('path');

const DIR = 'src/components/pages/governance';
const PROHIBITED_PATTERNS = [
  /calculateSeverity/g,
  /calculatePriority/g,
  /inferRisk/g,
  /riskScore/g,
  /fiduciaryScore/g,
  /(?:const|let|var)\s+score\s*=/g,
  /if\s*\([^)]*severity[^)]*\)/g
];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

if (!fs.existsSync(DIR)) {
  console.log("No governance pages found to audit.");
  process.exit(0);
}

const files = walkDir(DIR);
let failed = false;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(content)) {
      console.error(`[VIOLATION] Found prohibited pattern ${pattern} in ${file}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("Zero-Logic-UI Audit Failed! UI components must not interpret logic.");
  process.exit(1);
} else {
  console.log("Zero-Logic-UI Audit Passed!");
  process.exit(0);
}
