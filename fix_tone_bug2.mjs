import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allFiles = [
  'src/components/pages/OperacionalPage.tsx',
  'src/components/pages/MarketingComercialPage.tsx',
  'src/components/pages/ControladoriaPage.tsx'
];

allFiles.forEach(f => {
  const absolutePath = path.join(__dirname, f);
  if (!fs.existsSync(absolutePath)) return;
  let c = fs.readFileSync(absolutePath, 'utf8');

  // Simple and dirty replace for the exact bad string that was logged in errors:
  // "tone={status === 'Verde' ? 'Verde' : 'Vermelho' === 'Verde' ? 'success' ...}"
  // Since we don't know the exact string, let's just use regex for the suffix:
  // === 'Verde' ? 'success' : ... === 'Vermelho' ? 'critical' : 'warning'
  c = c.replace(/tone=\{([^}]+) === 'Verde' \? 'success' : [^}]+ === 'Vermelho' \? 'critical' : 'warning'\}/g, 'tone={$1 === "Verde" ? "success" : $1 === "Vermelho" ? "critical" : "warning"}');

  // And for the ones with ? "Verde" : "Vermelho" === 'Verde'
  c = c.replace(/tone=\{([^?]+)\? "Verde" : "Vermelho" === 'Verde' \? 'success' : [^?]+\? "Verde" : "Vermelho" === 'Vermelho' \? 'critical' : 'warning'\}/g, 'tone={$1 ? "success" : "critical"}');
  c = c.replace(/tone=\{([^?]+)\? "Verde" : "Amarelo" === 'Verde' \? 'success' : [^?]+\? "Verde" : "Amarelo" === 'Vermelho' \? 'critical' : 'warning'\}/g, 'tone={$1 ? "success" : "warning"}');

  if (c !== fs.readFileSync(absolutePath, 'utf8')) {
    fs.writeFileSync(absolutePath, c);
    console.log(`Fixed ${f}`);
  } else {
    // If it didn't match, let's print what we have
    const match = c.match(/tone=\{([^}]+)\}/g);
    if (match) {
       console.log(`Found tones in ${f}:`, match.filter(t => t.includes('Verde')));
    }
  }
});
