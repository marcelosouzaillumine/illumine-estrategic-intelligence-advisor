import type { BoardPack } from "./board-pack-types";
import type { BoardDeck } from "./board-deck-types";

export type InstitutionalExportFormat =
  | "PDF"
  | "PPTX"
  | "DOCX"
  | "MEMO"
  | "MINUTES"
  | "BOARD_PACKAGE";

export interface InstitutionalReportingInput {
  boardPack?: BoardPack;
  boardDeck?: BoardDeck;
}

export interface InstitutionalReportingReportLike {
  boardPack?: BoardPack;
  boardDeck?: BoardDeck;
}

export interface InstitutionalReport {
  title: string;
  subtitle: string;
  executiveSummary: string;
  sections: InstitutionalReportSection[];
  fiduciaryDisclaimer: string;
}

export interface InstitutionalReportSection {
  title: string;
  content: string[];
}

export interface BoardMemo {
  memoTitle: string;
  memoPurpose: string;
  keyMessages: string[];
  decisionTopics: string[];
  recommendedActions: string[];
  fiduciaryDisclaimer: string;
}

export interface MeetingMinutesDraft {
  meetingTitle: string;
  agendaItems: string[];
  discussionTopics: string[];
  decisionRecords: string[];
  actionItems: string[];
  fiduciaryDisclaimer: string;
}

export interface ExportManifest {
  availableFormats: InstitutionalExportFormat[];
  exportReadiness: "READY" | "PARTIAL" | "UNAVAILABLE";
  missingArtifacts: string[];
  fiduciaryDisclaimer: string;
}

export interface InstitutionalReportPackage {
  institutionalReport: InstitutionalReport;
  boardMemo: BoardMemo;
  meetingMinutesDraft: MeetingMinutesDraft;
  exportManifest: ExportManifest;
  fiduciaryDisclaimer: string;
}
