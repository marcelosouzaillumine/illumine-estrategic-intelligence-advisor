const fs = require('fs');
const path = require('path');

const files = [
  'src/components/pages/governance/ComplianceIntegrityCenter.tsx',
  'src/components/pages/governance/GovernanceRiskHeatmap.tsx',
  'src/components/pages/governance/CrisisResponseCenter.tsx'
];

const regexHooks = /use(State|Effect|Memo|Callback)\b/g;
const regexDirectImports = /from\s+['"](firebase|.*Firebase.*|.*ClientIntelligence.*|.*Runtime.*|.*BrasilAPI.*|.*ai-.*|.*operational-intelligence.*)['"]/g;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hooksMatch = content.match(regexHooks);
  const directImportsMatch = content.match(regexDirectImports);
  
  console.log(`\nFile: ${file}`);
  console.log(`Hooks found: ${hooksMatch ? hooksMatch.length : 0}`);
  if (hooksMatch) console.log(hooksMatch);
  
  console.log(`Direct imports found: ${directImportsMatch ? directImportsMatch.length : 0}`);
  if (directImportsMatch) console.log(directImportsMatch);
});
