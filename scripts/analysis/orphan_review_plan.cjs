const fs = require('fs');
const path = require('path');

const AUDIT_FILE = 'docs/architecture/redundancy-audit.json';
const OUTPUT_FILE = 'docs/architecture/orphan-review-full.json';
const ROOT_DIR = process.cwd();

// Load orphans
const auditData = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
const orphans = auditData.orphans || [];

const protectedPrefixes = [
  'src/core/runtime/',
  'src/core/governance/',
  'src/core/security/',
  'src/runtime/',
  'src/services/security/'
];

function isProtected(filePath) {
  return protectedPrefixes.some(prefix => filePath.startsWith(prefix));
}

function hasBarrelExport(filePath) {
  const dir = path.dirname(filePath);
  const basename = path.basename(filePath, path.extname(filePath));
  const barrelPath = path.join(dir, 'index.ts');
  const barrelTsx = path.join(dir, 'index.tsx');
  
  for (const bp of [barrelPath, barrelTsx]) {
    if (fs.existsSync(bp)) {
      const content = fs.readFileSync(bp, 'utf8');
      if (content.includes(`export * from './${basename}'`) || content.includes(`export { ${basename} }`) || content.includes(`export * from "./${basename}"`)) {
        return true;
      }
    }
  }
  return false;
}

function hasTest(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  const dir = path.dirname(filePath);
  const exts = ['.test.ts', '.spec.ts', '.test.tsx', '.spec.tsx'];
  for (const ext of exts) {
    if (fs.existsSync(path.join(dir, basename + ext))) return true;
    if (fs.existsSync(path.join(dir, '__tests__', basename + ext))) return true;
  }
  return false;
}

function isEngineOrProvider(filePath) {
  const bn = path.basename(filePath).toLowerCase();
  return bn.includes('engine') || bn.includes('provider') || bn.includes('adapter') || bn.includes('service') || bn.includes('guard');
}

// Memory pre-load for string references
function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      filelist = walkSync(p, filelist);
    } else {
      filelist.push(p);
    }
  }
  return filelist;
}

console.log("Loading all src files into memory...");
const allFiles = walkSync('src');
const fileContents = allFiles.map(f => ({ path: f, content: fs.readFileSync(f, 'utf8') }));

function findStringReferences(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  let count = 0;
  for (const f of fileContents) {
    if (f.path === filePath) continue;
    if (f.path.endsWith('.test.ts') || f.path.endsWith('.spec.ts')) continue;
    if (f.content.includes(basename)) count++;
  }
  return count > 0;
}

const results = [];
let safeLines = 0;
let safeLogs = 0;

console.log("Analyzing orphans...");
for (const orphan of orphans) {
  if (!fs.existsSync(orphan)) {
    // Already gone?
    continue;
  }
  
  let status = 'SAFE_TO_ARCHIVE';
  let reason = '';
  
  const isProt = isProtected(orphan);
  const isEng = isEngineOrProvider(orphan);
  const hasBarr = hasBarrelExport(orphan);
  const hasTst = hasTest(orphan);
  const hasRef = findStringReferences(orphan);
  
  if (isEng) {
    status = 'KEEP_ACTIVE';
    reason = 'Is Engine/Provider/Adapter/Service/Guard';
  } else if (hasRef) {
    status = 'FALSE_POSITIVE';
    reason = 'Indirect string references or lazy loading detected';
  } else if (isProt) {
    status = 'REVIEW_REQUIRED';
    reason = 'Located in protected fiduciary/runtime domain';
  } else if (hasBarr) {
    status = 'REVIEW_REQUIRED';
    reason = 'Exported in local barrel file';
  } else if (hasTst) {
    status = 'REVIEW_REQUIRED';
    reason = 'Has associated test file';
  }
  
  const content = fs.readFileSync(orphan, 'utf8');
  const lines = content.split('\n').length;
  const logs = (content.match(/console\./g) || []).length;
  
  if (status === 'SAFE_TO_ARCHIVE') {
    safeLines += lines;
    safeLogs += logs;
  }
  
  results.push({
    file: orphan,
    status,
    reason,
    metrics: { lines, logs }
  });
}

const summary = {
  total: orphans.length,
  analyzed: results.length,
  SAFE_TO_ARCHIVE: results.filter(r => r.status === 'SAFE_TO_ARCHIVE').length,
  REVIEW_REQUIRED: results.filter(r => r.status === 'REVIEW_REQUIRED').length,
  KEEP_ACTIVE: results.filter(r => r.status === 'KEEP_ACTIVE').length,
  FALSE_POSITIVE: results.filter(r => r.status === 'FALSE_POSITIVE').length,
  metrics: {
    safeToArchiveLinesOfCode: safeLines,
    safeToArchiveConsoleLogs: safeLogs
  },
  items: results
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2));

console.log("Analysis completed.");
console.log(`SAFE: ${summary.SAFE_TO_ARCHIVE}, REVIEW: ${summary.REVIEW_REQUIRED}, KEEP: ${summary.KEEP_ACTIVE}, FALSE_POS: ${summary.FALSE_POSITIVE}`);
