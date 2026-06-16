import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'DashboardPage.tsx',
  'ControladoriaPage.tsx',
  'MarketingComercialPage.tsx',
  'DLPAPage.tsx',
  'OperacionalPage.tsx',
  'PayablesPage.tsx',
  'ReceivablesPage.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src/components/pages', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove KpiValue import
  content = content.replace(/,\s*KpiValue|KpiValue\s*,\s*/g, '');

  fs.writeFileSync(filePath, content);
  console.log('Updated imports in', file);
});

// Also remove from Base.tsx
const basePath = path.join(__dirname, 'src/components/Common/Base.tsx');
if (fs.existsSync(basePath)) {
  let baseContent = fs.readFileSync(basePath, 'utf8');
  // Remove KpiValue component definition
  baseContent = baseContent.replace(/export function KpiValue\(\{\s*value,\s*suffix = '',\s*className,\s*noScroll = false\s*\}\s*:\s*\{[\s\S]*?\}\) \{[\s\S]*?\n\}\n/g, '');
  fs.writeFileSync(basePath, baseContent);
  console.log('Removed KpiValue from Base.tsx');
}

// Remove from index.tsx
const indexPath = path.join(__dirname, 'src/components/Common/index.tsx');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  indexContent = indexContent.replace(/,\s*KpiValue|KpiValue\s*,\s*/g, '');
  fs.writeFileSync(indexPath, indexContent);
  console.log('Removed KpiValue from Common/index.tsx');
}
