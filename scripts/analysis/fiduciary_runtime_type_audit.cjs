const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  'src/core/runtime',
  'src/core/governance',
  'src/core/financial'
];

const AUDIT_FILE = 'docs/architecture/Fiduciary_Runtime_Type_Audit.md';
const BOUNDARY_FILE = 'docs/architecture/Runtime_Boundary_Audit.md';

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

const allFiles = TARGET_DIRS.flatMap(d => walkSync(d));
const results = {
  CRITICAL: [],
  REVIEW_REQUIRED: [],
  SAFE: []
};
const boundaryInterfaces = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  // Boundary check (export interface | type)
  if (content.includes('export interface') || content.includes('export type')) {
    const hasAnyInExports = lines.some(l => (l.includes('export interface') || l.includes('export type') || l.includes('?: any') || l.includes(': any')) && !l.trim().startsWith('//'));
    boundaryInterfaces.push({
      file,
      hasAnyInExports
    });
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
       // Ignore comments unless it's a ts-ignore or ts-expect-error
       if (!trimmed.includes('@ts-ignore') && !trimmed.includes('@ts-expect-error')) {
         continue;
       }
    }
    
    let isMatch = false;
    let matchType = '';
    if (trimmed.includes(': any')) { isMatch = true; matchType = ': any'; }
    else if (trimmed.includes('as any')) { isMatch = true; matchType = 'as any'; }
    else if (trimmed.includes('<any>')) { isMatch = true; matchType = '<any>'; }
    else if (trimmed.includes('@ts-ignore')) { isMatch = true; matchType = '@ts-ignore'; }
    else if (trimmed.includes('@ts-expect-error')) { isMatch = true; matchType = '@ts-expect-error'; }
    
    if (isMatch) {
      const bn = path.basename(file).toLowerCase();
      let classification = 'REVIEW_REQUIRED';
      
      // Heuristic Classification
      if (trimmed.includes('catch (') && !file.includes('ConsolidatedGroupRepository') && !file.includes('IntercompanyRelationsLoader') && !file.includes('ExecutiveConstitutionalRuntime') && !file.includes('WorkerRegistry') && !file.includes('LazyExecutionCoordinator') && !file.includes('TenantGovernanceEnforcer')) {
        classification = 'SAFE'; // Error typing is usually safe to migrate to unknown
      } else if (matchType === '@ts-ignore' || matchType === '@ts-expect-error') {
        classification = 'CRITICAL';
      } else if (bn.includes('engine') || bn.includes('calculat') || bn.includes('formula') || bn.includes('math') || bn.includes('score')) {
        classification = 'CRITICAL';
      } else if (file.includes('/financial/')) {
        // Any financial module any is critical to review deeply
        classification = 'CRITICAL';
      } else if (trimmed.includes('=> any') || trimmed.includes('): any')) {
        classification = 'REVIEW_REQUIRED';
      }
      
      results[classification].push({
        file,
        line: i + 1,
        code: trimmed,
        type: matchType
      });
    }
  }
}

// Generate Markdown: Fiduciary_Runtime_Type_Audit.md
let auditMd = `# Fiduciary Runtime Type Safety Hardening v2.0
## Relatório de Auditoria de Tipagem (Fase 1)

Este relatório mapeia todas as ocorrências de \`any\`, \`@ts-ignore\` e \`@ts-expect-error\` nas três camadas mais vitais do repositório:
- \`src/core/runtime\`
- \`src/core/governance\`
- \`src/core/financial\`

NENHUMA correção foi aplicada. Este documento serve como plano base para segmentação.

### Resumo Executivo
- **CRITICAL:** ${results.CRITICAL.length} ocorrências
- **REVIEW_REQUIRED:** ${results.REVIEW_REQUIRED.length} ocorrências
- **SAFE:** ${results.SAFE.length} ocorrências

---

`;

for (const level of ['CRITICAL', 'REVIEW_REQUIRED', 'SAFE']) {
  auditMd += `## 🔴 Nível: ${level} (${results[level].length} itens)\n`;
  if (level === 'CRITICAL') auditMd += `> [!CAUTION]\n> Alteraçoes nestes itens possuem alto risco de regressão matemática, fiduciária ou de runtime.\n\n`;
  if (level === 'REVIEW_REQUIRED') auditMd += `> [!WARNING]\n> Requer revisão pontual de contratos de interface.\n\n`;
  if (level === 'SAFE') auditMd += `> [!TIP]\n> Seguros para migração imediata (ex: catch (err: any) -> catch (err: unknown)).\n\n`;
  
  if (results[level].length === 0) {
    auditMd += `_Nenhuma ocorrência encontrada._\n\n`;
    continue;
  }
  
  auditMd += `| Arquivo | Linha | Tipo | Código | \n`;
  auditMd += `|---|---|---|---| \n`;
  for (const item of results[level]) {
    auditMd += `| \`${path.basename(item.file)}\` | ${item.line} | \`${item.type}\` | \`${item.code.substring(0, 60)}${item.code.length > 60 ? '...' : ''}\` | \n`;
  }
  auditMd += `\n`;
}

fs.writeFileSync(AUDIT_FILE, auditMd);

// Generate Markdown: Runtime_Boundary_Audit.md
let boundaryMd = `# Runtime Boundary Audit (Interfaces de Contrato)

Este relatório foca exclusivamente nas declarações de \`interface\` e \`type\` nas camadas nucleares.
O objetivo é mapear se estamos recebendo cargas dinâmicas fracamente tipadas (\`any\`) de fora da fronteira.

### Arquivos de Contrato Encontrados: ${boundaryInterfaces.length}

| Arquivo de Fronteira | Possui \`any\` Exportado? |
|---|---|
`;

for (const b of boundaryInterfaces) {
  boundaryMd += `| \`${b.file}\` | ${b.hasAnyInExports ? '⚠️ SIM' : '✅ NÃO'} |\n`;
}

fs.writeFileSync(BOUNDARY_FILE, boundaryMd);

console.log("Audit complete. Reports generated.");
console.log(`CRITICAL: ${results.CRITICAL.length}, REVIEW: ${results.REVIEW_REQUIRED.length}, SAFE: ${results.SAFE.length}`);
