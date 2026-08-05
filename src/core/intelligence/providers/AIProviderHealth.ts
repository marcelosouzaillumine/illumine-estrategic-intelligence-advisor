export interface AIProviderHealth {
  provider: string; // e.g. 'openai'
  available: boolean;
  latencyMs: number;
  lastSuccessfulCall: Date;
  failureRate: number; // 0.0 to 1.0 representing failure percentage over time
}
