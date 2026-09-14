import { useExecutiveUIStore } from '../../../../../packages/shell/executive-copilot/src/store/ExecutiveUIStore';

export class AdvisoryLaunchService {
  /**
   * Launches the conversational interface of the Illumine Advisory.
   * This abstracts away the underlying technical implementation (currently the Executive Copilot panel).
   */
  public static launchAdvisoryExperience(): void {
    // Record analytics event
    console.log('[Analytics] advisory_conversation_started');

    // Currently we map the Advisory Experience to the legacy Copilot panel toggle
    const store = useExecutiveUIStore.getState();
    store.setOpen(true);
  }
}
