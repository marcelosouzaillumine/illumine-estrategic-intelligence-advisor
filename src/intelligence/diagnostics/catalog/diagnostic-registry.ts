import { ExecutiveDiagnostic } from '../core/diagnostic-contracts';
import { DiagnosticDomain } from '../core/diagnostic-types';

export class DiagnosticRegistry {
  private static readonly diagnosticsByDomain = new Map<DiagnosticDomain, ExecutiveDiagnostic>();
  private static readonly diagnosticsByJourneyId = new Map<string, ExecutiveDiagnostic>();

  /**
   * Registers a diagnostic globally within the platform architecture.
   */
  public static registerDiagnostic(diagnostic: ExecutiveDiagnostic): void {
    this.diagnosticsByDomain.set(diagnostic.domain, diagnostic);
    this.diagnosticsByJourneyId.set(diagnostic.journeyId, diagnostic);
  }

  /**
   * Finds a registered diagnostic by its core domain.
   */
  public static findByDomain(domain: DiagnosticDomain): ExecutiveDiagnostic | undefined {
    return this.diagnosticsByDomain.get(domain);
  }

  /**
   * Finds a registered diagnostic by the journey ID (used by Concierge and Routing).
   */
  public static findByJourneyId(journeyId: string): ExecutiveDiagnostic | undefined {
    return this.diagnosticsByJourneyId.get(journeyId);
  }

  /**
   * Returns all available diagnostics.
   */
  public static getAllDiagnostics(): ExecutiveDiagnostic[] {
    return Array.from(this.diagnosticsByDomain.values());
  }
}
