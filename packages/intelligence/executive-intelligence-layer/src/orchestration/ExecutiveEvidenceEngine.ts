import { ExecutiveIntelligenceOrchestrator } from './ExecutiveIntelligenceOrchestrator';
import { ExecutiveEvidencePackage } from '../domain/evidence/ExecutiveEvidencePackage';
import { Provenance } from '../domain/evidence/Provenance';
import { DecisionMemoryRecord } from '../learning/DecisionMemoryRecord';
import { LearningEvent } from '../learning/LearningEvent';

/**
 * The Executive Evidence Engine™
 * Esta é a camada final de consolidação cognitiva (Fase 5).
 * Nenhuma API fala diretamente com orquestradores ou validadores. Todas consomem 
 * este motor, que constrói o Executive Evidence Package™ 100% versionado e rastreável.
 */
export class ExecutiveEvidenceEngine {
  private static readonly ENGINE_VERSION = '1.0.0-fase5';
  private static readonly SCHEMA_VERSION = '1.0.0';
  private static readonly RULES_VERSION = '2026-07.1';
  private static readonly NARRATIVE_VERSION = '1.2.0-adaptive';
  private static readonly BENCHMARK_VERSION = 'v1-six-dimensions';

  /**
   * Constrói o pacote de evidências executivas fiduciário.
   */
  public static buildPackage(
    companyId: string,
    financialData: any,
    historicalData?: any[],
    proposedDecision?: string,
    decisionHistory: DecisionMemoryRecord[] = [],
    learningHistory: LearningEvent[] = []
  ): ExecutiveEvidencePackage {
    
    // 1. Invoca o Orquestrador Central (Fases 1 a 4)
    const rawCognitiveResult = ExecutiveIntelligenceOrchestrator.runPipeline(
      financialData,
      historicalData,
      proposedDecision,
      decisionHistory,
      learningHistory
    );

    // 2. Montagem de Provenance (Rastreabilidade Fiduciária)
    const evidenceTrail: Provenance[] = rawCognitiveResult.evidences.map(ev => ({
      origin: ev.layer,
      formula: 'Default internal heuristics', // A ser extraído de regras formais futuramente
      confidence: ev.confidence,
      validatedBy: 'CausalDiagnosticEngine'
    }));

    // Se a integridade passou, ela também é uma proveniência fundamental
    if (rawCognitiveResult.businessState !== 'UNKNOWN - DATA REJECTED') {
      evidenceTrail.push({
        origin: 'Layer 0 - Trust Foundation',
        confidence: 100,
        validatedBy: 'FinancialIntegrityEngine'
      });
    }

    // 3. Empacotamento
    const evidencePackage: ExecutiveEvidencePackage = {
      id: rawCognitiveResult.cognitiveSessionId,
      metadata: {
        schemaVersion: this.SCHEMA_VERSION,
        engineVersion: this.ENGINE_VERSION,
        rulesVersion: this.RULES_VERSION,
        narrativeVersion: this.NARRATIVE_VERSION,
        benchmarkVersion: this.BENCHMARK_VERSION,
        generatedAt: new Date().toISOString(),
        companyId: companyId
      },
      integrity: {
        passed: rawCognitiveResult.businessState !== 'UNKNOWN - DATA REJECTED',
        score: rawCognitiveResult.overallConfidence, // Simplificação
        blockers: rawCognitiveResult.businessState === 'UNKNOWN - DATA REJECTED' 
          ? [rawCognitiveResult.narrativeBlocks[0]?.content || 'Dados Rejeitados'] 
          : []
      },
      financialState: rawCognitiveResult.businessState,
      decisionAssessment: {
        decisionRequested: rawCognitiveResult.decisionAssessment?.decisionIntent || 'N/A',
        status: rawCognitiveResult.decisionAssessment?.status || 'N/A',
        approvalLevel: 'EXECUTIVE', // Placeholder, deveria vir da política
        blockingRules: rawCognitiveResult.decisionAssessment?.status === 'BLOCKED' ? rawCognitiveResult.decisionAssessment.reasons : [],
        conditions: rawCognitiveResult.decisionAssessment?.status === 'APPROVED_WITH_CONDITIONS' ? rawCognitiveResult.decisionAssessment.reasons : []
      },
      executiveNarrative: {
        title: `Strategic Assessment: ${rawCognitiveResult.businessState}`,
        severity: rawCognitiveResult.narrativeBlocks.find(b => b.type === 'SITUATION')?.severity || rawCognitiveResult.narrativeBlocks[0]?.severity || 'UNKNOWN',
        summary: rawCognitiveResult.narrativeBlocks.find(b => b.type === 'SITUATION')?.content || rawCognitiveResult.narrativeBlocks[0]?.content || '',
        implications: rawCognitiveResult.narrativeBlocks.filter(b => b.type === 'IMPLICATION').map(b => b.content),
        recommendations: rawCognitiveResult.narrativeBlocks.filter(b => b.type === 'RECOMMENDATION').map(b => b.content),
        actions: [], // Ações táticas, preenchidas por um TaskEngine no futuro
        confidence: rawCognitiveResult.overallConfidence,
        sources: evidenceTrail
      },
      causalDiagnostics: rawCognitiveResult.evidences.map(ev => ev.content),
      evidenceTrail: evidenceTrail
    };

    return evidencePackage;
  }
}
