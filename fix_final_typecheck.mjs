import fs from 'fs';
import path from 'path';

// Fix AxisDashboardPage
let file = 'src/components/pages/AxisDashboardPage.tsx';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('ExecutiveMetricCard')) {
  // Try finding an import to attach to
  content = content.replace(/import\s+React.*?;\n/, match => match + "import { ExecutiveMetricCard } from '../../components/ui/executive-metric-card';\n");
}
fs.writeFileSync(file, content, 'utf8');

// Fix GovernanceDashboardPage
file = 'src/components/pages/GovernanceDashboardPage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<ExecutiveMetricCard([^>]*?)(noScroll|noScroll=\{true\})([^>]*?)>/g, '<ExecutiveMetricCard$1$3>');
content = content.replace(/<ExecutiveMetricCard([^>]*?)title=/g, '<ExecutiveMetricCard$1label=');
content = content.replace(/<ExecutiveMetricCard([^>]*?)status=/g, '<ExecutiveMetricCard$1tone=');
fs.writeFileSync(file, content, 'utf8');

// Fix IndicatorsPage
file = 'src/components/pages/IndicatorsPage.tsx';
content = fs.readFileSync(file, 'utf8');
// <div value={formatValue(...)} suffix="%" className="..." /> -> <div className="...">{formatValue(...)}%</div>
content = content.replace(/<div\s+value=\{([^}]+)\}\s+suffix=(['"])(.*?)\2\s+className=(['"])(.*?)\4\s*\/>/g, '<div className=$4$5$4>{$1}$3</div>');
content = content.replace(/<div\s+value=\{([^}]+)\}\s+className=(['"])(.*?)\2\s*\/>/g, '<div className=$2$3$2>{$1}</div>');
fs.writeFileSync(file, content, 'utf8');

// Fix PayablesPage
file = 'src/components/pages/PayablesPage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<div\s+value=\{([^}]+)\}\s+className=(['"])(.*?)\2\s*\/>/g, '<div className=$2$3$2>{$1}</div>');
fs.writeFileSync(file, content, 'utf8');

// Fix ReceivablesPage
file = 'src/components/pages/ReceivablesPage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<div\s+value=\{([^}]+)\}\s+className=(['"])(.*?)\2\s*\/>/g, '<div className=$2$3$2>{$1}</div>');
fs.writeFileSync(file, content, 'utf8');

