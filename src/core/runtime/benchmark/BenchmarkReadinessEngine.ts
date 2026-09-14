// src/core/runtime/benchmark/BenchmarkReadinessEngine.ts

import { 
  BenchmarkReadinessResult, 
  BenchmarkReadinessLevel, 
  ESGIMScenario 
} from '../../../capabilities/runtime/esgim/esgimTypes';
import { esgimAssessmentEngine } from '../../../capabilities/runtime/esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../../../capabilities/runtime/esgim/InstitutionalResilienceIndexEngine';
import { decisionRegistryEngine } from '../../../capabilities/runtime/execution/DecisionRegistryEngine';
import { governanceMonitoringEngine } from '../monitoring/GovernanceMonitoringEngine';
import { governanceKnowledgeEngine } from '../knowledge/GovernanceKnowledgeEngine';

export class BenchmarkReadinessEngine {
  private static instance: BenchmarkReadinessEngine;

  public static getInstance(): BenchmarkReadinessEngine {
    if (!BenchmarkReadinessEngine.instance) {
      BenchmarkReadinessEngine.instance = new BenchmarkReadinessEngine();
    }
    return BenchmarkReadinessEngine.instance;
  }

  /**
   * Evaluates the readiness of the organization for external benchmarking.
   */
  public evaluateReadiness(clientId: string, scenario: ESGIMScenario): BenchmarkReadinessResult {
    const createdAt = new Date().toISOString();
    const lineageHash = `LIN-BRL-${scenario}-${Date.now()}`;

    // 1. Data Readiness Assessment
    let completeness = 85;
    let quality = 80;
    let continuity = 90;

    if (scenario === 'CONSTITUTIONAL_BREACH') {
      completeness = 50;
      quality = 40;
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      completeness = 70;
      quality = 60;
    } else if (scenario === 'MISSION_STRESS') {
      quality = 70;
    } else if (scenario === 'FOUNDER_EXIT') {
      quality = 75;
    } else if (scenario === 'MARKET_DISRUPTION') {
      completeness = 75;
    }

    const dataReadiness = Math.round((completeness + quality + continuity) / 3);

    // 2. Governance Readiness Assessment
    const esgim = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCENARIO', scenario);
    const iri = institutionalResilienceIndexEngine.calculateResilience(clientId, 'DEMO_SCENARIO', scenario);
    const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);
    const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, 'DEMO_SCENARIO', scenario);
    const pei = monitoring.snapshots?.[3]?.priorityExecutionIndex ?? 70;

    const governanceReadiness = Math.round(
      (esgim.overallScore * 0.3) + 
      (iri.score * 0.3) + 
      (geiWeighted * 0.2) + 
      (pei * 0.2)
    );

    // 3. Institutional Readiness Assessment
    const pai = governanceKnowledgeEngine.calculatePAI(clientId, scenario);
    const institutionalReadiness = Math.round(
      (pai.score * 0.5) + 
      (iri.missionContinuity * 0.5)
    );

    // 4. Comparative Readiness Assessment
    let metricAvailability = 90;
    let periodAlignment = 85;
    let evidenceThreshold = 80;

    if (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') {
      evidenceThreshold = 45;
      periodAlignment = 60;
    } else if (scenario === 'MISSION_STRESS') {
      evidenceThreshold = 70;
    } else if (scenario === 'FOUNDER_EXIT' || scenario === 'MARKET_DISRUPTION') {
      metricAvailability = 80;
    }

    const comparativeReadiness = Math.round(
      (metricAvailability + periodAlignment + evidenceThreshold) / 3
    );

    // 5. Calculate Benchmark Readiness Index (BRI™)
    const rawBRI = Math.round(
      (dataReadiness * 0.25) +
      (governanceReadiness * 0.30) +
      (institutionalReadiness * 0.25) +
      (comparativeReadiness * 0.20)
    );

    // 6. Apply Constitutional ceilings/caps
    let score = rawBRI;
    let level: BenchmarkReadinessLevel = 'DEVELOPING';
    let certificationStatus: "CERTIFIED" | "CONDITIONALLY_CERTIFIED" | "NOT_CERTIFIED" = 'CERTIFIED';

    if (scenario === 'CONSTITUTIONAL_BREACH') {
      score = Math.min(score, 34);
      level = 'CRITICAL';
      certificationStatus = 'NOT_CERTIFIED';
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      score = Math.min(score, 49);
      level = 'CONCERN';
      certificationStatus = 'NOT_CERTIFIED';
    } else if (scenario === 'MISSION_STRESS') {
      score = Math.min(score, 59);
      level = 'DEVELOPING';
      certificationStatus = 'CONDITIONALLY_CERTIFIED';
    } else if (scenario === 'FOUNDER_EXIT') {
      score = Math.min(score, 89); // Capped below EXCELLENT
    } else if (scenario === 'MARKET_DISRUPTION') {
      score = Math.min(score, 89); // Capped below EXCELLENT
    }

    // Map score to levels if not already set by breach/shock
    if (scenario !== 'CONSTITUTIONAL_BREACH' && scenario !== 'LIQUIDITY_SHOCK' && scenario !== 'MISSION_STRESS') {
      if (score >= 90) {
        level = 'EXCELLENT';
        certificationStatus = 'CERTIFIED';
      } else if (score >= 75) {
        level = 'MATURE';
        certificationStatus = 'CERTIFIED';
      } else if (score >= 60) {
        level = 'DEVELOPING';
        certificationStatus = 'CONDITIONALLY_CERTIFIED';
      } else if (score >= 35) {
        level = 'CONCERN';
        certificationStatus = 'NOT_CERTIFIED';
      } else {
        level = 'CRITICAL';
        certificationStatus = 'NOT_CERTIFIED';
      }
    }

    // 7. Benchmark Eligibility determination
    // Standard rule: If certificationStatus === "NOT_CERTIFIED", then benchmarkEligible must always be false.
    let benchmarkEligible = true;
    if (certificationStatus === 'NOT_CERTIFIED') {
      benchmarkEligible = false;
    }

    // 8. Generate Blocked Reasons & Requirements
    let benchmarkBlockedReason: string | undefined;
    let requiredBeforeBenchmark: string[] | undefined;

    if (certificationStatus === 'NOT_CERTIFIED') {
      requiredBeforeBenchmark = [];
      if (scenario === 'CONSTITUTIONAL_BREACH') {
        benchmarkBlockedReason = 'Presença de violação constitucional ativa na holding.';
        requiredBeforeBenchmark.push('Sanar violações de limites fiduciários e de alçadas estatutárias.');
        requiredBeforeBenchmark.push('Aprovar e assinar a Ata da Reunião de Board com as resoluções corretivas.');
      } else if (scenario === 'LIQUIDITY_SHOCK') {
        benchmarkBlockedReason = 'Grave crise de liquidez operacional e runway financeiro crítico.';
        requiredBeforeBenchmark.push('Mitigar o estrangulamento de caixa através de aporte societário ou renegociação de dívida.');
        requiredBeforeBenchmark.push('Restabelecer o runway fiduciário mínimo de 6 meses.');
      } else {
        benchmarkBlockedReason = 'Maturidade de governança ou integridade de dados abaixo do limite mínimo.';
        requiredBeforeBenchmark.push('Elevar a cobertura histórica de dados financeiros e operacionais.');
        requiredBeforeBenchmark.push('Melhorar a taxa de resolução de pendências decisórias no GDTL™.');
      }
    } else if (certificationStatus === 'CONDITIONALLY_CERTIFIED') {
      requiredBeforeBenchmark = [];
      if (scenario === 'MISSION_STRESS') {
        requiredBeforeBenchmark.push('Restaurar o alinhamento da governança aos valores de legado IWL™.');
      } else {
        requiredBeforeBenchmark.push('Aumentar a cobertura de auditoria dos registros do DFC.');
      }
    }

    // 9. Strengths & Vulnerabilities
    const strengths: string[] = [];
    const vulnerabilities: string[] = [];

    if (dataReadiness >= 85) strengths.push('Alta integridade histórica e consistência dos registros de caixa.');
    else if (dataReadiness < 70) vulnerabilities.push('Lacunas ou inconsistências na série histórica de dados.');

    if (governanceReadiness >= 80) strengths.push('Estrutura de governança colegiada ativa e com segregação clara de alçadas.');
    else if (governanceReadiness < 65) vulnerabilities.push('Baixo índice de execução das recomendações do conselho (GEI™).');

    if (institutionalReadiness >= 80) strengths.push('Forte alinhamento com a biblioteca de princípios e perenidade (IWL™).');
    else if (institutionalReadiness < 65) vulnerabilities.push('Instabilidade sucessória ou desvio da missão original da holding.');

    if (comparativeReadiness >= 80) strengths.push('Presença de dimensões e métricas diretamente comparáveis com o mercado.');
    else if (comparativeReadiness < 70) vulnerabilities.push('Threshold de evidências limítrofe para fins de comparação externa.');

    // 10. Executive Summary & Explainability
    const eligibilityText = benchmarkEligible ? 'Elegível' : 'Bloqueado';
    const statusText = certificationStatus === 'CERTIFIED' ? 'Certificada' : (certificationStatus === 'CONDITIONALLY_CERTIFIED' ? 'Certificada Condicionalmente' : 'Não Certificada');
    
    let executiveSummary = `A holding apresenta Índice de Prontidão de Benchmark (BRI™) de ${score}/100, classificado como ${level}. O status de certificação atual é ${statusText}, tornando a participação em rodadas de comparação setorial: ${eligibilityText}.`;
    
    if (!benchmarkEligible && benchmarkBlockedReason) {
      executiveSummary += ` Motivo do bloqueio: ${benchmarkBlockedReason}`;
    }

    const explainability: string[] = [
      `Data Readiness Score: ${dataReadiness}/100 (Peso 25%)`,
      `Governance Readiness Score: ${governanceReadiness}/100 (Peso 30%)`,
      `Institutional Readiness Score: ${institutionalReadiness}/100 (Peso 25%)`,
      `Comparative Readiness Score: ${comparativeReadiness}/100 (Peso 20%)`
    ];

    if (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK' || scenario === 'MISSION_STRESS') {
      explainability.push(`Teto constitucional aplicado ativamente devido ao contexto de ${scenario}.`);
    }

    const getDimensionStatus = (s: number): 'CRITICAL' | 'WARNING' | 'OPTIMAL' => {
      if (s < 60) return 'CRITICAL';
      if (s < 75) return 'WARNING';
      return 'OPTIMAL';
    };

    const dataReadinessStatus = getDimensionStatus(dataReadiness);
    const governanceReadinessStatus = getDimensionStatus(governanceReadiness);
    const institutionalReadinessStatus = getDimensionStatus(institutionalReadiness);
    const comparativeReadinessStatus = getDimensionStatus(comparativeReadiness);

    return {
      score,
      level,
      benchmarkEligible,
      dataReadiness,
      dataReadinessStatus,
      governanceReadiness,
      governanceReadinessStatus,
      institutionalReadiness,
      institutionalReadinessStatus,
      comparativeReadiness,
      comparativeReadinessStatus,
      strengths,
      vulnerabilities,
      executiveSummary,
      certificationStatus,
      explainability,
      lineageHash,
      createdAt,
      benchmarkBlockedReason,
      requiredBeforeBenchmark
    };
  }
}

export const benchmarkReadinessEngine = BenchmarkReadinessEngine.getInstance();
