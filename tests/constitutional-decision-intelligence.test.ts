import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutionalActionRegistry } from '../src/capabilities/runtime/decision-intelligence/ConstitutionalActionRegistry';
import { ConstitutionalDecisionRuntime } from '../src/capabilities/runtime/decision-intelligence/ConstitutionalDecisionRuntime';
import { ExecutiveDecisionReport } from '../src/capabilities/runtime/decision-intelligence/ExecutiveDecisionReport';
import { ExecutiveActionMatrixEngine } from '../src/capabilities/runtime/decision-intelligence/ExecutiveActionMatrixEngine';

describe('Constitutional Decision Governance Layer (CDIL v1.1) Tests', () => {
  beforeEach(() => {
    ConstitutionalActionRegistry.clearRegistry();
    
    ConstitutionalActionRegistry.registerAction({
      actionId: 'ACTION_PRESERVE_CASH',
      category: 'TREASURY',
      title: 'Preservar Caixa',
      description: 'Congelamento de gastos discricionários.',
      constitutionalProtocols: ['FCF', 'TCF'],
      active: true,
      conflictsWith: ['ACTION_EXPAND_CAPEX']
    });

    ConstitutionalActionRegistry.registerAction({
      actionId: 'ACTION_EXPAND_CAPEX',
      category: 'CAPITAL',
      title: 'Expandir CAPEX',
      description: 'Aceleração de investimentos estruturais.',
      constitutionalProtocols: ['FCF', 'CCF'],
      active: true,
      conflictsWith: ['ACTION_PRESERVE_CASH']
    });

    ConstitutionalActionRegistry.registerAction({
      actionId: 'ACTION_REDUCE_INVENTORY',
      category: 'WORKING_CAPITAL',
      title: 'Reduzir Estoques',
      description: 'Liquidação de giro excessivo.',
      constitutionalProtocols: ['LCF'],
      active: true
    });

    ConstitutionalActionRegistry.registerAction({
      actionId: 'ACTION_MAINTAIN_STRATEGY',
      category: 'GOVERNANCE',
      title: 'Manter Estratégia',
      description: 'Nenhuma ação reativa imediata.',
      constitutionalProtocols: ['SCCF'],
      active: true
    });
  });

  const getValidContext = () => ({
    fiduciaryEvidenceStatus: 'STABLE',
    operationalCashFlow: 1000,
    treasuryConclusion: 'SUSTAINABLE_GROWTH',
    hasExecutiveConclusion: true,
    runwayMonths: 12,
    inventoryDays: 60,
    lineageHash: 'context-hash-123'
  });

  test('1. Verify Executive Decision Object creation', () => {
    const context = getValidContext();
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context);
    
    assert.notStrictEqual((result as any).status, 'CDIL_BLOCKED_BY_CGL');
    const report = result as ExecutiveDecisionReport;
    
    assert.strictEqual(report.executiveDecisions.length, 1);
    assert.strictEqual(report.executiveDecisions[0].actionId, 'ACTION_MAINTAIN_STRATEGY');
    assert.strictEqual(report.executiveDecisions[0].actionSource, 'CAR');
  });

  test('2. Verify unsupported recommendation is blocked', () => {
    // If we map an action but it's not registered or active, it handles it safely (empty mapping)
    ConstitutionalActionRegistry.clearRegistry(); // No actions
    const context = getValidContext();
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    assert.strictEqual(result.executiveDecisions.length, 0); // mapped correctly to nothing
  });

  test('3. Verify prioritization engine', () => {
    const context = getValidContext();
    context.fiduciaryEvidenceStatus = 'CRITICAL';
    context.operationalCashFlow = -500;
    context.treasuryConclusion = 'Severe Stress';
    context.runwayMonths = 2; // triggers PRESERVE_CASH
    
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    assert.strictEqual(result.overallPriority, 'CRITICAL');
    assert.strictEqual(result.executiveDecisions[0].urgency, 'IMMEDIATE');
  });

  test('4. Verify decision constitution validation', () => {
    const context = getValidContext();
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    assert.strictEqual(result.decisionCompliance.constitutionalStatus, 'VALID');
  });

  test('5. Verify action matrix generation', () => {
    const context = getValidContext();
    context.runwayMonths = 2;
    context.inventoryDays = 120;
    
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    assert.strictEqual(result.executiveDecisions.length, 2);
    assert.strictEqual(result.executiveDecisions[0].actionId, 'ACTION_PRESERVE_CASH');
    assert.strictEqual(result.executiveDecisions[1].actionId, 'ACTION_REDUCE_INVENTORY');
  });

  test('6. Verify constitutional lineage', () => {
    const context = getValidContext();
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    assert.strictEqual(result.executiveDecisions[0].lineageReferences[0], 'context-hash-123');
  });

  test('7. Verify deterministic execution', () => {
    const context = getValidContext();
    const result1 = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    const result2 = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    
    assert.strictEqual(result1.decisionHash, result2.decisionHash);
  });

  test('8. Verify constitutional hash stability (Timestamp must not alter decisionHash)', async () => {
    const context = getValidContext();
    const result1 = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    
    await new Promise(resolve => setTimeout(resolve, 5));
    
    const result2 = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    assert.strictEqual(result1.decisionHash, result2.decisionHash);
    assert.notStrictEqual(result1.generatedAt, result2.generatedAt);
  });

  test('9. Verify CGL approval required', () => {
    const context = getValidContext();
    const result = ConstitutionalDecisionRuntime.evaluate('INVALID', context);
    
    assert.strictEqual((result as any).status, 'CDIL_BLOCKED_BY_CGL');
  });

  test('10. Verify decision conflict detection', () => {
    const context = getValidContext();
    // Force action matrix to return conflicting actions by overriding mapActions temporarily
    const origMap = ExecutiveActionMatrixEngine.mapActions;
    ExecutiveActionMatrixEngine.mapActions = () => ['ACTION_PRESERVE_CASH', 'ACTION_EXPAND_CAPEX'];
    
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    
    assert.strictEqual(result.constitutionalStatus, 'BLOCKED');
    assert.strictEqual(result.decisionCompliance.conflictStatus, 'INVALID');
    
    ExecutiveActionMatrixEngine.mapActions = origMap;
  });

  test('11. Verify survivability filter', () => {
    const context = getValidContext();
    context.fiduciaryEvidenceStatus = 'CRITICAL';
    const origMap = ExecutiveActionMatrixEngine.mapActions;
    ExecutiveActionMatrixEngine.mapActions = () => ['ACTION_EXPAND_CAPEX']; // conflicting with critical liquidity
    
    const result = ConstitutionalDecisionRuntime.evaluate('VALID', context) as ExecutiveDecisionReport;
    
    assert.strictEqual(result.constitutionalStatus, 'BLOCKED');
    assert.strictEqual(result.decisionCompliance.survivabilityStatus, 'INVALID');
    
    ExecutiveActionMatrixEngine.mapActions = origMap;
  });

});
