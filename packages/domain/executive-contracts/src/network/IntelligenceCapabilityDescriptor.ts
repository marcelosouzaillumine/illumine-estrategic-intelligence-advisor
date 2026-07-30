export interface IntelligenceCapabilityDescriptor {
  readonly capabilityId: string;
  readonly name: string;
  readonly version: string;
  readonly owner: string;
  readonly supportedDomains: readonly string[];
  readonly priority: number;
  readonly confidenceScore: number;
  readonly expectedLatencyMs: number;
  readonly isHealthy: boolean;
}
