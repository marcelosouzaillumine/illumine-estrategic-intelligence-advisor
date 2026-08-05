import fs from 'fs';
import path from 'path';

const dir = './src/components/pages/balance-sheet';

const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.tsx')) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput')) {
      content = content.replace('../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput', '../../../core/intelligence/contracts/ExecutiveIntelligenceOutput');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated import in ${fullPath}`);
    }
  }
}
