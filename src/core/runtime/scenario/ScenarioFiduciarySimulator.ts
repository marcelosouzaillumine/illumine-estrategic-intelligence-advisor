import { ScenarioSimulationInput, ScenarioSimulationResult } from './ScenarioTypes';
import { ScenarioSnapshotBuilder } from './ScenarioSnapshotBuilder';
import { InstitutionalShockSimulator } from './InstitutionalShockSimulator';
import { ScenarioPropagationRuntime } from './ScenarioPropagationRuntime';
import { ScenarioConfidenceProjector } from './ScenarioConfidenceProjector';
import { ScenarioNarrativeEngine } from './ScenarioNarrativeEngine';
import { ScenarioExecutionLogger } from './ScenarioExecutionLogger';
import { ScenarioRegistry } from './ScenarioRegistry';
import { DataAccessContext } from '../../security/data-access-context';

export class ScenarioFiduciarySimulator {
  /**
   * Orquestrador Mestre do Laboratório de Cenários.
   * Isolado, Fiduciário, e Seguro (Non-Mutating sobre dados reais).
   */
  static async runSimulation(
    input: ScenarioSimulationInput & { isSurvivalMode?: boolean },
    historicalConfidence: 'HIGH' | 'MEDIUM' | 'LOW',
    context?: DataAccessContext,
    isSurvivalMode?: boolean
  ): Promise<ScenarioSimulationResult> {
    const executionId = crypto.randomUUID();
    const scenarioId = crypto.randomUUID();
    
    await ScenarioExecutionLogger.logEvent(executionId, 'SCENARIO_STARTED');

    // 1. Snapshotting (Isolamento de Memória Absoluto)
    const snapshotHash = ScenarioSnapshotBuilder.generateHash(input.baseSnapshot);
    const isolatedSnapshot = ScenarioSnapshotBuilder.buildClone(input.baseSnapshot);

    // 2. Shock Application (Matemática Preditiva)
    await ScenarioExecutionLogger.logEvent(executionId, 'APPLYING_SHOCKS');
    const stressedSnapshot = InstitutionalShockSimulator.applyShocks(isolatedSnapshot, input.shocks);

    // 3. Propagation & Stress Testing
    await ScenarioExecutionLogger.logEvent(executionId, 'RUNNING_PROPAGATION');
    const propagation = ScenarioPropagationRuntime.run(stressedSnapshot, input.horizonMonths);

    // 4. Confidence Projection
    const projectedConfidence = ScenarioConfidenceProjector.project(historicalConfidence, propagation);

    // Fiduciary Check for Distribution Shocks in Scenarios
    let finalConfidence = projectedConfidence;
    let fiduciarySeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let fiduciaryViolation: string | undefined = undefined;

    const hasDistributionShock = input.shocks.some(s => {
      const desc = (s.description || '').toLowerCase();
      const type = (s.type || '').toLowerCase();
      return desc.includes('divid') || desc.includes('distrib') || desc.includes('payout') || desc.includes('socio') || desc.includes('retirada') || type.includes('dividend') || type.includes('distribution') || type.includes('partner') || type.includes('withdrawal');
    });

    const hasCapexShock = input.shocks.some(s => {
      const desc = (s.description || '').toLowerCase();
      const type = (s.type || '').toLowerCase();
      return desc.includes('capex') || desc.includes('expansão') || desc.includes('investimento') || type.includes('capex') || type.includes('expansion');
    });

    const hasExpansionShock = input.shocks.some(s => {
      const desc = (s.description || '').toLowerCase();
      const type = (s.type || '').toLowerCase();
      return desc.includes('expans') || desc.includes('crescimento') || type.includes('expansion');
    });

    const hasHiringShock = input.shocks.some(s => {
      const desc = (s.description || '').toLowerCase();
      const type = (s.type || '').toLowerCase();
      return desc.includes('hiring') || desc.includes('contrat') || type.includes('hiring');
    });

    if (hasDistributionShock || hasCapexShock || hasExpansionShock || hasHiringShock) {
      let totalNetIncome = 0;
      for (const entityId of Object.keys(isolatedSnapshot.dreByEntity)) {
        const dre = isolatedSnapshot.dreByEntity[entityId] || [];
        for (const line of dre) {
          const cat = (line.category || '').toLowerCase();
          if (cat.includes('lucro liquido') || cat.includes('lucro do exercicio') || cat.includes('resultado liquido')) {
            totalNetIncome += line.value;
          }
        }
      }

      let totalEndingEquity = 0;
      let totalStartingEquity = 0;
      for (const entityId of Object.keys(isolatedSnapshot.bpByEntity)) {
        const bp = isolatedSnapshot.bpByEntity[entityId] || [];
        for (const line of bp) {
          const cat = (line.category || '').toLowerCase();
          if (cat.includes('patrimonio liquido') || cat.includes('pl fim')) {
            totalEndingEquity += line.value;
          }
          if (cat.includes('pl inicio') || cat.includes('saldo inicial')) {
            totalStartingEquity += line.value;
          }
        }
      }
      if (totalStartingEquity <= 0) totalStartingEquity = totalEndingEquity;

      const preservationIndex = totalStartingEquity > 0 ? totalEndingEquity / totalStartingEquity : 1.0;
      const isTreasuryStressed = propagation.stressResult.groupSolvencyStatus === 'INSOLVENT' || propagation.stressResult.groupSolvencyStatus === 'AT_RISK';
      const negativeFCO = totalNetIncome <= 0;
      const plEroded = preservationIndex < 0.50;
      const runwayCritico = propagation.stressResult.monthsToLiquidityCrisis < 3 || propagation.stressResult.groupSolvencyStatus === 'INSOLVENT';

      if (hasDistributionShock) {
        // Check amount
        const proposedPayoutAmount = input.shocks
          .filter(s => {
            const desc = (s.description || '').toLowerCase();
            const type = (s.type || '').toLowerCase();
            return desc.includes('divid') || desc.includes('distrib') || desc.includes('payout') || type.includes('dividend') || type.includes('distribution') || type.includes('payout');
          })
          .reduce((sum, s) => sum + s.magnitude, 0);

        const hasDividendsExceedingGeneration = negativeFCO || proposedPayoutAmount > totalNetIncome;
        const hasDistributionErosion = plEroded;
        const hasPayoutStressed = isTreasuryStressed;

        if (hasDividendsExceedingGeneration || hasDistributionErosion || hasPayoutStressed) {
          finalConfidence = 'CRITICAL_STRESS';
          fiduciarySeverity = 'CRITICAL';
          fiduciaryViolation = 'INVALID_FIDUCIARY_DISTRIBUTION';
        }
      }

      if (hasCapexShock && !fiduciaryViolation) {
        // O bloqueio deve ocorrer apenas quando o Capex:
        // 1. consumir caixa próprio sob estresse;
        // 2. ampliar risco de continuidade;
        // 3. não possuir funding dedicado;
        // 4. ocorrer com FCO negativo;
        // 5. ocorrer com PL severamente erodido;
        // 6. reduzir runway operacional abaixo do limite fiduciário mínimo.
        const hasFundingDedicated = input.shocks.some(s => {
          const desc = (s.description || '').toLowerCase();
          return desc.includes('funding') || desc.includes('aporte') || desc.includes('dedicado') || desc.includes('captação');
        });

        const consumesStressedCash = isTreasuryStressed || propagation.stressResult.estimatedCashBurnRate > 0;
        const amplifiesContinuityRisk = finalConfidence === 'CRITICAL_STRESS' || propagation.stressResult.groupSolvencyStatus === 'INSOLVENT';
        const reducesRunwayBelowLimit = runwayCritico;

        if (
          consumesStressedCash ||
          amplifiesContinuityRisk ||
          !hasFundingDedicated ||
          negativeFCO ||
          plEroded ||
          reducesRunwayBelowLimit
        ) {
          finalConfidence = 'CRITICAL_STRESS';
          fiduciarySeverity = 'CRITICAL';
          fiduciaryViolation = 'AGGRESSIVE_CAPEX_FROM_STRESSED_CASH';
        }
      }

      // ISHE Survival conflict override (Constraint 3)
      const isSurvivalActive = !!isSurvivalMode || !!input.isSurvivalMode;

      const isExpansionUnderSurvival = hasExpansionShock && (negativeFCO || runwayCritico || plEroded);
      const isDividendUnderTreasury = hasDistributionShock && isTreasuryStressed;
      const isCapexUnderRunwayCollapse = hasCapexShock && runwayCritico;
      const isHiringUnderLiquidityFragility = hasHiringShock && (isTreasuryStressed || runwayCritico);

      // IRAE Constraint: Resilience Adjustment
      const isFragile = input.resilienceClassification === 'INSTITUTIONALLY_FRAGILE';
      const isAntifragile = input.resilienceClassification === 'ANTIFRAGILE' || input.resilienceClassification === 'ADAPTIVE';

      // Faster invalidation for fragile orgs
      if (isFragile && !fiduciaryViolation) {
        if (hasExpansionShock || hasCapexShock || hasDistributionShock) {
          finalConfidence = 'LOW';
          fiduciarySeverity = 'CRITICAL';
          fiduciaryViolation = 'INVALID_RESILIENCE_FRAGILITY';
        }
      }

      if (isSurvivalActive && (hasCapexShock || hasExpansionShock || hasDistributionShock || hasHiringShock)) {
        finalConfidence = 'LOW';
        fiduciarySeverity = 'CRITICAL';
        fiduciaryViolation = 'INVALID_SURVIVAL_CONFLICT';
      } else if (isExpansionUnderSurvival || isDividendUnderTreasury || isCapexUnderRunwayCollapse || isHiringUnderLiquidityFragility) {
        // Antifragile entities have broader tolerance for some combinations, but cannot bypass fiduciary blocks (like capex with runway collapse)
        if (isAntifragile && !isCapexUnderRunwayCollapse && !isDividendUnderTreasury) {
           // Allow mild shocks like hiring under liquidity fragility if antifragile
        } else {
          finalConfidence = 'LOW';
          fiduciarySeverity = 'CRITICAL';
          fiduciaryViolation = 'INVALID_SURVIVAL_CONFLICT';
        }
      }

      // IRRE Constraint: Premature Recovery Validation
      if (input.recoveryAuthorized === false && !fiduciaryViolation) {
        if (hasExpansionShock || hasCapexShock || hasHiringShock) {
          finalConfidence = 'LOW';
          fiduciarySeverity = 'CRITICAL';
          fiduciaryViolation = 'INVALID_PREMATURE_RECOVERY';
        }
      }

      // RRG Constraint: Recovery Regression Override
      if (input.regressionDetected === true && !fiduciaryViolation) {
        if (hasExpansionShock || hasCapexShock || hasHiringShock || hasDistributionShock) {
          finalConfidence = 'LOW';
          fiduciarySeverity = 'CRITICAL';
          fiduciaryViolation = 'INVALID_RECOVERY_REGRESSION';
        }
      }
    }

    // 5. Executive Narrative
    const narrative = ScenarioNarrativeEngine.generateNarrative(input.shocks, propagation, finalConfidence);

    const result: ScenarioSimulationResult = {
      scenarioId,
      groupId: input.baseSnapshot.groupId,
      executionId,
      timestamp: new Date().toISOString(),
      shocksApplied: input.shocks,
      historicalConfidence,
      projectedConfidence: finalConfidence,
      institutionalStress: propagation.stressResult,
      narrative,
      runtimeVersion: '1.0.0-phase8',
      snapshotHash,
      fiduciarySeverity,
      fiduciaryViolation,
      scenarioValidity: fiduciaryViolation === 'INVALID_SURVIVAL_CONFLICT' ? 'INVALID_SURVIVAL_CONFLICT' : (fiduciaryViolation === 'INVALID_PREMATURE_RECOVERY' ? 'INVALID_PREMATURE_RECOVERY' : (fiduciaryViolation === 'INVALID_RECOVERY_REGRESSION' ? 'INVALID_RECOVERY_REGRESSION' : (fiduciaryViolation === 'INVALID_RESILIENCE_FRAGILITY' ? 'INVALID_RESILIENCE_FRAGILITY' : 'VALID')))
    };

    // 6. Persistência Auditável High-Level
    if (context) {
      await ScenarioRegistry.registerScenario(context, result, propagation.propagatedViolations);
    }
    
    await ScenarioExecutionLogger.logEvent(executionId, 'SCENARIO_COMPLETED');

    return result;
  }
}
