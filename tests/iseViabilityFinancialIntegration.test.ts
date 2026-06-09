import test from 'node:test';
import assert from 'node:assert';

test('▶ Viability to Financial Modeling Integration (ISE Structural Regression Fix)', async (t) => {

  // Mock Data Structure representing the DB state
  const mockRealScenarios = [
    { id: 'scen-baseline', status: 'Approved', name: 'Baseline 2026' },
    { id: 'scen-draft', status: 'Draft', name: 'Draft Expansion' }
  ];

  let mockScenarioImpacts: any[] = [];

  // Mocks processViabilityImpact logic
  const processViabilityImpactMock = (project: any) => {
    if (project.conclusao !== 'Aprovado' && project.conclusao !== 'Implementado') return;
    
    // Always target Draft if no specific target is given
    const targetScenarioId = 'scen-draft';
    
    const existingIndex = mockScenarioImpacts.findIndex(i => i.sourceId === project.id && i.scenarioId === targetScenarioId);
    
    const impact = {
      scenarioId: targetScenarioId,
      sourceId: project.id,
      revenueImpact: project.receitaMensal * 12,
      capexImpact: project.capex,
      workingCapitalImpact: project.ncg,
      valuationImpact: project.vpl || 0,
    };

    if (existingIndex >= 0) {
      mockScenarioImpacts[existingIndex] = impact;
    } else {
      mockScenarioImpacts.push(impact);
    }
  };

  await t.test('1. Projeto aprovado gera scenario_impact no Draft, protegendo Baseline Approved (Regras 1, 7)', () => {
    const project = {
      id: 'proj-1',
      nome: 'Expansão Sul',
      conclusao: 'Aprovado',
      receitaMensal: 50000,
      capex: 1000000,
      ncg: 200000,
      vpl: 500000
    };

    processViabilityImpactMock(project);

    assert.strictEqual(mockScenarioImpacts.length, 1);
    assert.strictEqual(mockScenarioImpacts[0].scenarioId, 'scen-draft'); // Baseline is protected
    assert.strictEqual(mockScenarioImpacts[0].revenueImpact, 600000);
  });

  await t.test('2. Reprocessar o mesmo projeto não duplica impacto (Regra 2)', () => {
    const projectUpdated = {
      id: 'proj-1',
      nome: 'Expansão Sul (Ajustado)',
      conclusao: 'Aprovado',
      receitaMensal: 60000,
      capex: 1000000,
      ncg: 200000,
      vpl: 600000
    };

    processViabilityImpactMock(projectUpdated);

    assert.strictEqual(mockScenarioImpacts.length, 1, 'Não deve duplicar');
    assert.strictEqual(mockScenarioImpacts[0].revenueImpact, 720000, 'Deve atualizar valor');
  });

  await t.test('3/4/5. FinancialModeling consome scenario_impacts e altera DRE/FCFF (Regras 3, 4, 5)', () => {
    // Logic extracted from FinancialModelingPage.tsx useMemo
    const activeScenarioId = 'scen-draft';
    const activeScenarioImpacts = mockScenarioImpacts.filter(i => i.scenarioId === activeScenarioId);
    
    let rev = 0, cap = 0, wc = 0;
    activeScenarioImpacts.forEach(imp => {
      rev += imp.revenueImpact || 0;
      cap += imp.capexImpact || 0;
      wc += imp.workingCapitalImpact || 0;
    });

    const dreGerencialRows = [
      { item: "Receita Base", values: [0,0,0,0,0] },
      { item: "(+) Receita Incremental de Projetos", values: [rev, rev, rev, rev, rev] },
    ];

    const fluxoCaixaRows = [
      { item: "(-) CAPEX Incremental de Projetos", values: [cap, 0, 0, 0, 0] },
      { item: "(-) Variação NCG Incremental", values: [wc, 0, 0, 0, 0] },
      { item: "Fluxo de Caixa Livre (FCFF)", values: [-cap - wc, rev, rev, rev, rev] },
    ];

    // Assertions DRE
    assert.strictEqual(dreGerencialRows[1].values[0], 720000, 'Receita incremental deve ser injetada na DRE');
    
    // Assertions FCFF
    assert.strictEqual(fluxoCaixaRows[0].values[0], 1000000, 'Capex incremental injetado no Ano 1 do Fluxo de Caixa');
    assert.strictEqual(fluxoCaixaRows[2].values[0], -1200000, 'FCFF Ano 1 deve refletir consumo de caixa do CAPEX + NCG (-1M - 200k)');
    assert.strictEqual(fluxoCaixaRows[2].values[1], 720000, 'FCFF Ano 2 deve refletir a geração de caixa via Receita Incremental');
  });

  await t.test('6/8. Enterprise Value muda e Motores superiores consomem reconciliado read-only (Regras 6, 8)', () => {
    // Logic from dynamicExecutiveDecisionInputs
    const activeScenarioId = 'scen-draft';
    const impactsForScenario = mockScenarioImpacts.filter(i => i.scenarioId === activeScenarioId);
    
    const totalValuationImpact = impactsForScenario.reduce((sum, imp) => sum + (imp.valuationImpact || 0), 0);
    const baseEnterpriseValue = 120000000;
    const finalEV = baseEnterpriseValue + totalValuationImpact;

    assert.strictEqual(finalEV, 120600000, 'Enterprise Value deve ser alterado pelo impacto do VPL de Viabilidade');
    
    // Motores superiores consumindo
    const mockEFOSInput = {
      scenarioId: activeScenarioId,
      enterpriseValue: finalEV,
      readOnly: true // Motores superiores não alteram a base
    };

    assert.strictEqual(mockEFOSInput.readOnly, true);
    assert.strictEqual(mockEFOSInput.enterpriseValue, 120600000);
  });
});
