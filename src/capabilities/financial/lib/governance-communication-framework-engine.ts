import type {
  GovernanceCommunicationFramework,
  GovernanceCommunicationFrameworkInput,
} from './governance-communication-framework-types';

const FIDUCIARY_DISCLAIMER =
  'Este framework consolida exclusivamente as camadas de comunicação executiva da Illumine Governance™, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.';

export function buildGovernanceCommunicationFramework(
  input: GovernanceCommunicationFrameworkInput | undefined,
): GovernanceCommunicationFramework | undefined {
  if (!input) {
    return undefined;
  }
  
  const {
    boardNarrative,
    advisoryNarrative,
    partnerNarrative,
    managementNarrative,
  } = input;
  
  const hasNarratives =
    boardNarrative ||
    advisoryNarrative ||
    partnerNarrative ||
    managementNarrative;
    
  if (!hasNarratives) {
    return undefined;
  }
  
  const integratedExecutiveAgenda = [
    ...(boardNarrative?.executiveAgenda ?? []),
    ...(advisoryNarrative?.advisoryRecommendations ?? []),
    ...(partnerNarrative?.strategicOwnershipAgenda ?? []),
    ...(managementNarrative?.managementActionPlan ?? []),
  ];
  
  const integratedDecisionAgenda = [
    ...(boardNarrative?.fiduciaryQuestions ?? []),
    ...(advisoryNarrative?.executiveReflectionQuestions ?? []),
    ...(partnerNarrative?.partnerReflectionQuestions ?? []),
    ...(managementNarrative?.accountabilityAgenda ?? []),
  ];
  
  const integratedAttentionPoints = [
    ...(boardNarrative?.decisionPoints ?? []),
    ...(advisoryNarrative?.systemicObservations ?? []),
    ...(partnerNarrative?.partnerReflectionQuestions ?? []),
    ...(managementNarrative?.operationalAttentionPoints ?? []),
  ];
  
  return {
    institutionalExecutiveSummary:
      'Consolidação institucional das comunicações executivas para Conselho, Advisors, Sócios e Gestão.',
    boardCommunicationView: boardNarrative,
    advisoryCommunicationView: advisoryNarrative,
    partnerCommunicationView: partnerNarrative,
    managementCommunicationView: managementNarrative,
    integratedExecutiveAgenda,
    integratedDecisionAgenda,
    integratedAttentionPoints,
    stakeholderCommunicationMatrix: {
      board: 'Board Narrative Layer',
      advisory: 'Advisory Narrative Layer',
      partners: 'Partner Narrative Layer',
      management: 'Management Narrative Layer',
    },
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
