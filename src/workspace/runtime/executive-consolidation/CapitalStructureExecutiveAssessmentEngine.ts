import { ExecutiveAssessmentResult } from './LiquidityExecutiveAssessmentEngine';
import { ExecutiveNarrativeVariations } from './ExecutiveNarrativeVariations';

export class CapitalStructureExecutiveAssessmentEngine {
  public static assess(indicators: any[], bpSummary: any): ExecutiveAssessmentResult {
    const findValue = (name: string) => Number(indicators?.find(i => i.metricName === name)?.value || 0);
    
    // Estrutura de Capital: autonomia 35%, endividamento geral 25%, dependência de terceiros 25%, composição CP/LP 15%.
    const autonomia = findValue('Autonomia Financeira');
    const endividamentoGeral = findValue('Endividamento Geral');
    const dependenciaTerceiros = findValue('Dependência de Capital de Terceiros');
    
    const passivoTotal = bpSummary?.passivoTotal || 1;
    const passivoCirculante = bpSummary?.passivoCirculante || 0;
    const compCPLP = passivoCirculante / passivoTotal;
    
    // Normalize heuristically
    const normAutonomia = Math.min(Math.max(autonomia, 0), 100);
    
    // endividamentoGeral: lower is better. Let's assume <= 20% is excellent (100 pts), >= 100% is 0 pts.
    const normEndiv = Math.min(Math.max((1 - (endividamentoGeral / 100)) * 100, 0), 100);
    
    // Dependencia de terceiros (multiplier): < 0.3 is low, > 1.0 is high
    const normDep = Math.min(Math.max((1 - (dependenciaTerceiros / 1.0)) * 100, 0), 100);
    
    // Lower short term debt composition is generally better for structural safety
    const normComp = Math.min(Math.max((1 - compCPLP) * 100, 0), 100);

    let score = (normAutonomia * 0.35) + (normEndiv * 0.25) + (normDep * 0.25) + (normComp * 0.15);
    
    // Zero Semantic Contradiction / Override Rules
    if (endividamentoGeral <= 20 && dependenciaTerceiros <= 0.30) {
      score = Math.max(score, 85); // Force into EXCELLENT/HEALTHY
    }
    
    let healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'INSUFFICIENT_DATA' = 'HEALTHY';
    let primaryDriverKpi = 'Autonomia Financeira';

    if (score >= 80) {
      healthStatus = 'EXCELLENT';
      primaryDriverKpi = 'Autonomia Financeira';
    } else if (score >= 50) {
      healthStatus = 'HEALTHY';
      primaryDriverKpi = 'Endividamento Geral';
    } else if (score >= 30) {
      healthStatus = 'WARNING';
      primaryDriverKpi = 'Dependência de Capital de Terceiros';
    } else {
      healthStatus = 'CRITICAL';
      primaryDriverKpi = 'Endividamento Geral';
    }

    // Secondary overrides for semantic consistency
    if (dependenciaTerceiros <= 0.30 && healthStatus === 'WARNING') {
       healthStatus = 'HEALTHY';
       score = Math.max(score, 50);
       primaryDriverKpi = 'Autonomia Financeira';
    }

    if (dependenciaTerceiros > 1.0) {
      if (healthStatus === 'EXCELLENT' || healthStatus === 'HEALTHY') {
        healthStatus = 'WARNING';
        score = Math.min(score, 49);
      }
      primaryDriverKpi = 'Dependência de Capital de Terceiros';
    }

    const narrative = ExecutiveNarrativeVariations.get('CAPITAL_STRUCTURE', healthStatus, bpSummary);
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
