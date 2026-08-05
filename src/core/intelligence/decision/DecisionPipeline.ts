import { ExecutiveSession } from '../runtime/ExecutiveSession';
import { ExecutiveDecision } from '../contracts/ExecutiveIntelligenceOutput';

// Base Interfaces for Engines
export interface DecisionOptionEngine {
  process(session: ExecutiveSession, reasoningData: any): Promise<any>;
}
export interface TradeoffEngine {
  process(session: ExecutiveSession, options: any): Promise<any>;
}
export interface RecommendationEngine {
  process(session: ExecutiveSession, tradeoffs: any): Promise<any>;
}
export interface NextActionEngine {
  process(session: ExecutiveSession, recommendations: any): Promise<any>;
}

export class DecisionPipeline {
  constructor(
    private readonly decisionOptionEngine: DecisionOptionEngine,
    private readonly tradeoffEngine: TradeoffEngine,
    private readonly recommendationEngine: RecommendationEngine,
    private readonly nextActionEngine: NextActionEngine
  ) {}

  public async execute(session: ExecutiveSession, reasoningOutput: any): Promise<ExecutiveDecision> {
    // Pipeline execution:
    // 1. Generate Options
    const options = await this.decisionOptionEngine.process(session, reasoningOutput);
    // 2. Evaluate Tradeoffs
    const tradeoffs = await this.tradeoffEngine.process(session, options);
    // 3. Formulate Recommendations
    const recommendations = await this.recommendationEngine.process(session, tradeoffs);
    // 4. Define Next Actions
    const nextActions = await this.nextActionEngine.process(session, recommendations);

    return {
      decisionOptions: options || [],
      tradeOffs: tradeoffs || [],
      recommendations: recommendations || [],
      nextBestActions: nextActions || []
    };
  }
}
