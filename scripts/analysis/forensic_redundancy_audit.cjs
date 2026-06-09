const fs = require('fs');
const path = require('path');

const auditInputPath = path.resolve(__dirname, '../../docs/architecture/redundancy-audit.json');
const srcDir = path.resolve(__dirname, '../../src');

const auditData = JSON.parse(fs.readFileSync(auditInputPath, 'utf8'));

// Caching all files content for fast import checking
const allSrcFiles = [];
function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) {
      allSrcFiles.push({
        path: dirPath,
        content: fs.readFileSync(dirPath, 'utf-8')
      });
    }
  });
}
walkDir(srcDir);

function countImports(baseName) {
  let count = 0;
  for (const file of allSrcFiles) {
    // Avoid counting imports in index files or tests for true usage, but let's count everywhere for simplicity
    if (file.content.includes(baseName)) count++;
  }
  return count;
}

function classifyType(content, filePath) {
  const name = path.basename(filePath);
  if (name.includes('Adapter')) return 'Adapter';
  if (name.includes('Engine')) return 'Engine';
  if (name.includes('Service')) return 'Service';
  if (name.includes('use') && filePath.endsWith('.ts')) return 'Hook';
  if (name.includes('Page') || name.includes('Screen')) return 'Page';
  if (content.includes('export const') && content.includes('=>') && filePath.endsWith('.tsx')) return 'Component';
  if (content.includes('export class')) return 'Class';
  if (content.includes('export type') || content.includes('export interface')) return 'Type';
  if (filePath.includes('__tests__') || name.includes('.test.') || name.includes('.spec.')) return 'Test';
  return 'Utility/Model';
}

function classifyStatusAndConfidence(content, filePath, importCount, isDuplicate) {
  const lcPath = filePath.toLowerCase();
  const lcContent = content.toLowerCase();
  
  if (lcPath.includes('legacy') || lcPath.includes('backup') || lcContent.includes('@deprecated')) {
    return { status: 'Legado provável', confidence: 'Alto', reason: 'Caminho contém legacy/backup ou código possui @deprecated.' };
  }
  if (lcPath.includes('experimental') || lcPath.includes('draft') || lcContent.includes('@experimental')) {
    return { status: 'Experimental provável', confidence: 'Alto', reason: 'Marcadores de draft ou experimental.' };
  }
  if (isDuplicate) {
    if (importCount > 5) return { status: 'Oficial provável', confidence: 'Médio', reason: 'Possui número considerável de dependentes na base de código.' };
    if (importCount === 0) return { status: 'Substituído provável', confidence: 'Médio', reason: 'Zero imports na base enquanto existe outra versão ativa.' };
    return { status: 'Indeterminado', confidence: 'Baixo', reason: 'Possui alguns imports, mas colide com outro de mesmo nome.' };
  } else {
    // Orfanato
    if (importCount === 0) return { status: 'Órfão provável', confidence: 'Alto', reason: 'Zero imports detectados. Totalmente isolado.' };
    return { status: 'Uso futuro provável', confidence: 'Baixo', reason: 'Sem imports, mas contexto não indica lixo imediato.' };
  }
}

const detailedReport = {
  metadata: {
    timestamp: new Date().toISOString(),
    totalOrphansAnalyzed: auditData.orphans.length,
    totalDuplicatesAnalyzed: auditData.duplicates.length
  },
  orphans: [],
  duplicates: []
};

let mdReport = `# Architectural Redundancy Audit v1.0\n\n`;
mdReport += `> **AVISO IMPORTANTE:** Este relatório foi gerado por meio de inteligência estática e heurística forense. Nenhuma classificação apresentada aqui constitui uma decisão arquitetural final. Todos os itens rotulados como *Substituído* ou *Legado* refletem inferências técnicas baseadas em árvores de dependência, assinaturas de arquivo e comentários. Nenhuma remoção automática está autorizada.\n\n`;

mdReport += `## Resumo Executivo\n`;
mdReport += `- **Órfãos Encontrados:** ${auditData.orphans.length}\n`;
mdReport += `- **Grupos de Duplicidade:** ${auditData.duplicates.length}\n\n`;

mdReport += `## Análise de Órfãos\n\n`;

