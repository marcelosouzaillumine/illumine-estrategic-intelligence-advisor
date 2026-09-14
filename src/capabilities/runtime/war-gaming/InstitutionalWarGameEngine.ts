// src/core/runtime/war-gaming/InstitutionalWarGameEngine.ts

import { CrisisInput, InstitutionalWarGameScenario, WarGameResult } from './war-gaming-types';
import { InstitutionalCollapseConstraintEngine } from './InstitutionalCollapseConstraintEngine';
import { InstitutionalCollapsePropagationEngine } from './InstitutionalCollapsePropagationEngine';
import { TreasuryWarRoomEngine } from './TreasuryWarRoomEngine';
import { InstitutionalSurvivalThesisEngine } from './InstitutionalSurvivalThesisEngine';
import { CrisisExplainabilityEngine } from './CrisisExplainabilityEngine';
import { LongitudinalCrisisMemoryEngine } from './LongitudinalCrisisMemoryEngine';

export class InstitutionalWarGameEngine {
  public static executeScenario(
    scenarioId: string,
    baselineHash: string,
    inputs: CrisisInput[],
    baselineContext: {
      hasDFC: boolean;
      hasValidCash: boolean;
      hasValidFunding: boolean;
      initialCash: number;
      receita: number;
      margemContribuicaoPct: number;
      custosFixos: number;
      ebitda: number;
      prazoMedioFornecedores: number;
      estoques: number;
      simulatedMonthlyCashFlow: number;
      covenantThresholds: { minEbitda: number; minCash: number };
    }
  ): WarGameResult {
    
    // 1. Validation and Constraints (Fail-Closed)
    const constraintCheck = InstitutionalCollapseConstraintEngine.validateCrisisInputs(inputs);
    if (!constraintCheck.valid) {
      throw new Error(`FIDUCIARY_VIOLATION: ${constraintCheck.violations.join(' | ')}`);
    }

    const dataIntegrityCheck = InstitutionalCollapseConstraintEngine.enforceBaselineDataIntegrity(
      baselineContext.hasDFC,
      baselineContext.hasValidCash,
      baselineContext.hasValidFunding
    );
    if (!dataIntegrityCheck.allowed) {
      throw new Error(`FIDUCIARY_VIOLATION: ${dataIntegrityCheck.reason}`);
    }

    // 2. Scenario Initialization
    const scenario: InstitutionalWarGameScenario = {
      scenarioId,
      baselineHash,
      crisisInputs: inputs,
      status: 'EXECUTING'
    };

    // 3. Propagation & Domino Effect
    const nodes = InstitutionalCollapsePropagationEngine.propagate(inputs, baselineContext);

    // Assume some impact on cash flow based on the crisis inputs
    let adjustedCashFlow = baselineContext.simulatedMonthlyCashFlow;
    let adjustedEbitda = baselineContext.ebitda;
    nodes.forEach(n => {
      if (n.variable === 'EBITDA') {
        adjustedEbitda = n.simulatedValue;
        // simplistic conversion
        adjustedCashFlow -= (n.baselineValue - n.simulatedValue) / 12;
      }
    });

    // 4. Treasury & Survival Mapping
    const treasurySurvival = TreasuryWarRoomEngine.mapSurvival(
      baselineContext.initialCash,
      adjustedCashFlow,
      baselineContext.covenantThresholds,
      adjustedEbitda
    );

    // 5. Institutional Thesis
    const thesis = InstitutionalSurvivalThesisEngine.evaluate(treasurySurvival, nodes);

    // 6. Explainability & Lineage
    // Mock simple lineage hash based on scenario and inputs
    const lineageHash = `L-HASH-${scenarioId}-${Date.now()}`;
    scenario.simulationHash = `S-HASH-${baselineHash}-${inputs.length}`;
    scenario.status = 'COMPLETED';

    const explainability = CrisisExplainabilityEngine.generateProfile(
      scenario.simulationHash,
      lineageHash,
      nodes,
      thesis,
      treasurySurvival
    );

    const result: WarGameResult = {
      scenario,
      propagation: nodes,
      treasurySurvival,
      thesis,
      explainability
    };

    // 7. Persist to Fiduciary Memory
    LongitudinalCrisisMemoryEngine.persistScenario(result);

    return result;
  }
}
