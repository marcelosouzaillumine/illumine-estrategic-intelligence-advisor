const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const uiDir = path.join(__dirname, '../components/ui');
const execDir = path.join(__dirname, '../components/executive');

const targetFiles = [...getFiles(uiDir), ...getFiles(execDir)];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    let needsImport = false;

    // Pattern to catch typical card-like divs
    const surfaceRegex = /<div\s+([^>]*className=["'](?:[^"']*)?(?:bg-(?:slate|gray|zinc|neutral|primary|surface|white)[-\w]*(?:\/[0-9]+)?)(?:[^"']*)?(?:rounded-[a-z0-9\-\[\]]+)(?:[^"']*)?["'][^>]*)>([\s\S]*?)<\/\s*div>/g;

    content = content.replace(surfaceRegex, (match, props, inner) => {
        // Skip small icon wrappers or button-like elements
        if (props.includes('w-6') || props.includes('w-8') || props.includes('w-10') || props.includes('w-12') || props.includes('aspect-square') || props.includes('inline-flex') || props.includes('size-4')) {
            return match;
        }

        // Determine variants
        let variant = 'default';
        if (props.includes('bg-primary')) variant = 'primary';
        else if (props.includes('bg-surface-high') || props.includes('bg-surface-container-high')) variant = 'info';
        else if (props.includes('bg-red-') || props.includes('bg-critical')) variant = 'critical';

        // Strip basic bg and border classes
        let cleanedProps = props.replace(/bg-(slate|gray|zinc|neutral|primary|surface|white)[-\w]*(?:\/[0-9]+)?\s*/g, '');
        cleanedProps = cleanedProps.replace(/border-border\s*/g, '');
        cleanedProps = cleanedProps.replace(/border\s*/g, '');
        cleanedProps = cleanedProps.replace(/rounded-[a-z0-9\-\[\]]+\s*/g, '');
        cleanedProps = cleanedProps.replace(/shadow-[a-z]+\s*/g, '');
        cleanedProps = cleanedProps.replace(/shadow\s*/g, '');
        
        let padding = 'none';
        if (props.includes('p-6') || props.includes('p-8')) padding = 'lg';
        else if (props.includes('p-4') || props.includes('p-5')) padding = 'md';
        else if (props.includes('p-3')) padding = 'sm';

        let radius = 'sm';
        if (props.includes('rounded-xl') || props.includes('rounded-2xl')) radius = 'md';
        else if (props.includes('rounded-[24px]')) radius = 'lg';
        
        needsImport = true;
        return `<ExecutiveSurface variant="${variant}" padding="${padding}" radius="${radius}" ${cleanedProps}>${inner}</ExecutiveSurface>`;
    });

    if (needsImport) {
        if (!content.includes('ExecutiveSurface')) {
            let importPath = filePath.includes('/ui/') ? './executive-surface' : '@/components/ui/executive-surface';
            content = `import { ExecutiveSurface } from '${importPath}';\n` + content;
        }
    }

    if (content !== original) {
        console.log(`Updated Surface in ${filePath}`);
        fs.writeFileSync(filePath, content);
    }
}

for (const file of targetFiles) {
    processFile(file);
}
console.log('Domain 03 Surfaces Full script finished.');
