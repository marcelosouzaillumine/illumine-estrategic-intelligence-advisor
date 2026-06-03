// src/core/runtime/lifecycle/LifecycleSemanticConsumptionGuard.ts

export class LifecycleSemanticConsumptionGuard {
  public static assertLifecycleSemanticConsumption(context: any, consumedValues: {
    governanceStatus: string;
    capitalStatus: string;
  }): void {
    if (!context || !context.lifecycleProfile) {
      throw new Error("LIFECYCLE_PROFILE_NOT_CONSUMED: O perfil de ciclo de vida (lifecycleProfile) não está disponível no contexto de execução.");
    }

    const { lifecycleProfile } = context;

    // Check if the semantic authority overrides are active, and if they were bypassed
    const isEarly = lifecycleProfile.lifecycleStage === 'INITIAL_CAPITALIZATION' || lifecycleProfile.lifecycleStage === 'EARLY_GROWTH';
    if (isEarly) {
      const expectedGov = lifecycleProfile.governanceStatus?.semanticLabel;
      const expectedCap = lifecycleProfile.capitalStatus?.semanticLabel;

      if (expectedGov && consumedValues.governanceStatus !== expectedGov) {
        throw new Error(`LIFECYCLE_PROFILE_NOT_CONSUMED: Desvio semântico de governança detectado. Consumido: '${consumedValues.governanceStatus}', Esperado (ELSA): '${expectedGov}'`);
      }

      if (expectedCap && consumedValues.capitalStatus !== expectedCap) {
        throw new Error(`LIFECYCLE_PROFILE_NOT_CONSUMED: Desvio semântico de capital detectado. Consumido: '${consumedValues.capitalStatus}', Esperado (ELSA): '${expectedCap}'`);
      }
    }
  }
}
