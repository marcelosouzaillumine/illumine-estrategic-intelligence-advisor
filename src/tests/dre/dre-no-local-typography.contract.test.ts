import test from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import path from 'path';

test('DRE Canonical UI - No Local Typography', async (t) => {
  const dreDir = path.resolve(process.cwd(), 'src/components/pages/dre');
  
  await t.test('Should not contain arbitrary typography utility classes', () => {
    try {
      const result = execSync(`grep -R -E "text-xs|text-sm|font-semibold|font-bold" ${dreDir} | grep -v "text-xs\|text-sm" | grep -v "font-bold\|font-semibold"`).toString();
      // Actually we just want to ensure we don't have text-xs, text-sm, font-semibold, font-bold 
      // used as arbitrary Tailwind classes instead of ExecutiveTypography.
      // We do a strict check on grep and let it fail if it finds them.
      
      const strictGrep = execSync(`grep -R -E "text-xs|text-sm|font-semibold|font-bold" ${dreDir}`).toString();
      assert.fail(`Found prohibited local typography classes in DRE pages:\n${strictGrep}`);
    } catch (error: any) {
      if (error.status === 1) {
        assert.ok(true, 'No arbitrary typography utility classes found');
      } else {
        throw error;
      }
    }
  });
});
