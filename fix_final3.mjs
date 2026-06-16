import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const p = path.join(__dirname, 'src/components/pages/TaxReformImpactPage.tsx');
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/(<ExecutiveMetricCard[\s\S]*?)\btitle=/g, '$1label=');
fs.writeFileSync(p, c);
console.log('Fixed TaxReformImpactPage');
