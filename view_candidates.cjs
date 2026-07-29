const fs = require('fs');
const path = require('path');

const candidates = [
  "ExecutiveBoardReportModal",
  "BenchmarkReadinessPanel",
  "BoardDecisionSurface",
  "CausalityExplorerPanel",
  "GovernanceJourneyPanel",
  "GovernanceKnowledgePanel",
  "GovernanceLearningPanel"
];

function findFile(dir, name) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const res = findFile(fullPath, name);
      if (res) return res;
    } else if (file === name + '.tsx') {
      return fullPath;
    }
  }
  return null;
}

const srcDir = path.join(process.cwd(), 'src');
candidates.forEach(c => {
  const p = findFile(srcDir, c);
  if (p) {
    const content = fs.readFileSync(p, 'utf8');
    const lines = content.split('\n');
    console.log(`\n=== ${c} ===`);
    console.log(`Lines: ${lines.length}`);
    const imports = lines.filter(l => l.startsWith('import '));
    console.log(`Imports: ${imports.length}`);
  }
});
