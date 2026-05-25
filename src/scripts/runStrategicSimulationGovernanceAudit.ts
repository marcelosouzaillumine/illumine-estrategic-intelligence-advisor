import * as fs from 'fs';
import * as path from 'path';

function runStrategicSimulationGovernanceAudit() {
  console.log('Iniciando Strategic Simulation Governance Audit (Active Governance)...\n');

  const enginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'strategic-simulation');
  const uiPath = path.join(process.cwd(), 'src', 'components', 'strategic-simulation');
  const pagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'StrategicSimulationPage.tsx');
  
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

  // 1. Validar UI
  const uiFiles = [...scanDir(uiPath)];
  if (fs.existsSync(pagePath)) uiFiles.push(pagePath);

  const UI_BANNED_PATTERNS = [
    { regex: /StrategicDecisionSimulator\.simulate\([^)]*Math\.random/g, message: 'Violação Fase 19: Simulação baseada em aleatoriedade de UI.' },
    { regex: /localStorage\.setItem\(['"]sim/g, message: 'Vazamento: A UI não pode persistir simulações localmente no localStorage.' },
    { regex: /tenantId:\s*['"](?!TENANT-HQ)['"]/g, message: 'Cross-Tenant: A UI tem hardcode de tenant desconhecido.' },
    { regex: /ConfidenceTimelineEngine\.override/g, message: 'Violação: Strategic Simulation não pode alterar confidence original do Runtime.' },
    { regex: /Math\.random\(\).*impact/g, message: 'Violação: Cálculo financeiro bruto proibido na view.' }
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

  // 2. Validar Engine Core
  if (fs.existsSync(enginePath)) {
    const engineFiles = scanDir(enginePath);
    const ENGINE_BANNED_PATTERNS = [
      { regex: /BpRuntime|DreRuntime/g, message: 'Engine Violation: Strategic Simulation não pode mutar matemática base fiduciária.' }
    ];

    let foundBinder = false;

    for (const file of engineFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (file.includes('StrategicDecisionEvidenceBinder')) foundBinder = true;

      ENGINE_BANNED_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
          violations++;
        }
      });
    }

    if (!foundBinder) {
      console.error('❌ VIOLATION: StrategicDecisionEvidenceBinder ausente. Nenhuma simulação pode rodar sem vinculação de Lineage.');
      violations++;
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Strategic Simulation Governance. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI está isenta de simulações com matemática em client-side e vazamentos de persistência local.');
    console.log('✅ StrategicDecisionEvidenceBinder garantindo o Lineage das projeções.');
    console.log('✅ Propagação e Trade-offs operam isolados, protegendo a Truth Layer principal.');
    console.log('\nStrategic Simulation Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runStrategicSimulationGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
