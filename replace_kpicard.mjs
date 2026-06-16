import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'DashboardPage.tsx',
  'ControladoriaPage.tsx',
  'MarketingComercialPage.tsx',
  'OperacionalPage.tsx',
  'FinancialAdminDashboard.tsx',
  'DFCPage.tsx',
  'governance/MultiTenantGovernanceCenter.tsx',
  'AdministrativaPage.tsx',
  'CashFlowPage.tsx',
  'FinancialPositionPage.tsx',
  'TenantGovernancePage.tsx',
  'DreGerencialPage.tsx',
  'DREPage.tsx',
  'RelatorioExecutivoPage.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src/components/pages', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix imports
  if (content.includes('KpiCard')) {
    // Determine the import depth
    const depthMatch = content.match(/import\s+{[^}]*}\s+from\s+['"]((?:\.\.\/)+)Common['"]/);
    const depth = depthMatch ? depthMatch[1] : '../';
    
    // Remove KpiCard from Common import
    content = content.replace(/,\s*KpiCard|KpiCard\s*,\s*/g, '');
    // Also remove KpiValue if present
    // content = content.replace(/,\s*KpiValue|KpiValue\s*,\s*/g, '');
    
    // Add ExecutiveMetricCard import
    if (!content.includes('ExecutiveMetricCard')) {
       content = content.replace(new RegExp(`(import\\s+{[^}]*}\\s+from\\s+['"]${depth.replace(/\\./g, '\\.')}Common['"];?)`), `$1\nimport { ExecutiveMetricCard } from '${depth}ui/executive-metric-card';`);
    }
  }

  // Replace <KpiCard tags
  content = content.replace(/<KpiCard\s+([\s\S]*?)(\/>|><\/KpiCard>)/g, (match, propsStr) => {
    let newProps = propsStr;
    
    newProps = newProps.replace(/status=(['"])(danger|critical)\1/g, 'tone="critical"');
    newProps = newProps.replace(/status=(['"])(success)\1/g, 'tone="success"');
    newProps = newProps.replace(/status=(['"])(warning|alert)\1/g, 'tone="warning"');
    newProps = newProps.replace(/status=(['"])(info)\1/g, 'tone="info"');
    newProps = newProps.replace(/status=(['"])(default)\1/g, 'tone="neutral"');

    const suffixMatch = newProps.match(/suffix=(['"])(.*?)\1/);
    if (suffixMatch) {
       const suffix = suffixMatch[2];
       newProps = newProps.replace(/suffix=(['"]).*?\1\s*/, '');
       newProps = newProps.replace(/value=\{([^}]+)\}/, `value={\`\${$1}${suffix}\`}`);
       newProps = newProps.replace(/value=(['"])(.*?)\1/, `value={\`$2${suffix}\`}`);
    }

    newProps = newProps.replace(/trend=/g, 'description=');
    
    if (newProps.match(/\bhighlight\b(?!\s*=)/)) {
      newProps = newProps.replace(/\bhighlight\b/, 'variant="highlight"');
    } else if (newProps.match(/highlight=\{true\}/)) {
      newProps = newProps.replace(/highlight=\{true\}/, 'variant="highlight"');
    }

    return `<ExecutiveMetricCard density="analytical" ${newProps}/>`;
  });

  fs.writeFileSync(filePath, content);
  console.log('Updated', file);
});
