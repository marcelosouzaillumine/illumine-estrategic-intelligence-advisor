import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFixLabel = [
  'src/components/pages/PayablesPage.tsx',
  'src/components/pages/PurchasingPage.tsx',
  'src/components/pages/ReceivablesPage.tsx',
  'src/components/PayrollDashboard.tsx',
  'src/components/pages/TaxReformImpactPage.tsx',
  'src/components/pages/PilotMonitoringDashboard.tsx'
];

filesToFixLabel.forEach(filePath => {
  const absolutePath = path.join(__dirname, filePath);
  if (!fs.existsSync(absolutePath)) return;
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // SortableHeader
  content = content.replace(/(<SortableHeader[\s\S]*?)\btitle=/g, '$1label=');
  // MetricScore
  content = content.replace(/(<MetricScore[\s\S]*?)\btitle=/g, '$1label=');
  // MetricCard
  content = content.replace(/(<MetricCard[\s\S]*?)\btitle=/g, '$1label=');

  fs.writeFileSync(absolutePath, content);
  console.log(`Fixed ${filePath}`);
});
