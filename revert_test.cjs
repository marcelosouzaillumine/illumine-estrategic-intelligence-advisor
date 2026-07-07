const fs = require('fs');
let content = fs.readFileSync('tests/design-token-sovereignty.test.ts', 'utf-8');
content = content.replace(/if\s*\(hexViolations\.length\s*>\s*0\)\s*\{\s*console\.warn\('[^']+'\s*\+\s*hexViolations\.length\s*\+\s*'[^']+'\s*\+\s*hexViolations\.join\('\\n'\)\);\s*\}/s, "assert.strictEqual(hexViolations.length, 0, 'Found hardcoded hex colors:\\n' + hexViolations.join('\\n'));");
fs.writeFileSync('tests/design-token-sovereignty.test.ts', content);
