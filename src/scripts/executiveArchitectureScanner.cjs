const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Configuração das páginas piloto
const PILOT_PAGES = [
  { path: 'src/components/pages/BalanceSheetPage.tsx', profile: 'Executive Analytical Page' },
  { path: 'src/components/pages/DREPage.tsx', profile: 'Executive Analytical Page' },
  { path: 'src/components/pages/DFCPage.tsx', profile: 'Executive Analytical Page' },
  { path: 'src/components/pages/DLPAPage.tsx', profile: 'Executive Analytical Page' },
  { path: 'src/components/pages/DashboardPage.tsx', profile: 'Executive Governance Page' },
  { path: 'src/components/pages/governance/SovereignBoardPackPage.tsx', profile: 'Board Mode' },
  { path: 'src/components/pages/PayablesPage.tsx', profile: 'Operational Management Page' },
  { path: 'src/components/pages/ConsolidatedGroupAdminPage.tsx', profile: 'Administrative/Form Page' }
];

// Heurísticas de mapeamento: Nome do Componente -> Bloco Arquitetural
const COMPONENT_TO_BLOCK_MAP = [
  { regex: /PageHeader|Header/, block: 'Page Identity' },
  { regex: /Filter|StatusBadge|DataSource|ControlBar/, block: 'Context Controls and Actions' },
  { regex: /ActionToolbar|Toolbar/, block: 'Context Controls and Actions' }, // Agrupado para simplificar baseline
  { regex: /Synthesis|Summary|InstitutionalContext/, block: 'Executive Summary' },
  { regex: /ExposureCard|KPI|MetricGrid|EvolutionAnalysis/, block: 'KPIs' },
  { regex: /PreservationSection|LiquiditySection|StructureSection|WorkingCapitalSection|QualitySection|EfficiencySection|Narrative/, block: 'Narrative' },
  { regex: /Chart|Waterfall|Heatmap|TablesSection|Analytics/, block: 'Analytics' },
  { regex: /Tensions|Restrictions/, block: 'Restrictions' },
  { regex: /Plan|Recommendations/, block: 'Recommendations' },
  { regex: /Technical|Audit|Trace|Appendix/, block: 'Technical Layer' }
];

const ARCHETYPE_EXPECTED_ORDER = {
  'Executive Analytical Page': [
    'Page Identity', 'Context Controls and Actions', 'Executive Summary', 
    'KPIs', 'Narrative', 'Analytics', 'Restrictions', 'Recommendations', 'Technical Layer'
  ],
  'Executive Governance Page': [
    'Page Identity', 'Context Controls and Actions', 'Executive Summary', // Simplificação para o piloto
    'KPIs', 'Narrative', 'Recommendations', 'Technical Layer'
  ],
  'Board Mode': [
    'Page Identity', 'Context Controls and Actions', 'Executive Summary', 
    'KPIs', 'Narrative', 'Technical Layer'
  ],
  'Operational Management Page': [
    'Page Identity', 'Context Controls and Actions', 'KPIs', 'Analytics', 'Technical Layer'
  ],
  'Administrative/Form Page': [
    'Page Identity', 'Narrative', 'Context Controls and Actions', 'Technical Layer'
  ]
};

function identifyBlock(elementName) {
  for (const mapping of COMPONENT_TO_BLOCK_MAP) {
    if (mapping.regex.test(elementName)) {
      return mapping.block;
    }
  }
  return null;
}

function traverseJSX(node, foundBlocks, fileContent) {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    let tagName = '';
    
    if (ts.isJsxElement(node)) {
      tagName = node.openingElement.tagName.getText();
    } else {
      tagName = node.tagName.getText();
    }

    const block = identifyBlock(tagName);
    if (block) {
      // Evita duplicar blocos consecutivos do mesmo tipo para não poluir a ordem
      if (foundBlocks.length === 0 || foundBlocks[foundBlocks.length - 1].block !== block) {
        foundBlocks.push({
          component: tagName,
          block: block,
          line: fileContent.substr(0, node.getStart()).split('\n').length
        });
      }
    }
  }

  ts.forEachChild(node, child => traverseJSX(child, foundBlocks, fileContent));
}

