import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  'src/components/pages/governance/ComplianceIntegrityCenter.tsx',
  'src/components/pages/governance/MultiTenantGovernanceCenter.tsx',
  'src/components/pages/governance/ObservabilityConsolePage.tsx',
  'src/components/pages/MeetingMinutesPage.tsx',
  'src/components/pages/PilotMonitoringDashboard.tsx',
  'src/components/pages/TaxReformImpactPage.tsx'
];

filesToFix.forEach(f => {
  const absolutePath = path.join(__dirname, f);
  if (!fs.existsSync(absolutePath)) return;
  let c = fs.readFileSync(absolutePath, 'utf8');
  
  // Revert all label= back to title= for these files
  c = c.replace(/\blabel=/g, 'title=');
  
  fs.writeFileSync(absolutePath, c);
});
console.log('Fixed final 5 files');
