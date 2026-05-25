import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// 1. Validar existência da rota /lab.
test('Deve existir mapeamento para a rota do Executive Scenario Lab', () => {
  const routesContent = fs.readFileSync(path.join(process.cwd(), 'src/app/routes.tsx'), 'utf8');
  assert.ok(routesContent.includes('currentPage === \'lab\'') || routesContent.includes('currentPage === \'executive_scenario_lab\''));
});

// 2. Validar presença do link no menu lateral (via navigation).
test('Deve existir entrada no Navigation Groups', () => {
  const navContent = fs.readFileSync(path.join(process.cwd(), 'src/app/navigation.ts'), 'utf8');
  assert.ok(navContent.includes('id: \'lab\''));
  assert.ok(navContent.includes('Executive Scenario Lab'));
});

test('UI não importa simulador local (Phase 5 Isolation)', () => {
  const pageContent = fs.readFileSync(path.join(process.cwd(), 'src/components/pages/ExecutiveScenarioLabPage.tsx'), 'utf8');
  assert.ok(!pageContent.includes('useScenarioSimulation'), 'A interface não deve usar simulador local no Phase 5');
});

// 4. Validar ausência de chamadas diretas a AI services
test('Ausência de serviços de AI diretos', () => {
  const files = [
    'src/components/pages/ExecutiveScenarioLabPage.tsx',
    'src/components/ScenarioLab/AdvisoryDeltaPanel.tsx',
    'src/components/ScenarioLab/ScenarioControlPanel.tsx',
    'src/hooks/useScenarioSimulation.ts'
  ];
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    assert.ok(!content.includes('openai'), 'A interface não deve invocar openai localmente');
    assert.ok(!content.includes('claude'), 'A interface não deve invocar claude localmente');
    assert.ok(!content.includes('generateExecutiveAdvisory('), 'A interface não pode invocar o generator localmente, apenas ler do output');
  });
});

// 5. Validar ausência de thresholds financeiros hardcoded
test('Ausência de thresholds decisórios hardcoded', () => {
  const panelContent = fs.readFileSync(path.join(process.cwd(), 'src/components/ScenarioLab/InstitutionalProjectionPanel.tsx'), 'utf8');
  // O painel deve usar as classificações que vieram do engine
  assert.ok(panelContent.includes('cashFlowOutput.cashQuality.classification'));
  assert.ok(panelContent.includes('cashFlowOutput.financialDependency.classification'));
});

// 6. Validar ausência de advisory local e 7. Validar que o AdvisoryDeltaPanel apenas compara arrays
test('AdvisoryDeltaPanel não cria texto, apenas compara arrays', () => {
  const panelContent = fs.readFileSync(path.join(process.cwd(), 'src/components/ScenarioLab/AdvisoryDeltaPanel.tsx'), 'utf8');
  assert.ok(panelContent.includes('projectedAdvisory.dominantRisks.filter'));
  assert.ok(!panelContent.includes('Se a dívida') && !panelContent.includes('If debt'));
});

// 8. Validar que o RiskPropagationMap renderiza propagationSignals, sem inferência local.
test('RiskPropagationMap apenas repassa as flags vindas do Output', () => {
  const mapContent = fs.readFileSync(path.join(process.cwd(), 'src/components/ScenarioLab/RiskPropagationMap.tsx'), 'utf8');
  assert.ok(mapContent.includes('output.operationalOutput.ebitdaQuality.causalFlags'));
  assert.ok(mapContent.includes('output.advisory.dominantRisks'));
  assert.ok(!mapContent.includes('if (ebitda < 0)'));
});
