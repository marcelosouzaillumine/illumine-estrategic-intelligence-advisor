// src/core/runtime/strategic-intelligence/StrategicNarrativeComposer.ts

import { StrategicEvaluationContext, StrategicPosture, InstitutionalVectorDirection, LongitudinalTrajectoryStatus, ExpansionSustainability, CapitalStrategyAlignment, StrategicContradiction } from './strategic-intelligence-types';

export class StrategicNarrativeComposer {
  static composeThesis(
    context: StrategicEvaluationContext,
    posture: StrategicPosture,
    primaryVector: InstitutionalVectorDirection,
    trajectory: LongitudinalTrajectoryStatus,
    sustainability: ExpansionSustainability,
    alignment: CapitalStrategyAlignment,
    contradictions: StrategicContradiction[]
  ): string {
    
    if (context.metadata.historicalCyclesCount < 2) {
      return 'Base longitudinal insuficiente para formulação de tese estratégica estrutural. Aguardando consolidação histórica.';
    }

    let thesis = 'Direção Institucional observada: ';

    switch(posture) {
      case 'EXPANSION_POSTURE': thesis += 'Foco em expansão. '; break;
      case 'PRESERVATION_POSTURE': thesis += 'Preservação de capital e proteção de liquidez. '; break;
      case 'STABILIZATION_POSTURE': thesis += 'Estabilização operacional após período de variação. '; break;
      case 'RESTRICTION_POSTURE': thesis += 'Atuação sob forte restrição fiduciária ou operacional. '; break;
      case 'CONTINUITY_POSTURE': thesis += 'Foco defensivo na continuidade operacional primária. '; break;
      default: thesis += 'Indefinida. '; break;
    }

    if (trajectory === 'TRAJECTORY_STABLE') {
      thesis += 'Trajetória longitudinal estável. ';
    } else if (trajectory === 'TRAJECTORY_PRESSURED' || trajectory === 'TRAJECTORY_SENSITIVE') {
      thesis += 'Trajetória demonstra sinais de sensibilidade estrutural. ';
    } else if (trajectory === 'TRAJECTORY_UNSTABLE') {
      thesis += 'Trajetória com alta divergência direcional. ';
    }

    if (!alignment.isCoherent) {
      thesis += 'Foi detectado um desalinhamento entre a alocação de capital e as restrições vigentes. ';
    }

    if (!sustainability.isSustainable && posture === 'EXPANSION_POSTURE') {
      thesis += 'A expansão observada apresenta baixa sustentabilidade financeira ou estrutural (' + sustainability.rationale + '). ';
    }

    if (contradictions.length > 0) {
      thesis += `Existem tensões estratégicas estruturais não resolvidas (${contradictions.length} registradas).`;
    } else {
      thesis += 'Alinhamento direcional íntegro, sem contradições observáveis ativas.';
    }

    return thesis.trim();
  }
}
