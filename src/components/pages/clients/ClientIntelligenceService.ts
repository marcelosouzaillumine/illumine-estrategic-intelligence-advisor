export class ClientIntelligenceService {
  /**
   * Normalizes AI Analysis payload safely to avoid runtime errors and local casts in the UI.
   * Ensures the UI receives a strictly typed contract.
   */
  static normalizeAiAnalysis(formData: any): {
    hasAnalysis: boolean;
    challenges: string[];
    growthSuggestions: string[];
    governance: string;
    operationalFlow: string;
    dashboardIdeas: string[];
  } {
    const aiAnalysis = formData?.aiAnalysis;

    if (!aiAnalysis) {
      return {
        hasAnalysis: false,
        challenges: [],
        growthSuggestions: [],
        governance: 'N/A',
        operationalFlow: 'N/A',
        dashboardIdeas: []
      };
    }

    return {
      hasAnalysis: true,
      challenges: Array.isArray(aiAnalysis.challenges) ? aiAnalysis.challenges : [],
      growthSuggestions: Array.isArray(aiAnalysis.growthSuggestions) ? aiAnalysis.growthSuggestions : [],
      governance: aiAnalysis.governance || 'N/A',
      operationalFlow: aiAnalysis.operationalFlow || 'N/A',
      dashboardIdeas: Array.isArray(aiAnalysis.dashboardIdeas) ? aiAnalysis.dashboardIdeas : []
    };
  }
}
