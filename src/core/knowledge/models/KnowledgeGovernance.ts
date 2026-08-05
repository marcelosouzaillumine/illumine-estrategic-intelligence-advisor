export interface KnowledgeGovernance {
  owner: string; // User ID or role responsible for this knowledge
  approvedBy?: string; // Executive or Advisor who validated it
  retentionPolicy: string; // E.g., 'keep_forever', 'delete_after_7_years'
  lastReviewedAt?: Date;
  classification: string; // Internal mapping for GDPR/LGPD or sector-specific rules
}
