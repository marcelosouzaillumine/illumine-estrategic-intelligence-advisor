const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', '..', 'src');
const ARTIFACT_DIR = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed';

const registry = JSON.parse(fs.readFileSync(path.join(ARTIFACT_DIR, 'EVC_EQUIVALENCE_REGISTRY.json'), 'utf8'));

const GOVERNED_TECH_DEBT = [
  'SeveritySemanticEngine',
  'Base.tsx',
  'BoardReportPDF.tsx',
  'polyfills'
];

const CALIBRATING_DIRS = [];
const LEGACY_MARKERS = ['legacy', 'Legacy', 'Page.tsx'];

function getCategory(filePath) {
  const fileName = path.basename(filePath);
  if (GOVERNED_TECH_DEBT.some(g => filePath.includes(g))) return 'GOVERNED_TECHNICAL_DEBT';
  if (CALIBRATING_DIRS.some(d => filePath.includes(d))) return 'CALIBRATING';
  if (LEGACY_MARKERS.some(l => fileName.includes(l))) {
      if (!filePath.includes('/governance/')) return 'LEGACY';
  }
  if (filePath.includes('/ui/') || filePath.includes('/governance') || filePath.includes('/capabilities')) return 'CANONICAL';
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
const inventory = { CANONICAL: [], CALIBRATING: [], LEGACY: [], GOVERNED_TECHNICAL_DEBT: [] };

const autoSafeCandidates = [];
const manualReviewCandidates = [];
let violations = 0;

for (const file of allFiles) {
  const category = getCategory(file);
  const relativePath = file.replace(process.cwd(), '');
  inventory[category].push(relativePath);

  if (category === 'CANONICAL') {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, idx) => {
       const colorMatches = line.match(/bg-(gray|slate|zinc|neutral|stone|red|blue|green)-\d{2,3}/g) || [];
       const radiusMatches = line.match(/rounded-\[\d+px\]/g) || [];
       const widthMatches = line.match(/w-\[\d+px\]/g) || [];
       
       const allMatches = [...colorMatches, ...radiusMatches, ...widthMatches];
       violations += allMatches.length;

       allMatches.forEach(match => {
          const rule = registry.rules.find(r => r.source === match);
          // Since we can't statically guarantee the semantic role, all require manual confirmation in dry run
          // unless it's explicitly a component we know.
          
          let classification = "MANUAL_REVIEW";
          let semanticRole = "UNKNOWN";

          // Heuristics for dry run semantic role mapping
          if (line.includes('Card') || file.includes('card')) semanticRole = "EXECUTIVE_CARD";
          if (line.includes('Panel') || file.includes('panel')) semanticRole = "EXECUTIVE_PANEL";
          if (line.includes('Surface') || file.includes('surface')) semanticRole = "EXECUTIVE_SURFACE";
          if (line.includes('button') || file.includes('Action')) semanticRole = "EXECUTIVE_CONTROL";
          
          if (rule && rule.allowedRoles.includes(semanticRole)) {
              classification = "AUTO_SAFE";
          }

          const candidate = {
            file: relativePath,
            line: idx + 1,
            currentValue: match,
            proposedValue: rule ? rule.target : null,
            componentStatus: "CANONICAL",
            semanticRole: semanticRole,
            registryRuleId: rule ? "EVC-EQ-" + registry.rules.indexOf(rule) : null,
            classification: classification,
            numericEquivalent: rule ? rule.numericEquivalent : false,
            semanticEquivalent: classification === "AUTO_SAFE"
          };

          if (classification === "AUTO_SAFE") autoSafeCandidates.push(candidate);
          else manualReviewCandidates.push(candidate);
       });
    });
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
    "Safe Auto Fix Candidates": autoSafeCandidates.length,
    "Manual Review Candidates": manualReviewCandidates.length
  }
};

fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_CANONICAL_INVENTORY.json'), JSON.stringify(inventory, null, 2));
fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_AUTO_SAFE_CANDIDATES.json'), JSON.stringify(autoSafeCandidates, null, 2));
fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_MANUAL_REVIEW_CANDIDATES.json'), JSON.stringify(manualReviewCandidates, null, 2));

const mdReport = `# EVC Dry Run Report

**Overview**
- Auto Safe Candidates: ${autoSafeCandidates.length}
- Manual Review Candidates: ${manualReviewCandidates.length}
- Total Violations in Canonical: ${violations}

## Auto Safe Sample
\`\`\`json
${JSON.stringify(autoSafeCandidates.slice(0, 5), null, 2)}
\`\`\`

## Manual Review Sample
\`\`\`json
${JSON.stringify(manualReviewCandidates.slice(0, 5), null, 2)}
\`\`\`
`;

fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_DRY_RUN_REPORT.md'), mdReport);
console.log(JSON.stringify(report, null, 2));
