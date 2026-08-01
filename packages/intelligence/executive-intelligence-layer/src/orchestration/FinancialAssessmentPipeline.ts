import { FinancialIntegrityEngine } from '../integrity/FinancialIntegrityEngine';
import { ExecutiveFinancialStateClassifier } from '../integrity/ExecutiveFinancialStateClassifier';
import { ExecutiveFinancialState } from '../contracts/ExecutiveFinancialState';

export class FinancialAssessmentPipeline {
  /**
   * Lê a realidade: Executa validadores e emite o Estado Financeiro.
   */
  public static run(financialData: any, historicalData?: any[]): { state: ExecutiveFinancialState, integrityInfo: any } {
    // 1. Raw Data -> Validators
    const integrity = FinancialIntegrityEngine.validate(financialData, historicalData);
    
    // 2. Integrity -> State
    const state = ExecutiveFinancialStateClassifier.classify({
      integrityStatus: integrity.status,
      earningsQuality: { classification: 'MODERATE', score: 70, drivers: [] }, // Mock from validator return
      cashConversion: { status: 'HEALTHY', conversionRate: 0.8 }, // Mock
      solvency: { status: 'STABLE', liquidityRatio: 1.5, equityToAssets: 0.5, thirdPartyDependence: 0.5, workingCapital: 1000000, alerts: [] }, // Mock
      executiveRiskLevel: 'LOW',
      narrativePermission: 'FULL'
    });

    return { state, integrityInfo: integrity };
  }
}
