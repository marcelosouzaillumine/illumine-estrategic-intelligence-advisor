import { FinancialRelationship } from './FinancialRelationshipEngine';

export interface FinancialHypothesis {
  hypothesis: string;
  confidence: number;
  evidence: string[];
}

export class FinancialHypothesisEngine {
  /**
   * Formulates hypotheses based on identified financial relationships.
   */
  public generate(relationships: FinancialRelationship[]): FinancialHypothesis[] {
    const hypotheses: FinancialHypothesis[] = [];

    for (const rel of relationships) {
      if (rel.relationship === 'Conservative Capital Structure') {
        hypotheses.push({
          hypothesis: 'Capital accumulation without proportional reinvestment',
          confidence: rel.confidence - 0.08, // Inferential decay
          evidence: [
            'High cash concentration',
            'Low leverage',
            'High liquidity'
          ]
        });
      }

      if (rel.relationship === 'Heavy Operational Asset Drag') {
        hypotheses.push({
          hypothesis: 'Inventory accumulation exceeding sales velocity',
          confidence: rel.confidence - 0.1,
          evidence: [
            'Inventory represents significant portion of assets',
            'Working capital is heavily tied up in operations'
          ]
        });
      }
      
      if (rel.relationship === 'Aggressive Leverage') {
         hypotheses.push({
           hypothesis: 'Growth financed primarily through external debt',
           confidence: rel.confidence - 0.05,
           evidence: [
             'High reliance on third-party capital',
             'Constrained short-term liquidity'
           ]
         });
      }
    }

    return hypotheses.sort((a, b) => b.confidence - a.confidence);
  }
}
