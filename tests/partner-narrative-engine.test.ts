import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildPartnerNarrative } from '../src/lib/partner-narrative-engine';
import { PartnerNarrativeInput, PartnerNarrativeReportLike } from '../src/lib/partner-narrative-types';
import { ExecutiveFinancialStory } from '../src/lib/executive-financial-story-types';
import { mapReportToPartnerNarrativeInput } from '../src/lib/partner-narrative-mapper';

describe('Partner Narrative Layer v1.0', () => {

  const mockExecutiveFinancialStory: ExecutiveFinancialStory = {
    executiveBriefing: 'Value Creation Briefing',
    boardMessage: 'Capital Preservation Message',
    partnerMessage: 'Shareholder & Distribution Message',
    managementMessage: 'Patrimonial Growth Message',
    advisoryMessage: 'Long Term Sustainability Message',
    decisionQuestions: ['Q1', 'Q2'],
    fiduciaryAttentionPoints: ['Att 1', 'Att 2'],
    recommendedDiscussionAgenda: ['Agenda 1'],
    fiduciaryDisclaimer: 'Disclaimer'
  };

  test('should return undefined if no executiveFinancialStory is provided', () => {
    assert.strictEqual(buildPartnerNarrative(undefined), undefined);
    assert.strictEqual(buildPartnerNarrative({}), undefined);
  });

  test('should map and build PartnerNarrative correctly', () => {
    const reportLike: PartnerNarrativeReportLike = {
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input: PartnerNarrativeInput = mapReportToPartnerNarrativeInput(reportLike);
    const result = buildPartnerNarrative(input);

    assert.ok(result);
    assert.strictEqual(result.shareholderMessage, 'Shareholder & Distribution Message');
    assert.strictEqual(result.valueCreationNarrative, 'Value Creation Briefing');
    assert.strictEqual(result.capitalPreservationNarrative, 'Capital Preservation Message');
    assert.strictEqual(result.patrimonialGrowthNarrative, 'Patrimonial Growth Message');
    assert.strictEqual(result.longTermSustainabilityNarrative, 'Long Term Sustainability Message');
    assert.strictEqual(result.distributionPerspective, 'Shareholder & Distribution Message');
    assert.deepStrictEqual(result.partnerReflectionQuestions, ['Q1', 'Q2']);
    assert.deepStrictEqual(result.strategicOwnershipAgenda, ['Agenda 1']);
    assert.strictEqual(result.fiduciaryDisclaimer, 'Esta narrativa societária deriva exclusivamente da Executive Financial Story, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias.');
  });

  test('should not interfere with scores, metrics, and classifications during conditional spread', () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: 'GOOD' }
    };

    const reportWithAdvisoryNarrative = {
      ...baseline,
      executiveFinancialStory: mockExecutiveFinancialStory
    };

    const input = mapReportToPartnerNarrativeInput(reportWithAdvisoryNarrative);
    const partnerNarrative = buildPartnerNarrative(input);

    const reportWithPartnerNarrative = {
      ...reportWithAdvisoryNarrative,
      ...(partnerNarrative && { partnerNarrative })
    };

    assert.deepStrictEqual(reportWithPartnerNarrative.scores, baseline.scores);
    assert.deepStrictEqual(reportWithPartnerNarrative.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithPartnerNarrative.classifications, baseline.classifications);
    assert.ok(reportWithPartnerNarrative.partnerNarrative);
  });

});
