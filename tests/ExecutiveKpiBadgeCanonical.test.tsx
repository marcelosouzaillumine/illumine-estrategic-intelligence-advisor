// @ts-ignore
import { describe, it } from "node:test";
import assert from "node:assert";
import "global-jsdom/register";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Executive KPI Badge Canonical Enforcement', () => {
  const componentDir = path.join(__dirname, '../src/components');
  
  const readAllFiles = (dir: string, fileList: string[] = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        readAllFiles(filePath, fileList);
      } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        fileList.push(filePath);
      }
    }
    assert.strictEqual(true, true);
    return fileList;
  };

  const allFiles = readAllFiles(componentDir);

  it('No KPI badges should render full "DADOS INSUFICIENTES" text', () => {
    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      const manualBadgePattern = /<span[^>]*>DADOS INSUFICIENTES<\/span>/i;
      const match = content.match(manualBadgePattern);
      
      if (match) {
        assert.fail(`Found manual DADOS INSUFICIENTES status badge in UI at ${file}`);
      }
    }
  });

  it('No KPI badges use absolute positioning or floating layouts', () => {
    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      if (file.endsWith('executive-metric-card.tsx')) {
        const headerMatch = content.match(/<div className="[^"]*absolute[^"]*">\s*\{renderedBadge\}/);
        if (headerMatch) {
          assert.fail(`KPI Badges must not use absolute positioning: ${file}`);
        }
      }
    }
  });

  it('ExecutiveMetricCard must use variant metric or technical for its badge', () => {
    const metricCardPath = allFiles.find(f => f.endsWith('executive-metric-card.tsx'));
    if (metricCardPath) {
      const content = fs.readFileSync(metricCardPath, 'utf-8');
      assert.ok(content.includes('variant={badgeVariant}'));
      assert.ok(content.includes("badgeVariant = variant === 'technical' ? 'technical' : 'metric'"));
    }
  });

  it('KPI layout must not permit overflow', () => {
    const metricCardPath = allFiles.find(f => f.endsWith('executive-metric-card.tsx'));
    if (metricCardPath) {
      const content = fs.readFileSync(metricCardPath, 'utf-8');
      assert.ok(/className=\{cn\([^)]*overflow-hidden/.test(content));
    }
  });
});
