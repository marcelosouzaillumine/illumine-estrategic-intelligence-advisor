export type RelationshipType = 
  | 'IS_A'              // Hierarchical parent (Current Ratio IS_A Liquidity Metric)
  | 'BELONGS_TO'        // Domain aggregation (Liquidity BELONGS_TO Financial Health)
  | 'MEASURES'          // Purpose (Current Ratio MEASURES Short Term Solvency)
  | 'DEPENDS_ON'        // Calculation or systemic dependency (Current Ratio DEPENDS_ON Cash)
  | 'INDICATES'         // Diagnostic symptom (Current Ratio INDICATES Ability to honor obligations)
  | 'INFLUENCES'        // Directional causation (Interest Rates INFLUENCES Cost of Debt)
  | 'CORRELATES_WITH';  // Undirected association (Employee Satisfaction CORRELATES_WITH Retention)

export interface OntologyRelationship {
  type: RelationshipType;
  targetConceptId: string;
  strength?: 'STRONG' | 'MODERATE' | 'WEAK';
  context?: string; // Optional description of when this relationship holds true
}
