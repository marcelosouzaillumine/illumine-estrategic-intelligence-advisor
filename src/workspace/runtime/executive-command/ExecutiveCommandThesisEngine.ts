// src/core/runtime/executive-command/ExecutiveCommandThesisEngine.ts

import { CommandEvaluationContext } from './command-adapter';
import { 
  ExecutiveCommandThesis, 
  ExecutiveDirective, 
  ExecutiveDriftEvent, 
  InstitutionalAlignmentState,
  StrategicOrchestration
} from './executive-command-types';

export class ExecutiveCommandThesisEngine {
  static evaluate(
    context: CommandEvaluationContext,
    directives: ExecutiveDirective[],
    driftEvents: ExecutiveDriftEvent[],
    alignment: InstitutionalAlignmentState,
    orchestration: StrategicOrchestration
  ): ExecutiveCommandThesis {
    
    if (context.historicalCyclesCount < 3) {
      return {
        thesisStatement: 'Garantia Fiduciária Ativa. Tese retida devido à falta de profundidade longitudinal.',
        structuralPosture: 'CAUTIOUS',
        confidenceLevel: 'LOW',
        lineageHash: context.lineageHash
      };
    }

    let posture: ExecutiveCommandThesis['structuralPosture'] = 'EXPANSIONARY';
    let confidence: ExecutiveCommandThesis['confidenceLevel'] = 'HIGH';

    if (context.activeSurvivalMode === 'SURVIVAL_MODE') {
      posture = 'SURVIVAL';
    } else if (context.treasuryProtectionLevel.includes('WEAK') || context.operatingPressureSeverity === 'CRITICAL') {
      posture = 'DEFENSIVE';
    } else if (alignment.overallAlignmentScore < 70) {
      posture = 'CAUTIOUS';
      confidence = 'MODERATE';
    }

    let thesisStatement = `A estrutura determina uma postura ${posture}. `;
    if (driftEvents.length > 0) {
      thesisStatement += `Divergências operacionais requerem atenção do Board.`;
    } else {
      thesisStatement += `A orquestração está em harmonia com as proteções de continuidade.`;
    }

    return {
      thesisStatement,
      structuralPosture: posture,
      confidenceLevel: confidence,
      lineageHash: context.lineageHash
    };
  }
}
