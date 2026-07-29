const fs = require('fs');
const p = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed/EVC_EQUIVALENCE_REGISTRY.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

const r20 = data.rules.find(r => r.target === 'rounded-surface-compact');
if (r20 && !r20.allowedComponents) r20.allowedComponents = ['executive-action-card.tsx'];

const r24 = data.rules.find(r => r.target === 'rounded-surface');
if (r24 && !r24.allowedComponents) r24.allowedComponents = ['executive-metric-card.tsx', 'executive-info-card.tsx', 'executive-surface.tsx'];

const r32 = data.rules.find(r => r.target === 'rounded-surface-prominent');
if (r32 && !r32.allowedComponents) r32.allowedComponents = ['executive-insight-card.tsx', 'executive-accordion.tsx'];

fs.writeFileSync(p, JSON.stringify(data, null, 2));
console.log('Registry updated with allowedComponents.');
