const fs = require('fs');
const path = require('path');
const dir = 'src/core/runtime/governance-orchestration';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('\\`')) {
    content = content.replace(/\\`/g, '`');
    fs.writeFileSync(p, content);
    console.log('Fixed', p);
  }
}
