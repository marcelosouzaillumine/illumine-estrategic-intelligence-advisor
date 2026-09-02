import { WorkspaceContext } from '../workspace/workspace-context';

export interface RoleLandingDefinition {
  role: string;
  context: WorkspaceContext;
  surfaceId?: string;
  fallbackRoute: string; // Used if surfaceId is missing or if it's a non-executive context
}

export const ROLE_LANDING_REGISTRY: Record<string, RoleLandingDefinition> = {
  // Executive Offices
  'CEO': {
    role: 'CEO',
    context: 'EXECUTIVE',
    surfaceId: 'ceo.executive-overview',
    fallbackRoute: '/executive/workspace/ceo-office/ceo.executive-overview'
  },
  'CFO': {
    role: 'CFO',
    context: 'EXECUTIVE',
    surfaceId: 'cfo.financial-performance',
    fallbackRoute: '/executive/workspace/cfo-office/cfo.financial-performance'
  },
  'COO': {
    role: 'COO',
    context: 'EXECUTIVE',
    surfaceId: 'coo.executive-overview',
    fallbackRoute: '/executive/workspace/coo-office/coo.executive-overview'
  },
  'Commercial': {
    role: 'Commercial',
    context: 'EXECUTIVE',
    surfaceId: 'commercial.revenue-intelligence',
    fallbackRoute: '/executive/workspace/commercial-office/commercial.revenue-intelligence'
  },
  'People': {
    role: 'People',
    context: 'EXECUTIVE',
    surfaceId: 'people.workforce-intelligence',
    fallbackRoute: '/executive/workspace/people-office/people.workforce-intelligence'
  },
  'Innovation': {
    role: 'Innovation',
    context: 'EXECUTIVE',
    surfaceId: 'innovation.innovation-intelligence',
    fallbackRoute: '/executive/workspace/innovation-office/innovation.innovation-intelligence'
  },
  'Governance': {
    role: 'Governance',
    context: 'EXECUTIVE',
    surfaceId: 'governance.executive-overview',
    fallbackRoute: '/executive/workspace/governance-office/governance.executive-overview'
  },
  'Risk': {
    role: 'Risk',
    context: 'EXECUTIVE',
    surfaceId: 'risk.risk-intelligence',
    fallbackRoute: '/executive/workspace/risk-office/risk.risk-intelligence'
  },
  
  // Board
  'Board Member': {
    role: 'Board Member',
    context: 'EXECUTIVE',
    surfaceId: 'governance.board-intelligence',
    fallbackRoute: '/executive/workspace/governance-office/governance.board-intelligence'
  },

  // Mentorship Layer
  'Mentor': {
    role: 'Mentor',
    context: 'MENTOR',
    fallbackRoute: '/mentor/workspace'
  },
  'Mentee': {
    role: 'Mentee',
    context: 'MENTEE',
    fallbackRoute: '/mentee/workspace'
  },

  // Partner Layer
  'Advisor': {
    role: 'Advisor',
    context: 'ADVISOR',
    fallbackRoute: '/advisor/workspace'
  },

  // Client Layer
  'Client Executive': {
    role: 'Client Executive',
    context: 'CLIENT',
    fallbackRoute: '/client/workspace'
  },

  // Administration Layer
  'Admin': {
    role: 'Admin',
    context: 'ADMINISTRATION',
    fallbackRoute: '/administration/workspace'
  },

  // Platform Layer
  'Platform Revenue': {
    role: 'Platform Revenue',
    context: 'PLATFORM',
    surfaceId: 'platform.revenue-center',
    fallbackRoute: '/platform/workspace/revenue-center'
  },
  'Platform Partner': {
    role: 'Platform Partner',
    context: 'PLATFORM',
    surfaceId: 'platform.partner-center',
    fallbackRoute: '/platform/workspace/partner-center'
  }
};
