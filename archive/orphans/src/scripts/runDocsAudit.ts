import fs from 'fs';
import path from 'path';

// This script only reports findings, it does not modify files.

interface Finding {
  file: string;
  risk: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  action: string;
}

const findings: Finding[] = [];

const REQUIRED_DOCS = [
  'docs/MASTER_FINANCIAL_GOVERNANCE_ENGINE.md',
  'docs/TEMPORAL_CAUSALITY_GOLDEN_DATASETS.md',
  'docs/CONSOLIDATED_RUNTIME_GOLDEN_DATASETS.md',
  'docs/SYSTEMIC_HEATMAP_UI_PLAN.md'
];

function scanDocs() {
  const docsDir = path.join(process.cwd(), 'docs');
  
  if (!fs.existsSync(docsDir)) {
    findings.push({
      file: 'docs/',
      risk: 'Diretório docs/ não encontrado.',
      severity: 'CRITICAL',
      recommendation: 'Restaurar o diretório docs.',
      action: 'Criar diretório.'
    });
    return;
  }

  const existingDocs = fs.readdirSync(docsDir).map(f => `docs/${f}`);
  
  for (const requiredDoc of REQUIRED_DOCS) {
    if (!existingDocs.includes(requiredDoc)) {
      findings.push({
        file: requiredDoc,
        risk: `Documentação oficial ausente: ${requiredDoc}`,
        severity: 'MEDIUM',
        recommendation: 'Criar ou restaurar a documentação.',
        action: 'Recriar arquivo de doc.'
      });
    } else {
      const content = fs.readFileSync(path.join(process.cwd(), requiredDoc), 'utf-8');
      if (content.trim().length < 50) {
        findings.push({
          file: requiredDoc,
          risk: `Documentação aparentemente vazia ou insuficiente.`,
          severity: 'MEDIUM',
          recommendation: 'Popular a documentação com o design arquitetural.',
          action: 'Expandir documento.'
        });
      }
    }
  }

  // Detect dead or unused docs
  const knownPrefixes = ['MASTER', 'TEMPORAL', 'CONSOLIDATED', 'SYSTEMIC', 'ENGINE', 'EXECUTIVE', 'STRATEGIC'];
  for (const file of existingDocs) {
    if (file.endsWith('.md')) {
      const basename = path.basename(file);
      const isKnown = knownPrefixes.some(prefix => basename.startsWith(prefix)) || REQUIRED_DOCS.includes(file);
      if (!isKnown) {
        findings.push({
          file: file,
          risk: 'Documentação possivelmente não governada ou morta.',
          severity: 'LOW',
          recommendation: 'Verificar se o arquivo ainda é relevante ou se deve ser arquivado/excluído.',
          action: 'Revisar ou deletar.'
        });
      }
    }
  }
}

console.log('Iniciando Docs Audit...');
scanDocs();

fs.writeFileSync(
  path.join(process.cwd(), 'docs_audit_report.json'),
  JSON.stringify(findings, null, 2)
);

console.log(`Docs Audit concluída. Encontrados ${findings.length} problemas.`);
if (findings.length > 0) {
  console.log('Verifique docs_audit_report.json para mais detalhes.');
  process.exit(0);
}
