const fs = require('fs');
const file = 'src/components/pages/ClientExecutiveWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace RuntimeHealthPanel with a mapped viewModel
content = content.replace(
  /<RuntimeHealthPanel viewModel={report as any} \/>/g,
  `{report && report.compliance && (
            <RuntimeHealthPanel viewModel={{
              visible: {
                confidenceLevel: report.compliance.confidenceLevel || 'MEDIUM_CONFIDENCE',
                confidenceLabel: report.compliance.confidenceLevel === 'HIGH_CONFIDENCE' ? 'Alta Confiança' : 'Confiança Restrita',
                causalDepth: report.compliance.runtimeMode === 'FULL_FINANCIAL_VIEW' ? 3 : 1,
                dataCompletenessPercent: Math.round((report.compliance.dataCompleteness || 1) * 100),
                modeLabel: report.compliance.runtimeMode === 'FULL_FINANCIAL_VIEW' ? 'Visão Integral' : 'Visão Parcial',
                restrictions: []
              },
              internal: report.compliance
            }} />
          )}`
);

fs.writeFileSync(file, content);
console.log("Fixed rendering error");
