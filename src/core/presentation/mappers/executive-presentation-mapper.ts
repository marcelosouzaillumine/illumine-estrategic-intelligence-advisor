import { ExecutiveCardViewModel, ExecutiveSectionViewModel } from "../contracts/executive-view-models";
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
