import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('DRE UI Passivity Contract', () => {
  it('must not contain data-processing logic or structural governance in the UI layer', () => {
    const dreDir = path.join(process.cwd(), 'src/components/pages/dre');
    
    if (!fs.existsSync(dreDir)) {
      return;
    }

    const dreFiles = fs.readdirSync(dreDir)
      .filter(f => f.endsWith('.tsx') && f !== 'types.ts' && f !== 'view-models.ts')
      .map(f => path.join(dreDir, f));

    const badPatterns = [
      /if\s*\(\s*margin/i,
      /if\s*\(\s*ebitda/i,
      /if\s*\(\s*receita/i,
      /if\s*\(\s*lucro/i,
      /currentSituation\s*=/i,
      /recommendation\s*=/i,
      /priority\s*=/i,
      /calculate[a-zA-Z]*\(/i,
      /\.map\(\s*[a-zA-Z_]+\s*=>\s*\{\s*if/i
    ];

    const errors: string[] = [];

    for (const file of dreFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      for (const pattern of badPatterns) {
        if (pattern.test(content)) {
          errors.push(`Passivity violation: found logic pattern ${pattern.toString()} in ${path.basename(file)}`);
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`UI Passivity violations found:\n${errors.join('\n')}`);
    }
  });
});
