// src/core/runtime/war-gaming/InstitutionalSurvivalThesisEngine.ts

import { InstitutionalSurvivalThesis, TreasurySurvivalProfile, CrisisPropagationNode } from './war-gaming-types';

export class InstitutionalSurvivalThesisEngine {
  public static evaluate(
    treasury: TreasurySurvivalProfile,
    nodes: CrisisPropagationNode[]
  ): InstitutionalSurvivalThesis {
    
    let score = 100;
    const evidence: string[] = [];
    let pressure: 'BAIXA' | 'MODERADA' | 'ALTA' | 'EXTREMA' = 'BAIXA';
    let status: 'PRESERVADA' | 'PRESSIONADA' | 'DETERIORADA' | 'INSUSTENTÁVEL' = 'PRESERVADA';

    if (treasury.exhaustionPointReached) {
      score -= 50;
      evidence.push('Exaustão de caixa projetada no horizonte visível.');
      pressure = 'EXTREMA';
      status = 'INSUSTENTÁVEL';
    } else if (treasury.availableRunwayMonths < 12) {
      score -= 30;
      evidence.push('Runway reduzido para menos de 12 meses.');
      pressure = 'ALTA';
      status = 'DETERIORADA';
    }

    if (treasury.criticalCovenantBreached) {
      score -= 20;
      evidence.push('Rompimento de covenants limitando funding institucional.');
      if (pressure !== 'EXTREMA') pressure = 'ALTA';
    }

    const criticalNodes = nodes.filter(n => n.severity === 'CRÍTICA' || n.severity === 'RUPTURA');
    if (criticalNodes.length > 0) {
      score -= (criticalNodes.length * 10);
      evidence.push(`Múltiplos vetores operacionais (${criticalNodes.length}) atingiram nível de ruptura estrutural.`);
      if (status === 'PRESERVADA') status = 'PRESSIONADA';
      if (pressure === 'BAIXA') pressure = 'MODERADA';
    }

    score = Math.max(0, score);

    let thesisStatement = `A tese de sobrevivência avalia resiliência institucional em ${score}/100. `;
    if (status === 'INSUSTENTÁVEL') {
      thesisStatement += 'A estrutura não demonstra capacidade natural de absorver a crise sem intervenção severa (ex: capital externo ou corte agressivo).';
    } else if (status === 'DETERIORADA') {
      thesisStatement += 'A estrutura sustenta a crise com alto desgaste, demandando proteção iminente de liquidez.';
    } else if (status === 'PRESSIONADA') {
      thesisStatement += 'A instituição absorve o choque mas incorre em pressões marginais que limitam seu crescimento e expansão.';
    } else {
      thesisStatement += 'A capacidade de sobrevivência estrutural permanece intacta perante o choque simulado.';
    }

    return {
      resilienceScore: score,
      sustainabilityStatus: status,
      fiduciaryPressureLevel: pressure,
      structuralDeteriorationEvidence: evidence,
      thesisStatement
    };
  }
}
