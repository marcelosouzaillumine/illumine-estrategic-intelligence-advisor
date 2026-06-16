import { ExecutiveNarrativeVariations } from './ExecutiveNarrativeVariations';

export interface ExecutiveAssessmentResult {
  healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'ATTENTION' | 'INSUFFICIENT_DATA';
  score: number | null;
  primaryDriver: string;
  primaryDriverKpi?: string;
  executiveNarrative: string;
  justification?: string;
  managerialImplication?: string;
  priorityAction?: string;
  confidence?: 'Alta' | 'Média' | 'Baixa';
}

export class LiquidityExecutiveAssessmentEngine {
  public static assess(indicators: any[], bpSummary: any): ExecutiveAssessmentResult {
    const findValue = (name: string) => Number(indicators?.find(i => i.metricName === name)?.value || 0);
    
    const liquidezReal = findValue('Liquidez Corrente'); // Using 'Liquidez Corrente' as 'Liquidez Real' based on driver mapper
    const liquidezSeca = findValue('Liquidez Seca');
    const liquidezImediata = findValue('Liquidez Imediata');
    const tesouraria = bpSummary?.caixaEquivalentes || 0;
    
    // Normalize heuristically
    const normLR = Math.min(Math.max((liquidezReal / 1.5) * 100, 0), 100);
    const normLS = Math.min(Math.max((liquidezSeca / 1.0) * 100, 0), 100);
    const normLI = Math.min(Math.max((liquidezImediata / 0.5) * 100, 0), 100);
    const normTesouraria = Math.min(Math.max(((tesouraria / Math.max(bpSummary?.passivoCirculante || 1, 1))) * 100, 0), 100);

    const score = (normLR * 0.35) + (normLS * 0.25) + (normLI * 0.20) + (normTesouraria * 0.20);
    
    let healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'INSUFFICIENT_DATA' = 'HEALTHY';
    let primaryDriverKpi = 'Liquidez Real';

    if (score >= 85) {
      healthStatus = 'EXCELLENT';
      primaryDriverKpi = 'Liquidez Real';
    } else if (score >= 60) {
      healthStatus = 'HEALTHY';
      primaryDriverKpi = 'Liquidez Real';
    } else if (score >= 35) {
      healthStatus = 'WARNING';
      primaryDriverKpi = 'Liquidez Seca';
    } else {
      healthStatus = 'CRITICAL';
      primaryDriverKpi = 'Liquidez Instantânea Real';
    }

    const narrative = ExecutiveNarrativeVariations.get('LIQUIDITY', healthStatus, bpSummary);
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
