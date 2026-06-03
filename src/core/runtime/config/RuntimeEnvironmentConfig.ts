export type RuntimeEnvironmentType = 'DEVELOPMENT' | 'PRODUCTION' | 'PILOT';

export interface RuntimeEnvironmentConfig {
  environmentType: RuntimeEnvironmentType;
  mockFactoriesEnabled: boolean;
  debugModeEnabled: boolean;
  isPilotTenant: boolean;
  isProductionTenant: boolean;
  testsPassed: boolean;
  typecheckPassed: boolean;
  buildPassed: boolean;
  userRole: string;
}

export function readRuntimeEnvironmentConfig(): RuntimeEnvironmentConfig {
  const globalEnv = globalThis as unknown as Record<string, unknown>;
  
  const envType = (globalEnv.EFOS_ENV as string) || 'DEVELOPMENT';
  
  return {
    environmentType: envType as RuntimeEnvironmentType,
    mockFactoriesEnabled: Boolean(globalEnv.EFOS_MOCKS_ENABLED),
    debugModeEnabled: Boolean(globalEnv.EFOS_DEBUG_MODE),
    isPilotTenant: Boolean(globalEnv.EFOS_IS_PILOT),
    isProductionTenant: envType === 'PRODUCTION',
    testsPassed: globalEnv.EFOS_TESTS_PASSED !== false, // Defaults to true if undefined
    typecheckPassed: globalEnv.EFOS_TYPECHECK_PASSED !== false,
    buildPassed: globalEnv.EFOS_BUILD_PASSED !== false,
    userRole: (globalEnv.EFOS_USER_ROLE as string) || 'MASTER_SUPERVISOR',
  };
}
