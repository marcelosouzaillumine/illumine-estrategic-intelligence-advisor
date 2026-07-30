export interface DecisionLedgerContract {
  readonly ledgerRecordId: string;
  readonly decisionId: string;
  readonly companyId: string;
  readonly decidedByRole: string; // ex: 'Conselho Executivo & CEO'
  readonly timestamp: string;
  readonly participatingAgents: readonly string[];
  readonly supportingEvidenceIds: readonly string[];
  readonly rejectedAlternatives: readonly string[];
  readonly winningScenario: string;
  readonly immutableHash: string;
}
