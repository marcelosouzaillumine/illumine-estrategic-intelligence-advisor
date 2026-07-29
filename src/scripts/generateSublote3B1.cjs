const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync('/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_MANUAL_REVIEW_DISPOSITION.json', 'utf8'));

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

const ui = data.filter(d => d.file.startsWith('/src/components/ui/') && surfaceFiles.some(f => d.file.includes(f)));

const grouped = {};
for (const item of ui) {
  if (!grouped[item.file]) grouped[item.file] = [];
  
  let proposedToken = null;
  let proposedDisposition = 'PENDING';
  let reason = '';
  
  if (item.finding === 'bg-slate-50' || item.finding === 'bg-gray-100') {
      proposedDisposition = 'APPROVED_EQUIVALENCE';
      proposedToken = 'bg-surface-container';
      reason = 'Equivalent secondary passive surface.';
  } else if (item.finding.includes('bg-white') || item.finding === 'bg-[#FFFFFF]') {
      proposedDisposition = 'APPROVED_EQUIVALENCE';
      proposedToken = 'bg-surface';
      reason = 'Primary canvas surface.';
  } else if (item.finding.includes('rounded')) {
      proposedDisposition = 'REQUIRES_VISUAL_MIGRATION';
      reason = 'Radius must map to a formal component property or token.';
  } else if (item.finding.includes('w-') || item.finding.includes('h-')) {
      proposedDisposition = 'CANONICAL_EXCEPTION';
      reason = 'Fixed dimension requires architectural justification (e.g. chart canvas or strict grid constraint).';
  } else {
      proposedDisposition = 'CANONICAL_EXCEPTION';
      reason = 'Requires further evaluation for semantic role.';
  }
  
  grouped[item.file].push({
    id: item.id,
    finding: item.finding,
    semanticRole: 'SURFACE_CONTAINER',
    proposedDisposition,
    proposedToken,
    lightModeImpact: 'NONE',
    darkModeImpact: 'NONE',
    reason
  });
}

const output = Object.keys(grouped).map(k => ({
  component: path.basename(k),
  findings: grouped[k]
}));

fs.writeFileSync('/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_SUBLOTE_3B_1_REVIEW.json', JSON.stringify(output, null, 2));

// Generate MD for presentation
let md = `# EVC Sublote 3B.1 — Superfícies e Containers\n\n`;
output.forEach(comp => {
  md += `## \`${comp.component}\`\n`;
  comp.findings.forEach(f => {
    md += `- **ID**: ${f.id} | **Finding**: \`${f.finding}\`\n`;
    md += `  - **Proposed Disposition**: \`${f.proposedDisposition}\`\n`;
    if (f.proposedToken) md += `  - **Proposed Token**: \`${f.proposedToken}\`\n`;
    md += `  - **Reason**: ${f.reason}\n\n`;
  });
});
fs.writeFileSync('/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_SUBLOTE_3B_1_REVIEW.md', md);
