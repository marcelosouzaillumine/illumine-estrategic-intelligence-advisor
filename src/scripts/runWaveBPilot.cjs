const fs = require('fs');
const path = require('path');

const targetFiles = [
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/executive-strategic-semantic-cards.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/executive-score.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/metric-tile.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/executive-decision-memo.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/executive-action-card.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/executive/demo/ExecutiveDemoShell.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/executive/demo/ExecutiveDisclosurePanel.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/executive/copilot/BoardCopilotPanel.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/executive/board/ExecutionTrackingDashboard.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/executive/ExecutiveHomeWorkspace.tsx'
];

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    let needsImport = false;
    
    // Replace <p> and <span> with ExecutiveText
    content = content.replace(/<(p|span)([^>]*)>([\s\S]*?)<\/\1>/g, (match, tag, props, inner) => {
        // Only target if it has text-* or font-* or uppercase
        if (!/className=(?:"[^"]*(text-|font-|uppercase)[^"]*"|\{[^}]*(text-|font-|uppercase)[^}]*\})/.test(props)) {
            return match; // Skip if no typography classes
        }

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

        // if there's no props left after cleaning (className=" "), we can remove it entirely
        newProps = newProps.replace(/className="\s*"/, '');

        return `<ExecutiveText as="${tag}" variant="${variant}"${newProps}>${inner}</ExecutiveText>`;
    });

    if (needsImport && !content.includes("ExecutiveText")) {
        // Add import after last import
        const importRegex = /import.*from.*?;?\n/g;
        let lastImportIndex = 0;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            lastImportIndex = match.index + match[0].length;
        }
        let importPath = filePath.includes('/ui/') ? './executive-typography' : '@/components/ui/executive-typography';
        if (lastImportIndex > 0) {
            content = content.slice(0, lastImportIndex) + `import { ExecutiveText } from '${importPath}';\n` + content.slice(lastImportIndex);
        } else {
            content = `import { ExecutiveText } from '${importPath}';\n` + content;
        }
    }

    if (content !== original) {
        console.log(`Updated ${filePath}`);
        fs.writeFileSync(filePath, content);
    }
}

for (const file of targetFiles) {
    processFile(file);
}
console.log('Done.');
