export interface WorkspaceMember {
  userId: string;
  role: string;
  permissions: string[];
}

export interface WorkspaceConfiguration {
  theme: 'EXECUTIVE_DARK' | 'CORPORATE_LIGHT';
  defaultDashboard: string;
  activeCapabilities: string[];
}

export interface Workspace {
  id: string;
  tenantId: string;
  organizationId: string;
  name: string;
  configuration: WorkspaceConfiguration;
  members: WorkspaceMember[];
  createdAt: string;
}

export class WorkspaceManager {
  private workspaces = new Map<string, Workspace>();

  public createWorkspace(tenantId: string, organizationId: string, name: string): Workspace {
    const ws: Workspace = {
      id: `ws-${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      organizationId,
      name,
      configuration: {
        theme: 'EXECUTIVE_DARK',
        defaultDashboard: 'ceo.dashboard',
        activeCapabilities: ['finance-intelligence', 'governance-intelligence']
      },
      members: [],
      createdAt: new Date().toISOString()
    };
    this.workspaces.set(ws.id, ws);
    return ws;
  }

  public getWorkspace(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }
}
