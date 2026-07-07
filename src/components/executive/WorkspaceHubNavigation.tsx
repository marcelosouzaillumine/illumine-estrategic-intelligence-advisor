import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useWorkspaceHubNavigationViewModel } from '../../capabilities/executive/presentation/view-models/useWorkspaceHubNavigationViewModel';

export const WorkspaceHubNavigation: React.FC = () => {
  const { computed, actions } = useWorkspaceHubNavigationViewModel();

  return (
    <nav className="w-64 h-screen bg-surface-container-low border-r border-border p-4 flex flex-col gap-2">
      <div className="mb-6 px-2">
        <h2 className="text-h3 font-display font-bold text-foreground tracking-tight">Illumine</h2>
        <p className="text-eyebrow uppercase tracking-widest mt-1">Governance OS</p>
      </div>
      
      <div className="space-y-1">
        {computed.actions.map(action => {
          const isActive = computed.currentPath.startsWith(action.path);
          return (
            <button
              key={action.id}
              onClick={() => actions.handleNavigation(action)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${isActive ? 'bg-insight text-insight border border-insight' : 'text-muted-foreground hover:bg-surface-container-high hover:text-foreground border border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                {action.icon}
                <span className="font-display font-medium text-sm">{action.label}</span>
              </div>
              {isActive && <ArrowRight size={14} className="opacity-50" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

