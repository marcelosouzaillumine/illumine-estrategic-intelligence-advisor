import { GuidedJourneyStep } from './GuidedBoardJourneyEngine';
import { DemoScenario } from './ExecutiveDemoScenarioRegistry';

export class ExecutiveStorySequenceResolver {
  public static resolveSteps(
    actorScope: 'CFO' | 'CONSELHO' | 'FAMILY_OFFICE' | 'ADVISOR',
    scenario: DemoScenario
  ): GuidedJourneyStep[] {
    // Basic compliance checks
    if (!scenario || !scenario.scenarioId) {
      throw new Error(`STORY_RESOLVER_FAILED: Missing scenario metadata.`);
    }

    if (scenario.confidenceState === 'UNVERIFIED') {
      throw new Error(`STORY_RESOLVER_FAILED: Cannot resolve sequence for UNVERIFIED confidence level.`);
    }

    // Determine sequence based on role
    const baseSteps: GuidedJourneyStep[] = [
      'SUMMARY',
      'STRUCTURAL_TENSIONS',
      'ROOT_CAUSE',
      'PROPAGATION',
      'INSTITUTIONAL_RISKS',
      'RECOMMENDATIONS',
      'EVIDENCE_CHAIN',
      'TIMELINE',
      'FINAL_DISCLOSURE'
    ];

    // CFO focus: financial controls and evidence first
    if (actorScope === 'CFO') {
      return baseSteps; // Full diagnostic
    }

    // Conselho / Board focus: high-level synthesis, propagation risk and final disclosures
    if (actorScope === 'CONSELHO') {
      return baseSteps.filter(s => s !== 'EVIDENCE_CHAIN'); // Exclude raw evidence from presentation, but keep it in background
    }

    // Family Office focus: risks, turnaround & final disclosure
    if (actorScope === 'FAMILY_OFFICE') {
      return ['SUMMARY', 'STRUCTURAL_TENSIONS', 'ROOT_CAUSE', 'INSTITUTIONAL_RISKS', 'RECOMMENDATIONS', 'TIMELINE', 'FINAL_DISCLOSURE'];
    }

    // Advisor: All steps
    return baseSteps;
  }
}
