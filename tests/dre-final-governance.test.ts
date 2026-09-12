import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DRELabelSanitizationRegistry } from '../src/workspace/runtime/presentation-governance/DRELabelSanitizationRegistry';
import { CrossStatementNarrativeIsolationRegistry } from '../src/workspace/runtime/presentation-governance/CrossStatementNarrativeIsolationRegistry';
import { OperationalSeverityGovernanceEngine } from '../src/workspace/runtime/presentation-governance/OperationalSeverityGovernanceEngine';
import { DREPresentationGovernanceAudit } from '../src/workspace/runtime/presentation-governance/DREPresentationGovernanceAudit';
import { DRERecoverabilityGovernanceEngine } from '../src/core/runtime/dre/DRERecoverabilityGovernanceEngine';
import { OperationalHealthExplainabilityEngine } from '../src/core/runtime/dre/OperationalHealthExplainabilityEngine';
import { EconomicDiagnosisEngine } from '../src/core/runtime/dre/EconomicDiagnosisEngine';
import { DREBoardAdvisoryEngine } from '../src/core/runtime/dre/DREBoardAdvisoryEngine';
import { DREExecutiveDataMapper } from '../src/core/runtime/dre/DREExecutiveDataMapper';
import { ExecutiveLabelResolver } from '../src/workspace/runtime/executive-presentation/ExecutiveLabelResolver';

