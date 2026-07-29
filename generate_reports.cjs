const fs = require('fs');
const before = JSON.parse(fs.readFileSync('docs/architecture/EAC_PAGE_INVENTORY_V2_BEFORE.json'));
const after = JSON.parse(fs.readFileSync('docs/architecture/EAC_PAGE_INVENTORY_V2.json'));

const dreBefore = before.find(p => p.path.includes('DREPage'));
const dreAfter = after.find(p => p.path.includes('DREPage'));
fs.writeFileSync('docs/architecture/EAC_SUMMARY_DRE_BEFORE_AFTER.json', JSON.stringify({ before: dreBefore, after: dreAfter }, null, 2));

const govBefore = before.find(p => p.path.includes('FiduciaryGovernanceCenter'));
const govAfter = after.find(p => p.path.includes('FiduciaryGovernanceCenter'));
fs.writeFileSync('docs/architecture/EAC_SUMMARY_GOVERNANCE_BEFORE_AFTER.json', JSON.stringify({ before: govBefore, after: govAfter }, null, 2));
