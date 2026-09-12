import { ExecutiveEvidencePackage, NarrativeBlock, ExecutionPlanItem } from '../contracts/ExecutiveEvidencePackage';
import { ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';
import { ResolvedEvidence } from './EvidenceResolver';

export class ExecutiveEvidenceAssembler {
  /**
   * Constrói o pacote de evidências executivas (Executive Brief final).
   * A montagem agora é determinística, herdando o status do diagnóstico (Nunca UNKNOWN).
   */
  public static assemble(
    diagnosis: ExecutiveDiagnosis,
    resolvedEvidence: ResolvedEvidence,
    narrativeBlocks: NarrativeBlock[],
    executionPlan: ExecutionPlanItem[]
  ): ExecutiveEvidencePackage {
    
    let permission: "FULL" | "RESTRICTED" | "BLOCKED" = "FULL";
    if (diagnosis.financialState.evidenceIntegrity === 'REJECTED') {
      permission = "BLOCKED";
    } else if (diagnosis.financialState.status === 'CRITICAL' || diagnosis.financialState.status === 'STRESSED') {
      permission = "RESTRICTED";
    }

    return {
      cognitiveSessionId: diagnosis.id,
      executiveContext: {
        financialState: diagnosis.financialState.status,
        severity: diagnosis.financialState.status === 'CRITICAL' ? 'HIGH' : 'LOW',
        confidence: resolvedEvidence.overallConfidence,
        dominantDriver: 'Algoritmo Principal',
        institutionalMoment: 'Estabilidade',
        businessStage: 'Operação Contínua'
      },
      decisionIntent: {
        requestedDecision: 'Policy-Defined Intent',
        decisionCategory: "UNKNOWN",
        assumptions: []
      },
      dataQuality: {
        integrityScore: diagnosis.financialState.evidenceIntegrity === 'REJECTED' ? 0 : 90,
        originScore: 100,
        recencyScore: 100,
        completenessScore: 100,
        historicalReliabilityScore: 100,
        warnings: [],
        missingEvidence: [],
        isComplete: true,
        dataSource: 'SYSTEM',
        lastUpdatedAt: diagnosis.generatedAt
      },
      evidenceTrail: [],
      financialIntegrity: {
        balanceSheetStatus: diagnosis.financialState.evidenceIntegrity === 'REJECTED' ? 'REJECTED' : 'VALIDATED',
        earningsQualityScore: 0,
        cashConversionStatus: diagnosis.financialState.cashConversion < 0 ? 'CRITICAL' : 'HEALTHY',
        narrativePermission: permission
      },
      decisionAssessment: {
        status: diagnosis.decisionMode === 'PRESERVE' ? 'BLOCKED' : 'APPROVED',
        proposedDecision: 'Policy-Defined Intent',
        reasons: [],
        requiredActions: diagnosis.recommendations.map(r => r.action)
      } as any,
      narrativeBlocks,
      executionPlan,
      riskMap: [],
      confidenceMap: {
        financial: { score: diagnosis.financialState.evidenceIntegrity === 'REJECTED' ? 0 : 100, basis: 'Data integrity' },
        causal: { score: 100, basis: 'Institutional Policy' },
        recommendation: { score: 100, basis: 'Determinístico' },
        uncertainties: [],
        executiveJudgmentRequired: 'LOW'
      }
    };
  }
}
