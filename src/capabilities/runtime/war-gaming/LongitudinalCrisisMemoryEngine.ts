// src/core/runtime/war-gaming/LongitudinalCrisisMemoryEngine.ts

import { InstitutionalWarGameScenario, WarGameResult } from './war-gaming-types';

export class LongitudinalCrisisMemoryEngine {
  private static mockMemory: any[] = [];

  /**
   * Append-only memory of crisis scenarios run by the board.
   */
  public static persistScenario(result: WarGameResult): boolean {
    
    const record = {
      timestamp: new Date().toISOString(),
      scenarioId: result.scenario.scenarioId,
      baselineHash: result.scenario.baselineHash,
      lineageHash: result.explainability.lineageHash,
      crisisInputs: result.scenario.crisisInputs,
      thesis: result.thesis,
      treasuryRunway: result.treasurySurvival.availableRunwayMonths
    };

    // In a real system, this writes to Firestore / Ledger in an append-only transaction.
    this.mockMemory.push(record);
    
    return true;
  }

  public static getHistoricalCrises(): any[] {
    return [...this.mockMemory];
  }

  public static clearMemoryForTests(): void {
    if (process.env.NODE_ENV === 'test' || (typeof process !== 'undefined' && process.argv.some(a => a.includes('test')))) {
      this.mockMemory = [];
    }
  }
}
