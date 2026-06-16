import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const drePath = path.join(__dirname, 'src/components/pages/DreGerencialPage.tsx');
let dre = fs.readFileSync(drePath, 'utf8');

// Replace the <KpiCard /> in DreGerencialPage.tsx with <ExecutiveMetricCard />
dre = dre.replace(/<KpiCard[\s\n]*title="Receita \(Período\)"[\s\n]*value={([^}]+)}[\s\n]*suffix="R\$"[\s\n]*icon=\{([^}]+)\}[\s\n]*status="Verde"[\s\n]*trend="Estável"[\s\n]*\/>/g, 
  `<ExecutiveMetricCard density="analytical" label="Receita (Período)" value={\`R$ \${$1}\`} icon={$2} tone="success" description="Estável" />`);

dre = dre.replace(/<KpiCard[\s\n]*title="EBITDA \(Período\)"[\s\n]*value={([^}]+)}[\s\n]*suffix="R\$"[\s\n]*icon=\{([^}]+)\}[\s\n]*status=\{([^}]+) >= 0 \? "Verde" : "Vermelho"\}[\s\n]*trend=\{([^}]+) >= 0 \? "Bullish" : "Bearish"\}[\s\n]*\/>/g, 
  `<ExecutiveMetricCard density="analytical" label="EBITDA (Período)" value={\`R$ \${$1}\`} icon={$2} tone={$3 >= 0 ? "success" : "critical"} description={$4 >= 0 ? "Bullish" : "Bearish"} />`);

dre = dre.replace(/<KpiCard[\s\n]*title="Margem EBITDA"[\s\n]*value={([^}]+)}[\s\n]*suffix="%"[\s\n]*icon=\{([^}]+)\}[\s\n]*status=\{([^}]+) >= 20 \? "Verde" : "Amarelo"\}[\s\n]*trend="Estável"[\s\n]*\/>/g, 
  `<ExecutiveMetricCard density="analytical" label="Margem EBITDA" value={\`\${$1}%\`} icon={$2} tone={$3 >= 20 ? "success" : "warning"} description="Estável" />`);

dre = dre.replace(/<KpiCard[\s\n]*title="Lucro Líquido"[\s\n]*value={([^}]+)}[\s\n]*suffix="R\$"[\s\n]*icon=\{([^}]+)\}[\s\n]*status=\{([^}]+) >= 0 \? "Verde" : "Vermelho"\}[\s\n]*trend="Consolidado"[\s\n]*\/>/g, 
  `<ExecutiveMetricCard density="analytical" label="Lucro Líquido" value={\`R$ \${$1}\`} icon={$2} tone={$3 >= 0 ? "success" : "critical"} description="Consolidado" />`);

dre = dre.replace(/import \{ PageHeader, KpiCard \} from '\.\.\/Common';/, `import { PageHeader } from '../Common';\nimport { ExecutiveMetricCard } from '../ui/executive-metric-card';`);

fs.writeFileSync(drePath, dre);

const fpPath = path.join(__dirname, 'src/components/pages/FinancialPositionPage.tsx');
let fp = fs.readFileSync(fpPath, 'utf8');

fp = fp.replace(/import \{ PageHeader, KpiCard \} from '\.\.\/Common';/, `import { PageHeader } from '../Common';\nimport { ExecutiveMetricCard } from '../ui/executive-metric-card';`);

fp = fp.replace(/<KpiCard[\s\n]*title="Saldo Total Atual"[\s\n]*value={([^}]+)}[\s\n]*suffix="R\$"[\s\n]*icon=\{([^}]+)\}[\s\n]*\/>/g, 
  `<ExecutiveMetricCard density="analytical" label="Saldo Total Atual" value={\`R$ \${$1}\`} icon={$2} />`);

fp = fp.replace(/<KpiCard[\s\n]*title="Saldos no Início do Mês"[\s\n]*value={([^}]+)}[\s\n]*suffix="R\$"[\s\n]*icon=\{([^}]+)\}[\s\n]*\/>/g, 
  `<ExecutiveMetricCard density="analytical" label="Saldos no Início do Mês" value={\`R$ \${$1}\`} icon={$2} />`);

fp = fp.replace(/<KpiCard[\s\n]*title="Evolução no Mês"[\s\n]*value={([^}]+)}[\s\n]*suffix="%"[\s\n]*icon=\{([^}]+)\}[\s\n]*status=\{([^}]+) >= 0 \? 'Verde' : 'Vermelho'\}[\s\n]*\/>/g, 
  `<ExecutiveMetricCard density="analytical" label="Evolução no Mês" value={\`\${$1}%\`} icon={$2} tone={$3 >= 0 ? "success" : "critical"} />`);

fs.writeFileSync(fpPath, fp);

console.log('Fixed two files');
