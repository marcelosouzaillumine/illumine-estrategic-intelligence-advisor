import { ExecutiveNarrative } from '../types';
import { ExecutiveNarrativePolicy } from '../ExecutiveNarrativePolicy';
import { ExecutiveSessionContext } from './ExecutiveSessionContext';

export class BoardModeGuard {
  /**
   * Fail-closed absolute validation for Board Mode rendering.
   * Prevents graceful degradation.
   */
  static assertSafeRendering(narrative: ExecutiveNarrative, sessionId: string): void {
    if (!narrative) throw new Error('BOARD_GUARD_BLOCKED: Narrative missing.');
    if (!sessionId) throw new Error('BOARD_GUARD_BLOCKED: Session ID missing.');

    const session = ExecutiveSessionContext.getSession(sessionId);

    // 1. Disclosure State Check
    if (session.disclosureState !== 'ACKNOWLEDGED') {
      throw new Error('BOARD_GUARD_BLOCKED: Mandatory disclosure not acknowledged.');
    }

    // 2. Strict properties check (Fail-Closed)
    if (!narrative.sourceRuntime) throw new Error('BOARD_GUARD_BLOCKED: Missing sourceRuntime.');
    if (!narrative.lineage || narrative.lineage.length === 0) throw new Error('BOARD_GUARD_BLOCKED: Missing lineage.');
    if (!narrative.confidence) throw new Error('BOARD_GUARD_BLOCKED: Missing confidence.');
    if (!narrative.evidenceChain || narrative.evidenceChain.length === 0) throw new Error('BOARD_GUARD_BLOCKED: Missing evidenceChain.');

    // 3. Hash Integrity Check
    if (narrative.sourceRuntime !== 'EXECUTIVE_WORKSPACE_RUNTIME') {
      if (!ExecutiveNarrativePolicy.verifyIntegrity(narrative)) {
        throw new Error('BOARD_GUARD_BLOCKED: Narrative Hash verification failed. Mutation detected.');
      }
    }

    // 4. Additional confidence barrier
    if (narrative.confidence === 'UNVERIFIED') {
      throw new Error('BOARD_GUARD_BLOCKED: Cannot render UNVERIFIED confidence in Board Mode.');
    }
  }
}
