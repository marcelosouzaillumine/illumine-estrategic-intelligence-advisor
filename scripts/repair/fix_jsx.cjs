const fs = require('fs');
const file = 'src/components/pages/FinancialModelingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /{tab === 'cenarios' && \(\n            <ExecutiveDecisionCenter/,
  `{tab === 'cenarios' && (\n            <><ExecutiveDecisionCenter`
);

content = content.replace(
  /<ExecutionTrackingDashboard commitments={mockCommitments} \/>\n          \)}/,
  `<ExecutionTrackingDashboard commitments={mockCommitments} />\n            </>\n          )}`
);

fs.writeFileSync(file, content);
console.log("Fixed JSX");
