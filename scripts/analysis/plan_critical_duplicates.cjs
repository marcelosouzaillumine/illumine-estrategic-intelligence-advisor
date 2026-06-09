const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../docs/architecture/architectural-redundancy-audit-full.json'), 'utf8'));

const criticalDups = data.duplicates.filter(d => d.risk === 'Crítico' || d.risk === 'Alto');

const priorityTargets = [
  'ExecutiveDecisionAdapter',
  'BoardResolutionEngine',
  'InstitutionalMemoryEngine',
  'PermissionResolver'
];

criticalDups.sort((a, b) => {
  const aPriority = priorityTargets.some(p => a.name.includes(p)) ? 1 : 0;
  const bPriority = priorityTargets.some(p => b.name.includes(p)) ? 1 : 0;
  return bPriority - aPriority;
});

let md = `# Architectural Redundancy Consolidation v1.0 (Critical Duplicates First)\n\n`;
md += `O objetivo desta sprint é resolver duplicidades críticas sem alterar regras de negócio, engines, cálculos ou contratos fiduciários. O processo é estritamente estrutural (movimentação, arquivamento e redirecionamento de imports).\n\n`;
md += `## Tabela de Consolidação Proposta\n\n`;
md += `| Abstração Duplicada | Oficial Proposto | Legado Proposto (a arquivar) | Motivo da Escolha | Imports Of. / Leg. | Risco |\n`;
md += `|---------------------|------------------|------------------------------|-------------------|-------------------|-------|\n`;

for (const dup of criticalDups) {
  let official = null;
  let legacy = [];
  
  // Custom heuristics for priority targets to avoid bad automated choices
  if (dup.name === 'ExecutiveDecisionAdapter') {
    official = dup.implementations.find(i => i.file.includes('core/workflows/'));
    if(!official) official = dup.implementations[0];
  } else if (dup.name === 'InstitutionalMemoryEngine') {
    official = dup.implementations.find(i => i.file.includes('core/runtime/institutional-memory/'));
    if(!official) official = dup.implementations[0];
  } else {
    // Rely on import counts or specific paths
    const sorted = [...dup.implementations].sort((a,b) => b.importCount - a.importCount);
    official = sorted[0];
    
    // Tie breaker: prefer not legacy-backup
    if (official.file.includes('legacy-backup')) {
      const alternative = sorted.find(i => !i.file.includes('legacy-backup'));
      if (alternative) official = alternative;
    }
  }
  
  for (const impl of dup.implementations) {
    if (impl.file !== official.file) {
      legacy.push(impl);
    }
  }
  
  const officialPath = official.file.replace('src/core/', '');
  const legacyPaths = legacy.map(l => l.file.replace('src/core/', '')).join('<br>');
  const legacyImports = legacy.map(l => l.importCount).join('/');
  
  md += `| **${dup.name}** | \`${officialPath}\` | \`${legacyPaths}\` | ${official.justification || 'Verificado via paths/imports'} | ${official.importCount} / ${legacyImports} | **${dup.risk}** |\n`;
}

md += `\n## User Review Required\n\n`;
md += `> [!IMPORTANT]\n`;
md += `> **Validação da Tabela de Consolidação**\n`;
md += `> A tabela acima contém a minha proposta de "Quem vive e quem é arquivado" para os itens Críticos e Altos, com especial atenção às prioridades máximas (\`ExecutiveDecisionAdapter\`, \`InstitutionalMemoryEngine\`, etc).\n`;
md += `> Por favor, revise a coluna **Oficial Proposto**. Se alguma abstração oficial foi inferida incorretamente pela heurística, indique qual caminho deve ser o correto.\n\n`;

md += `## Proposed Changes\n\n`;
md += `1. **Arquivamento Seguro**: Mover todos os arquivos marcados como "Legado Proposto" para a pasta \`src/archive/\` (ou \`archive/\` na raiz, de acordo com o padrão do repositório).\n`;
md += `2. **Redirecionamento**: Em toda a base de código (através de \`grep_search\` / \`multi_replace_file_content\`), substituir os caminhos de importação que apontavam para os arquivos legados para apontar para a versão "Oficial Proposto".\n`;
md += `3. **Auditoria Pós-Consolidação**: Rodar \`typecheck\` e testes para garantir que as assinaturas batem e nenhuma regressão ocorreu.\n\n`;

md += `## Verification Plan\n\n`;
md += `- Execução completa de \`npm run typecheck\`, \`npm run test\` e \`npm run build\`.\n`;
md += `- Garantir que nenhum arquivo de engine/cálculo teve seu conteúdo/lógica modificado (apenas imports alterados).\n`;

fs.writeFileSync(path.resolve(__dirname, '../../docs/architecture/implementation_plan.md'), md);
console.log('Done');
