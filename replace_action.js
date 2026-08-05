import fs from 'fs';
import path from 'path';

const dir = './src/components/pages';

function traverse(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('action=')) {
        content = content.replace(/action="/g, 'executiveQuestion="');
        content = content.replace(/action=\{/g, 'executiveQuestion={');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

traverse(dir);
console.log('Done.');
