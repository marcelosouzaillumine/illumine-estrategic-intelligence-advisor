// src/core/runtime/operational-governance/ExecutionIntegrityEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { ExecutionIntegrityState, ExecutionCapabilityConfidence } from './operational-governance-types';

export class ExecutionIntegrityEngine {
  static evaluate(context: OperationalEvaluationContext): ExecutionIntegrityState {
    
    let capabilityConfidence = 'HIGH' as ExecutionCapabilityConfidence;
    
    // Fallback unverified confidence
    if (context.historicalCyclesCount < 2 || context.ocf === 0) {
      capabilityConfidence = 'UNVERIFIABLE' as ExecutionCapabilityConfidence;
    } else if (context.historicalCyclesCount < 4) {
      capabilityConfidence = 'LOW' as ExecutionCapabilityConfidence;
    }

    let status: ExecutionIntegrityState['status'] = 'EXECUTION_STABLE';
    const strainFactors: string[] = [];

    // Evaluate strain logic only if confidence is sufficient
    if (capabilityConfidence === 'HIGH' || capabilityConfidence === 'MEDIUM') {
      const hasExpansionSuspension = context.activeExecutiveDirectives.includes('EXPANSION_SUSPENSION');
      const isExpanding = context.revenueGrowth > 0.15 || context.fcoGrowth > 0.15;

      if (hasExpansionSuspension && isExpanding) {
        status = 'EXECUTION_UNDER_COORDINATION_STRAIN';
        strainFactors.push('Crescimento sob restrição fiduciária de suspensão.');
      }

      const hasLiquidityStabilization = context.activeExecutiveDirectives.includes('LIQUIDITY_STABILIZATION');
      if (hasLiquidityStabilization && context.fcoGrowth < -0.10) {
        status = 'EXECUTION_PRESSURED';
        strainFactors.push('Degradação operacional durante modo de estabilização.');
      }

      if (context.operatingPressureSeverity === 'CRITICAL' && isExpanding) {
        status = 'EXECUTION_UNDER_STRAIN';
        strainFactors.push('Expansão insustentável perante pressão operacional crítica.');
      }
    } else {
      // Se confidence for UNVERIFIABLE/LOW, block aggressive conclusions
      status = 'EXECUTION_STABLE'; 
      if (capabilityConfidence === 'UNVERIFIABLE') {
        strainFactors.push('Avaliação retida devido à insuficiência de maturidade informacional.');
      } else {
        strainFactors.push('Integridade presumida sob baixa profundidade longitudinal.');
      }
    }

    return {
      status,
      capabilityConfidence,
      strainFactors
    };
  }
}
