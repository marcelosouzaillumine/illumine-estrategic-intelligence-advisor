export interface EvidenceLocator {
  systemId: string; // E.g., 'financial-data-lake'
  resourceURI: string; // E.g., 's3://bucket/dre-2026-q2.pdf'
  locationInfo?: string; // E.g., 'page 14, paragraph 2'
}
