const fs = require('fs');
const file = 'src/components/pages/ClientExecutiveWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /causalDepth: report\.compliance\.runtimeMode === 'FULL_FINANCIAL_VIEW' \? 3 : 1,/,
  `causalDepth: report.compliance.runtimeMode === 'FULL_FINANCIAL_VIEW' ? "3 Níveis" : "1 Nível",`
);

content = content.replace(
  /dataCompletenessPercent: Math\.round\(\(report\.compliance\.dataCompleteness \|\| 1\) \* 100\),/,
  `dataCompletenessPercent: String(Math.round((report.compliance.dataCompleteness || 1) * 100)),`
);

fs.writeFileSync(file, content);
console.log("Fixed string types");
