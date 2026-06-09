import { ExplainabilityChain } from "../../types/explainability/ExplainabilityChain";
import { getErrorMessage } from "../../types/runtime/RuntimeErrorGuards";

export class ExecutiveExplainabilityRegistry {
  static async registerChain(chain: ExplainabilityChain): Promise<void> {
    try {
      if (!chain.outputId || !chain.engineId) {
        throw new Error("Missing critical context in ExplainabilityChain");
      }
      console.log(`[ExplainabilityRegistry] Chain ${chain.chainId} registered for output ${chain.outputId} with ${chain.nodes.length} nodes`);
    } catch (err: unknown) {
      console.error("[ExplainabilityRegistry] Failed to register chain:", getErrorMessage(err));
    }
  }
}