function analyzePage(pagePath, profile) {
  const fullPath = path.resolve(process.cwd(), pagePath);
  if (!fs.existsSync(fullPath)) {
    return { path: pagePath, error: 'File not found', score: 0 };
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const sourceFile = ts.createSourceFile(
    fullPath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const foundBlocks = [];
  traverseJSX(sourceFile, foundBlocks, content);

  const expectedOrder = ARCHETYPE_EXPECTED_ORDER[profile] || ARCHETYPE_EXPECTED_ORDER['Executive Analytical Page'];
  
  let score = 100;
  let penaltyLog = [];
  
  // Extrair apenas os nomes dos blocos encontrados, mantendo a ordem única
  const extractedFlow = [];
  const uniqueBlocksPresent = new Set();
  for (const item of foundBlocks) {
    if (extractedFlow.length === 0 || extractedFlow[extractedFlow.length - 1] !== item.block) {
      extractedFlow.push(item.block);
    }
    uniqueBlocksPresent.add(item.block);
  }

  // Verifica ordem
  let lastExpectedIndex = -1;
  for (let i = 0; i < extractedFlow.length; i++) {
    const block = extractedFlow[i];
    const expectedIndex = expectedOrder.indexOf(block);
    
    if (expectedIndex !== -1) {
      if (expectedIndex < lastExpectedIndex) {
        score -= 20; // Penalidade pesada por inversão arquitetural
        penaltyLog.push(`Ordem Incorreta: '${block}' apareceu depois de blocos que deveriam sucedê-lo.`);
      }
      lastExpectedIndex = Math.max(lastExpectedIndex, expectedIndex);
    }
  }

  // Verifica obrigatoriedade (simplificada: exige pelo menos Identity e Summary/KPIs para analíticas)
  if (!uniqueBlocksPresent.has('Page Identity')) {
    score -= 30;
    penaltyLog.push('Ausente: Page Identity (Header/Title)');
  }

  if (profile === 'Executive Analytical Page') {
    if (!uniqueBlocksPresent.has('Executive Summary') && !uniqueBlocksPresent.has('KPIs')) {
      score -= 20;
      penaltyLog.push('Ausente: Nenhuma seção de Summary ou KPIs localizada.');
    }
    if (!uniqueBlocksPresent.has('Technical Layer')) {
      score -= 10;
      penaltyLog.push('Ausente: Technical Layer (Rastreabilidade/Auditoria)');
    }
  }

  // Previne score negativo
  score = Math.max(0, score);

  return {
    path: pagePath,
    profile,
    score,
    blocksFound: foundBlocks.map(b => b.block), // Lista bruta com repetições permitidas visualmente
    structuralFlow: extractedFlow, // Fluxo condensado
    penalties: penaltyLog
  };
}

function runScanner() {
  console.log('Iniciando Executive Architecture Scanner (AST Mode)...');
  
  const inventory = [];
  let totalScore = 0;
  let validPages = 0;

  for (const page of PILOT_PAGES) {
    console.log(`Analisando: ${page.path} (${page.profile})`);
    const result = analyzePage(page.path, page.profile);
    inventory.push(result);
    
    if (!result.error) {
      totalScore += result.score;
      validPages++;
    }
  }

  const avgScore = validPages > 0 ? (totalScore / validPages).toFixed(1) : 0;
  
  // Salvar Inventário JSON
  const inventoryPath = path.resolve(process.cwd(), 'docs/architecture/EAC_PAGE_INVENTORY.json');
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
  
  // Gerar Relatório MD
  let mdReport = `# EAC Initial Compliance Report\n\n`;
  mdReport += `**Data:** ${new Date().toISOString().split('T')[0]}\n`;
  mdReport += `**Média de Conformidade Cognitiva:** ${avgScore}%\n\n`;
  mdReport += `Este relatório foi gerado automaticamente pelo \`executiveArchitectureScanner.cjs\` inspecionando a AST das páginas piloto.\n\n`;
  mdReport += `## Avaliação por Página\n\n`;

  for (const item of inventory) {
    if (item.error) {
      mdReport += `### ❌ ${path.basename(item.path)}\n- Erro: ${item.error}\n\n`;
      continue;
    }
    
    mdReport += `### ${item.score >= 90 ? '✅' : item.score >= 70 ? '⚠️' : '❌'} ${path.basename(item.path)}\n`;
    mdReport += `- **Perfil:** ${item.profile}\n`;
    mdReport += `- **Score:** ${item.score}%\n`;
    
    mdReport += `- **Fluxo Cognitivo Encontrado:**\n`;
    for (const block of item.structuralFlow) {
      mdReport += `  - ↓ ${block}\n`;
    }

    if (item.penalties.length > 0) {
      mdReport += `- **Penalidades / Alertas:**\n`;
      for (const p of item.penalties) {
        mdReport += `  - ${p}\n`;
      }
    }
    mdReport += '\n';
  }

  const reportPath = path.resolve(process.cwd(), 'docs/architecture/EAC_INITIAL_COMPLIANCE_REPORT.md');
  fs.writeFileSync(reportPath, mdReport);
  
  console.log(`Scan finalizado. Score médio: ${avgScore}%`);
  console.log(`Inventário salvo em: ${inventoryPath}`);
  console.log(`Relatório salvo em: ${reportPath}`);
}

runScanner();
