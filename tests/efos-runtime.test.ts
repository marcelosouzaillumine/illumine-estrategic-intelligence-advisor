import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateInstitutionalFinancialThesisProfile } from '../src/core/runtime/InstitutionalFinancialThesisEngine';
import { CashFlowDiagnostics } from '../src/core/runtime/cashflow/cashflow-types';
import { CapitalGovernanceDiagnostics } from '../src/core/runtime/capital-governance/capital-governance-types';
import { detectCrossStatementCausality } from '../src/core/runtime/CrossStatementCausalityEngine';

describe('EFOS Runtime - Institutional Financial Thesis Engine', () => {
  it('Deve retornar indisponível quando não houver dados', () => {
    const profile = generateInstitutionalFinancialThesisProfile(
      false, false, 
      { isAvailable: false } as CashFlowDiagnostics, 
      { isAvailable: false } as CapitalGovernanceDiagnostics,
      0, 0
    );
    assert.equal(profile.isAvailable, false);
    assert.equal(profile.consolidatedSeverity, 'INDISPONÍVEL');
  });

  it('Deve aplicar severidade ALTA para drenagem de capital', () => {
    const profile = generateInstitutionalFinancialThesisProfile(
      true, true, 
      { isAvailable: true, operational: { pattern: 'OPERACIONAL_SUSTENTAVEL' } } as any, 
      { isAvailable: true, preservation: { preservationStatus: 'FRAGILIDADE_PATRIMONIAL' }, distribution: { distributionPressure: 'BAIXA' } } as any,
      1000, 500
    );
    assert.equal(profile.isAvailable, true);
    assert.equal(profile.consolidatedSeverity, 'CRÍTICA');
    assert.equal(profile.structuralRisks.some(r => r.id === 'DRENAGEM_DE_CAPITAL'), true);
  });
});

describe('EFOS Runtime - Cross Statement Causality Engine', () => {
  it('Deve detectar tensão DRE -> DFC por retenção de capital de giro', () => {
    const causality = detectCrossStatementCausality(
      5000, // ebitda
      -1000, // ocf
      0,
      6000, // wc variation
      0,
      0
    );
    assert.ok(causality.tensions.length > 0);
    assert.equal(causality.tensions[0].source, 'DRE');
    assert.equal(causality.tensions[0].target, 'DFC');
    assert.equal(causality.tensions[0].severity, 'ALTA');
  });
});

describe('EFOS Observability - Propagation Chain Tracer', () => {
  it('Deve agrupar tensões conectadas em cadeias de propagação', async () => {
    const { tracePropagationChains } = await import('../src/core/runtime/observability/PropagationChainTracer');
    const tensions = [
      { source: 'DRE', target: 'DFC', propagationDirection: 'DRE → DFC', mechanism: 'EBITDA não convertido', evidence: '...', severity: 'ALTA' },
      { source: 'DFC', target: 'BP', propagationDirection: 'DFC → BP', mechanism: 'Consumo de Caixa', evidence: '...', severity: 'CRÍTICA' }
    ] as any;
    const chains = tracePropagationChains(tensions);
    assert.equal(chains.length, 1);
    assert.equal(chains[0].nodes.length, 3);
    assert.equal(chains[0].nodes[0], 'DRE');
    assert.equal(chains[0].nodes[2], 'BP');
    assert.equal(chains[0].chainSeverity, 'CRÍTICA');
  });
});

describe('EFOS Observability - Institutional Explainability', () => {
  it('Deve gerar racional fiduciário completo com camadas progressivas', async () => {
    const { generateFiduciaryRationale } = await import('../src/core/runtime/observability/InstitutionalExplainabilityEngine');
    const profile = { isAvailable: true, consolidatedSeverity: 'ALTA', structuralRisks: [{ id: 'RISK_1', component: 'Capital', severity: 'ALTA' }], pressures: [] } as any;
    const rationale = generateFiduciaryRationale(profile, [], 'HIGH_CONFIDENCE', false);
    assert.ok(rationale.executiveSummary);
    assert.ok(rationale.structuralDrivers);
    assert.ok(rationale.mathematicalEvidence);
    assert.equal(rationale.confidenceDecomposition.sustainmentFactors.length > 0, true);
  });
});
