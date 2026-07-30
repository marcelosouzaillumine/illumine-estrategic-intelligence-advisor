import { ExecutiveLivingContract } from '@illumine/executive-contracts';
import { ExecutiveAwarenessEngine } from './ExecutiveAwarenessEngine';
import { ExecutiveSignalEngine } from './ExecutiveSignalEngine';
import { ExecutiveFeedEngine } from './ExecutiveFeedEngine';
import { ExecutiveNudgeEngine } from './ExecutiveNudgeEngine';
import { ExecutiveReflectionEngine } from './ExecutiveReflectionEngine';
import { ExecutiveMomentEngine } from './ExecutiveMomentEngine';

export class ExecutiveLivingOrchestrator {
  public static buildLivingExperience(
    userId: string,
    companyId: string = 'empresa-demo',
    isRealDataAvailable: boolean = false
  ): ExecutiveLivingContract {
    const rawEvents = ExecutiveAwarenessEngine.observeEventStream(companyId);
    const signals = ExecutiveSignalEngine.convertEventsToSignals(rawEvents);
    const feed = ExecutiveFeedEngine.buildFeed(companyId, signals);
    const nudges = ExecutiveNudgeEngine.generateDiscreetNudges(companyId);
    const moments = ExecutiveMomentEngine.detectMoments(companyId, isRealDataAvailable);
    const reflection = ExecutiveReflectionEngine.buildDailyReflection();

    return {
      livingId: `liv-${userId}-${Date.now()}`,
      companyId,
      userId,
      feed,
      signals,
      nudges,
      moments,
      reflection,
      generatedAt: new Date().toISOString()
    };
  }
}
