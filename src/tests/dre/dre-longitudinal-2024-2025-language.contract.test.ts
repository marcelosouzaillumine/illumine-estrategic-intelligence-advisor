import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('DRE Longitudinal 2024-2025 Language Contract', () => {
  it('must specifically target 2024 and 2025 years in the longitudinal compiler', () => {
    const compilerPath = path.join(process.cwd(), 'src/capabilities/financial/runtime/dre/DreExecutiveLanguageCompiler.ts');
    
    if (!fs.existsSync(compilerPath)) {
      return; 
    }

    const content = fs.readFileSync(compilerPath, 'utf-8');
    
    if (!content.includes('year === 2024')) {
      assert.fail('Compiler is missing specific 2024 longitudinal branching condition (year === 2024)');
    }

    if (!content.includes('year === 2025')) {
      assert.fail('Compiler is missing specific 2025 longitudinal branching condition (year === 2025)');
    }

    if (!content.includes('salto consistente de rentabilidade')) {
      assert.fail('Compiler is missing the 2024 text requirement');
    }

    if (!content.includes('manutenção de margem elevada')) {
      assert.fail('Compiler is missing the 2025 text requirement');
    }
  });
});
