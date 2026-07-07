const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find src/core/runtime/governance -name "*.ts"', { encoding: 'utf8' }).trim().split('\n');
for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Strip out all [key: string]: any; and static [key: string]: any;
  content = content.replace(/\[key:\s*string\]:\s*any;\s*/g, '');
  content = content.replace(/static\s*\[key:\s*string\]:\s*any;\s*/g, '');

  // Add them back exactly once inside the class declaration
  content = content.replace(/export class ([a-zA-Z0-9_]+)\s*(?:implements [^{]+)?\{/, (match, className) => {
    return `${match}\n  [key: string]: any;\n  static [key: string]: any;`;
  });
  
  fs.writeFileSync(file, content);
}
console.log('Fixed duplicates');
