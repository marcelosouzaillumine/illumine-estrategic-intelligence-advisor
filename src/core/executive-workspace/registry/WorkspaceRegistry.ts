import { WorkspaceDefinition } from '../types/ExecutiveWorkspaceMetadata';

class WorkspaceRegistryImpl {
  private workspaces = new Map<string, WorkspaceDefinition>();

  register(workspace: WorkspaceDefinition) {
    if (this.workspaces.has(workspace.id)) {
      console.warn(`Workspace [${workspace.id}] is being overwritten.`);
    }
    this.workspaces.set(workspace.id, workspace);
  }

  get(id: string): React.LazyExoticComponent<any> | React.FC<any> | null {
    const def = this.workspaces.get(id);
    return def ? def.component : null;
  }
}

export const WorkspaceRegistry = new WorkspaceRegistryImpl();
