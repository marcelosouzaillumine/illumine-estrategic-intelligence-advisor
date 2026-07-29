const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed';
const dispositionData = JSON.parse(fs.readFileSync(path.join(ARTIFACT_DIR, 'EVC_MANUAL_REVIEW_DISPOSITION.json'), 'utf8'));
const PROJECT_ROOT = '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor';

const surfaceFiles = [
  'executive-surface.tsx',
  'executive-info-card.tsx',
  'executive-metric-card.tsx',
  'executive-accordion.tsx',
  'executive-decision-panel.tsx',
  'executive-insight-card.tsx',
  'executive-distribution-card.tsx',
  'executive-exposure-card.tsx',
  'executive-action-card.tsx',
  'executive-execution-plan.tsx'
];

const targetItems = dispositionData.filter(d => d.file.startsWith('/src/components/ui/') && surfaceFiles.some(f => d.file.includes(f)));

const enrichedData = [];

for (const item of targetItems) {
  const filePath = path.join(PROJECT_ROOT, item.file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const lineStr = lines[item.line - 1]; // 1-indexed

  // Heuristics for context
  const tagMatch = lineStr.match(/<([A-Za-z0-9_]+)/);
  let jsxElement = tagMatch ? tagMatch[1] : 'div';
  if (!tagMatch && lineStr.includes('className')) jsxElement = 'dynamic container';
  
  // Try to find dark mode class
  const darkMatch = lineStr.match(/dark:([a-z0-9\-\/]+)/);
  const inactiveDarkClass = darkMatch ? darkMatch[0] : null;

  let disposition = "PENDING";
  let proposedToken = null;
  let proposedSemanticRole = "UNKNOWN";

  if (item.finding.includes('bg-slate-50') || item.finding.includes('bg-slate-200')) {
      disposition = item.finding.includes('50') ? 'MANUAL_SEMANTIC_CONFIRMATION' : 'MANUAL_REVIEW';
      proposedToken = item.finding.includes('50') ? 'bg-surface-container' : 'bg-muted';
      proposedSemanticRole = item.finding.includes('50') ? 'SURFACE_SECONDARY' : 'INACTIVE_TRACK';
  } else if (item.finding.includes('rounded-[20px]') || item.finding.includes('rounded-[24px]') || item.finding.includes('rounded-[32px]')) {
      if (item.file.includes('executive-surface.tsx')) {
         disposition = 'TOKEN_GAP_REQUIRES_REGISTRY_DECISION';
         proposedSemanticRole = 'SURFACE_BASE';
      } else {
         disposition = 'REQUIRES_TOKEN_ALIGNMENT';
         proposedSemanticRole = 'DEPENDS_ON_SURFACE_CONTRACT';
      }
  } else if (item.finding.includes('w-') || item.finding.includes('h-')) {
      if (item.finding === 'w-[22px]') {
          disposition = 'CONTROL_ICON_REVIEW';
          proposedSemanticRole = 'CONTROL_ICON';
      } else {
          disposition = 'FIXED_DIMENSION_REVIEW';
          proposedSemanticRole = 'FIXED_CANVAS_OR_COLUMN';
      }
  }

  enrichedData.push({
    id: item.id,
    component: path.basename(item.file),
    line: item.line,
    finding: item.finding,
    jsxElement: jsxElement,
    usageContext: lineStr.trim(),
    variant: "unknown_static_heuristic",
    activeThemeClass: item.finding,
    inactiveDarkClass: inactiveDarkClass,
    themeScope: "LIGHT_ONLY",
    proposedSemanticRole: proposedSemanticRole,
    proposedToken: proposedToken,
    disposition: disposition,
    activeThemeVisualRegression: "PENDING",
    responsiveBehavior: "PENDING",
    decisionSource: null
  });
}

// Group for MD
const grouped = {};
for (const item of enrichedData) {
  if (!grouped[item.component]) grouped[item.component] = [];
  grouped[item.component].push(item);
}

let md = `# EVC Sublote 3B.1 — Enriched Semantic Review (LIGHT THEME CERTIFICATION)\n\n`;
Object.keys(grouped).forEach(comp => {
  md += `## \`${comp}\`\n`;
  grouped[comp].forEach(f => {
    md += `- **ID**: ${f.id} | **Finding**: \`${f.finding}\`\n`;
    md += `  - **Element Context**: \`${f.jsxElement}\` on line ${f.line}\n`;
    md += `  - **Code Line**: \`${f.usageContext}\`\n`;
    md += `  - **Dark Mode Class (Ignored)**: \`${f.inactiveDarkClass || 'none'}\`\n`;
    md += `  - **Proposed Role**: \`${f.proposedSemanticRole}\`\n`;
    md += `  - **Disposition**: \`${f.disposition}\`\n`;
    if (f.proposedToken) md += `  - **Proposed Token**: \`${f.proposedToken}\`\n`;
    md += `\n`;
  });
});

const geometryContract = {
  "EVC Geometry Contract": {
    "TargetComponents": ["ExecutiveSurface", "ExecutiveCard", "ExecutivePanel"],
    "Values": {
      "20px": { "proposedToken": "radius-surface-compact", "role": "EXECUTIVE_ACTION_CARD_OR_COMPACT_SURFACE" },
      "24px": { "proposedToken": "radius-surface", "role": "EXECUTIVE_SURFACE_STANDARD" },
      "32px": { "proposedToken": "radius-surface-prominent", "role": "EXECUTIVE_SURFACE_HERO_OR_PROMINENT" }
    },
    "Dependencies": [
      "executive-accordion.tsx must inherit radius-surface-prominent if wrapping hero content.",
      "executive-insight-card.tsx must inherit radius-surface-prominent."
    ]
  }
};

fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_SUBLOTE_3B_1_ENRICHED_REVIEW.json'), JSON.stringify(enrichedData, null, 2));
fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_SUBLOTE_3B_1_ENRICHED_REVIEW.md'), md);
fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_GEOMETRY_CONTRACT_PROPOSAL.json'), JSON.stringify(geometryContract, null, 2));

console.log("Artifacts successfully generated.");
