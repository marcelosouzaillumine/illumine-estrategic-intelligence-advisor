import { InstitutionalNavigationService } from '../navigation/InstitutionalNavigationService';
import { InstitutionalNavigationReference } from '../../types/intelligence/InstitutionalNavigationReference';

/**
 * Motor de Navegação Institucional.
 * Centraliza as rotas absolutas do Governance Operating System.
 * Garante que a transição entre Twin, Investigation e Time Machine seja determinística.
 */
export class AdvisorNavigationEngine {
  
  static navigateToOrganization(navigateFn: (path: string, state?: any) => void, tenantId: string, organizationId: string): void {
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'ADVISOR',
      targetWorkspace: 'ADVISOR',
      tenantId,
      targetObjectId: organizationId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }

  static navigateToDigitalTwin(navigateFn: (path: string, state?: any) => void, tenantId: string, domainId?: string): void {
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'ADVISOR',
      targetWorkspace: 'DIGITAL_TWIN',
      tenantId,
      targetObjectId: domainId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }

  static navigateToInvestigation(navigateFn: (path: string, state?: any) => void, tenantId: string, nodeId: string): void {
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'ADVISOR',
      targetWorkspace: 'INVESTIGATION',
      tenantId,
      targetObjectId: nodeId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }

  static navigateToHistoricalTimeline(navigateFn: (path: string, state?: any) => void, tenantId: string, timelineId: string): void {
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'ADVISOR',
      targetWorkspace: 'TIME_MACHINE',
      tenantId,
      targetObjectId: timelineId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }

  static navigateToBoardPack(navigateFn: (path: string, state?: any) => void, tenantId: string, boardSessionId: string): void {
    // Rota hipotética do Board Pack
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'ADVISOR',
      targetWorkspace: 'DIGITAL_TWIN', // Defaulting since BOARD_PACK isn't in WorkspaceType
      tenantId,
      targetObjectId: boardSessionId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }
}
