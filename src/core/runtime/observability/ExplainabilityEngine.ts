import { ExplainabilityOutput } from './observability-types';

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
    return {
      causalChains: this.causalChains,
      narrativeLineage: this.narrativeLineage,
      blockedNarratives: this.blockedNarratives,
      stabilityScore: this.stabilityScore
    };
  }
}
