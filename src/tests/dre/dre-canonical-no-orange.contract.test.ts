import test from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import path from 'path';

test('DRE Canonical UI - No Orange/Amber', async (t) => {
  const dreDir = path.resolve(process.cwd(), 'src/components/pages/dre');
  
  await t.test('Should not contain orange or amber utility classes', () => {
    try {
      const result = execSync(`grep -R -E "text-orange|bg-orange|border-orange|text-amber|bg-amber|border-amber" ${dreDir}`).toString();
      
      // If we find any matches, the test should fail
      assert.fail(`Found prohibited orange/amber colors in DRE pages:\n${result}`);
    } catch (error: any) {
      // grep exits with 1 if no lines were found (which is what we want)
      if (error.status === 1) {
        assert.ok(true, 'No orange or amber utility classes found');
      } else {
        throw error;
      }
    }
  });
});
