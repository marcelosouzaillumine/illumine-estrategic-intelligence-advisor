const fs = require('fs');
const path = require('path');

const logDir = './.audit';
const files = fs.readdirSync(logDir).filter(f => f.endsWith('.log'));

const inventory = new Map(); // filepath -> { lines: [], occurrences: 0 }
const collections = new Map(); // collectionName -> { filepaths: new Set() }

files.forEach(f => {
  const content = fs.readFileSync(path.join(logDir, f), 'utf-8');
  content.split('\n').forEach(line => {
    if (!line) return;
    const parts = line.split(':');
    if (parts.length >= 3) {
      const filepath = parts[0];
      const lineno = parts[1];
      const text = parts.slice(2).join(':');

      if (!inventory.has(filepath)) {
        inventory.set(filepath, { occurrences: 0, sample: text.trim() });
      }
      inventory.get(filepath).occurrences++;

      // Try to extract collection names
      const collMatch = text.match(/collection\([^,]+,\s*['"]([^'"]+)['"]/);
      if (collMatch) {
        const coll = collMatch[1];
        if (!collections.has(coll)) collections.set(coll, new Set());
        collections.get(coll).add(filepath);
      }
    }
  });
});

let md = '# ILLUMINE FIRESTORE LEGACY INVENTORY\n\n';

md += '## 1. Firebase Collections and Entities in Codebase\n';
md += '| Collection | Status | Occurrences | Purpose / Read / Write | Classification |\n';
md += '|---|---|---|---|---|\n';

const manualClassifications = {
    'users': 'ACTIVE (Identity)',
    'companies': 'ACTIVE (Identity/Core)',
    'invitations': 'ACTIVE (Identity)',
    'board_packs': 'MIGRATED',
    'financial_positions': 'QUARANTINED',
    'assessments': 'MIGRATED / QUARANTINED'
};

for (const [coll, fps] of collections.entries()) {
    let classification = manualClassifications[coll] || 'LEGACY';
    if (coll.includes('$')) classification = 'DYNAMIC';
    md += `| \`${coll}\` | - | ${fps.size} files | Unknown | **${classification}** |\n`;
}

md += '\n## 2. File-level Dependency Classification\n';
md += '| File | Occurrences | Classification | Reason |\n';
md += '|---|---|---|---|\n';

for (const [fp, data] of inventory.entries()) {
    let classification = 'UNKNOWN';
    let reason = 'Contains Firebase logic';

    if (fp.includes('src/capabilities/financial')) {
        classification = 'BLOCKER';
        reason = 'Financial Core should be 100% Supabase';
    } else if (fp.includes('scripts/') || fp.includes('src/scripts/')) {
        classification = 'LEGACY';
        reason = 'Automation script';
    } else if (fp.includes('src/services/firebase') || fp.includes('auth')) {
        classification = 'ACTIVE';
        reason = 'Identity / Auth integration';
    } else if (fp.includes('adapter') || fp.includes('repository')) {
        classification = 'MIGRATED / QUARANTINED';
        reason = 'Likely legacy adapter';
    } else if (fp.includes('components/')) {
        classification = 'ACTIVE / QUARANTINED';
        reason = 'UI depending on Firestore';
    }

    md += `| ${fp} | ${data.occurrences} | **${classification}** | ${reason} |\n`;
}

fs.writeFileSync('ILLUMINE_FIRESTORE_LEGACY_INVENTORY.md', md);
console.log('Done.');
