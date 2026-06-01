// src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts

import { TreasuryStressOutput } from './types';
import { RuntimeSeverity } from '../shared/runtime-contracts';

export interface StressSimulationInput {
  availableCash: number;
  normalizedMonthlyCashBurn: number;
  receivables: number;
  inventory: number;
  payables: number;
  shortTermDebt: number;
}

export class TreasuryStressEngine {
  /**
   * Simulates a cumulative stress propagation scenario over the treasury baseline.
   * Cumulative shocks from 7 categories:
   * 1. Receivables delay (Atraso de recebíveis)
   * 2. Margin compression (Compressão de margem)
   * 3. Financing restriction (Restrição de financiamento)
   * 4. Operational burn escalation (Escalada de queima operacional)
   * 5. Customer concentration shock (Choque de concentração de clientes)
   * 6. Supplier dependency disruption (Ruptura em fornecedores críticos)
   * 7. Refinancing blockage (Bloqueio de rolagem/refinanciamento)
   */
  public static evaluate(input: StressSimulationInput): TreasuryStressOutput {
    const {
      availableCash,
      normalizedMonthlyCashBurn,
      receivables,
      inventory,
      payables,
      shortTermDebt
    } = input;

    const activeStressFactors: string[] = [
      'receivables_delay',
      'margin_compression',
      'financing_restriction',
      'operational_burn_escalation',
      'customer_concentration_shock',
      'supplier_dependency_disruption',
      'refinancing_blockage'
    ];

    // Initialize simulated cash and burn rate
    let simulatedCash = availableCash;
    let simulatedMonthlyBurn = normalizedMonthlyCashBurn > 0 ? normalizedMonthlyCashBurn : 5000; // minimal burn fallback

    // 1. Receivables Delay Shock: 30% of receivables are delayed and don't hit cash
    const receivablesShock = receivables * 0.3;
    simulatedCash -= receivablesShock;

    // 2. Margin Compression & 4. Operational Burn Escalation:
    // Cumulatively increases the monthly burn rate by 40% (20% compression + 20% escalation)
    simulatedMonthlyBurn = simulatedMonthlyBurn * 1.40;

    // 5. Customer Concentration Shock: Loss of a major client causes immediate cash outflow of 15% of annual revenue/burn
    const customerShock = simulatedMonthlyBurn * 1.8; // ~2 months of burn
    simulatedCash -= customerShock;

    // 6. Supplier Dependency Disruption: Forced prepayment of 40% of payables
    const supplierShock = payables * 0.4;
    simulatedCash -= supplierShock;

    // 7. Refinancing Blockage & 3. Financing Restriction:
    // Blocked rollover forces repayment of 50% of short term debt immediately
    const debtRepaymentShock = shortTermDebt * 0.5;
    simulatedCash -= debtRepaymentShock;

    // Ensure cash doesn't go below 0 during simulation bounds
    const baselineExhausted = simulatedCash <= 0;
    if (simulatedCash < 0) {
      simulatedCash = 0;
    }

    // Calculate exhaustion days under cumulative stress
    let cumulativeExhaustionDays = 0;
    const dailySimulatedBurn = simulatedMonthlyBurn / 30;

    if (baselineExhausted) {
      cumulativeExhaustionDays = 0;
    } else if (dailySimulatedBurn > 0) {
      cumulativeExhaustionDays = Math.round((simulatedCash / dailySimulatedBurn) * 10) / 10;
    } else {
      cumulativeExhaustionDays = 999.0;
    }

    // Determine Stress Severity
    let stressSeverity: RuntimeSeverity = 'STABLE';
    if (cumulativeExhaustionDays < 45 || baselineExhausted) {
      stressSeverity = 'CRITICAL';
    } else if (cumulativeExhaustionDays < 120) {
      stressSeverity = 'HIGH';
    } else if (cumulativeExhaustionDays < 270) {
      stressSeverity = 'MODERATE';
    } else {
      stressSeverity = 'STABLE';
    }

    const simulatedExhaustionProjected = cumulativeExhaustionDays < 120 || baselineExhausted;

    return {
      stressSeverity,
      cumulativeExhaustionDays,
      activeStressFactors,
      simulatedExhaustionProjected
    };
  }
}
