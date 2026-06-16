import fs from 'fs';
let file = 'src/components/pages/AxisDashboardPage.tsx';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes("import { ExecutiveMetricCard }")) {
  content = content.replace(/import\s+React.*?;\n/, match => match + "import { ExecutiveMetricCard } from '../../components/ui/executive-metric-card';\n");
}
fs.writeFileSync(file, content, 'utf8');
