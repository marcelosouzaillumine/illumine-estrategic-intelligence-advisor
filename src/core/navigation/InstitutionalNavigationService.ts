import { InstitutionalNavigationReference } from '../../types/intelligence/InstitutionalNavigationReference';

/**
 * InstitutionalNavigationService
 * Centralizes the generation and execution of cross-workspace navigation references.
 * Eliminates direct window.location usage and UI-level routing logic.
 */
export class InstitutionalNavigationService {
  /**
   * Generates a fully qualified URI path from an InstitutionalNavigationReference.
   */
  static generateRoute(ref: InstitutionalNavigationReference): string {
    const objectParam = ref.targetObjectId ? `/${ref.targetObjectId}` : '';
    
    switch (ref.targetWorkspace) {
      case 'DIGITAL_TWIN':
        return `/digital-twin${objectParam}`;
      case 'INVESTIGATION':
        return `/investigation${objectParam}`;
      case 'TIME_MACHINE':
        return `/governance-time-machine${objectParam}`;
      case 'WAR_ROOM':
        return `/war-room${objectParam}`;
      case 'ADVISOR':
        return `/advisor${objectParam}`;
      case 'GOVERNANCE_FABRIC':
        return `/governance-fabric${objectParam}`;
      case 'MEMORY':
        return `/institutional-memory${objectParam}`;
      case 'EXECUTIVE_HOME':
      case 'HUB':
        return `/executive-home${objectParam}`;
      default:
        // Fallback or Fail-Closed
        return '/dashboard'; 
    }
  }

  /**
   * Executes navigation deterministically using the provided navigate function
   * (e.g., from useNavigate hook) and the Canonical Reference.
   */
  static navigate(
    navigateFn: (path: string, state?: any) => void,
    ref: InstitutionalNavigationReference
  ): void {
    const route = this.generateRoute(ref);
    // Pass the reference context to preserve Tenant Sovereignty and Lineage across workspaces
    navigateFn(route, { state: { navigationReference: ref } });
  }

  /**
   * Helper to perform external/public navigation if needed,
   * though strictly speaking, all internal navigation should use navigate().
   */
  static openExternal(url: string): void {
    window.open(url, '_blank');
  }
}
