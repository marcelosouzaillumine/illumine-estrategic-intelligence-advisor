// src/core/runtime/scenario-intelligence/ThesisFutureImpactEngine.ts
import { InstitutionalScenarioResult } from './scenario-types';
import { StressTestResult } from './InstitutionalStressTestEngine';

export interface ThesisImpactProfile {
  thesisShift: 'ESTÁVEL' | 'DETERIORAÇÃO_MODERADA' | 'DETERIORAÇÃO_CRÍTICA' | 'FORTALECIMENTO';
  vulnerabilityTriggers: string[];
}

export class ThesisFutureImpactEngine {
  public static evaluate(
    currentThesisSeverity: 'SAUDÁVEL' | 'MODERADA' | 'ALTA' | 'CRÍTICA' | 'INDISPONÍVEL',
    scenarioResult: InstitutionalScenarioResult,
    stressResult?: StressTestResult
  ): ThesisImpactProfile {
    
    if (scenarioResult.validation.status !== 'VALID' || !scenarioResult.propagationProfile) {
      return { thesisShift: 'ESTÁVEL', vulnerabilityTriggers: [] };
    }

    const { systemicSeverity } = scenarioResult.propagationProfile;
    const { survivalPressure, structuralVulnerabilities } = stressResult || { survivalPressure: 'BAIXA', structuralVulnerabilities: [] };

    let thesisShift: ThesisImpactProfile['thesisShift'] = 'ESTÁVEL';

    // Determina a evolução baseado na severidade atual vs pressão da simulação
    if (survivalPressure === 'CRÍTICA' || systemicSeverity === 'CRÍTICA') {
      thesisShift = 'DETERIORAÇÃO_CRÍTICA';
    } else if (survivalPressure === 'ALTA' || systemicSeverity === 'ALTA') {
      // Se a tese já era crítica, mantém crítica
      if (currentThesisSeverity === 'CRÍTICA') thesisShift = 'ESTÁVEL';
      else thesisShift = 'DETERIORAÇÃO_MODERADA';
    } else if (systemicSeverity === 'MODERADA') {
      thesisShift = 'DETERIORAÇÃO_MODERADA';
    } else {
      // Se a simulação indica alívio de pressões
      if (currentThesisSeverity === 'CRÍTICA' || currentThesisSeverity === 'ALTA') {
        thesisShift = 'FORTALECIMENTO';
      } else {
        thesisShift = 'ESTÁVEL';
      }
    }

    return {
      thesisShift,
      vulnerabilityTriggers: structuralVulnerabilities
    };
  }
}
