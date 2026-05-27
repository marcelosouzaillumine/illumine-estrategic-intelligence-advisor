import * as fs from 'fs';
import * as path from 'path';

function runCausalityAudit() {
  console.log('Iniciando Institutional Causality & Longitudinal Governance Layer Audit...\n');

  const componentsPath = path.join(process.cwd(), 'src', 'components');

  let violations = 0;
  const filesToCheck: string[] = [];

  const getFilesRecursive = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        getFilesRecursive(fullPath);
      } else {
        if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          filesToCheck.push(fullPath);
        }
      }
    });
  };

  getFilesRecursive(componentsPath);

  const BANNED_PATTERNS = [
    {
      regex: /InstitutionalCausalityOrchestrator/g,
      message: 'Componentes React não podem instanciar ou invocar o InstitutionalCausalityOrchestrator. Use o report final emitido pelo runtime.'
    },
    {
      regex: /CausalSequenceEngine|StructuralPropagationEngine|LongitudinalRiskEngine|CausalConfidenceEngine|GovernanceImpactChainEngine|ExecutiveCausalNarrativeComposer|InstitutionalGraphBuilder|CausalLineageIntegrityEngine/g,
      message: 'Módulos internos de causalidade não podem ser referenciados ou executados em componentes de visualização.'
    },
    {
      regex: /\bcausou\b/i,
      message: 'Uso de linguagem de causalidade absoluta proibida (causou). Utilize termos de associação.'
    },
    {
      regex: /\bprovou\b/i,
      message: 'Uso de linguagem de causalidade absoluta proibida (provou). Utilize termos de associação.'
    },
    {
      regex: /demonstrou\s+definitivamente/i,
      message: 'Uso de linguagem de causalidade absoluta proibida (demonstrou definitivamente).'
    },
    {
      regex: /inevitavelmente\s+levar[aá]/i,
      message: 'Uso de linguagem preditiva absoluta proibida (inevitavelmente levará).'
    },
    {
      regex: /evid[eê]ncia\s+falha/i,
      message: 'Uso de linguagem de julgamento subjetivo proibido (evidencia falha).'
    },
    {
      regex: /resultar[aá]\s+em/i,
      message: 'Uso de linguagem preditiva absoluta proibida (resultará em).'
    },
    {
      regex: /respons[aá]vel\s+pela\s+deterioraç[aã]o/i,
      message: 'Uso de linguagem de atribuição causal absoluta proibida (responsável pela deterioração).'
    },
    {
      regex: /determinou\s+o\s+colapso/i,
      message: 'Uso de linguagem de atribuição causal absoluta proibida (determinou o colapso).'
    },
    {
      regex: /explica\s+completamente/i,
      message: 'Uso de linguagem de causalidade absoluta proibida (explica completamente).'
    },
    {
      regex: /gest[aã]o\s+falhou/i,
      message: 'Uso de inferência subjetiva de gestão proibida (gestão falhou).'
    },
    {
      regex: /mal\s+administrada/i,
      message: 'Uso de inferência subjetiva de gestão proibida (mal administrada).'
    },
    {
      regex: /resist[eê]ncia\s+interna/i,
      message: 'Uso de inferência subjetiva organizacional proibida (resistência interna).'
    },
    {
      regex: /baixa\s+maturidade/i,
      message: 'Uso de inferência subjetiva de maturidade de gestão proibida (baixa maturidade).'
    },
    {
      regex: /incompet[eê]ncia/i,
      message: 'Uso de inferência subjetiva de capacidade proibida (incompetência).'
    }
  ];

  for (const file of filesToCheck) {
    const relativePath = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf8');

    BANNED_PATTERNS.forEach(pattern => {
      const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      const matches = cleanContent.match(pattern.regex);
      if (matches) {
        console.error(`❌ CAUSALITY VIOLATION in ${relativePath}:`);
        console.error(`  Reason: ${pattern.message}`);
        console.error(`  Matched pattern: "${matches[0].trim()}"\n`);
        violations++;
      }
    });
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Causalidade Institucional. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ Camada de causalidade longitudinal livre de ranqueamento manual e desvios de integridade.');
    console.log('\nInstitutional Causality & Longitudinal Governance Layer Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runCausalityAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
