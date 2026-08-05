import { DiagnosticRegistry } from './diagnostic-registry';
import { FinancialDiagnosticJourney } from '../financial/financial-diagnostic';
import { GovernanceDiagnosticJourney } from '../governance/governance-diagnostic';
import { SampleDiagnosticJourney } from '../sample-domain/sample-diagnostic';

/**
 * Initializes and registers all Executive Diagnostic Journeys.
 * Call this once during application bootstrap (e.g., in App.tsx or a provider).
 */
export function registerAllDiagnostics(): void {
  const financialJourney = new FinancialDiagnosticJourney();
  DiagnosticRegistry.registerDiagnostic(financialJourney.descriptor);

  const governanceJourney = new GovernanceDiagnosticJourney();
  DiagnosticRegistry.registerDiagnostic(governanceJourney.descriptor);

  const sampleJourney = new SampleDiagnosticJourney();
  DiagnosticRegistry.registerDiagnostic(sampleJourney.descriptor);
}
