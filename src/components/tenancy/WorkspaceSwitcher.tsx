import React, { useEffect, useState } from 'react';
import { useTenancy } from '../../context/TenancyProvider';
import { AdvisorWorkspaceManager } from '../../core/runtime/tenancy/AdvisorWorkspaceManager';
import { Workspace } from '../../core/runtime/tenancy/TenancyTypes';
import { BriefcaseBusiness, ChevronDown } from 'lucide-react';

export function WorkspaceSwitcher() {
  const { context, switchWorkspace, loading } = useTenancy();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (context) {
      AdvisorWorkspaceManager.listAvailableWorkspaces(context.activeTenantId).then(setWorkspaces);
    }
  }, [context]);

  if (!context || loading) return <div className="text-xs text-muted-foreground animate-pulse">Carregando Workspace...</div>;

  const activeWs = workspaces.find(w => w.workspaceId === context.activeWorkspaceId);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-surface-container border border-border px-3 py-1.5 rounded-md hover:bg-neutral/10 transition-colors"
      >
        <BriefcaseBusiness size={16} className="text-primary" />
        <span className="text-sm font-medium text-foreground">{activeWs?.workspaceName || 'Select Workspace'}</span>
        <ChevronDown size={14} className="text-muted-foreground ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-50 py-2">
          <div className="px-3 pb-2 mb-2 border-b border-border text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Seus Clientes (Workspaces)
          </div>
          {workspaces.map(ws => (
            <button
              key={ws.workspaceId}
              onClick={() => {
                switchWorkspace(ws.workspaceId, ws.groupId);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary/10 hover:text-secondary transition-colors ${
                ws.workspaceId === context.activeWorkspaceId ? 'font-bold text-secondary bg-secondary/5' : 'text-foreground'
              }`}
            >
              {ws.workspaceName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
