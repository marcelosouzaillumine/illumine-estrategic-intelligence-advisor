const fs = require('fs');
const path = require('path');

const targetFiles = [
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/semantic-card.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/metric-tile.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/executive-stat.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/executive-exposure-card.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/executive/InstitutionalMemoryDashboard.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/ui/executive-technical-score.tsx',
    '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/executive/board/ExecutionTrackingDashboard.tsx'
];

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    let needsImport = false;

    // 1. Replace <div>, <span>, <p>, or <ExecutiveText> containing large text classes with <ExecutiveMetric>
    // e.g. <div className="font-medium tabular-nums text-4xl tracking-tighter mt-2">{value}</div>
    // e.g. <ExecutiveHeading as="h5" className="text-2xl text-muted-foreground">0</ExecutiveHeading>
    // e.g. <ExecutiveText as="span" variant="bodyStandard" className="text-primary tabular-nums text-4xl">{value}</ExecutiveText>
    
    content = content.replace(/<(div|span|p|ExecutiveText|ExecutiveHeading|ExecutiveMetric)([^>]*)>([\s\S]*?)<\/\1>/g, (match, tag, props, inner) => {
        // Target if it has metric-like classes
        if (!/className=(?:"[^"]*(text-(2xl|3xl|4xl|5xl|6xl|\[24px\]|\[30px\]|\[32px\])|tabular-nums|tracking-tighter)[^"]*"|\{[^}]*(text-(2xl|3xl|4xl|5xl|6xl|\[24px\]|\[30px\]|\[32px\])|tabular-nums|tracking-tighter)[^}]*\})/.test(props)) {
            // Check if it's already an ExecutiveMetric but with hardcoded font size
            if (tag === 'ExecutiveMetric' && /className="[^"]*(text-\[[0-9]+px\]|font-(bold|black))/.test(props)) {
                // fall through
            } else {
                return match;
            }
        }

        needsImport = true;
        
        let variant = 'metricValue'; // default
        
        if (props.includes('4xl') || props.includes('5xl') || props.includes('6xl') || props.includes('text-[38px]') || props.includes('text-[44px]')) {
            variant = 'heroMetric';
        } else if (props.includes('3xl') || props.includes('text-[28px]') || props.includes('text-[32px]')) {
            variant = 'metricValue';
        } else if (props.includes('2xl') || props.includes('text-[24px]') || props.includes('text-[20px]')) {
            variant = 'metricCompact';
        } else if (props.includes('text-[16px]')) {
            variant = 'metricUnit';
        }
        
        // Strip out variant from props if it was ExecutiveText or ExecutiveHeading
        let newProps = props.replace(/variant="[^"]*"\s*/, '');
        // Strip out 'as=' if it was a component, we will assign it explicitly
        let asProp = 'div';
        if (props.includes('as="span"') || tag === 'span') asProp = 'span';
        else if (props.includes('as="p"') || tag === 'p') asProp = 'p';
        else if (props.includes('as="h5"')) asProp = 'div'; // h5 for metrics doesn't make semantic sense usually, fallback to div

        newProps = newProps.replace(/as="[^"]*"\s*/, '');

        // Clean typography classes
        const classNameMatch = newProps.match(/className=(?:"([^"]*)"|\{([^}]*)\})/);
        if (classNameMatch) {
            let classNameStr = classNameMatch[1] || classNameMatch[2];
            if (classNameStr && typeof classNameStr === 'string' && classNameStr.includes('cn(') === false) {
                let cleanedClass = classNameStr.split(/\s+/).filter(cls => {
                    return !/^(text-(sm|xs|base|lg|xl|2xl|3xl|4xl|5xl|6xl|muted|secondary|gray|slate|\[)|font-|leading-|tracking-|uppercase|lowercase|capitalize|tabular-nums)/.test(cls);
                }).join(' ');
                newProps = newProps.replace(/className="[^"]*"/, `className="${cleanedClass}"`);
            }
        }

        newProps = newProps.replace(/className="\s*"/, '');

        return `<ExecutiveMetric as="${asProp}" variant="${variant}"${newProps}>${inner}</ExecutiveMetric>`;
    });

    if (needsImport) {
        if (!content.includes('import { ExecutiveMetric }') && !content.includes('import {ExecutiveMetric}') && !content.includes('ExecutiveMetric,')) {
            // Need to insert ExecutiveMetric into the import from executive-typography
            if (content.includes('executive-typography')) {
                content = content.replace(/import\s+\{\s*([^}]*)\s*\}\s+from\s+['"]([^'"]*executive-typography)['"]/, (match, imports, path) => {
                    if (!imports.includes('ExecutiveMetric')) {
                        return `import { ${imports}, ExecutiveMetric } from '${path}'`;
                    }
                    return match;
                });
            } else {
                let importPath = filePath.includes('/ui/') ? './executive-typography' : '@/components/ui/executive-typography';
                content = `import { ExecutiveMetric } from '${importPath}';\n` + content;
            }
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
