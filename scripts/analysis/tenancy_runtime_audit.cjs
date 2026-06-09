const fs = require('fs');
const path = require('path');

const TARGET_DIR = 'src/core/runtime/tenancy';
const AUDIT_FILE = 'docs/architecture/Tenancy_Runtime_Type_Audit.md';
const REPORT_FILE = 'docs/architecture/Tenancy_Runtime_Type_Hardening_Report.md';

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
    
    // Procura por vazamentos de any explícitos
    if (trimmed.includes(': any') || trimmed.includes('as any') || trimmed.includes('<any>') || trimmed.includes('@ts-ignore') || trimmed.includes('@ts-expect-error')) {
      let classification = 'REVIEW_REQUIRED';
      let justification = '';
      
      if (trimmed.includes('metadata?: any')) {
        classification = 'REVIEW_REQUIRED';
        justification = 'Metadado livre de auditoria. Exige Record<string, unknown> nos contratos.';
      } else {
        classification = 'REVIEW_REQUIRED';
        justification = 'Análise pendente.';
      }
      
      results[classification].push({
        file: file.replace(TARGET_DIR + '/', ''),
        line: i + 1,
        code: trimmed,
        justification
      });
    }
    
    // Procura por catch block não blindado explicitamente com unknown
    if (trimmed.includes('catch (err)') || trimmed.includes('catch (error)') || trimmed.includes('catch(err)') || trimmed.includes('catch(error)')) {
      // Ignora os que já têm : unknown ou : any. Vamos pegar apenas os untyped ou que precisam migrar.
      // Se tiver : unknown, a gente ignora da auditoria (já tá seguro).
      if (!trimmed.includes(': unknown')) {
        results['SAFE_NOW'].push({
          file: file.replace(TARGET_DIR + '/', ''),
          line: i + 1,
          code: trimmed,
          justification: 'Untyped catch block. Permitido migrar para catch(err: unknown) e usar guards fiduciários.'
        });
      }
    }
  }
}

// Generate Audit File
let auditMd = `# Runtime Domain Review Program v1.2 — Tenancy Runtime
## Relatório de Auditoria Local

Este relatório foca exclusivamente nas ocorrências dentro de \`src/core/runtime/tenancy/\`.

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
console.log("SAFE_NOW items:", results.SAFE_NOW.length);
