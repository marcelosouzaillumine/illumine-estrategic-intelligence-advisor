import type {
  BoardMemo,
  ExportManifest,
  InstitutionalReport,
  InstitutionalReportPackage,
  InstitutionalReportingInput,
  MeetingMinutesDraft,
} from "./institutional-reporting-types";

const FIDUCIARY_DISCLAIMER =
  "Este pacote institucional consolida exclusivamente artefatos narrativos e executivos previamente gerados pela Illumine Governance™, sem recalcular métricas, indicadores, scores, classificações ou saídas fiduciárias.";

export function buildInstitutionalReportPackage(
  input: InstitutionalReportingInput | undefined,
): InstitutionalReportPackage | undefined {
  if (!input?.boardPack && !input?.boardDeck) {
    return undefined;
  }
  
  const institutionalReport = buildInstitutionalReport(input);
  const boardMemo = buildBoardMemo(input);
  const meetingMinutesDraft = buildMeetingMinutesDraft(input);
  const exportManifest = buildExportManifest(input);
  
  return {
    institutionalReport,
    boardMemo,
    meetingMinutesDraft,
    exportManifest,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}

function buildInstitutionalReport(
  input: InstitutionalReportingInput,
): InstitutionalReport {
  return {
    title: "Relatório Institucional de Governança",
    subtitle: "Illumine Governance™",
    executiveSummary:
      input.boardPack?.institutionalSummary ??
      input.boardDeck?.executiveSummarySlide.content.join(" ") ??
      "Síntese institucional não disponível.",
    sections: [
      {
        title: "Pauta Executiva",
        content:
          input.boardPack?.executiveAgenda ??
          input.boardDeck?.agendaSlide.content ??
          [],
      },
      {
        title: "Perguntas Fiduciárias",
        content:
          input.boardPack?.fiduciaryQuestions ??
          input.boardDeck?.fiduciaryQuestionsSlide.content ??
          [],
      },
      {
        title: "Pontos de Decisão",
        content:
          input.boardPack?.decisionPoints ??
          input.boardDeck?.decisionPointsSlide.content ??
          [],
      },
      {
        title: "Riscos Estratégicos",
        content:
          input.boardPack?.strategicRisks ??
          input.boardDeck?.strategicRisksSlide.content ??
          [],
      },
      {
        title: "Ações Recomendadas",
        content:
          input.boardPack?.recommendedActions ??
          input.boardDeck?.recommendedActionsSlide.content ??
          [],
      },
    ],
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}

function buildBoardMemo(
  input: InstitutionalReportingInput,
): BoardMemo {
  return {
    memoTitle: "Memorando Executivo ao Conselho",
    memoPurpose:
      "Consolidar os principais temas executivos, fiduciários e institucionais para deliberação.",
    keyMessages: [
      input.boardPack?.boardMessage ??
        (input.boardDeck?.coverSlide.content && input.boardDeck.coverSlide.content.length > 0 
          ? input.boardDeck.coverSlide.content.join(" ") 
          : "Mensagem executiva não disponível.")
    ],
    decisionTopics:
      input.boardPack?.decisionPoints ??
      input.boardDeck?.decisionPointsSlide.content ??
      [],
    recommendedActions:
      input.boardPack?.recommendedActions ??
      input.boardDeck?.recommendedActionsSlide.content ??
      [],
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}

function buildMeetingMinutesDraft(
  input: InstitutionalReportingInput,
): MeetingMinutesDraft {
  return {
    meetingTitle: "Minuta de Ata de Reunião do Conselho",
    agendaItems:
      input.boardPack?.executiveAgenda ??
      input.boardDeck?.agendaSlide.content ??
      [],
    discussionTopics:
      input.boardPack?.fiduciaryQuestions ??
      input.boardDeck?.fiduciaryQuestionsSlide.content ??
      [],
    decisionRecords:
      input.boardPack?.decisionPoints ??
      input.boardDeck?.decisionPointsSlide.content ??
      [],
    actionItems:
      input.boardPack?.recommendedActions ??
      input.boardDeck?.recommendedActionsSlide.content ??
      [],
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}

function buildExportManifest(
  input: InstitutionalReportingInput,
): ExportManifest {
  const missingArtifacts: string[] = [];
  if (!input.boardPack) {
    missingArtifacts.push("boardPack");
  }
  if (!input.boardDeck) {
    missingArtifacts.push("boardDeck");
  }
  
  return {
    availableFormats: [
      "PDF",
      "PPTX",
      "DOCX",
      "MEMO",
      "MINUTES",
      "BOARD_PACKAGE",
    ],
    exportReadiness:
      missingArtifacts.length === 0
        ? "READY"
        : missingArtifacts.length === 2
          ? "UNAVAILABLE"
          : "PARTIAL",
    missingArtifacts,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
