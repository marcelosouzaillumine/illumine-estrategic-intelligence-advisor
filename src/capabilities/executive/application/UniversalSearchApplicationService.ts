import { InstitutionalObservabilityRegistry } from '../../../core/observability/InstitutionalObservabilityRegistry';
import { InstitutionalNavigationService } from '../../../core/navigation/InstitutionalNavigationService';
import { InstitutionalNavigationReference } from '../../../types/intelligence/InstitutionalNavigationReference';
import { NavigateFunction } from 'react-router-dom';

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  domain: string;
  targetWorkspace: string;
  path: string;
}

export class UniversalSearchApplicationService {
  static recordSearchOpened(tenantId: string | undefined, correlationId: string) {
    if (tenantId) {
      InstitutionalObservabilityRegistry.recordExecutiveEvent(
        'UNIVERSAL_SEARCH_OPENED',
        tenantId,
        correlationId,
        { sourceWorkspace: 'UNIVERSAL_SEARCH' }
      );
    }
  }

  static getMockSearchResults(query: string): SearchResult[] {
    if (query.trim().length < 2) {
      return [];
    }

    const mockData: SearchResult[] = [
      { id: 'sc-123', type: 'SCENARIO', title: 'Macroeconomia Q3', domain: 'War Room', targetWorkspace: 'WAR_ROOM', path: '/war-room' },
      { id: 'risk-456', type: 'RISK', title: 'Exposição Cambial', domain: 'Investigation', targetWorkspace: 'INVESTIGATION', path: '/investigation/risk-456' },
      { id: 'kpi-789', type: 'KPI', title: 'Índice de Resiliência', domain: 'Digital Twin', targetWorkspace: 'DIGITAL_TWIN', path: '/digital-twin' }
    ];

    return mockData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.type.toLowerCase().includes(query.toLowerCase())
    );
  }

  static performNavigation(
    result: SearchResult,
    tenantId: string | undefined,
    navigate: NavigateFunction
  ) {
    if (!tenantId) return;

    const navRef: InstitutionalNavigationReference = {
      tenantId: tenantId,
      sourceWorkspace: 'UNIVERSAL_SEARCH',
      targetWorkspace: result.targetWorkspace as any,
      targetObjectId: result.id,
      correlationId: `nav-${Date.now()}`
    };
    
    InstitutionalObservabilityRegistry.recordObjectNavigated(
      tenantId,
      navRef.correlationId,
      result.id,
      'UNIVERSAL_SEARCH',
      result.targetWorkspace
    );
    
    InstitutionalNavigationService.navigate(navigate, navRef);
  }
}
