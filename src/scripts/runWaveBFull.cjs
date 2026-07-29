const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const uiFiles = getAllFiles(path.join(__dirname, '../components/ui'));
const execFiles = getAllFiles(path.join(__dirname, '../components/executive'));
const targetFiles = [...uiFiles, ...execFiles];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    let needsImport = false;
    
    // Replace <p> and <span> with ExecutiveText, cautiously avoiding <span ...>{...}</span> issues if nested heavily
    content = content.replace(/<(p|span)([^>]*)>([\s\S]*?)<\/\1>/g, (match, tag, props, inner) => {
        // Only target if it has text-* or font-* or uppercase
        if (!/className=(?:"[^"]*(text-|font-|uppercase)[^"]*"|\{[^}]*(text-|font-|uppercase)[^}]*\})/.test(props)) {
            return match; // Skip if no typography classes
        }

        // Avoid touching instances that contain nested JSX inside them that might be broken by the regex, just basic text/spans
        // We will just do a direct replacement for this outer tag
        needsImport = true;
        let variant = 'bodyStandard';
        
        if (props.includes('uppercase') || props.includes('tracking-widest') || props.includes('text-[10px]') || props.includes('text-[11px]')) {
            variant = 'microLabel';
        } else if (props.includes('text-xs') || props.includes('text-muted')) {
            variant = 'caption';
        } else if (props.includes('text-base') || props.includes('text-lg') || props.includes('text-[15px]') || props.includes('text-[16px]')) {
            variant = 'bodyLarge';
        }

        // Strip typography from className if present
        let newProps = props;
        const classNameMatch = props.match(/className=(?:"([^"]*)"|\{([^}]*)\})/);
        if (classNameMatch) {
            let classNameStr = classNameMatch[1] || classNameMatch[2];
            if (classNameStr && typeof classNameStr === 'string' && classNameStr.includes('cn(') === false) {
                // simple string class
                let cleanedClass = classNameStr.split(/\s+/).filter(cls => {
                    return !/^(text-(sm|xs|base|lg|xl|muted|secondary|gray|slate|\[)|font-|leading-|tracking-|uppercase|lowercase|capitalize)/.test(cls);
                }).join(' ');
                newProps = props.replace(/className="[^"]*"/, `className="${cleanedClass}"`);
            }
        }

        newProps = newProps.replace(/className="\s*"/, '');

        return `<ExecutiveText as="${tag}" variant="${variant}"${newProps}>${inner}</ExecutiveText>`;
    });

    if (content !== original) {
        // Add import
        if (!content.includes('import { ExecutiveText }') && !content.includes('import {ExecutiveText}') && !content.includes('import { ExecutiveHeading, ExecutiveText }')) {
            let importPath = filePath.includes('/ui/') ? './executive-typography' : '@/components/ui/executive-typography';
            const lines = content.split('\n');
            let lastImportIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    lastImportIndex = i;
                }
            }
            if (lastImportIndex !== -1) {
                lines.splice(lastImportIndex + 1, 0, `import { ExecutiveText } from '${importPath}';`);
                content = lines.join('\n');
            } else {
                content = `import { ExecutiveText } from '${importPath}';\n` + content;
            }
        }
        
        console.log(`Updated ${filePath}`);
        fs.writeFileSync(filePath, content);
    }
}

for (const file of targetFiles) {
    processFile(file);
}
console.log('Wave B Full Complete.');
