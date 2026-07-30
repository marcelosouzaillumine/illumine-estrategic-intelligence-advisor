export interface ExecutiveBriefingContract {
  readonly briefingId: string;
  readonly role: 'CLIENT' | 'ADVISOR' | 'BOARD' | 'PARTNER' | 'MASTER_ADMIN';
  readonly headlineText: string;
  readonly contextText: string;
  readonly operationalStatus: 'STABLE' | 'ATTENTION_REQUIRED' | 'CRITICAL';
  readonly generatedAt: string;
}
