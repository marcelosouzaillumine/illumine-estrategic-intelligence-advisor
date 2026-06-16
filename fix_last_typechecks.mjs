import fs from 'fs';
import path from 'path';

// Fix AxisDashboardPage
let file = 'src/components/pages/AxisDashboardPage.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<KpiCard/g, '<ExecutiveMetricCard');
// We need to add KpiCard/ExecutiveMetricCard import to AxisDashboardPage if missing, or use the polyfill? No, we just renamed it.
// Actually if it was renamed to ExecutiveMetricCard, we need to ensure ExecutiveMetricCard is imported.
if (!content.includes('ExecutiveMetricCard')) {
  content = content.replace(/import \{.*?\} from '\.\.\/\.\.\/components\/Common';/, (match) => {
    return `import { ExecutiveMetricCard } from '../../components/ui/executive-metric-card';\n` + match;
  });
}
fs.writeFileSync(file, content, 'utf8');

// Fix GovernanceDashboardPage
file = 'src/components/pages/GovernanceDashboardPage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<KpiCard/g, '<ExecutiveMetricCard');
if (!content.includes('ExecutiveMetricCard')) {
  content = content.replace(/import \{.*?\} from '\.\.\/\.\.\/components\/Common';/, (match) => {
    return `import { ExecutiveMetricCard } from '../../components/ui/executive-metric-card';\n` + match;
  });
}
fs.writeFileSync(file, content, 'utf8');

// Fix IndicatorsPage
file = 'src/components/pages/IndicatorsPage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<KpiValue/g, '<div'); // Simplest fix for KpiValue usage is div or span if it's just value formatting
fs.writeFileSync(file, content, 'utf8');

// Fix PayablesPage
file = 'src/components/pages/PayablesPage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<KpiValue/g, '<div');
fs.writeFileSync(file, content, 'utf8');

// Fix ReceivablesPage
file = 'src/components/pages/ReceivablesPage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<KpiValue/g, '<div');
fs.writeFileSync(file, content, 'utf8');

// Fix noScroll in MultiTenantGovernanceCenter
file = 'src/components/pages/governance/MultiTenantGovernanceCenter.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/noScroll=\{true\}/g, '');
content = content.replace(/noScroll\s/g, '');
fs.writeFileSync(file, content, 'utf8');

// Fix noScroll in TenantGovernancePage
file = 'src/components/pages/TenantGovernancePage.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/noScroll=\{true\}/g, '');
content = content.replace(/noScroll\s/g, '');
fs.writeFileSync(file, content, 'utf8');
