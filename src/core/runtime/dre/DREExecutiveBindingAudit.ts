export class DREExecutiveBindingAudit {
  public static audit(metrics: any) {
    return {
      metricsPayloadHasDreInsights: !!metrics?.dreInsights || !!metrics?.revenueEconomicStructure, // Allows backward compatibility if passed directly
      revenueEngineBound: !!metrics?.revenueEconomicStructure?.available || !!metrics?.dreInsights?.revenueEconomicStructure?.available,
      burnRateBound: !!metrics?.economicBurnRate?.available || !!metrics?.dreInsights?.economicBurnRate?.available,
      breakEvenBound: !!metrics?.breakEvenAnalysis?.available || !!metrics?.dreInsights?.breakEvenAnalysis?.available,
      coverageBound: !!metrics?.operationalAbsorption?.available || !!metrics?.dreInsights?.operationalAbsorption?.available,
      scaleEfficiencyBound: !!metrics?.scaleEfficiency?.available || !!metrics?.dreInsights?.scaleEfficiency?.available
    };
  }
}
