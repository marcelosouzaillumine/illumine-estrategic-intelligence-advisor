// src/core/runtime/treasury-intelligence/TreasuryPriorityMatrixEngine.ts

import { TreasuryAllocationItem, TreasuryPriorityLevel } from './types';

export interface PriorityEvaluationInput {
  isSurvivabilityDegraded: boolean;
  isRunwayCritical: boolean;
  isFalseStability: boolean;
  hasPredictiveRupture: boolean;
  allocations: { id: string; category: string; amount: number; priority: TreasuryPriorityLevel }[];
  isSurvivalMode?: boolean;
}

export class TreasuryPriorityMatrixEngine {
  /**
   * Enforces the constitutional priority ranking:
   * 1. Institutional Survivability
   * 2. Operational Continuity
   * 3. Liquidity Preservation
   * 4. Debt Sustainability
   * 5. Governance Stability
   * 6. Strategic Resilience
   * 7. Sustainable Reinvestment
   * 8. Controlled Expansion
   * 9. Capital Distribution
   * 
   * And applies a cascading fiduciary restriction model to freeze or degrade lower-priority layers under stress.
   */
  public static evaluate(input: PriorityEvaluationInput): {
    priorities: TreasuryAllocationItem[];
    restrictedLayers: string[];
    activeCascadeBlock: boolean;
  } {
    const { isSurvivabilityDegraded, isRunwayCritical, isFalseStability, hasPredictiveRupture, allocations, isSurvivalMode } = input;
    
    const restrictedLayers: string[] = [];
    let activeCascadeBlock = false;
    
    // Determine cascading severity rules
    let freezeThreshold: number = 10; // Nothing frozen initially
    let degradeThreshold: number = 10;

    if (isSurvivalMode) {
      activeCascadeBlock = true;
      freezeThreshold = 2; // Freeze all priorities above 1 under survival mode
      degradeThreshold = 2;
      restrictedLayers.push(
        'Operational Continuity',
        'Liquidity Preservation',
        'Debt Sustainability',
        'Governance Stability',
        'Strategic Resilience',
        'Sustainable Reinvestment',
        'Controlled Expansion',
        'Capital Distribution'
      );
    } else if (hasPredictiveRupture || isRunwayCritical) {
      activeCascadeBlock = true;
      freezeThreshold = 5; // Freeze priorities 5, 6, 7, 8, 9 (Governance Stability down to Distribution)
      degradeThreshold = 4; // Degrade priority 4 (Debt Sustainability)
      restrictedLayers.push(
        'Governance Stability',
        'Strategic Resilience',
        'Sustainable Reinvestment',
        'Controlled Expansion',
        'Capital Distribution'
      );
    } else if (isSurvivabilityDegraded || isFalseStability) {
      activeCascadeBlock = true;
      freezeThreshold = 7; // Freeze priorities 7, 8, 9 (Reinvestment down to Distribution)
      degradeThreshold = 5; // Degrade priorities 5 and 6
      restrictedLayers.push(
        'Sustainable Reinvestment',
        'Controlled Expansion',
        'Capital Distribution'
      );
    }

    const priorities = allocations.map((alloc) => {
      let status: 'APPROVED' | 'DEGRADED' | 'FROZEN' = 'APPROVED';
      let rationale = 'Aprovado sob diretrizes normais de governança de tesouraria.';

      if (alloc.priority >= freezeThreshold) {
        status = 'FROZEN';
        rationale = `Bloqueio Compulsório: Alocação congelada na camada ${alloc.priority} devido a estresse ou instabilidade fiduciária nas camadas superiores de continuidade.`;
      } else if (alloc.priority >= degradeThreshold) {
        status = 'DEGRADED';
        rationale = `Degradação Fiduciária: Alocação rebaixada na camada ${alloc.priority} para priorizar a sobrevivência institucional básica.`;
      }

      return {
        id: alloc.id,
        category: alloc.category,
        amount: alloc.amount,
        priority: alloc.priority,
        status,
        rationale
      };
    });

    // Sort by priority (ascending, 1 is highest priority)
    priorities.sort((a, b) => a.priority - b.priority);

    return {
      priorities,
      restrictedLayers,
      activeCascadeBlock
    };
  }
}
