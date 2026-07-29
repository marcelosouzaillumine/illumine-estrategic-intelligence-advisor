const fs = require('fs');
const path = require('path');

const dispPath = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_MANUAL_REVIEW_DISPOSITION.json';
const dispData = JSON.parse(fs.readFileSync(dispPath, 'utf8'));

const mappings = {
  'EVC-MR-0698': { disp: 'TOKEN_GAP_RESOLVED', tok: 'bg-surface-emphasis', role: 'CURRENT_STEP_CONTAINER' },
  'EVC-MR-0699': { disp: 'APPROVED_EQUIVALENCE', tok: 'hover:bg-surface-container/50', role: 'PASSIVE_CARD_HOVER' },
  'EVC-MR-0700': { disp: 'APPROVED_EQUIVALENCE', tok: 'bg-border', role: 'NEUTRAL_STEP_CONNECTOR' },
  'EVC-MR-0701': { disp: 'SEMANTIC_COMPONENT_MIGRATION', tok: 'ExecutiveBadge variant="info"', role: 'CURRENT_STEP_STATUS' }
};

dispData.forEach(item => {
  if (mappings[item.id]) {
    item.disposition = mappings[item.id].disp;
    item.proposedToken = mappings[item.id].tok;
    item.semanticRole = mappings[item.id].role;
    item.decisionSource = 'EVC Sublote 3B.1C Color Semantics';
  }
});
fs.writeFileSync(dispPath, JSON.stringify(dispData, null, 2));

const regPath = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_EQUIVALENCE_REGISTRY.json';
const regData = JSON.parse(fs.readFileSync(regPath, 'utf8'));

regData.rules.push(
  {
    source: 'bg-slate-50',
    target: 'bg-surface-emphasis',
    numericEquivalent: true,
    allowedComponents: ['executive-execution-plan.tsx'],
    allowedRoles: ['CURRENT_STEP_CONTAINER', 'SELECTED_EXECUTIVE_SURFACE', 'EMPHASIZED_PASSIVE_CONTAINER'],
    themeScope: 'LIGHT_ONLY',
    darkMode: 'INACTIVE_NOT_CERTIFIED',
    classification: 'AUTO_SAFE'
  },
  {
    source: 'hover:bg-slate-50/50',
    target: 'hover:bg-surface-container/50',
    numericEquivalent: true,
    allowedComponents: ['executive-execution-plan.tsx'],
    allowedRoles: ['PASSIVE_CARD_HOVER'],
    themeScope: 'LIGHT_ONLY',
    classification: 'AUTO_SAFE'
  },
  {
    source: 'bg-slate-200',
    target: 'bg-border',
    numericEquivalent: true,
    allowedComponents: ['executive-execution-plan.tsx'],
    allowedRoles: ['NEUTRAL_STEP_CONNECTOR'],
    themeScope: 'LIGHT_ONLY',
    classification: 'AUTO_SAFE'
  }
);
fs.writeFileSync(regPath, JSON.stringify(regData, null, 2));
console.log('Artifacts updated for 3B.1C');
