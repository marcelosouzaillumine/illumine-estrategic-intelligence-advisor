import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

test('I18N ENUM STRUCTURAL AUDIT', async (t) => {
  await t.test('[DICTIONARY-COVERAGE] All enums must be translated in all locales', async () => {
    const ptModule = await import('../src/i18n/pt-BR.ts');
    const enModule = await import('../src/i18n/en-US.ts');
    const esModule = await import('../src/i18n/es-ES.ts');

    const ptKeys = flattenObject(ptModule.default);
    const enKeys = flattenObject(enModule.default);
    const esKeys = flattenObject(esModule.default);

    const ptEnums = Object.keys(ptKeys).filter(k => k.startsWith('enums.'));

    for (const enumKey of ptEnums) {
      assert.ok(enumKey in enKeys, `Missing translation for ${enumKey} in en-US`);
      assert.ok(enumKey in esKeys, `Missing translation for ${enumKey} in es-ES`);
    }
  });

  await t.test('[STATIC-LEAK-AUDIT] No raw enums should be rendered directly in JSX', () => {
    const walkSync = (dir: string, filelist: string[] = []) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
          filelist = walkSync(filepath, filelist);
        } else if (filepath.endsWith('.tsx')) {
          filelist.push(filepath);
        }
      });
      return filelist;
    };

    const tsxFiles = walkSync(srcDir);
    const enumLeakRegex = />\s*([A-Z0-9_]{4,})\s*</g; // Captures > CRITICAL_RISK <
    
    const whitelist = [
      'CANCELAR', 'IMPORTAR', 'MAPEAMENTO', 'CRITICAL', 'HIGH', 'WARNING', 'INFO', 
      'STATUS', 'NOME', 'TIPO', 'ENTIDADE', 'VENCIMENTO', 'VALOR', 'CATEGORIA',
      'COFINS', 'FGTS', 'DATA', 'IPCA', 'PRICE', 'CNPJ', 'APROVADA', 
      'REJECTED', 'ESCALATED', 'DRAFT', 'COMPLETED', 'CANCELLED', 'VERIFIED',
      'GOVERNANCE', 'FIDUCIARY', 'MISSION', 'INSTITUTIONAL', 'STRATEGIC', 'BADI',
      'UI_RENDER_MISMATCH', 'CROSS_STATEMENT_BINDING_FAILURE', 'WHERE', 'WITH',
      'PASSED', 'FAILED', 'BOARD_EVIDENCE_MODE', 'ACKNOWLEDGE', 'SUPERVISE', 'ESCALATE',
      'CONTAIN', 'RESOLVE', 'BLOCK', 'MEDIUM', 'UNVERIFIED', 'GRAPH_QUERY_ENGINE',
      'SELECT', 'FROM', 'HOVER', 'ACTIVE', 'DECISION', 'ASSUMPTIONS', 'EVIDENCE',
      'RECOMMENDATION', 'RECOMENDADO', 'DASHBOARD', 'SIMULADO', 'VELOCIDADE',
      'DISTRIBUTION_SPLIT_SUCCESS', 'KNOWLEDGE_HARDENING_SUCCESS', 'SEMANTIC'
    ];

    let leaks: string[] = [];

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      let match;
      while ((match = enumLeakRegex.exec(content)) !== null) {
        const suspiciousString = match[1];
        // Ignore boolean/logical literals sometimes caught
        if (['TRUE', 'FALSE', 'NULL'].includes(suspiciousString)) continue;
        if (whitelist.includes(suspiciousString)) continue;
        
        leaks.push(`Found raw enum leak "${suspiciousString}" in file: ${file}`);
      }
    }

    if (leaks.length > 0) {
      assert.fail(`Raw enums detected leaking into JSX text nodes:\n${leaks.join('\n')}`);
    }
  });
});
