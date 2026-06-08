import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildGovernanceMemory } from "../src/lib/governance-memory-engine";
import { GovernanceMemoryInput, GovernanceMemoryReportLike } from "../src/lib/governance-memory-types";
import { mapReportToGovernanceMemoryInput } from "../src/lib/governance-memory-mapper";
import { BoardNarrative } from "../src/lib/board-narrative-types";
import { AdvisoryNarrative } from "../src/lib/advisory-narrative-types";
import { ManagementNarrative } from "../src/lib/management-narrative-types";

describe("Governance Memory Layer v2.0", () => {
  const mockBoardNarrative: BoardNarrative = {
    boardBriefing: "",
    boardMessage: "",
    executiveAgenda: [],
    fiduciaryQuestions: ["Recurring Topic 1", "Unique Board Topic"],
    decisionPoints: ["Approve Q1 Budget"],
    riskOversightAgenda: [],
    recommendedBoardActions: ["Hire new CFO"],
    fiduciaryDisclaimer: ""
  };

  const mockAdvisoryNarrative: AdvisoryNarrative = {
    advisoryRecommendations: ["Focus on digital transformation"],
    executiveReflectionQuestions: ["Recurring Topic 1", "Unique Advisory Topic"],
    systemicObservations: [],
    advisoryExecutiveSummary: "",
    strategicOpportunities: [],
    advisoryHypotheses: [],
    fiduciaryDisclaimer: ""
  };

  const mockManagementNarrative: ManagementNarrative = {
    managementActionPlan: ["Complete infrastructure migration"],
    accountabilityAgenda: [],
    operationalAttentionPoints: [],
    managementBriefing: "",
    executionPriorities: [],
    leadershipAlignmentAgenda: [],
    performanceMonitoringAgenda: [],
    fiduciaryDisclaimer: ""
  };

  test("should return undefined if no events can be generated", () => {
    assert.strictEqual(buildGovernanceMemory(undefined), undefined);
    assert.strictEqual(buildGovernanceMemory({}), undefined);
  });

  test("should build governance memory correctly preserving event integrity", () => {
    const reportLike: GovernanceMemoryReportLike = {
      boardNarrative: mockBoardNarrative,
      advisoryNarrative: mockAdvisoryNarrative,
      managementNarrative: mockManagementNarrative
    };
    
    const input: GovernanceMemoryInput = mapReportToGovernanceMemoryInput(reportLike);
    const result = buildGovernanceMemory(input);

    assert.ok(result);
    
    // Validate events extracted
    // Board Decision: 1, Board Action: 1, Advisory Rec: 1, Management Action: 1
    assert.strictEqual(result.events.length, 4);

    const boardDecisions = result.events.filter(e => e.eventType === "BOARD_DECISION");
    assert.strictEqual(boardDecisions.length, 1);
    assert.strictEqual(boardDecisions[0].description, "Approve Q1 Budget");
    assert.ok(boardDecisions[0].timestamp); // timestamp preserved

    const actionPlans = result.events.filter(e => e.eventType === "ACTION_PLAN_CREATED");
    assert.strictEqual(actionPlans.length, 2);

    const advisoryRecs = result.events.filter(e => e.eventType === "STRATEGIC_RECOMMENDATION");
    assert.strictEqual(advisoryRecs.length, 1);
    assert.strictEqual(advisoryRecs[0].description, "Focus on digital transformation");

    // Validate recurrence and learning
    assert.deepStrictEqual(result.recurringTopics, ["Recurring Topic 1"]);
    assert.strictEqual(result.institutionalLearnings.length, 1);
    assert.ok(result.institutionalLearnings[0].includes("1 tópicos transversais"));

    // Validate action items tracking
    assert.deepStrictEqual(result.openActionItems, ["Hire new CFO", "Complete infrastructure migration"]);
  });

  test("should not interfere with scores, metrics, and classifications during conditional spread", () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithInstitutionalPackage = {
      ...baseline,
      boardNarrative: mockBoardNarrative,
      advisoryNarrative: mockAdvisoryNarrative
    };

    const input = mapReportToGovernanceMemoryInput(reportWithInstitutionalPackage);
    const governanceMemory = buildGovernanceMemory(input);

    const reportWithGovernanceMemory = {
      ...reportWithInstitutionalPackage,
      ...(governanceMemory && { governanceMemory })
    };

    assert.deepStrictEqual(reportWithGovernanceMemory.scores, baseline.scores);
    assert.deepStrictEqual(reportWithGovernanceMemory.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithGovernanceMemory.classifications, baseline.classifications);
    assert.ok(reportWithGovernanceMemory.governanceMemory);
  });
});
