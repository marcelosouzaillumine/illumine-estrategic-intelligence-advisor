import { ExplainabilityOutput } from '../shared/runtime-contracts';
import { ExplainabilityLevel } from '../shared/runtime-constitutional-types';

export class ExplainabilityEngine {
  private causalChains: string[][] = [];
  private narrativeLineage: string[] = [];
  private blockedNarratives: string[] = [];
  private stabilityScore: number = 100;

  public registerCausalChain(chain: string[]) {
    this.causalChains.push(chain);
  }

  public registerNarrative(narrative: string, blocked: boolean = false) {
    if (blocked) {
      this.blockedNarratives.push(narrative);
    } else {
      this.narrativeLineage.push(narrative);
    }
  }

  public degradeStability(amount: number) {
    this.stabilityScore -= amount;
    if (this.stabilityScore < 0) this.stabilityScore = 0;
  }

  public getOutput(): ExplainabilityOutput {
    // Semantic Adapter: mapping legacy tracking into the new canonical contract
    return {
      structuralDrivers: this.causalChains.map(chain => chain[0] || 'Unknown Driver'),
      propagationChains: this.causalChains.map(chain => chain.join(' -> ')),
      evidence: [...this.narrativeLineage, ...this.blockedNarratives.map(n => `[BLOCKED] ${n}`)],
      confidenceDecomposition: {
        'Stability Score': this.stabilityScore.toString(),
        'Blocked Nodes': this.blockedNarratives.length.toString()
      },
      lineageReferences: [],
      level: this.stabilityScore > 80 ? 'DETERMINISTIC' : this.stabilityScore > 50 ? 'HEURISTIC' : 'UNVERIFIABLE'
    };
  }
}
