import { ExecutiveOpinion } from '@illumine/executive-contracts';

export class OpinionAggregator {
  public static aggregateOpinions(opinions: ExecutiveOpinion[]): {
    consolidatedSummary: string;
    combinedRisks: string[];
    combinedOpportunities: string[];
  } {
    const combinedRisks = Array.from(new Set(opinions.flatMap(o => o.keyRisks)));
    const combinedOpportunities = Array.from(new Set(opinions.flatMap(o => o.keyOpportunities)));

    return {
      consolidatedSummary: `Consolidação de ${opinions.length} pareceres executivos independentes.`,
      combinedRisks,
      combinedOpportunities
    };
  }
}
