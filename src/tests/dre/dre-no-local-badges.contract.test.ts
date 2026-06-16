import test from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import path from 'path';

test('DRE Canonical UI - No Local Badges', async (t) => {
  const dreDir = path.resolve(process.cwd(), 'src/components/pages/dre');
  
  await t.test('Should not contain arbitrary badges or pills', () => {
    try {
      const result = execSync(`grep -R -E "rounded-full|px-2 py-1|StatusBadge" ${dreDir}`).toString();
      
      assert.fail(`Found prohibited local badges or rounded-full pills in DRE pages:\n${result}`);
    } catch (error: any) {
      if (error.status === 1) {
        assert.ok(true, 'No arbitrary badge utility classes found');
      } else {
        throw error;
      }
    }
  });
});
