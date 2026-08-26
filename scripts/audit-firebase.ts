import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(filePath, fileList);
      }
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

function audit() {
  const allFiles = walk(path.join(process.cwd(), 'src'));
  const hits: Record<string, string[]> = {};

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let fileHits: string[] = [];

    const hasFirebaseImport = content.toLowerCase().includes('firebase') || content.toLowerCase().includes('firestore');
    if (!hasFirebaseImport) continue;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().includes('firebase') || line.toLowerCase().includes('firestore')) {
         fileHits.push(`L${i + 1}: ${line.trim()}`);
      }
    }

    if (fileHits.length > 0) {
      hits[file.replace(process.cwd() + '/', '')] = fileHits;
    }
  }

  console.log(JSON.stringify(hits, null, 2));
}

audit();
