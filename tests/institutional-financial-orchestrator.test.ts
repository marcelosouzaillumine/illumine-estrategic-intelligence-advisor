import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalFinancialDomainOrchestrator } from '../src/workspace/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator';

describe('InstitutionalFinancialDomainOrchestrator', () => {
  const getMockCtx = (): any => ({
    operationalSegment: { label: 'Tecnologia', code: 'TECH' },
    operationalModel: { label: 'SaaS B2B', code: 'SAAS_B2B' },
    financialProfile: { label: 'Intensivo em Capital', code: 'CAPITAL_INTENSIVE' },
    institutionalMaturity: { label: 'Estágio de Crescimento', code: 'GROWTH_STAGE', historicalSupportLevel: 'MODERATE_HISTORY' },
    confidence: { level: 'HIGH_CONFIDENCE', completeness: 1, strategicConfidence: 'HIGH_CONFIDENCE' },
    narrativeConstraints: { blockedNarrativeClaims: [], allowedNarrativeFrame: [] },
    recommendationBoundaries: { strictCapitalGovernance: true, leverageTolerance: 'LOW', focusAreas: [], blockedRecommendations: [] },
    legacy: {
      businessStage: 'GROWTH_STAGE',
      economicModel: 'SAAS',
      liabilityProfile: ['UNKNOWN'],
      historicalDensity: 'MODERATE_HISTORY'
    }
  });

  it('deve gerar relatório crítico (Fail-Closed) quando falta BP', () => {
    const payload = {
      ctx: getMockCtx(),
      presence: { hasBP: false, hasDRE: true, hasDFC: true, historicalCycles: 3 },
      signals: {
        dreRevenueGrowth: true, dreMarginExpansion: true, dfcCashBurn: false,
        dfcOperationalCashFlowNegative: false, bpWorkingCapitalPressure: false, bpHighLeverage: false
      }
    };

    const view = InstitutionalFinancialDomainOrchestrator.orchestrate(payload);

    assert.equal(view.disclosures.isCritical, true);
    assert.ok(view.disclosures.primaryDisclosure.includes('INDISPONÍVEIS'));
    assert.equal(view.telemetry.isFailClosedActivated, true);
    assert.equal(view.severity.levelLabel, 'SENSÍVEL');
  });

  it('deve julgar tensão de DRE crescendo e caixa queimando como "Expansão suportada por pressão de liquidez"', () => {
    const payload = {
      ctx: getMockCtx(),
      presence: { hasBP: true, hasDRE: true, hasDFC: true, historicalCycles: 3 },
      signals: {
        dreRevenueGrowth: true, dreMarginExpansion: false, dfcCashBurn: false,
        dfcOperationalCashFlowNegative: true, bpWorkingCapitalPressure: true, bpHighLeverage: false
      }
    };

    const view = InstitutionalFinancialDomainOrchestrator.orchestrate(payload);

    assert.ok(view.causality.primaryEvent.includes('pressão'));
    assert.equal(view.severity.levelLabel, 'ALERTA');
  });

  it('deve limitar declarações verbosas de estabilidade se for SINGLE_YEAR_ONLY', () => {
    const ctx = getMockCtx();
    ctx.legacy.historicalDensity = 'SINGLE_YEAR_ONLY';
    
    const payload = {
      ctx,
      presence: { hasBP: true, hasDRE: true, hasDFC: true, historicalCycles: 1 },
      signals: {
        dreRevenueGrowth: true, dreMarginExpansion: true, dfcCashBurn: false,
        dfcOperationalCashFlowNegative: false, bpWorkingCapitalPressure: false, bpHighLeverage: false
      }
    };

    const view = InstitutionalFinancialDomainOrchestrator.orchestrate(payload);
    
    // A narrativa gerada deveria limitar as palavras de maturidade / consolidação
    assert.ok(view.causality.primaryEvent.includes('Eficiência de curto prazo estabilizada'));
    assert.equal(view.disclosures.secondaryDisclosures.some((d: string) => d.includes('Limitação Longitudinal')), true);
  });
});
