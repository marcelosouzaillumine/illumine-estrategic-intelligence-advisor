// src/core/runtime/executive-command/ExecutiveDriftDetectionEngine.ts

import { CommandEvaluationContext } from './command-adapter';
import { ExecutiveDriftEvent, ExecutiveDirective } from './executive-command-types';

export class ExecutiveDriftDetectionEngine {
  static evaluate(context: CommandEvaluationContext, activeDirectives: ExecutiveDirective[]): ExecutiveDriftEvent[] {
    const driftEvents: ExecutiveDriftEvent[] = [];
    const timestamp = new Date().toISOString();

    if (context.historicalCyclesCount < 3) {
      return driftEvents; // Fail-closed
    }

    // Checking if there's an expansionary drift under Survival Mode
    const hasExpansionDirective = activeDirectives.find(d => d.category === 'EXPANSION_SUSPENSION');
    
    // Simplistic heuristic for drift: If FCO or Revenue grew significantly while under expansion suspension,
    // we observe a structural divergence.
    // NOTE: Does not infer management failure, just divergence between constraint and posture.
    if (hasExpansionDirective && (context.fcoGrowth > 0.15 || context.revenueGrowth > 0.20)) {
      driftEvents.push({
        id: `DRIFT-EXP-${context.lineageHash.substring(0, 8)}`,
        description: 'Observada divergência entre restrição fiduciária de sobrevivência e postura operacional de expansão.',
        severity: 'CRITICAL',
        conflictingDirective: hasExpansionDirective.id,
        observedMetric: 'revenue/fco growth',
        timestamp,
        lineageHash: context.lineageHash
      });
    }

    // Checking if liquidity is draining while under liquidity stabilization
    const hasLiquidityDirective = activeDirectives.find(d => d.category === 'LIQUIDITY_STABILIZATION');
    if (hasLiquidityDirective && context.fcoGrowth < -0.10) {
      driftEvents.push({
        id: `DRIFT-LIQ-${context.lineageHash.substring(0, 8)}`,
        description: 'Ação operacional registrada em tensão com o modo de estabilização de liquidez.',
        severity: 'HIGH',
        conflictingDirective: hasLiquidityDirective.id,
        observedMetric: 'fco decline',
        timestamp,
        lineageHash: context.lineageHash
      });
    }

    // Check capital preservation vs treasury level dropping
    const hasCapitalDirective = activeDirectives.find(d => d.category === 'CAPITAL_PRESERVATION');
    if (hasCapitalDirective && context.fundingFragility === 'CRITICAL') {
      driftEvents.push({
        id: `DRIFT-CAP-${context.lineageHash.substring(0, 8)}`,
        description: 'Desalinhamento observado: fragilidade de funding evoluindo em oposição à preservação cautelar de capital.',
        severity: 'HIGH',
        conflictingDirective: hasCapitalDirective.id,
        observedMetric: 'fundingFragility',
        timestamp,
        lineageHash: context.lineageHash
      });
    }

    return driftEvents;
  }
}
