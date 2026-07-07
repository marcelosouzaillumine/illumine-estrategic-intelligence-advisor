import React from 'react';
import { Home, Compass, Target, History, Network } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WorkspaceHubNavigationApplicationService } from '../../application/WorkspaceHubNavigationApplicationService';
import { InstitutionalWorkspaceType, InstitutionalNavigationReference } from '../../../../types/intelligence/InstitutionalNavigationReference';
import { useInstitutionalContext } from '../../../../hooks/useInstitutionalContext';

export interface HubAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  workspaceId: InstitutionalWorkspaceType;
}

export interface WorkspaceHubNavigationState {
  // Empty state for Dumb Renderer compatibility if needed
}

export interface WorkspaceHubNavigationComputed {
  currentPath: string;
  tenantId: string;
  actions: HubAction[];
}

export interface WorkspaceHubNavigationActions {
  handleNavigation: (action: HubAction) => void;
}

export interface WorkspaceHubNavigationViewModel {
  state: WorkspaceHubNavigationState;
  computed: WorkspaceHubNavigationComputed;
  actions: WorkspaceHubNavigationActions;
}

export function useWorkspaceHubNavigationViewModel(): WorkspaceHubNavigationViewModel {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId } = useInstitutionalContext();

  const currentPath = location.pathname;

  const actions: HubAction[] = [
    { id: 'hub-home', label: 'Executive Home', icon: React.createElement(Home, { size: 18 }), path: '/executive-home', workspaceId: 'EXECUTIVE_HOME' },
    { id: 'hub-twin', label: 'Digital Twin', icon: React.createElement(Network, { size: 18 }), path: '/digital-twin', workspaceId: 'DIGITAL_TWIN' },
    { id: 'hub-war-room', label: 'War Room', icon: React.createElement(Target, { size: 18 }), path: '/war-room', workspaceId: 'WAR_ROOM' },
    { id: 'hub-investigation', label: 'Investigation', icon: React.createElement(Compass, { size: 18 }), path: '/investigation', workspaceId: 'INVESTIGATION' },
    { id: 'hub-time-machine', label: 'Time Machine', icon: React.createElement(History, { size: 18 }), path: '/governance-time-machine/root', workspaceId: 'TIME_MACHINE' }
  ];

  const handleNavigation = (action: HubAction) => {
    const currentNavRef = location.state?.navigationReference || location.state?.navRef;
    
    const navRef: InstitutionalNavigationReference = {
      tenantId: tenantId || currentNavRef?.tenantId || 'SYSTEM_TENANT',
      sourceWorkspace: 'HUB',
      targetWorkspace: action.workspaceId,
      correlationId: currentNavRef?.correlationId || `nav-${Date.now()}`,
      lineageId: currentNavRef?.lineageId
    };
    
    WorkspaceHubNavigationApplicationService.navigate(navigate, navRef);
  };

  return {
    state: {},
    computed: {
      currentPath,
      tenantId: tenantId || 'SYSTEM_TENANT',
      actions
    },
    actions: {
      handleNavigation
    }
  };
}
