import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildInstitutionalReportPackage } from "../src/lib/institutional-reporting-engine";
import { InstitutionalReportingInput, InstitutionalReportingReportLike } from "../src/lib/institutional-reporting-types";
import { mapReportToInstitutionalReportingInput } from "../src/lib/institutional-reporting-mapper";
import { BoardPack } from "../src/lib/board-pack-types";
import { BoardDeck, BoardDeckSlide } from "../src/lib/board-deck-types";

describe("Institutional Reporting Framework v1.0", () => {
  const mockBoardPack: BoardPack = {
    executiveCover: "Executive Cover Text",
    institutionalSummary: "Institutional Summary Text",
    executiveAgenda: ["Agenda 1", "Agenda 2"],
    fiduciaryQuestions: ["Q1"],
    decisionPoints: ["D1"],
    strategicRisks: ["R1"],
    recommendedActions: ["A1"],
    boardMessage: "Board Msg",
    advisoryPerspective: "Advisory Msg",
    partnerPerspective: "Partner Msg",
    managementPerspective: "Management Msg",
    governanceCommunicationSummary: "Governance Summary",
    fiduciaryDisclaimer: "Disclaimer",
  };

  const createMockSlide = (content: string[]): BoardDeckSlide => ({
    title: "Mock Title",
    content,
  });

  const mockBoardDeck: BoardDeck = {
    coverSlide: createMockSlide(["Deck Cover Text"]),
    executiveSummarySlide: createMockSlide(["Deck Summary Text"]),
    agendaSlide: createMockSlide(["Deck Agenda 1"]),
    fiduciaryQuestionsSlide: createMockSlide(["Deck Q1"]),
    decisionPointsSlide: createMockSlide(["Deck D1"]),
    strategicRisksSlide: createMockSlide(["Deck R1"]),
    recommendedActionsSlide: createMockSlide(["Deck A1"]),
    stakeholderPerspectivesSlide: createMockSlide(["Deck Perspectives"]),
    closingSlide: createMockSlide(["Deck Closing"]),
    fiduciaryDisclaimer: "Disclaimer",
  };

  test("should return undefined if no input or neither pack/deck is provided", () => {
    assert.strictEqual(buildInstitutionalReportPackage(undefined), undefined);
    assert.strictEqual(buildInstitutionalReportPackage({}), undefined);
  });

  test("should build partial package when only BoardPack is provided", () => {
    const reportLike: InstitutionalReportingReportLike = {
      boardPack: mockBoardPack,
    };
    const input: InstitutionalReportingInput = mapReportToInstitutionalReportingInput(reportLike);
    const result = buildInstitutionalReportPackage(input);

    assert.ok(result);
    assert.strictEqual(result.exportManifest.exportReadiness, "PARTIAL");
    assert.ok(result.exportManifest.missingArtifacts.includes("boardDeck"));
    assert.ok(result.institutionalReport);
    assert.ok(result.boardMemo);
    assert.ok(result.meetingMinutesDraft);
  });

  test("should build partial package when only BoardDeck is provided", () => {
    const reportLike: InstitutionalReportingReportLike = {
      boardDeck: mockBoardDeck,
    };
    const input: InstitutionalReportingInput = mapReportToInstitutionalReportingInput(reportLike);
    const result = buildInstitutionalReportPackage(input);

    assert.ok(result);
    assert.strictEqual(result.exportManifest.exportReadiness, "PARTIAL");
    assert.ok(result.exportManifest.missingArtifacts.includes("boardPack"));
  });

  test("should build full package when both BoardPack and BoardDeck are provided", () => {
    const reportLike: InstitutionalReportingReportLike = {
      boardPack: mockBoardPack,
      boardDeck: mockBoardDeck,
    };
    const input: InstitutionalReportingInput = mapReportToInstitutionalReportingInput(reportLike);
    const result = buildInstitutionalReportPackage(input);

    assert.ok(result);
    assert.strictEqual(result.exportManifest.exportReadiness, "READY");
    assert.strictEqual(result.exportManifest.missingArtifacts.length, 0);
  });

  test("should not interfere with scores, metrics, and classifications during conditional spread", () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" },
    };

    const reportWithBoardDeck = {
      ...baseline,
      boardPack: mockBoardPack,
      boardDeck: mockBoardDeck,
    };

    const input = mapReportToInstitutionalReportingInput(reportWithBoardDeck);
    const irfPackage = buildInstitutionalReportPackage(input);

    const reportWithInstitutionalPackage = {
      ...reportWithBoardDeck,
      ...(irfPackage && { institutionalReportPackage: irfPackage }),
    };

    assert.deepStrictEqual(reportWithInstitutionalPackage.scores, baseline.scores);
    assert.deepStrictEqual(reportWithInstitutionalPackage.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithInstitutionalPackage.classifications, baseline.classifications);
    assert.ok(reportWithInstitutionalPackage.institutionalReportPackage);
  });
});
