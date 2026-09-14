import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('DRE No Internal Metric Labels Contract', () => {
  it('must not leak internal metric variables into the UI via the compiler', () => {
    const compilerPath = path.join(process.cwd(), 'src/capabilities/financial/runtime/dre/DreExecutiveLanguageCompiler.ts');
    
    if (!fs.existsSync(compilerPath)) {
      return; 
    }

    const content = fs.readFileSync(compilerPath, 'utf-8');
    
    const badRegexes = [
      /rationale\s*=\s*`.*NetMargin.*`/g,
      /rationale\s*=\s*`.*BreakEvenCoverage.*`/g,
      /rationale\s*=\s*`.*EbitdaMargin.*`/g,
      /rationale\s*=\s*`.*causalityMetric.*`/g,
      /recomendação diretiva/g,
      /queima de caixa/g,
      /vantagem de escala/g,
      /altamente seguras/g
    ];

    badRegexes.forEach(regex => {
      if (regex.test(content)) {
        assert.fail(`Compiler leaks prohibited string or pattern: ${regex}`);
      }
    });
  });
});
