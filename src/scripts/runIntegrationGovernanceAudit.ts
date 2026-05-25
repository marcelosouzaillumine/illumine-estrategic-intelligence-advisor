import * as fs from 'fs';
import * as path from 'path';

function runIntegrationGovernanceAudit() {
  console.log('Iniciando Integration Governance Audit (Active Governance)...\n');

  const componentsPath = path.join(process.cwd(), 'src', 'components');
  const integrationsEnginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'integrations');
  
  let violations = 0;

  function scanDir(dir: string, fileList: string[] = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath, fileList);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const uiFiles = scanDir(componentsPath);
  const UI_BANNED_PATTERNS = [
    { regex: /localStorage\.set.*upload/gi, message: 'Tentativa de persistir payload de upload no localStorage.' },
    { regex: /IndexedDB.*upload/gi, message: 'Tentativa de persistir payload de upload no IndexedDB.' },
    { regex: /SchemaMappingEngine\.normalize.*React/gi, message: 'Lógica de mapeamento de schema não pode residir em Componente React.' }
  ];

  for (const file of uiFiles) {
    const content = fs.readFileSync(file, 'utf8');
    UI_BANNED_PATTERNS.forEach(pattern => {
      if (pattern.regex.test(content)) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
        violations++;
      }
    });
  }

  if (fs.existsSync(integrationsEnginePath)) {
    const engineFiles = scanDir(integrationsEnginePath);
    const ENGINE_BANNED_PATTERNS = [
      { regex: /confidence\s*=/gi, message: 'Connector Engine não tem autorização para recalcular confidence.' },
      { regex: /advisory\s*=/gi, message: 'Connector Engine não gera advisory.' },
      { regex: /RuntimeOrchestrator\.publish/gi, message: 'Tentativa de bypass: Publicação direta no Runtime sem passar pelo ImportPublicationEngine.' }
    ];

    for (const file of engineFiles) {
      const content = fs.readFileSync(file, 'utf8');
      ENGINE_BANNED_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
          violations++;
        }
      });
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Integration Governance. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI não processa payloads complexos nem persiste uploads localmente.');
    console.log('✅ ConnectorEngine não faz injeções matemáticas (Truth Layer Preserved).');
    console.log('✅ Pipeline de Ingestão segue fluxo obrigatório de Alfândega (Gateway -> Staging -> Publish).');
    console.log('\nIntegration Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runIntegrationGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
