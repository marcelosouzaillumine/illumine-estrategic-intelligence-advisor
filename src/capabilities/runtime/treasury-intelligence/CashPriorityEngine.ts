// src/core/runtime/treasury-intelligence/CashPriorityEngine.ts

import { CashPriorityOutput } from './types';

export interface CashPriorityEvaluationInput {
  isSurvivabilityDegraded: boolean;
  runwayMonths: number;
  hasRuptureRisk: boolean;
}

export class CashPriorityEngine {
  /**
   * Dynamically evaluates cash prioritization based on survivability levels.
   * If survivability deteriorates, protection for payroll, operational continuity,
   * regulatory obligations, and critical suppliers escalates immediately.
   */
  public static evaluate(input: CashPriorityEvaluationInput): CashPriorityOutput {
    const { isSurvivabilityDegraded, runwayMonths, hasRuptureRisk } = input;

    let escalatedPriorityList: string[] = [];
    let payrollPriorityScore = 70;
    let criticalCapexPriorityScore = 50;
    let reserveProtectionPriorityScore = 40;

    const isCritical = runwayMonths < 6 || hasRuptureRisk;
    const isWarning = isSurvivabilityDegraded || runwayMonths < 12;

    if (isCritical) {
      // Escalated Critical State
      payrollPriorityScore = 100; // Absolute protection
      criticalCapexPriorityScore = 10; // Frozen/De-prioritized
      reserveProtectionPriorityScore = 95; // Extreme protection
      escalatedPriorityList = [
        'payroll',
        'operational_continuity',
        'regulatory_obligations',
        'critical_suppliers',
        'reserve_protection'
      ];
    } else if (isWarning) {
      // Warning/Fragile State
      payrollPriorityScore = 90;
      criticalCapexPriorityScore = 30; // Reduced priority to protect cash
      reserveProtectionPriorityScore = 75;
      escalatedPriorityList = [
        'payroll',
        'operational_continuity',
        'regulatory_obligations',
        'reserve_protection',
        'debt_service',
        'critical_suppliers'
      ];
    } else {
      // Normal/Stable State
      payrollPriorityScore = 70;
      criticalCapexPriorityScore = 60;
      reserveProtectionPriorityScore = 50;
      escalatedPriorityList = [
        'operational_continuity',
        'payroll',
        'debt_service',
        'critical_capex',
        'strategic_reserves',
        'regulatory_obligations'
      ];
    }

    return {
      escalatedPriorityList,
      payrollPriorityScore,
      criticalCapexPriorityScore,
      reserveProtectionPriorityScore
    };
  }
}
