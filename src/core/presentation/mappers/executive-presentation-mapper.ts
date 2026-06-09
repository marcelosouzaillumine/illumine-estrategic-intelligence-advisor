import { 
  ExecutiveCardViewModel, 
  ExecutiveSectionViewModel,
  ExecutiveLatencyViewModel,
  ExecutiveHealthViewModel,
  ExecutiveViolationViewModel,
  ExecutiveConfidenceBadgeViewModel
} from "../contracts/executive-view-models";
import { resolveExecutiveLabel } from "../safe-executive-label-resolver";

/**
 * Generic interface simulating a runtime payload that might contain leaked technical codes.
 */
export interface RuntimePayload {
  id?: string;
  sourceModule?: string;
  traceId?: string;
  runtimeCode?: string;
  sectionId?: string;
  severity?: string;
  severityCode?: string;
  status?: string;
  title?: string;
  description?: string;
  technicalCode?: string;
  [key: string]: unknown;
}

/**
 * Mapeia um payload bruto de runtime de um Card para um ViewModel executivo saneado.
 */
export function mapToExecutiveCardViewModel(runtimeData: RuntimePayload): ExecutiveCardViewModel {
  return {
    visible: {
      title: runtimeData.title ? resolveExecutiveLabel(runtimeData.title, "generic") : "Informação indisponível",
      subtitle: runtimeData.sectionId ? resolveExecutiveLabel(runtimeData.sectionId, "sections") : undefined,
      description: runtimeData.description ? resolveExecutiveLabel(runtimeData.description, "generic") : "Sem descrição estruturada.",
      attentionLabel: (runtimeData.severity || runtimeData.severityCode) 
        ? resolveExecutiveLabel(runtimeData.severity || runtimeData.severityCode, "severities") 
        : undefined,
    },
    internal: {
      id: runtimeData.id,
      sourceModule: runtimeData.sourceModule,
      traceId: runtimeData.traceId,
      runtimeCode: runtimeData.runtimeCode || runtimeData.technicalCode,
    }
  };
}

/**
 * Mapeia um payload bruto de runtime de uma Section para um ViewModel executivo saneado.
 */
export function mapToExecutiveSectionViewModel(runtimeData: RuntimePayload): ExecutiveSectionViewModel {
  return {
    visible: {
      title: runtimeData.sectionId 
        ? resolveExecutiveLabel(runtimeData.sectionId, "sections") 
        : (runtimeData.title ? resolveExecutiveLabel(runtimeData.title, "generic") : "Seção não classificada"),
      statusLabel: runtimeData.status ? resolveExecutiveLabel(runtimeData.status, "status") : undefined,
    },
    internal: {
      id: runtimeData.id,
      sourceModule: runtimeData.sourceModule,
      traceId: runtimeData.traceId,
      runtimeCode: runtimeData.runtimeCode || runtimeData.technicalCode,
    }
  };
}

export function mapToExecutiveLatencyViewModel(snapshot: any): ExecutiveLatencyViewModel {
  return {
    visible: {
      totalDurationMs: snapshot.totalDurationMs || 0,
      stages: (snapshot.stages || []).map((s: any) => ({
        stage: resolveExecutiveLabel(s.stage, "generic"),
        durationMs: s.durationMs
      })),
      bottlenecks: (snapshot.bottlenecks || []).map((b: string) => resolveExecutiveLabel(b, "generic"))
    },
    internal: {
      runtimeCode: 'LATENCY_SNAPSHOT'
    }
  };
}

export function mapToExecutiveHealthViewModel(report: any): ExecutiveHealthViewModel {
  const getConfidenceLabel = (level: string) => {
    switch (level) {
      case 'HIGH_CONFIDENCE': return 'Alta Confiança fiduciária';
      case 'MEDIUM_CONFIDENCE': return 'Média Confiança';
      case 'LOW_CONFIDENCE': return 'Degradação / Baixa Confiança';
      default: return 'Não Determinado';
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'FULL_FINANCIAL_VIEW': return 'Visão Financeira Completa (BP + DRE)';
      case 'PARTIAL_FINANCIAL_VIEW': return 'Visão Financeira Parcial';
      case 'BALANCE_SHEET_ONLY': return 'Apenas Balanço Patrimonial (BP)';
      case 'DRE_ONLY': return 'Apenas DRE';
      case 'CASHFLOW_ONLY': return 'Apenas Fluxo de Caixa';
      default: return mode;
    }
  };

  return {
    visible: {
      confidenceLevel: report.compliance?.confidenceLevel || 'UNKNOWN',
      confidenceLabel: getConfidenceLabel(report.compliance?.confidenceLevel),
      causalDepth: String(report.compliance?.causalDepth || 'N/A'),
      dataCompletenessPercent: ((report.compliance?.dataCompleteness || 0) * 100).toFixed(1),
      modeLabel: getModeLabel(report.compliance?.runtimeMode || ''),
      restrictions: report.compliance?.narrativeRestrictions || []
    },
    internal: {
      traceId: String((report.runtimeMetadata as any)?.importId || report.runtimeMetadata?.executionId || 'EXEC-N/A')
    }
  };
}

export function mapToExecutiveViolationViewModel(violation: any): ExecutiveViolationViewModel {
  return {
    visible: {
      severityLabel: resolveExecutiveLabel(violation.severity, "severities"),
      message: resolveExecutiveLabel(violation.message, "generic"),
      context: resolveExecutiveLabel(violation.sourceContext, "generic")
    },
    internal: {
      id: violation.violationId,
      runtimeCode: violation.severity
    }
  };
}

export function mapToExecutiveConfidenceBadgeViewModel(confidence: any): ExecutiveConfidenceBadgeViewModel {
  const getConfidenceLabel = (level: string) => {
    switch (level) {
      case 'HIGH_CONFIDENCE': return 'Alta Confiança fiduciária';
      case 'MEDIUM_CONFIDENCE': return 'Média Confiança';
      case 'LOW_CONFIDENCE': return 'Degradação / Baixa Confiança';
      default: return 'Não Determinado';
    }
  };

  const levelStr = typeof confidence === 'string' ? confidence : confidence?.level;

  return {
    visible: {
      confidenceLevel: levelStr || 'UNKNOWN',
      label: getConfidenceLabel(levelStr)
    },
    internal: {
      runtimeCode: levelStr
    }
  };
}
