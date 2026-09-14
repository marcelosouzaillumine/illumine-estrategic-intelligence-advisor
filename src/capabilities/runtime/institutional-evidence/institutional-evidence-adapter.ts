import { mapReportToInstitutionalEvidenceInput } from '../../../lib/institutional-outcomes-mapper';
import { buildInstitutionalOutcomesDatabase } from '../../../lib/institutional-outcomes-engine';
import { InstitutionalOutcomeRecord } from '../../../lib/institutional-outcomes-types';

export function runInstitutionalEvidenceAdapter(
  reportWithExecutiveSovereignty: any,
  existingRecords: InstitutionalOutcomeRecord[] = []
): any {
  // 1. Map incoming intelligence and existing history into the Evidence Input
  const evidenceInput = mapReportToInstitutionalEvidenceInput(
    existingRecords,
    reportWithExecutiveSovereignty
  );

  // 2. Process through the deterministic outcomes engine
  const institutionalOutcomes = buildInstitutionalOutcomesDatabase(evidenceInput);

  // 3. Return the payload safely, without mutating or scoring the base intelligence
  return {
    ...reportWithExecutiveSovereignty,
    ...(institutionalOutcomes && { institutionalOutcomes })
  };
}
