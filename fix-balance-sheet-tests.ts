import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string, fileCallback: (filePath: string) => void) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walk(filePath, fileCallback);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        fileCallback(filePath);
      }
    }
  });
}

walk('src/tests/balance-sheet', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/decisionPanels/g, 'analysisPanels');
  content = content.replace(/planFinanceiro/g, 'observacaoFinanceira');
  content = content.replace(/planOperacional/g, 'observacaoOperacional');
  content = content.replace(/planGovernanca/g, 'observacaoGovernanca');
  content = content.replace(/\.acao/g, '.observacao');
  content = content.replace(/decisionTrace/g, 'patrimonialThesis');
  content = content.replace(/recommendedAction/g, 'strategicSeverity');
  content = content.replace(/institutionalScenario\?/g, 'institutionalScenario');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
