import { ExecutiveAssessmentResult } from './LiquidityExecutiveAssessmentEngine';
import { ExecutiveNarrativeVariations } from './ExecutiveNarrativeVariations';

export class WorkingCapitalExecutiveAssessmentEngine {
  public static assess(indicators: any[], bpSummary: any): ExecutiveAssessmentResult {
    // Capital de Giro: CGL 30%, NCG 25%, Saldo de Tesouraria 25%, ciclo financeiro/alocação 20%.
    const cgl = (bpSummary?.ativoCirculante || 0) - (bpSummary?.passivoCirculante || 0);
    const passivoCirculante = bpSummary?.passivoCirculante || 1;
    
    // Simplification for NCG if we don't have exact operational values: 
    // NCG = Ativo Circulante Operacional - Passivo Circulante Operacional
    // Let's use available metrics.
    const findValue = (name: string) => Number(indicators?.find(i => i.metricName === name)?.value || 0);
    const cicloFinanceiro = findValue('Ciclo Financeiro') || findValue('Cash Conversion Cycle');
    
    const saldoTesouraria = bpSummary?.caixaEquivalentes || 0;

    // Normalize heuristically
    // Positive CGL relative to PC is good
    const normCGL = Math.min(Math.max((cgl / passivoCirculante) * 100 + 50, 0), 100);
    
    // NCG is complex without direct data, but let's assume it correlates with CGL for scoring purposes
    const normNCG = normCGL; // fallback
    
    // Saldo de tesouraria relative to PC
    const normTesouraria = Math.min(Math.max((saldoTesouraria / passivoCirculante) * 100, 0), 100);
    
    // Ciclo financeiro: lower is better, usually. < 30 days is excellent, > 120 is bad.
    let normCiclo = 50;
    if (cicloFinanceiro) {
      normCiclo = Math.min(Math.max(100 - (cicloFinanceiro / 1.5), 0), 100);
    }

    let score = (normCGL * 0.30) + (normNCG * 0.25) + (normTesouraria * 0.25) + (normCiclo * 0.20);
    
    // Severity Lock based on Critical Liquidity
    const liquidezReal = findValue('Liquidez Corrente') || findValue('Liquidez Real');
    const liquidezSeca = findValue('Liquidez Seca');
    const liquidezInst = findValue('Liquidez Imediata') || findValue('Liquidez Instantânea');

    const isLiquidityCritical = liquidezReal > 0 && (liquidezReal < 1.0 || liquidezSeca < 1.0 || liquidezInst < 0.5);

    if (isLiquidityCritical) {
      // Force score to CRITICAL range if liquidity is compromised
      score = Math.min(score, 29);
    }

    let healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'INSUFFICIENT_DATA' = 'HEALTHY';
    let primaryDriverKpi = 'Capital de Giro Líquido (CGL)';

    if (score >= 80) {
      healthStatus = 'EXCELLENT';
      primaryDriverKpi = 'Saldo de Tesouraria';
    } else if (score >= 50) {
      healthStatus = 'HEALTHY';
      primaryDriverKpi = 'Capital de Giro Líquido (CGL)';
    } else if (score >= 30) {
      healthStatus = 'WARNING';
      primaryDriverKpi = 'Necessidade de Capital de Giro (NCG)';
    } else {
      healthStatus = 'CRITICAL';
      primaryDriverKpi = 'Saldo de Tesouraria';
    }

    const narrative = ExecutiveNarrativeVariations.get('WORKING_CAPITAL', healthStatus, bpSummary);
    const primaryDriver = narrative.primaryDriver;
    const executiveNarrative = narrative.executiveNarrative;
    const justification = narrative.justification;
    const managerialImplication = narrative.managerialImplication ?? narrative.justification;
    const priorityAction = narrative.priorityAction;

    return {
      healthStatus,
      score: Math.round(score),
      primaryDriver,
      primaryDriverKpi,
      executiveNarrative,
      justification,
      managerialImplication,
      priorityAction,
      confidence: 'Alta'
    };
  }
}
