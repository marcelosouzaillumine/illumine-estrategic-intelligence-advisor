const fs = require('fs');
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

for (const file of targetFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes('<ExecutiveText') && !content.includes('import { ExecutiveText }')) {
        let importPath = file.includes('/ui/') ? './executive-typography' : '@/components/ui/executive-typography';
        
        // Find last import
        const lines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIndex = i;
            }
        }
        
        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, `import { ExecutiveText } from '${importPath}';`);
            fs.writeFileSync(file, lines.join('\n'));
            console.log('Added import to ' + file);
        }
    }
}
