// src/core/runtime/operational-governance/InstitutionalDependencyEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { InstitutionalDependencyRisk } from './operational-governance-types';

export class InstitutionalDependencyEngine {
  static evaluate(context: OperationalEvaluationContext): InstitutionalDependencyRisk[] {
    const dependencies: InstitutionalDependencyRisk[] = [];

    if (context.historicalCyclesCount < 2) {
      return dependencies;
    }

    if (context.fundingFragility === 'CRITICAL' || context.fundingFragility === 'HIGH') {
      dependencies.push({
        id: `DEP-FUNDING-${context.lineageHash.substring(0,8)}`,
        category: 'FUNDING',
        description: 'Dependência estrutural de linhas de crédito externas para manutenção do ciclo de caixa.',
        severity: context.fundingFragility === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
      });
    }

    if (context.activeSurvivalMode === 'SURVIVAL_MODE' && context.fcoGrowth < 0) {
      dependencies.push({
        id: `DEP-LIQ-${context.lineageHash.substring(0,8)}`,
        category: 'LIQUIDITY_CONCENTRATION',
        description: 'Alta dependência da conversão imediata de recebíveis frente à queima operacional.',
        severity: 'CRITICAL'
      });
    }

    // Heurística baseada em crescimento rápido sem caixa
    if (context.revenueGrowth > 0.20 && context.ocf <= 0) {
      dependencies.push({
        id: `DEP-FLOW-${context.lineageHash.substring(0,8)}`,
        category: 'OPERATIONAL_FLOW',
        description: 'Dependência do volume absoluto para justificar margens; alavancagem operacional sensível.',
        severity: 'MODERATE'
      });
    }

    return dependencies;
  }
}
