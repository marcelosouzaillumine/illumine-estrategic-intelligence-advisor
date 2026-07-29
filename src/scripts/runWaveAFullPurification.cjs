const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '../components/ui');
const execDir = path.join(__dirname, '../components/executive');

function processFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Check if we have heading tags
    if (/<h[1-6]/.test(content)) {
        // Add import if not present
        if (!content.includes("ExecutiveHeading")) {
            // Find last import
            const importRegex = /import.*from.*?;?\n/g;
            let lastImportIndex = 0;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                lastImportIndex = match.index + match[0].length;
            }
            // Add import after last import
            let importPath = filePath.includes('/ui/') ? './executive-heading' : '@/components/ui/executive-heading';
            if (lastImportIndex > 0) {
                content = content.slice(0, lastImportIndex) + `import { ExecutiveHeading } from '${importPath}';\n` + content.slice(lastImportIndex);
            } else {
                content = `import { ExecutiveHeading } from '${importPath}';\n` + content;
            }
        }
    }

    // Replace <hX className="...">content</hX>
    // This is a naive regex but works for simple one-liners
    content = content.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, level, props, inner) => {
        // Try to guess variant based on level or just let it fallback
        let variant = '';
        if (level === '1') variant = 'pageTitle';
        else if (level === '2') variant = 'sectionTitle';
        else if (level === '3') variant = 'moduleTitle';
        else if (level === '4') variant = 'submoduleTitle';
        else if (level === '5' || level === '6') variant = 'cardTitle';

        // Strip typography from className if present
        let newProps = props;
        const classNameMatch = props.match(/className=(?:"([^"]*)"|\{([^}]*)\})/);
        if (classNameMatch) {
            let classNameStr = classNameMatch[1] || classNameMatch[2];
            if (classNameStr && typeof classNameStr === 'string' && classNameStr.includes('cn(') === false) {
                // simple string class
                let cleanedClass = classNameStr.split(/\s+/).filter(cls => {
                    return !/^(text-|font-|leading-|tracking-|uppercase|lowercase|capitalize)/.test(cls) || cls.startsWith('text-white') || cls.startsWith('text-primary') || cls.startsWith('text-red');
                }).join(' ');
                newProps = props.replace(/className="[^"]*"/, `className="${cleanedClass}"`);
            }
        }

        return `<ExecutiveHeading as="h${level}" variant="${variant}"${newProps}>${inner}</ExecutiveHeading>`;
    });

    if (content !== original) {
        console.log(`Updated ${filePath}`);
        fs.writeFileSync(filePath, content);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

walkDir(uiDir);
walkDir(execDir);
console.log('Done.');