describe('DRE Executive Governance (DEGFF) Validation', () => {
  
  // 1. Sanitization dictionary mapping keys correctly
  test('DRELabelSanitizationRegistry should sanitize keys correctly', () => {
    assert.strictEqual(DRELabelSanitizationRegistry.sanitize('Net Revenue'), 'Receita Líquida');
    assert.strictEqual(DRELabelSanitizationRegistry.sanitize('Gross Revenue'), 'Receita Bruta');
    assert.strictEqual(DRELabelSanitizationRegistry.sanitize('Admin Expenses'), 'Despesas Administrativas');
  });

  // 2. ExecutiveLabelResolver integrates sanitization registry
  test('ExecutiveLabelResolver should resolve sanitized labels before maps', () => {
    assert.strictEqual(ExecutiveLabelResolver.resolve('Net Revenue'), 'Receita Líquida');
    assert.strictEqual(ExecutiveLabelResolver.resolve('Gross Revenue'), 'Receita Bruta');
  });

  // 3. CrossStatementNarrativeIsolationRegistry blocking/allowing rules
  test('CrossStatementNarrativeIsolationRegistry should assert isolation correctly', () => {
    // Prohibited cash terms
    const forbiddenText = 'A empresa precisará de captação de liquidez e caixa livre.';
    const validation = CrossStatementNarrativeIsolationRegistry.validate(forbiddenText);
    assert.strictEqual(validation.isCompliant, false);
    assert.ok(validation.violations.includes('caixa'));
    assert.ok(validation.violations.includes('liquidez'));

    // Allowed economic terms
    const allowedText = 'A receita operacional aumentará a margem e rentabilidade da operação.';
    const allowedValidation = CrossStatementNarrativeIsolationRegistry.validate(allowedText);
    assert.strictEqual(allowedValidation.isCompliant, true);
    assert.strictEqual(allowedValidation.violations.length, 0);
  });

  // 4. OperationalSeverityGovernanceEngine health score thresholds
  test('OperationalSeverityGovernanceEngine should classify severities correctly', () => {
    assert.strictEqual(OperationalSeverityGovernanceEngine.classify(85).level, 'Estrutura Saudável');
    assert.strictEqual(OperationalSeverityGovernanceEngine.classify(70).level, 'Atenção');
    assert.strictEqual(OperationalSeverityGovernanceEngine.classify(50).level, 'Restritivo');
    assert.strictEqual(OperationalSeverityGovernanceEngine.classify(40).level, 'Crítico');
    assert.strictEqual(OperationalSeverityGovernanceEngine.classify(25).level, 'Colapso Econômico');
  });

  // 5. DRERecoverabilityGovernanceEngine deterministic evaluation
  test('DRERecoverabilityGovernanceEngine should classify recoverability correctly', () => {
    // Alta
    assert.strictEqual(DRERecoverabilityGovernanceEngine.evaluate(95, 0.35), 'Alta');
    // Moderada
    assert.strictEqual(DRERecoverabilityGovernanceEngine.evaluate(75, 0.10), 'Moderada');
    // Baixa
    assert.strictEqual(DRERecoverabilityGovernanceEngine.evaluate(55, 0.05), 'Baixa');
    // Crítica
    assert.strictEqual(DRERecoverabilityGovernanceEngine.evaluate(25, -0.05), 'Crítica');
  });

  // 6. OperationalHealthExplainabilityEngine thresholds and points
  test('OperationalHealthExplainabilityEngine should classify score 40 as CRÍTICO and output points', () => {
    const explained = OperationalHealthExplainabilityEngine.explain(40, {
      ebitda: -10000,
      breakEvenCoverage: 55,
      grossMargin: 0.15,
      netProfit: -20000,
      adminExpenses: -50000,
      netRevenue: 30000
    });

    assert.strictEqual(explained.classification, 'CRÍTICO');
    assert.strictEqual(explained.classificationColor, 'rose');
    
    // Check explicit point breakdown in labels
    assert.ok(explained.drivers.includes('EBITDA negativo (-25 pts)'));
    assert.ok(explained.drivers.includes('Cobertura insuficiente (-20 pts)'));
    assert.ok(explained.drivers.includes('Escala abaixo do Break-even (-10 pts)'));
    assert.ok(explained.drivers.includes('Margem operacional negativa (-5 pts)'));
  });

  // 7. EconomicDiagnosisEngine Granatum 2022 validation
  test('EconomicDiagnosisEngine evaluates Granatum 2022 payload correctly', () => {
    const payload = {
      netRevenue: 156969.54,
      cogs: -70026.22,
      adminExpenses: -157385.83,
      ebitda: -68548.88,
      netProfit: -68548.88,
      grossProfit: 86943.32,
      breakEvenRevenue: 284148.12
    };

    const mapped = DREExecutiveDataMapper.map(payload);
    const diagnosis = EconomicDiagnosisEngine.evaluate({
      normalizedDRE: mapped.executiveMetrics,
      revenueEconomicStructure: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 },
      breakEvenAnalysis: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 },
      operationalAbsorption: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 },
      economicBurnRate: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 }
    });

    // 55.24% coverage & 55.39% gross margin -> Baixa
    assert.strictEqual(diagnosis.recoverabilityAssessment, 'Baixa');
    assert.strictEqual(
      diagnosis.boardOutlook,
      'A operação continuará destruindo valor econômico e ampliando a pressão sobre a rentabilidade futura.'
    );
  });

  // 8. DREBoardAdvisoryEngine character limit (< 800) and structure
  test('DREBoardAdvisoryEngine generates brief advisory under 800 chars', () => {
    const payload = {
      netRevenue: 156969.54,
      cogs: -70026.22,
      adminExpenses: -157385.83,
      ebitda: -68548.88,
      netProfit: -68548.88,
      grossProfit: 86943.32,
      breakEvenRevenue: 284148.12
    };

    const mapped = DREExecutiveDataMapper.map(payload);
    const diagnosis = EconomicDiagnosisEngine.evaluate({
      normalizedDRE: mapped.executiveMetrics,
      revenueEconomicStructure: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 },
      breakEvenAnalysis: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 },
      operationalAbsorption: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 },
      economicBurnRate: { available: true, value: {} as any, sourceMetrics: {}, confidenceLevel: 100 }
    });
    const advisory = DREBoardAdvisoryEngine.generateExecutiveAdvisory(mapped.executiveMetrics, diagnosis);

    assert.ok(advisory.fullNarrative.length <= 800);
    assert.ok(advisory.fullNarrative.length > 10);
    assert.strictEqual(advisory.isolationValidated, true);
  });

  // 9. DREPresentationGovernanceAudit returning PASS
  test('DREPresentationGovernanceAudit returns PASS for compliant inputs', () => {
    const compliantNarrative = 'A receita operacional aumentará a margem e rentabilidade da operação.';
    const audit = DREPresentationGovernanceAudit.validate(
      compliantNarrative,
      false, // isTechnicalLayerExpanded
      'Crítico', // severity level
      450, // advisory length
      true // advisory structure compliant
    );

    assert.strictEqual(audit.governanceStatus, 'PASS');
    assert.strictEqual(audit.terminologyLeakage, false);
    assert.strictEqual(audit.cashContamination, false);
    assert.strictEqual(audit.technicalLayerCollapsed, true);
  });

});
