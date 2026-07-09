import React from 'react';
import { Network, Search, Target, Database, History, Compass, ArrowRight } from 'lucide-react';
import { InstitutionalWorkspaceType } from '../../types/intelligence/InstitutionalNavigationReference';
import { useNavigationAdapter } from '../../adapters/ui/useNavigationAdapter';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  targetWorkspace: InstitutionalWorkspaceType;
  path: string;
  color: string;
}

export const ExecutiveQuickActions: React.FC = () => {
  const { navigateToWorkspace } = useNavigationAdapter();

  const handleAction = (action: QuickAction) => {
    navigateToWorkspace(action.targetWorkspace);
  };

  const actions: QuickAction[] = [
    {
      id: 'qa-twin',
      label: 'Digital Twin',
      icon: <Network size={20} />,
      targetWorkspace: 'DIGITAL_TWIN',
      path: '/digital-twin',
      color: 'text-accent bg-accent border-accent hover:bg-accent'
    },
    {
      id: 'qa-war-room',
      label: 'War Room',
      icon: <Target size={20} />,
      targetWorkspace: 'WAR_ROOM',
      path: '/war-room',
      color: 'text-amber-400 bg-warning-soft0/10 border-amber-500/20 hover:bg-warning-soft0/20'
    },
    {
      id: 'qa-time-machine',
      label: 'Time Machine',
      icon: <History size={20} />,
      targetWorkspace: 'TIME_MACHINE',
      path: '/governance-time-machine/root',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20'
    },
    {
      id: 'qa-advisor',
      label: 'Advisor Parecer',
      icon: <Compass size={20} />,
      targetWorkspace: 'ADVISOR',
      path: '/advisor',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20 hover:bg-teal-500/20'
    }
  ];

  return (
    <div className="card-premium">
      <h3 className="text-eyebrow uppercase mb-4 flex items-center gap-2">
        <ArrowRight size={16} /> Ações Rápidas
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className={`flex flex-col items-start gap-3 p-4 rounded-[20px] border transition-colors text-left ${action.color}`}
          >
            {action.icon}
            <span className="font-display font-medium text-sm text-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
