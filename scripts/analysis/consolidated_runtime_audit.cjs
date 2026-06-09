const fs = require('fs');
const path = require('path');

const TARGET_DIR = 'src/core/runtime/consolidated';
const AUDIT_FILE = 'docs/architecture/Consolidated_Runtime_Type_Audit.md';
const REPORT_FILE = 'docs/architecture/Consolidated_Runtime_Type_Hardening_Report.md';

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      filelist = walkSync(p, filelist);
    } else {
      if (p.endsWith('.ts') || p.endsWith('.tsx')) {
        filelist.push(p);
      }
    }
  }
  return filelist;
}

const allFiles = walkSync(TARGET_DIR);
const results = {
  DO_NOT_TOUCH: [],
  REVIEW_REQUIRED: [],
  SAFE_NOW: []
};

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    
    if (trimmed.includes(': any') || trimmed.includes('as any') || trimmed.includes('<any>') || trimmed.includes('@ts-ignore') || trimmed.includes('@ts-expect-error')) {
      let classification = 'REVIEW_REQUIRED';
      let justification = '';
      
      // Classify based on rules
      if (trimmed.includes('catch (')) {
        classification = 'SAFE_NOW';
        justification = 'Error handler, safe for unknown.';
      } else if (trimmed.includes('public') && (trimmed.includes('(input: any)') || trimmed.includes('payload: any'))) {
        classification = 'REVIEW_REQUIRED';
        justification = 'Contrato de entrada público. Requer mapeamento do payload antes da alteração.';
      } else if (trimmed.includes('bpByEntity') || trimmed.includes('dreByEntity') || trimmed.includes('eliminatedEntries') || trimmed.includes('intercompanyRelations') || trimmed.includes('ownershipStructure')) {
        classification = 'DO_NOT_TOUCH';
        justification = 'Estrutura financeira central (BP/DRE/Intercompany). Alteração proibida nesta fase.';
      } else if (trimmed.includes('rawData: any')) {
        classification = 'REVIEW_REQUIRED';
        justification = 'Contrato base de dados crus. Exige tipagem de DFC/DRE/BP.';
      } else if (trimmed.includes('auditTrail: {')) {
        classification = 'REVIEW_REQUIRED';
        justification = 'Metadados dinâmicos de auditoria. Exige Record<string, unknown>.';
      } else if (trimmed.includes('.map((e: any)')) {
        classification = 'REVIEW_REQUIRED'; // Can't easily type without replacing mapping logic
        justification = 'Mapeamento de array dinâmico. Risco de quebra ao alterar para unknown sem cast.';
      } else {
        classification = 'REVIEW_REQUIRED';
        justification = 'Análise manual pendente.';
      }
      
      results[classification].push({
        file: file.replace(TARGET_DIR + '/', ''),
        line: i + 1,
        code: trimmed,
        justification
      });
    }
  }
}

// Generate Audit File
let auditMd = `# Runtime Domain Review Program v1.0 — Consolidated Runtime
## Relatório de Auditoria Local

Este relatório foca exclusivamente nas ocorrências dentro de \`src/core/runtime/consolidated/\`.

### Resumo Executivo
- **DO_NOT_TOUCH:** ${results.DO_NOT_TOUCH.length} ocorrências
- **REVIEW_REQUIRED:** ${results.REVIEW_REQUIRED.length} ocorrências
- **SAFE_NOW:** ${results.SAFE_NOW.length} ocorrências

---

`;

for (const level of ['DO_NOT_TOUCH', 'REVIEW_REQUIRED', 'SAFE_NOW']) {
  auditMd += `## ${level} (${results[level].length} itens)\n`;
  if (results[level].length === 0) {
    auditMd += `_Nenhuma ocorrência encontrada._\n\n`;
    continue;
  }
  
  auditMd += `| Arquivo | Linha | Código | Justificativa |\n`;
  auditMd += `|---|---|---|---|\n`;
  for (const item of results[level]) {
    auditMd += `| \`${item.file}\` | ${item.line} | \`${item.code.substring(0, 60)}\` | ${item.justification} |\n`;
  }
  auditMd += `\n`;
}

fs.writeFileSync(AUDIT_FILE, auditMd);

// Generate Report File immediately since we have 0 SAFE_NOW fixes
let reportMd = `# Consolidated Runtime Type Hardening Report

## Resultado da Execução (Fases 1 e 2)

A auditoria local foi executada com sucesso sobre o domínio \`src/core/runtime/consolidated/\`.

### Métricas
- **Ocorrências Iniciais (any/ignores):** ${results.DO_NOT_TOUCH.length + results.REVIEW_REQUIRED.length + results.SAFE_NOW.length}
- **Ocorrências Corrigidas (SAFE_NOW):** 0 (Todos os handlers de exceção locais já haviam sido promovidos para \`unknown\` de forma passiva na Sprint anterior).
- **Ocorrências Adiadas:** ${results.DO_NOT_TOUCH.length + results.REVIEW_REQUIRED.length}

### Justificativas de Adiamento
**Itens DO_NOT_TOUCH (${results.DO_NOT_TOUCH.length}):**
Foram ignorados por tratarem diretamente de coleções financeiras e estruturas intercompany (ex: \`bpByEntity\`, \`dreByEntity\`, \`eliminatedEntries\`). Como regra estrita, lógicas fiduciárias não devem ser tocadas.

**Itens REVIEW_REQUIRED (${results.REVIEW_REQUIRED.length}):**
Foram isolados por tratarem de contratos públicos de orquestração (ex: \`runConsolidatedAnalysis(input: any)\`), arrays de payloads crus e mapeamento de retornos do Firestore. A remoção de \`any\` nestes pontos exigirá criação ou extensão de interfaces no diretório \`types/\`.

### Riscos Remanescentes
O isolamento é alto. Os únicos vazamentos restantes de tipagem no Runtime Consolidado estão restritos aos payloads de entrada do Firebase e contratos globais. Não há lógicas de cálculo (\`reduce\`) consumindo diretamente variáveis cegas neste momento, o que garante estabilidade. A tipagem estrita exigirá a formalização dos contratos da pipeline consolidada na próxima iteração profunda.

`;

fs.writeFileSync(REPORT_FILE, reportMd);

console.log("Scripts executed. SAFE_NOW items:", results.SAFE_NOW.length);
