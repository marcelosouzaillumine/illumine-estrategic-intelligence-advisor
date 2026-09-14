export interface LegacyRouteMapping {
  id: string; // The surface ID mapped to a legacy route (e.g. cfo-office/nav-finance-dre)
  legacyRoute: string; // The string matched in the old App routes / navigation array
  migrationStatus: 'hybrid' | 'native';
  componentKey: string;
}

export const LEGACY_MIGRATION_REGISTRY: LegacyRouteMapping[] = [
  {
    id: 'cfo-office/nav-finance-dre', // ID formed by {office}/{surface}
    legacyRoute: 'dre', // Matches legacy navigation route key
    migrationStatus: 'hybrid',
    componentKey: 'FinancialPerformancePage' // Example semantic key, mapped in the bridge
  },
  {
    id: 'cfo-office/nav-finance-cash',
    legacyRoute: 'fluxo-caixa',
    migrationStatus: 'hybrid',
    componentKey: 'CashFlowPage'
  },
  {
    id: 'cfo-office/nav-finance-modeling',
    legacyRoute: 'modelagem-financeira',
    migrationStatus: 'hybrid',
    componentKey: 'FinancialModelingPage'
  }
];

export function getLegacyMappingForSurface(officeId: string, surfaceId: string): LegacyRouteMapping | undefined {
  return LEGACY_MIGRATION_REGISTRY.find(m => m.id === `${officeId}/${surfaceId}`);
}
