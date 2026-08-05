const fs = require('fs');

const files = [
  'src/core/localization/__tests__/currency.formatter.test.ts',
  'src/core/localization/__tests__/percentage.formatter.test.ts',
  'src/core/localization/__tests__/date.formatter.test.ts',
  'src/core/localization/__tests__/tenant-locale.service.test.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Quick fix for expect(mockUseFormatterResolve()).toBe('EUR') that might have been missed
  content = content.replace(/expect\(([^)]+)\)\.toBe\(([^)]+)\);/g, 'assert.equal($1, $2);');
  
  // And if we have any rogue `expect`
  content = content.replace(/expect\(/g, 'assert.ok(');
  content = content.replace(/assert\.ok\(([^)]+)\)\.toMatch\(([^)]+)\)/g, 'assert.match($1, $2)');
  content = content.replace(/assert\.ok\(([^)]+)\)\.toContain\(([^)]+)\)/g, 'assert.ok($1.includes($2))');
  
  // Also fix the Date format matching "Aug 03"
  content = content.replace(/\/Aug 3, 2026, 8:40\\s\*\(PM\|p\\\.m\\\.\)\/i/, '/Aug 0?3, 2026, 8:40\\s*(PM|p\\.m\\.)/i');
  
  fs.writeFileSync(file, content, 'utf8');
}
