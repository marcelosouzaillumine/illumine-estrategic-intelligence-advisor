import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, 'src', 'i18n');

function appendTranslations(newKeys) {
  const locales = ['pt-BR', 'en-US', 'es-ES'];

  locales.forEach(locale => {
    const filePath = path.join(localesDir, `${locale}.ts`);
    let content = fs.readFileSync(filePath, 'utf-8');

    const endMatch = content.match(/};\s*export default translations;/);
    if (!endMatch) {
      console.error(`Could not find the end of translations in ${locale}.ts`);
      return;
    }

    const insertionPoint = endMatch.index;
    const langData = newKeys[locale];
    if (!langData) return;

    let insertionString = '';
    for (const [key, value] of Object.entries(langData)) {
       const safeValue = value.replace(/'/g, "\\'");
       insertionString += `  '${key}': '${safeValue}',\n`;
    }

    const before = content.substring(0, insertionPoint);
    const lines = before.trimEnd().split('\n');
    const lastLine = lines[lines.length - 1];
    if (lastLine && !lastLine.endsWith(',') && !lastLine.endsWith('{')) {
       lines[lines.length - 1] = lastLine + ',';
    }
    
    const newBefore = lines.join('\n') + '\n';
    const newContent = newBefore + insertionString + content.substring(insertionPoint);

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${locale}.ts`);
  });
}

const data = fs.readFileSync(0, 'utf-8');
const parsed = JSON.parse(data);
appendTranslations(parsed);
