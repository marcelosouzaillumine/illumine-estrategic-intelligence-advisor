import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

describe('Architectural Boundaries & Constitutional Integrity', () => {
  const componentsDir = path.join(process.cwd(), 'src/components');

  const getFilesRecursive = (dir: string): string[] => {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFilesRecursive(fullPath));
      } else {
        if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
          results.push(fullPath);
        }
      }
    });
    return results;
  };

  const allComponentFiles = getFilesRecursive(componentsDir);

  it('UI must NEVER import Runtime modules directly', () => {
    const invalidFiles = allComponentFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      // Prohibits imports containing 'core/runtime' EXCEPT 'types' or 'interfaces' if necessary, but ideally no logic.
      // We strictly ban *Runtime, *Engine, *Calculator, *Threshold
      return /from\s+['"].*core\/runtime.*['"]/.test(content) && 
             (/Runtime\b/.test(content) || /Engine\b/.test(content) || /Calculator\b/.test(content) || /Threshold\b/.test(content));
    });

    if (invalidFiles.length > 0) {
      console.error('UI Components importing core logic directly:', invalidFiles);
    }
    
    if (invalidFiles.length > 0) {
      console.error(`[CRITICAL] UI Components importing core logic directly (${invalidFiles.length} violations detected). Architectural boundary broken!`);
    }
    
    assert.strictEqual(invalidFiles.length, 0, `UI Components must NEVER import from core/runtime directly. Found ${invalidFiles.length} violations.`);
  });

  it('ExecutiveMetricCard must NOT contain formulas, proxies or rationale in description', () => {
    const invalidFiles = allComponentFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.includes('<ExecutiveMetricCard')) return false;

      // Extract ExecutiveMetricCard blocks loosely
      const regex = /<ExecutiveMetricCard[^>]*description=\{[^}]*(?:rationale|fórmula|cálculo|proxy|metodologia)[^}]*\}/gi;
      return regex.test(content);
    });

    if (invalidFiles.length > 0) {
      console.error('[CRITICAL] Technical rationale found inside ExecutiveMetricCard descriptions:', invalidFiles);
    }
    
    assert.strictEqual(invalidFiles.length, 0, `Technical explanations must be moved to the final Technical Layer. Found ${invalidFiles.length} violations.`);
  });
});
