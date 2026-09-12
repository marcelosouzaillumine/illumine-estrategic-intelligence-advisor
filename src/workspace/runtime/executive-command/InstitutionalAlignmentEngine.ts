// src/core/runtime/executive-command/InstitutionalAlignmentEngine.ts

import { CommandEvaluationContext } from './command-adapter';
import { InstitutionalAlignmentState, ExecutiveDriftEvent, ExecutiveDirective } from './executive-command-types';

export class InstitutionalAlignmentEngine {
  static evaluate(context: CommandEvaluationContext, directives: ExecutiveDirective[], driftEvents: ExecutiveDriftEvent[]): InstitutionalAlignmentState {
    
    if (context.historicalCyclesCount < 3) {
      return {
        overallAlignmentScore: 0,
        treasuryAlignment: 'DIVERGENT',
        growthAlignment: 'DIVERGENT',
        continuityAlignment: 'DIVERGENT',
        alignmentNarrative: 'Alinhamento retido devido à insuficiência de ciclos longitudinais.'
      };
    }

    let treasuryAlignment: InstitutionalAlignmentState['treasuryAlignment'] = 'ALIGNED';
    let growthAlignment: InstitutionalAlignmentState['growthAlignment'] = 'ALIGNED';
    let continuityAlignment: InstitutionalAlignmentState['continuityAlignment'] = 'ALIGNED';

    // Measure Treasury Alignment
    if (driftEvents.some(d => d.conflictingDirective?.includes('DIR-CAP-PRES') || d.conflictingDirective?.includes('DIR-LIQ-STAB'))) {
      treasuryAlignment = 'CRITICAL_TENSION';
    } else if (context.treasuryProtectionLevel.includes('WEAK') || context.fundingFragility === 'HIGH') {
      treasuryAlignment = 'DIVERGENT';
    }

    // Measure Growth Alignment
    if (driftEvents.some(d => d.conflictingDirective?.includes('DIR-EXP-SUSP'))) {
      growthAlignment = 'CRITICAL_TENSION';
    } else if (context.activeSurvivalMode === 'SURVIVAL_MODE' && context.fcoGrowth > 0.05) {
      growthAlignment = 'DIVERGENT';
    }

    // Measure Continuity Alignment
    if (treasuryAlignment === 'CRITICAL_TENSION' && growthAlignment === 'CRITICAL_TENSION') {
      continuityAlignment = 'CRITICAL_TENSION';
    } else if (context.activeSurvivalMode === 'SURVIVAL_MODE' || context.operatingPressureSeverity === 'CRITICAL') {
      continuityAlignment = 'DIVERGENT';
    }

    // Score deduction based on tension
    let score = 100;
    if (treasuryAlignment === 'DIVERGENT') score -= 15;
    if (treasuryAlignment === 'CRITICAL_TENSION') score -= 30;
    if (growthAlignment === 'DIVERGENT') score -= 15;
    if (growthAlignment === 'CRITICAL_TENSION') score -= 30;
    if (continuityAlignment === 'DIVERGENT') score -= 10;
    if (continuityAlignment === 'CRITICAL_TENSION') score -= 20;

    score = Math.max(0, score);

    let narrative = 'Sincronia adequada entre expansão operacional e restrições fiduciárias.';
    if (score < 50) {
      narrative = 'Severa dissonância entre o perfil de expansão e a capacidade institucional estrutural.';
    } else if (score < 80) {
      narrative = 'Divergências pontuais demandam alinhamento do comitê executivo com as limitações de caixa e tesouraria.';
    }

    return {
      overallAlignmentScore: score,
      treasuryAlignment,
      growthAlignment,
      continuityAlignment,
      alignmentNarrative: narrative
    };
  }
}
