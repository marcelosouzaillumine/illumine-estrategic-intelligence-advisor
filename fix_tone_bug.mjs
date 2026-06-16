import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allFiles = [
  'src/components/pages/FinancialPositionPage.tsx',
  'src/components/pages/OperacionalPage.tsx',
  'src/components/pages/MarketingComercialPage.tsx',
  'src/components/pages/ControladoriaPage.tsx'
];

allFiles.forEach(f => {
  const absolutePath = path.join(__dirname, f);
  if (!fs.existsSync(absolutePath)) return;
  let c = fs.readFileSync(absolutePath, 'utf8');

  // Find all cases where tone={... ? "Verde" : "Vermelho" === 'Verde' ? 'success' ...}
  c = c.replace(/tone=\{([^?]+)\? "Verde" : "Vermelho" === 'Verde' \? 'success' : [^?]+\? "Verde" : "Vermelho" === 'Vermelho' \? 'critical' : 'warning'\}/g, 'tone={$1 ? "success" : "critical"}');
  c = c.replace(/tone=\{([^?]+)\? "Verde" : "Amarelo" === 'Verde' \? 'success' : [^?]+\? "Verde" : "Amarelo" === 'Vermelho' \? 'critical' : 'warning'\}/g, 'tone={$1 ? "success" : "warning"}');

  if (c !== fs.readFileSync(absolutePath, 'utf8')) {
    fs.writeFileSync(absolutePath, c);
    console.log(`Fixed ${f}`);
  }
});
