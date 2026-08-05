import { EnterpriseInsight } from '../models/enterprise-insight.types';
import { EnterpriseGraph } from '../core/graph/EnterpriseGraph';

export interface EnterpriseIntelligenceProvider {
  /**
   * Loads the active enterprise intelligence graph, including nodes and causal edges.
   */
  loadEnterpriseGraph(): Promise<EnterpriseGraph>;

  /**
   * Retrieves top critical, cross-domain insights.
   */
  getPriorityInsights(): Promise<EnterpriseInsight[]>;

  /**
   * Stores a newly discovered causal relationship or impact hypothesis.
   */
  registerInsight(insight: EnterpriseInsight): Promise<void>;
}
