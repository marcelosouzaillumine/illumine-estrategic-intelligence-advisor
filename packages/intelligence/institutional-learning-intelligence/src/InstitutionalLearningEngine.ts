import { InstitutionalLearningContract, InstitutionalMemoryType } from '@illumine/executive-contracts';
import { InstitutionalWisdomEngine } from './InstitutionalWisdomEngine';
import { InstitutionalMemoryLedgerEngine } from './InstitutionalMemoryLedgerEngine';

export class InstitutionalLearningEngine {
  public static processLearningCycle(
    companyId: string,
    decisionId: string,
    memoryType: InstitutionalMemoryType,
    observedDeltaPercent: number,
    causalStatement: string
  ): InstitutionalLearningContract {
    const wisdom = InstitutionalWisdomEngine.synthesizeWisdom(decisionId, memoryType, observedDeltaPercent, causalStatement);
    InstitutionalMemoryLedgerEngine.recordWisdom(wisdom);

    const storedWisdoms = InstitutionalMemoryLedgerEngine.getStoredWisdom();

    return {
      learningId: `learn-${companyId}-${Date.now()}`,
      companyId,
      wisdomObjects: storedWisdoms,
      totalWisdomCount: storedWisdoms.length,
      lastEvolutionTimestamp: new Date().toISOString()
    };
  }
}
