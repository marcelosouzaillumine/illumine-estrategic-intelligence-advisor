import fs from 'fs';
const p = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6b3e3212-9cf7-4fd0-b525-99adb7133935/task.md';
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/- \[\/\] Rodar validação com typecheck, lint e validate-constitution\.sh/, '- [x] Rodar validação com typecheck, lint e validate-constitution.sh');
fs.writeFileSync(p, content);
