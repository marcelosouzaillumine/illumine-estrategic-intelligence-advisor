const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', '..', 'src');

const GOVERNED_TECH_DEBT = [
  'SeveritySemanticEngine',
  'Base.tsx',
  'BoardReportPDF.tsx',
  'polyfills'
];

const CALIBRATING_DIRS = [
];

const LEGACY_MARKERS = [
  'legacy',
  'Legacy'
];

function getCategory(filePath) {
  const fileName = path.basename(filePath);
  if (GOVERNED_TECH_DEBT.some(g => filePath.includes(g))) return 'GOVERNED_TECHNICAL_DEBT';
  if (CALIBRATING_DIRS.some(d => filePath.includes(d))) return 'CALIBRATING';
  if (LEGACY_MARKERS.some(l => fileName.includes(l))) return 'LEGACY';
  
  if (filePath.includes('/ui/') || filePath.includes('/governance') || filePath.includes('/capabilities')) {
     return 'CANONICAL';
  }
  
  return 'LEGACY';
}

function scanFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = scanFiles(SRC_DIR);
const inventory = {
  CANONICAL: [],
  CALIBRATING: [],
  LEGACY: [],
  GOVERNED_TECHNICAL_DEBT: []
};

let violations = 0;
let safeAutoFix = 0;
let manualReview = 0;

for (const file of allFiles) {
  const category = getCategory(file);
  const relativePath = file.replace(process.cwd(), '');
  inventory[category].push(relativePath);

  if (category === 'CANONICAL') {
    const content = fs.readFileSync(file, 'utf8');
    
    const colorMatches = content.match(/bg-(gray|slate|zinc|neutral|stone|red|blue|green)-\d{2,3}/g) || [];
    const radiusMatches = content.match(/rounded-\[\d+px\]/g) || [];
    const widthMatches = content.match(/w-\[\d+px\]/g) || [];
    
    violations += colorMatches.length + radiusMatches.length + widthMatches.length;
    
    for (const match of colorMatches) {
       if (match === 'bg-gray-100' || match === 'bg-slate-50') safeAutoFix++;
       else manualReview++;
    }
    
    for (const match of radiusMatches) {
       if (['rounded-[12px]', 'rounded-[16px]', 'rounded-[24px]', 'rounded-[32px]'].includes(match)) safeAutoFix++;
       else manualReview++;
    }
    
    for (const match of widthMatches) {
       manualReview++;
    }
  }
}

const total = allFiles.length;
const canonicalPct = ((inventory.CANONICAL.length / total) * 100).toFixed(1);

const report = {
  "Executive Visual Canonical Report": {
    "Canonical": `${canonicalPct}%`,
    "Calibrating": `${inventory.CALIBRATING.length} componentes`,
    "Legacy": `${inventory.LEGACY.length} componentes`,
    "Governed Technical Debt": `${inventory.GOVERNED_TECHNICAL_DEBT.length} componentes`,
    "Violations": violations,
    "Safe Auto Fix": safeAutoFix,
    "Manual Review": manualReview
  }
};

fs.writeFileSync('.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_CANONICAL_INVENTORY.json', JSON.stringify(inventory, null, 2));
console.log(JSON.stringify(report, null, 2));
