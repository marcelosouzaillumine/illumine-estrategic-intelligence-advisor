import { readFileSync } from 'fs';

const fileContent = readFileSync('./src/core/navigation/navigation.registry.ts', 'utf-8');

const regex = /group:\s*'([^']+)',.*?category:\s*'([^']+)'/gs;
let match;
while ((match = regex.exec(fileContent)) !== null) {
  console.log(`Group: ${match[1]}, Category: ${match[2]}`);
}
