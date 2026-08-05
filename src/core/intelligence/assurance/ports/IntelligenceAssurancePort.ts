import { IntelligenceAssuranceResult } from '../contracts/IntelligenceAssuranceResult';
import { ExecutiveIntelligenceOutput } from '../../contracts/ExecutiveIntelligenceOutput';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

/**
 * Port for integrating Assurance Engines into the Intelligence Layer.
 * Validates both Data Integrity and Intelligence Reasoning.
 */
export interface IntelligenceAssurancePort {
  /**
   * Assures the data integrity before financial engines run.
   */
  assureDataIntegrity(data: NormalizedBalanceSheet): IntelligenceAssuranceResult;

  /**
   * Assures the reasoning (logic and narrative) after financial engines run.
   */
  assureIntelligenceReasoning(
    output: ExecutiveIntelligenceOutput,
    dataIntegrityResult: IntelligenceAssuranceResult,
    data: NormalizedBalanceSheet
  ): IntelligenceAssuranceResult;
}
