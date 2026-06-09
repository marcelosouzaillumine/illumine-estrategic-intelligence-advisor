import React, { useState } from 'react';
import { Home, Compass, Target, History, Network, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InstitutionalNavigationService } from '../../core/navigation/InstitutionalNavigationService';
import { InstitutionalWorkspaceType, InstitutionalNavigationReference } from '../../types/intelligence/InstitutionalNavigationReference';

interface HubAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  workspaceId: InstitutionalWorkspaceType;
}

export const WorkspaceHubNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const actions: HubAction[] = [
    { id: 'hub-home', label: 'Executive Home', icon: <Home size={18} />, path: '/executive-home', workspaceId: 'EXECUTIVE_HOME' },
    { id: 'hub-twin', label: 'Digital Twin', icon: <Network size={18} />, path: '/digital-twin', workspaceId: 'DIGITAL_TWIN' },
    { id: 'hub-war-room', label: 'War Room', icon: <Target size={18} />, path: '/war-room', workspaceId: 'WAR_ROOM' },
    { id: 'hub-investigation', label: 'Investigation', icon: <Compass size={18} />, path: '/investigation', workspaceId: 'INVESTIGATION' },
    { id: 'hub-time-machine', label: 'Time Machine', icon: <History size={18} />, path: '/governance-time-machine/root', workspaceId: 'TIME_MACHINE' }
  ];

  const handleNavigation = (action: HubAction) => {
    const navRef: InstitutionalNavigationReference = {
      tenantId: 'SYSTEM_TENANT',
      sourceWorkspace: 'HUB',
      targetWorkspace: action.workspaceId,
      correlationId: `nav-${Date.now()}`
    };
    InstitutionalNavigationService.navigate(navigate, navRef);
  };

  return (
    <nav className="w-64 h-screen bg-surface-container-low border-r border-border p-4 flex flex-col gap-2">
      <div className="mb-6 px-2">
        <h2 className="text-h3 font-display font-bold text-foreground tracking-tight">Illumine</h2>
        <p className="text-eyebrow uppercase tracking-widest mt-1">Governance OS</p>
      </div>
      
      <div className="space-y-1">
        {actions.map(action => {
          const isActive = currentPath.startsWith(action.path);
          return (
            <button
              key={action.id}
              onClick={() => handleNavigation(action)}
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
