import { InstitutionalNavigationService } from '../navigation/InstitutionalNavigationService';
import { InstitutionalNavigationReference } from '../../types/intelligence/InstitutionalNavigationReference';

/**
 * Motor de Navegação Observacional para Cenários.
 * Permite pular entre cenário, impacto, evidência e risco sem simular novos caminhos causais.
 */
export class ScenarioNavigationEngine {
  
  static navigateToScenario(navigateFn: (path: string, state?: any) => void, tenantId: string, scenarioId: string): void {
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'WAR_ROOM',
      targetWorkspace: 'WAR_ROOM',
      tenantId,
      targetObjectId: scenarioId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }

  static navigateToImpactInInvestigation(navigateFn: (path: string, state?: any) => void, tenantId: string, impactSourceNodeId: string): void {
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'WAR_ROOM',
      targetWorkspace: 'INVESTIGATION',
      tenantId,
      targetObjectId: impactSourceNodeId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }

  static navigateToDigitalTwin(navigateFn: (path: string, state?: any) => void, tenantId: string): void {
    const ref: InstitutionalNavigationReference = {
      sourceWorkspace: 'WAR_ROOM',
      targetWorkspace: 'DIGITAL_TWIN',
      tenantId
    };
    InstitutionalNavigationService.navigate(navigateFn, ref);
  }
}
