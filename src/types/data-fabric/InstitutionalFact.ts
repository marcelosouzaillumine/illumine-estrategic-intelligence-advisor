/**
 * Um Fato Institucional é uma afirmação inegável, rastreável e datada na história da organização.
 * Toda a memória, evidência e camada observacional atua sobre estes fatos.
 * Exemplo: "Liquidez Corrente caiu abaixo de 1,0", "Conselho aprovou expansão".
 */
export interface InstitutionalFact {
  factId: string;
  tenantId: string;
  organizationId: string;
  statement: string;
  factType: 'DECISION' | 'RISK_EVENT' | 'METRIC_CHANGE' | 'COMPLIANCE_EVENT' | 'EXTERNAL_EVENT';
  occurredAt: string;
  recordedAt: string;
  sourceArtifactIds: string[]; // Referências a InstitutionalArtifact
  confidenceLevel: 'VERIFIED' | 'SYSTEM_GENERATED' | 'ASSERTED';
}
