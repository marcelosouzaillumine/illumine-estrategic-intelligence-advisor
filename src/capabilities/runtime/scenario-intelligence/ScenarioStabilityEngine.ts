// src/core/runtime/scenario-intelligence/ScenarioStabilityEngine.ts
import { InstitutionalScenarioResult } from './scenario-types';

export class ScenarioStabilityEngine {
  public static stabilize(scenarioResult: InstitutionalScenarioResult): InstitutionalScenarioResult {
    // Para simplificar, estabilizamos a histerese limitando a oscilação extrema do score de integridade estrutural
    if (scenarioResult.propagationProfile) {
      const p = scenarioResult.propagationProfile;
      // Smoothing function (histerese) para evitar que a integridade zere abruptamente
      if (p.structuralIntegrityScore < 20) {
        p.structuralIntegrityScore = 20; // Hard floor to avoid panic signaling when things are just "Stressed" not "Broken"
      }
    }
    return scenarioResult;
  }
}
