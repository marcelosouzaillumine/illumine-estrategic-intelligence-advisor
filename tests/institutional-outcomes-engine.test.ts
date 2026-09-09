import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildInstitutionalOutcomesDatabase } from '../src/lib/institutional-outcomes-engine';
import { InstitutionalEvidenceInput } from '../src/lib/institutional-outcomes-types';

describe('Institutional Outcomes Engine', () => {
  it('should successfully build the outcomes database payload without mutating input', () => {
    const mockReport = {
      executiveSovereignty: { status: 'SOVEREIGN' },
      sectorIntelligence: { capabilityGaps: ['Digital Transformation'] }
    };

    const input: InstitutionalEvidenceInput = {
      existingRecords: [],
      executiveSovereigntyReport: mockReport
    };

    input.existingRecords = [
      { id: '1', level: 'E4', source: 'ACTION_PLAN', sourceReference: '', description: '', dateLogged: '', category: 'EXECUTION' }
    ];

    const db = buildInstitutionalOutcomesDatabase(input);
    
    assert.strictEqual(db.records.length, 1);
    assert.strictEqual(db.conversionMetrics.totalActions, 1);
    assert.strictEqual(db.transformationIndex.executionScore, 10);
    assert.strictEqual(db.evidenceAudit.predominantLevel, 'E4');
    assert.strictEqual(db.evidenceAudit.decisionInfluenceClassification, 'INSTITUTIONAL_GOVERNANCE_PLATFORM');
  });
});
