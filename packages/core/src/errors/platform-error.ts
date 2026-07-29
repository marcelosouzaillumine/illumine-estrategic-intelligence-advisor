export interface PlatformErrorDetails {
  code: string;
  message: string;
  category: 'CONSTITUTION' | 'ARCHITECTURE' | 'RUNTIME' | 'SECURITY';
  severity: 'MUST' | 'SHOULD' | 'MAY';
  timestamp: string;
  context?: Record<string, any>;
}

export class PlatformError extends Error {
  public readonly code: string;
  public readonly category: PlatformErrorDetails['category'];
  public readonly severity: PlatformErrorDetails['severity'];
  public readonly timestamp: string;
  public readonly context?: Record<string, any>;

  constructor(details: PlatformErrorDetails) {
    super(`[Illumine OS ${details.category} ${details.severity}] ${details.code}: ${details.message}`);
    this.name = 'PlatformError';
    this.code = details.code;
    this.category = details.category;
    this.severity = details.severity;
    this.timestamp = details.timestamp || new Date().toISOString();
    this.context = details.context;
  }
}
