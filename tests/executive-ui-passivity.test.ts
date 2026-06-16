import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

describe('UI Passivity Enforcement', () => {
  it('must not import any calculation engines inside pages', () => {
    const pagesDir = path.resolve(process.cwd(), 'src/components/pages');
    
    // Check all files recursively
    const walkSync = (dir: string, filelist: string[] = []) => {
      if (!fs.existsSync(dir)) return filelist;
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
          filelist = walkSync(filepath, filelist);
        } else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
          filelist.push(filepath);
        }
      });
      return filelist;
    };

    const files = walkSync(pagesDir);
    const forbiddenEngines = [
      'CapitalPreservationExecutiveAssessmentEngine',
      'LiquidityExecutiveAssessmentEngine',
      'AssetQualityExecutiveAssessmentEngine',
      'CapitalStructureExecutiveAssessmentEngine',
      'WorkingCapitalExecutiveAssessmentEngine',
      'CapitalEfficiencyExecutiveAssessmentEngine'
    ];

    const violations: string[] = [];

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      forbiddenEngines.forEach(engine => {
        if (content.includes(engine)) {
          violations.push(`${engine} found in ${path.relative(process.cwd(), file)}`);
        }
      });
    });

    assert.strictEqual(violations.length, 0, `UI Passivity Violation: UI layer is running local engines. \n${violations.join('\n')}`);
  });
});
