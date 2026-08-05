const fs = require('fs');

const files = [
  'src/core/localization/__tests__/currency.formatter.test.ts',
  'src/core/localization/__tests__/percentage.formatter.test.ts',
  'src/core/localization/__tests__/date.formatter.test.ts',
  'src/core/localization/__tests__/tenant-locale.service.test.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("import { expect, test, describe } from 'vitest';", "import { test, describe } from 'node:test';\nimport assert from 'node:assert/strict';");
  
  // Replace expect(x).toBe(y) with assert.equal(x, y)
  content = content.replace(/expect\(([^)]+)\)\.toBe\(([^)]+)\);/g, 'assert.equal($1, $2);');
  
  // Replace expect(x).toContain(y) with assert.match(x, new RegExp(y.replace(/\$/g, '\\$'), 'i')) 
  // Wait, assert doesn't have toContain. We can use assert.ok(x.includes(y))
  content = content.replace(/expect\(([^)]+)\)\.toContain\('([^']+)'\);/g, 'assert.ok($1.includes(\'$2\'));');
  
  // Replace expect(x).toMatch(/regex/) with assert.match(x, /regex/)
  content = content.replace(/expect\(([^)]+)\)\.toMatch\((\/[^\/]+\/[ig]*)\);/g, 'assert.match($1, $2);');

  fs.writeFileSync(file, content, 'utf8');
}
