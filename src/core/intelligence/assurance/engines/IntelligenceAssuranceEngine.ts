import { IntelligenceAssurancePort } from '../ports/IntelligenceAssurancePort';
import { IntelligenceAssuranceResult, ValidationIssue } from '../contracts/IntelligenceAssuranceResult';
import { ExecutiveIntelligenceOutput } from '../../contracts/ExecutiveIntelligenceOutput';
import { DataIntegrityAssurance } from './DataIntegrityAssurance';
import { FinancialLogicAssurance } from './FinancialLogicAssurance';
import { NarrativeAssurance } from './NarrativeAssurance';
import { ConfidenceEngine } from './ConfidenceEngine';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

export class IntelligenceAssuranceEngine implements IntelligenceAssurancePort {
  
  public assureDataIntegrity(data: NormalizedBalanceSheet): IntelligenceAssuranceResult {
    return DataIntegrityAssurance.validate(data);
  }

  public assureIntelligenceReasoning(
    output: ExecutiveIntelligenceOutput,
    dataIntegrityResult: IntelligenceAssuranceResult,
    data: NormalizedBalanceSheet
  ): IntelligenceAssuranceResult {
    const timestamp = new Date();

    const logicIssues = FinancialLogicAssurance.validate(output, data);
    const narrativeIssues = NarrativeAssurance.validate(output);

    const allIssues: ValidationIssue[] = [
      ...dataIntegrityResult.issues,
      ...logicIssues,
      ...narrativeIssues
    ];

    const hasCritical = allIssues.some(i => i.severity === 'CRITICAL');
    const hasWarning = allIssues.some(i => i.severity === 'WARNING');

    let status: 'VALID' | 'WARNING' | 'FAILED' = 'VALID';
    if (hasCritical) status = 'FAILED';
    else if (hasWarning) status = 'WARNING';

    const confidence = ConfidenceEngine.calculate(
      dataIntegrityResult.status,
      dataIntegrityResult.issues,
      logicIssues,
      narrativeIssues
    );

    const result: IntelligenceAssuranceResult = {
      status,
      confidence,
      issues: allIssues,
      validations: {
        mathematical: dataIntegrityResult.validations.mathematical,
        accounting: logicIssues.filter(i => i.severity === 'CRITICAL').length === 0,
        narrative: narrativeIssues.filter(i => i.severity === 'CRITICAL').length === 0,
      },
      provenance: {
        source: 'IntelligenceAssuranceEngine',
        rulesApplied: [
          ...dataIntegrityResult.provenance.rulesApplied,
          'Financial Logic Assurances',
          'Executive Narrative Governance'
        ],
        validatedAt: timestamp.toISOString()
      },
      timestamp
    };

    return result;
  }
}
