import { ExecutiveAssessmentResult } from './LiquidityExecutiveAssessmentEngine';
import { ExecutiveNarrativeVariations } from './ExecutiveNarrativeVariations';

export class CapitalPreservationExecutiveAssessmentEngine {
  public static assess(indicators: any[], bpSummary: any): ExecutiveAssessmentResult {
    let missingData = false;

    const findValue = (name: string) => {
      const ind = indicators?.find(i => i.metricName === name);
      if (!ind || ind.value === 'INSUFFICIENT_DATA' || ind.value == null || ind.value === '') {
        missingData = true;
        return NaN;
      }
      const parsed = parseFloat(String(ind.value).replace(/[^0-9.-]+/g, ''));
      if (isNaN(parsed)) {
        missingData = true;
        return NaN;
      }
      return parsed;
    };

    const hasCritical = indicators?.some(ind => {
      if (ind.value === 'INSUFFICIENT_DATA') return false;
      const classStr = (ind.classification || '').toUpperCase();
      return ind.severity === 'CRITICAL' || classStr.includes('CRITIC') || classStr.includes('CRÍTICA') || classStr.includes('CRÍTICO') || classStr.includes('SEVERE') || classStr.includes('DRENADO');
    });

    const lossAbsorption = findValue('Reserva Patrimonial para Choques');
    const equityBuffer = findValue('Margem de Segurança Patrimonial');

    let survivalIndexScore = 0;
    const survivalInd = indicators?.find(i => i.metricName === 'Índice de Sobrevivência Patrimonial');
    if (!survivalInd || survivalInd.value === 'INSUFFICIENT_DATA' || survivalInd.value == null || survivalInd.value === '') {
      missingData = true;
    } else {
      const v = String(survivalInd.value).toLowerCase();
      if (v.includes('forte') || v.includes('alto') || v.includes('elevado')) survivalIndexScore = 100;
      else if (v.includes('moderado') || v.includes('médio')) survivalIndexScore = 50;
      else survivalIndexScore = 0; // critical/frágil
    }

    if (missingData || isNaN(lossAbsorption) || isNaN(equityBuffer)) {
      return {
        healthStatus: 'INSUFFICIENT_DATA',
        score: null,
        primaryDriver: 'Dados Indisponíveis',
        executiveNarrative: 'Avaliação limitada por disponibilidade de evidências históricas.',
        justification: 'Avaliação limitada por disponibilidade de evidências históricas.',
        managerialImplication: 'Avaliação limitada por disponibilidade de evidências históricas.',
        priorityAction: 'Avaliação limitada por disponibilidade de evidências históricas.'
      };
    }

    // Heuristic normalization (0 to 100)
    // Loss Absorption (CEV) usually is years. Let's cap at 10 years for 100%. (10 -> 100, 5 -> 50, 0 -> 0)
    const normLoss = Math.min(Math.max((lossAbsorption / 10) * 100, 0), 100);
    // Equity Buffer is a percentage, usually between 0 and 1. 0.5 -> 100%
    const normEquity = Math.min(Math.max((equityBuffer / 0.5) * 100, 0), 100);
    const normSurvival = survivalIndexScore;

    let score = (normLoss * 0.35) + (normEquity * 0.35) + (normSurvival * 0.30);

    // Apply ceiling rule if any vital indicator is critical
    if (hasCritical && score > 49) {
      score = 49;
    }

    let healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'INSUFFICIENT_DATA' = 'HEALTHY';
    let primaryDriverKpi = 'Reserva Patrimonial para Choques';

    if (score >= 80) {
      healthStatus = 'EXCELLENT';
      primaryDriverKpi = 'Reserva Patrimonial para Choques';
    } else if (score >= 50) {
      healthStatus = 'HEALTHY';
      primaryDriverKpi = 'Reserva Patrimonial para Choques';
    } else if (score >= 30) {
      healthStatus = 'WARNING';
      primaryDriverKpi = 'Velocidade de Erosão Patrimonial';
    } else {
      healthStatus = 'CRITICAL';
      primaryDriverKpi = 'Índice de Sobrevivência Patrimonial';
    }

    const narrative = ExecutiveNarrativeVariations.get('PRESERVATION', healthStatus, bpSummary);
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
      confidence: 'Média'
    };
  }
}
