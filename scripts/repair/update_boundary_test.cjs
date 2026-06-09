const fs = require('fs');
const file = 'tests/architectural-boundaries.test.ts';
let content = fs.readFileSync(file, 'utf8');

// The test previously allowed some exceptions based on regexes. We will make it strict.
content = content.replace(
  /return \/from\\s\+\\['"]\.\*core\\\/runtime\.\*\\['"]\/\.test\(content\) && \n             \(\/Runtime\\b\/\.test\(content\) \|\| \/Engine\\b\/\.test\(content\) \|\| \/Calculator\\b\/\.test\(content\) \|\| \/Threshold\\b\/\.test\(content\)\);/,
  `return /from\\s+['"].*core\\/runtime.*['"]/.test(content);`
);

fs.writeFileSync(file, content);
console.log("Updated architectural-boundaries.test.ts");
