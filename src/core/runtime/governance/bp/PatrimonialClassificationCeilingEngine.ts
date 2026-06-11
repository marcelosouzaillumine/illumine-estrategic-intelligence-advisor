import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { FiduciaryOverrideRegistry, FiduciaryOverride } from '../fiduciary-overrides/FiduciaryOverrideRegistry';

export interface PatrimonialClassificationCeilingOutput {
  originalClassification: string;
  classificationCeiling: string | null;
  finalClassification: string;
  ceilingReasons: string[];
  confidenceImpact: number;
  fiduciaryRestrictions: string[];
  appliedOverrides: FiduciaryOverride[];
}

export class PatrimonialClassificationCeilingEngine {
  public static evaluate(
    originalClassification: string,
    bpIndicators: PatrimonialIndicator[],
    context: {
      hasValidatedCashFlowEvidence: boolean;
      netIncome?: number;
      fco?: number;
    }
  ): PatrimonialClassificationCeilingOutput {
    FiduciaryOverrideRegistry.clear('PATRIMONIAL');
    
    let confidenceImpact = 0;
    const fiduciaryRestrictions: string[] = [];

    const getInd = (metric: string) => bpIndicators.find(i => i.metricName === metric);
    const getVal = (metric: string) => {
      const ind = getInd(metric);
      return ind && typeof ind.value === 'number' ? ind.value : null;
    };
    const getClass = (metric: string) => getInd(metric)?.classification;

    // Rule Group 1: Liquidity Fragility Override
    const lsClass = getClass('Liquidez Seca');
    const liClass = getClass('Liquidez Imediata');
    const liquidityFragilityMet = lsClass === 'CRITICAL' && liClass === 'CRITICAL';
    FiduciaryOverrideRegistry.register({
      id: 'PAT_LIQ_FRAGILITY',
      name: 'Liquidity Fragility Override',
      domain: 'PATRIMONIAL',
      conditionMet: liquidityFragilityMet,
      severity: 'HIGH',
      ceilingImpact: 'VULNERABLE',
      penaltyScore: 1,
      triggeredAt: liquidityFragilityMet ? new Date().toISOString() : undefined
    });

    // Rule Group 2: Treasury Stress Override
    const stVal = getVal('Saldo de Tesouraria');
    const treasuryStressMet = stVal !== null && stVal < 0;
    FiduciaryOverrideRegistry.register({
      id: 'PAT_TREASURY_STRESS',
      name: 'Treasury Stress Override',
      domain: 'PATRIMONIAL',
      conditionMet: treasuryStressMet,
      severity: 'HIGH',
      ceilingImpact: 'VULNERABLE',
      penaltyScore: 1,
      triggeredAt: treasuryStressMet ? new Date().toISOString() : undefined
    });

    // Rule Group 3: Short-Term Debt Concentration Override (Materiality Based)
    const ceClass = getClass('Composição do Endividamento');
    const debtConcSevere = ceClass === 'SHORT_TERM_PRESSURE';
    const debtConcModerate = ceClass === 'ATTENTION';
    FiduciaryOverrideRegistry.register({
      id: 'PAT_DEBT_CONCENTRATION',
      name: 'Short-Term Debt Concentration Override',
      domain: 'PATRIMONIAL',
      conditionMet: debtConcModerate || debtConcSevere,
      severity: debtConcSevere ? 'CRITICAL' : 'HIGH',
      ceilingImpact: debtConcSevere ? 'FRAGILE' : 'VULNERABLE',
      penaltyScore: debtConcSevere ? 2 : 1,
      triggeredAt: (debtConcModerate || debtConcSevere) ? new Date().toISOString() : undefined
    });

    // Rule Group 4: Capital Dependency Override
    const afVal = getVal('Autonomia Financeira');
    const capDepModerate = afVal !== null && afVal < 0.20 && afVal >= 0.10;
    const capDepSevere = afVal !== null && afVal < 0.10;
    FiduciaryOverrideRegistry.register({
      id: 'PAT_CAPITAL_DEPENDENCY',
      name: 'Capital Dependency Override',
      domain: 'PATRIMONIAL',
      conditionMet: capDepModerate || capDepSevere,
      severity: capDepSevere ? 'CRITICAL' : 'HIGH',
      ceilingImpact: capDepSevere ? 'CRITICAL' : 'FRAGILE',
      penaltyScore: capDepSevere ? 3 : 2,
      triggeredAt: (capDepModerate || capDepSevere) ? new Date().toISOString() : undefined
    });

    // Rule 5: Earnings Quality Override (Added per refinement)
    const earningsQualityMet = (context.netIncome !== undefined && context.netIncome > 0) && (context.fco !== undefined && context.fco < 0);
    FiduciaryOverrideRegistry.register({
      id: 'PAT_EARNINGS_QUALITY',
      name: 'Earnings Quality Override',
      domain: 'PATRIMONIAL',
      conditionMet: earningsQualityMet,
      severity: 'HIGH',
      penaltyScore: 0, // Doesn't reduce ceiling directly
      mandatoryDisclosure: 'Lucro Líquido positivo não se refletiu em geração de Caixa Operacional (FCO negativo), indicando baixa qualidade dos lucros ou absorção severa pelo capital de giro.',
      triggeredAt: earningsQualityMet ? new Date().toISOString() : undefined
    });

    // Collect active overrides
    const activeOverrides = FiduciaryOverrideRegistry.getActiveOverrides('PATRIMONIAL');
    const totalPenalty = activeOverrides.reduce((sum, o) => sum + o.penaltyScore, 0);

    let classificationCeiling: string | null = null;
    const ceilingReasons: string[] = [];

    // Individual override ceilings
    activeOverrides.forEach(o => {
      if (o.ceilingImpact) {
        if (!classificationCeiling || this.getSeverityRank(o.ceilingImpact) > this.getSeverityRank(classificationCeiling)) {
          classificationCeiling = o.ceilingImpact;
        }
        ceilingReasons.push(`${o.name} atingiu teto ${o.ceilingImpact}.`);
      }
      if (o.mandatoryDisclosure) {
        fiduciaryRestrictions.push(o.mandatoryDisclosure);
      }
    });

    // Multi-Risk Accumulation rules
    if (totalPenalty >= 6 && this.getSeverityRank('CRITICAL') > this.getSeverityRank(classificationCeiling || '')) {
      classificationCeiling = 'CRITICAL';
      ceilingReasons.push(`Multi-Risk Accumulation (${totalPenalty} pts): Teto reduzido para CRITICAL.`);
    } else if (totalPenalty >= 4 && this.getSeverityRank('FRAGILE') > this.getSeverityRank(classificationCeiling || '')) {
      classificationCeiling = 'FRAGILE';
      ceilingReasons.push(`Multi-Risk Accumulation (${totalPenalty} pts): Teto reduzido para FRAGILE.`);
    } else if (totalPenalty >= 2 && this.getSeverityRank('VULNERABLE') > this.getSeverityRank(classificationCeiling || '')) {
      classificationCeiling = 'VULNERABLE';
      ceilingReasons.push(`Multi-Risk Accumulation (${totalPenalty} pts): Teto reduzido para VULNERABLE.`);
    }

    // Rule Group 6: Missing Critical Evidence
    const lgClass = getClass('Liquidez Geral');
    if (lgClass === 'INSUFFICIENT_DATA' && !context.hasValidatedCashFlowEvidence) {
      confidenceImpact -= 10;
      ceilingReasons.push('Falta de Liquidez Geral associada a ausência de DFC confiável reduz a confiança institucional.');
    }
    
    // (We omit runway < 180 restriction from here as it requires EFOS runway, which we can simulate by checking context later if needed, but let's stick to what's defined).

    // Classification Resolution
    const normalizedOriginal = originalClassification.replace(' STRUCTURE', '');
    let finalClassification = normalizedOriginal;

    if (classificationCeiling && this.getSeverityRank(classificationCeiling) > this.getSeverityRank(normalizedOriginal)) {
      finalClassification = classificationCeiling;
    }

    return {
      originalClassification: normalizedOriginal,
      classificationCeiling,
      finalClassification,
      ceilingReasons,
      confidenceImpact,
      fiduciaryRestrictions,
      appliedOverrides: activeOverrides
    };
  }

  private static getSeverityRank(classification: string): number {
    switch (classification) {
      case 'RESILIENT': return 1;
      case 'STABLE': return 2;
      case 'VULNERABLE': return 3;
      case 'FRAGILE': return 4;
      case 'CRITICAL': return 5;
      default: return 0;
    }
  }
}
