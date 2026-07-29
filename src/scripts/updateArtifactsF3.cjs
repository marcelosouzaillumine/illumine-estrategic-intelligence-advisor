const fs = require('fs');
const path = require('path');
const p = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_MANUAL_REVIEW_DISPOSITION.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
const approved = ['EVC-MR-0687', 'EVC-MR-0704', 'EVC-MR-0685', 'EVC-MR-0715', 'EVC-MR-0716'];
data.forEach(item => {
  if (approved.includes(item.id)) {
    item.disposition = 'APPROVED_EQUIVALENCE';
    item.decisionSource = 'EVC Geometry Contract';
    if (item.finding.includes('20px')) item.proposedToken = 'rounded-surface-compact';
    if (item.finding.includes('24px')) item.proposedToken = 'rounded-surface';
    if (item.finding.includes('32px')) item.proposedToken = 'rounded-surface-prominent';
  }
});
fs.writeFileSync(p, JSON.stringify(data, null, 2));

const regP = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_EQUIVALENCE_REGISTRY.json';
const regData = JSON.parse(fs.readFileSync(regP, 'utf8'));

// update Phase 3A mapping from rounded-md to rounded-surface
const r24 = regData.rules.find(r => r.source === 'rounded-[24px]');
if (r24) r24.target = 'rounded-surface';

regData.rules.push(
  { source: 'rounded-[20px]', target: 'rounded-surface-compact', numericEquivalent: true, allowedRoles: ['EXECUTIVE_ACTION_CARD_OR_COMPACT_SURFACE'], classification: 'AUTO_SAFE' },
  { source: 'rounded-[24px]', target: 'rounded-surface', numericEquivalent: true, allowedRoles: ['EXECUTIVE_SURFACE_STANDARD'], classification: 'AUTO_SAFE' },
  { source: 'rounded-[32px]', target: 'rounded-surface-prominent', numericEquivalent: true, allowedRoles: ['EXECUTIVE_SURFACE_HERO_OR_PROMINENT'], classification: 'AUTO_SAFE' }
);
fs.writeFileSync(regP, JSON.stringify(regData, null, 2));
console.log('Artifacts updated');
