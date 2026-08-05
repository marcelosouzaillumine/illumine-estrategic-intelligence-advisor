import { ExecutiveAdvisoryContext } from '../executive-profile/advisory-context-types';

export interface ExecutiveMemoryState {
  organizationId: string;
  activeContexts: Record<string, ExecutiveAdvisoryContext>;
  lastInteraction: string;
}
