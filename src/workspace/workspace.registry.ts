import { WorkspaceDefinition } from './types';
import { CFO_WORKSPACE } from './cfo/cfo.workspace';

export const WORKSPACE_REGISTRY: Record<string, WorkspaceDefinition> = {
  [CFO_WORKSPACE.officeId]: CFO_WORKSPACE
};

export function getWorkspaceDefinition(officeId: string): WorkspaceDefinition | undefined {
  return WORKSPACE_REGISTRY[officeId];
}
