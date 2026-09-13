import { 
  TaxReformDiagnosis, 
  TaxReformScenario as TransitionScenario, 
  calculateTaxImpact, 
  getTransitionScenarios, 
  getStrategicRecommendations, 
  calculateReformScores,
  getNCMInsights,
  ProductInfo 
} from '../../../lib/taxIntelligence';

export class TaxReformViewModel {
  public static getTransitionScenarios(): TransitionScenario[] {
    return getTransitionScenarios();
  }

  public static calculateMetrics(diagnosis: TaxReformDiagnosis, scenario: TransitionScenario) {
    return calculateTaxImpact(diagnosis, scenario);
  }

  public static calculateRecommendations(diagnosis: TaxReformDiagnosis, metrics: any) {
    return getStrategicRecommendations(diagnosis, metrics);
  }

  public static calculateScores(diagnosis: TaxReformDiagnosis, metrics: any) {
    return calculateReformScores(diagnosis, metrics);
  }

  public static calculateNCMInsights(produtos: ProductInfo[]) {
    return getNCMInsights(produtos);
  }

  public static hasValidData(diagnosis: TaxReformDiagnosis): boolean {
    return (diagnosis.faturamentoAnual > 0) || Boolean(diagnosis.produtos && diagnosis.produtos.length > 0);
  }

  public static toContract(state: any = {}, computed: any = {}, actions: any = {}) {
    return { state, computed, actions };
  }
}
