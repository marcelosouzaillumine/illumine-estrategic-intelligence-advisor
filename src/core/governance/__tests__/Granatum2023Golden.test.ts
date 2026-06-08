import { describe, it, expect } from 'vitest';
import { BalanceSheetTemporalIntegrityGuard } from '../../runtime/governance/bp/BalanceSheetTemporalIntegrityGuard';
import { BalanceSheetNarrativeBindingAudit } from '../../runtime/governance/bp/BalanceSheetNarrativeBindingAudit';
import { FinancialStatementBoundaryGuard } from '../../runtime/governance/bp/FinancialStatementBoundaryGuard';
import { BalanceSheetFiduciaryConsistencyEngine } from '../../runtime/governance/bp/BalanceSheetFiduciaryConsistencyEngine';
import { BalanceSheetGovernanceOutput } from '../../runtime/governance/bp/BalanceSheetGovernanceOutput';
import { PatrimonialIndicator } from '../../runtime/governance/bp/BalanceSheetFinancialMetricsEngine';

describe('BSTINCF v1.0 - Granatum 2023 Golden Test', () => {
  it('should validate BP temporal integrity and boundary preservation for Granatum 2023', () => {
    const output: BalanceSheetGovernanceOutput = {
      exerciseYear: 2023,
      sourceStatement: 'BALANCE_SHEET',
      indicators: {
        solvencyStatus: 'HEALTHY',
        liquidityStatus: 'HEALTHY', // Liquidity strong
        leverageStatus: 'HEALTHY', // Leverage low
        capitalPreservationStatus: 'ATTENTION' // Partially preserved due to accumulated losses
      },
      dominantBpRestriction: null, // No critical patrimonial restriction
      primaryRecommendation: {
        source: 'BALANCE_SHEET',
        text: 'Preserve solvency discipline and optimize capital allocation due to high liquidity and low leverage.',
        rationale: ['Capital is formally preserved.']
      },
      secondaryAdvisories: [
        {
          source: 'DFC',
          text: 'Contextual advisory originating from DFC: Cash conversion must be monitored due to negative operating cash flow.',
          severity: 'INFO'
        }
      ],
      validation: {
        severity: 'OK' as 'INFO',
        findings: [],
        consistencyScore: 100
      },
      explainability: {
        origin: 'golden_test',
        indicatorsUsed: ['Liquidez Geral', 'Debt-to-Equity', 'Loss Absorption Capacity'],
        weightsApplied: {},
        reason: 'Granatum 2023 Validation'
      }
    };

    // 1. Check Temporal Integrity (Must pass without throwing)
    expect(() => {
      BalanceSheetTemporalIntegrityGuard.verifyOutput(2023, output);
    }).not.toThrow();

    // 2. Check Boundary Guard
    const boundaryCheck = FinancialStatementBoundaryGuard.checkBoundaries(
      output.dominantBpRestriction,
      output.primaryRecommendation.text,
      output.secondaryAdvisories
    );

    // It should not be blocked by boundary violation
    expect(boundaryCheck.severity).not.toBe('BLOCKING');

    // It should specifically not mention forbidden terms like 'queima de caixa' in the primary recommendation
    const drcKeywords = ['caixa', 'queima de caixa', 'dfc', 'dre', 'margem líquida'];
    for (const kw of drcKeywords) {
      expect(output.primaryRecommendation.text.toLowerCase()).not.toContain(kw);
    }

    // 3. Fiduciary Consistency
    const consistencyCheck = BalanceSheetFiduciaryConsistencyEngine.validateConsistency(
      { 'Liquidez Geral': 1.5, 'PL': 100000, 'CEV': 0 },
      'Solvência Saudável',
      'Ativos superam passivos.',
      output.primaryRecommendation.text
    );
    expect(consistencyCheck.severity).not.toBe('BLOCKING');

    // 4. Check forbidden historical narrative contamination
    const narrativeBindingCheck = BalanceSheetNarrativeBindingAudit.audit(
      output.primaryRecommendation.text,
      [],
      2023
    );
    expect(narrativeBindingCheck.severity).not.toBe('BLOCKING');
    
    // Simulate failing case (Granatum 2022 temporal leak)
    const badOutput: BalanceSheetGovernanceOutput = {
      ...output,
      primaryRecommendation: {
        ...output.primaryRecommendation,
        text: 'Based on 2022 indicators, we recommend...'
      }
    };

    expect(() => {
      BalanceSheetTemporalIntegrityGuard.verifyOutput(2023, badOutput);
    }).toThrow('[TEMPORAL_INTEGRITY_VIOLATION]');
  });
});