auditData.orphans.forEach(orphanPath => {
  const absolutePath = path.resolve(__dirname, '../../', orphanPath);
  let content = '';
  try { content = fs.readFileSync(absolutePath, 'utf8'); } catch(e){}
  
  const type = classifyType(content, orphanPath);
  const imports = countImports(path.basename(orphanPath, path.extname(orphanPath)));
  const { status, confidence, reason } = classifyStatusAndConfidence(content, orphanPath, imports, false);
  
  let risk = 'Baixo';
  if (type === 'Engine' || type === 'Adapter') risk = 'Médio';
  if (orphanPath.includes('security') || orphanPath.includes('auth')) risk = 'Crítico';

  const reportItem = {
    file: orphanPath,
    type,
    category: orphanPath.split('/')[1] || 'Geral',
    inferredStatus: status,
    confidence,
    justification: reason,
    evidence: `Found ${imports} generic internal references.`,
    importCount: imports,
    risk,
    recommendation: 'Revisão humana necessária',
    suggestedAction: status === 'Órfão provável' ? 'Mover para /archive na próxima sprint' : 'Manter em observação'
  };
  
  detailedReport.orphans.push(reportItem);

  if (risk === 'Crítico' || risk === 'Médio') {
    mdReport += `### 📄 ${orphanPath}\n`;
    mdReport += `- **Tipo:** ${type}\n`;
    mdReport += `- **Status Inferido:** ${status} (Confiança: ${confidence})\n`;
    mdReport += `- **Risco:** ${risk}\n`;
    mdReport += `- **Justificativa:** ${reason}\n\n`;
  }
});

mdReport += `## Análise de Duplicidades (Colisão de Responsabilidade)\n\n`;

auditData.duplicates.forEach(dupGroup => {
  const groupReport = {
    name: dupGroup.name,
    implementations: [],
    officialImplementation: null,
    risk: 'Baixo'
  };

  let maxImports = -1;
  let officialCandidate = null;

  dupGroup.paths.forEach(dupPath => {
    const absolutePath = path.resolve(__dirname, '../../', dupPath);
    let content = '';
    try { content = fs.readFileSync(absolutePath, 'utf8'); } catch(e){}
    
    const type = classifyType(content, dupPath);
    const imports = countImports(path.basename(dupPath, path.extname(dupPath)));
    const { status, confidence, reason } = classifyStatusAndConfidence(content, dupPath, imports, true);
    
    const item = {
      file: dupPath,
      type,
      inferredStatus: status,
      confidence,
      importCount: imports,
      justification: reason
    };

    groupReport.implementations.push(item);

    if (imports > maxImports) {
      maxImports = imports;
      officialCandidate = item;
    }
  });

  groupReport.implementations.forEach(impl => {
    if (impl === officialCandidate && impl.importCount > 0) {
      impl.inferredStatus = 'Oficial provável';
      groupReport.officialImplementation = impl.file;
    } else if (impl.inferredStatus === 'Indeterminado' && impl.importCount === 0) {
      impl.inferredStatus = 'Abandonada / Substituída';
    }
  });

  if (dupGroup.name.includes('Engine') || dupGroup.name.includes('Adapter')) groupReport.risk = 'Alto';
  if (dupGroup.name.includes('Security') || dupGroup.name.includes('Audit')) groupReport.risk = 'Crítico';

  detailedReport.duplicates.push(groupReport);

  if (groupReport.risk === 'Crítico' || groupReport.risk === 'Alto') {
    mdReport += `### 🔄 Colisão: \`${dupGroup.name}\` (Risco: ${groupReport.risk})\n`;
    mdReport += `- **Oficial Provável:** \`${groupReport.officialImplementation || 'Nenhuma com imports majoritários'}\`\n`;
    groupReport.implementations.forEach(impl => {
      mdReport += `  - \`${impl.file}\` -> ${impl.inferredStatus} (${impl.importCount} imports)\n`;
    });
    mdReport += `\n`;
  }
});

mdReport += `## Recomendações e Roadmap de Consolidação\n\n`;
mdReport += `1. **Risco Crítico (Duplicidades em Engines Fiduciárias):** Analisar com o time as engines mapeadas como "Alto/Crítico" na seção anterior. O sistema pode estar executando fluxos bifurcados dependendo do domínio da importação.\n`;
mdReport += `2. **Consolidação de Legado:** As versões marcadas como "Legado provável" devido a \`legacy-backup\` ou marcações \`@deprecated\` deverão ser arquivadas fisicamente após validação técnica de impacto.\n`;
mdReport += `3. **Orfanato:** Os componentes visuais marcados como "Órfão provável" (Risco Baixo) são candidatos de primeira linha para remoção física no ciclo *Clean-up* sem efeitos colaterais sistêmicos.\n`;

// Write outputs
fs.writeFileSync(path.resolve(__dirname, '../../docs/architecture/architectural-redundancy-audit-full.json'), JSON.stringify(detailedReport, null, 2));
fs.writeFileSync(path.resolve(__dirname, '../../docs/architecture/Architectural_Redundancy_Audit.md'), mdReport);

console.log('Auditoria forense concluída. Relatórios gerados em docs/architecture/');
