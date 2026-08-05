import { ExecutiveMemoryState } from './executive-memory-types';
import { ExecutiveAdvisoryContext } from '../executive-profile/advisory-context-types';

export class ExecutiveMemoryService {
  private static instance: ExecutiveMemoryService;
  
  // In-memory state for the MVP. Future: Connect with InstitutionalMemoryProvider
  private states = new Map<string, ExecutiveMemoryState>();

  private constructor() {}

  public static getInstance(): ExecutiveMemoryService {
    if (!ExecutiveMemoryService.instance) {
      ExecutiveMemoryService.instance = new ExecutiveMemoryService();
    }
    return ExecutiveMemoryService.instance;
  }

  public injectContext(organizationId: string, context: ExecutiveAdvisoryContext): void {
    let state = this.states.get(organizationId);
    
    if (!state) {
      state = {
        organizationId,
        activeContexts: {},
        lastInteraction: new Date().toISOString()
      };
    }

    state.activeContexts[context.domain] = context;
    state.lastInteraction = new Date().toISOString();

    this.states.set(organizationId, state);
  }

  public getMemory(organizationId: string): ExecutiveMemoryState | null {
    return this.states.get(organizationId) || null;
  }
}
