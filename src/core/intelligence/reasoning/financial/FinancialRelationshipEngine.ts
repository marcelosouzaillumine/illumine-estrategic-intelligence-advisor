export interface FinancialContext {
  liquidity: 'High' | 'Medium' | 'Low';
  debt: 'High' | 'Medium' | 'Low';
  cashConcentration: 'High' | 'Medium' | 'Low';
  workingCapital: 'Positive' | 'Negative' | 'Neutral';
  inventoryConcentration?: 'High' | 'Medium' | 'Low';
}

export interface FinancialRelationship {
  relationship: string;
  possibleImpact: string;
  confidence: number;
}

export class FinancialRelationshipEngine {
  /**
   * Identifies complex relationships between isolated financial metrics.
   */
  public evaluate(context: FinancialContext): FinancialRelationship[] {
    const relationships: FinancialRelationship[] = [];

    // 1. Conservative Capital Structure
    if (context.liquidity === 'High' && context.debt === 'Low' && context.cashConcentration === 'High') {
      relationships.push({
        relationship: 'Conservative Capital Structure',
        possibleImpact: 'Capital Efficiency Opportunity',
        confidence: 0.95
      });
    }

    // 2. Aggressive Capital Structure
    if (context.liquidity === 'Low' && context.debt === 'High') {
      relationships.push({
        relationship: 'Aggressive Leverage',
        possibleImpact: 'High Solvency Risk',
        confidence: 0.88
      });
    }

    // 3. Operational Cash Drag
    if (context.inventoryConcentration === 'High' && context.liquidity === 'Medium') {
      relationships.push({
        relationship: 'Heavy Operational Asset Drag',
        possibleImpact: 'Reduced Cash Conversion Velocity',
        confidence: 0.82
      });
    }

    return relationships;
  }
}
