import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutionalGovernanceDashboardEngine } from '../src/core/runtime/constitutional-governance/ConstitutionalGovernanceDashboardEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('ConstitutionalGovernanceDashboardEngine Suite', async () => {
  await it('Scenario A: Fully compliant institution -> COMPLIANT', () => {
    const mockOutput = {
      status: 'COMPLETED',
      canonicalState: {
        confidence: 'HIGH',
        restrictions: [],
        warnings: [],
        isLineageIncomplete: false,
        lineageHash: 'valid-hash-123'
      }
    };
    
    const dashboard = ConstitutionalGovernanceDashboardEngine.generate(mockOutput as any);
    assert.equal(dashboard.constitutionalStatus, 'COMPLIANT');
    assert.equal(dashboard.quarantineState, undefined);
    assert.equal(dashboard.restrictions.length, 0);
    assert.equal(dashboard.confidenceBreakdown?.overallConfidence, 'HIGH_CONFIDENCE');
  });

  await it('Scenario B: Active governance restrictions -> Restrictions displayed', () => {
    const mockOutput = {
      status: 'COMPLETED',
      canonicalState: {
        confidence: 'HIGH',
        restrictions: [
          { type: 'BLOCKED_BY_GOVERNANCE', reason: 'Capital deficit' }
        ],
        warnings: [],
        isLineageIncomplete: false
      }
    };
    
    const dashboard = ConstitutionalGovernanceDashboardEngine.generate(mockOutput as any);
    assert.equal(dashboard.constitutionalStatus, 'RESTRICTED');
    assert.ok(dashboard.restrictions.length > 0);
    assert.equal(dashboard.restrictions[0].level, 'BLOCKED');
  });

  await it('Scenario C: Constitutional enforcement active -> Enforcement visible', () => {
    const mockOutput = {
      status: 'COMPLETED',
      canonicalState: {
        confidence: 'MODERATE',
        restrictions: [],
        warnings: ['Margin deterioration detected'],
        isLineageIncomplete: true
      }
    };
    
    const dashboard = ConstitutionalGovernanceDashboardEngine.generate(mockOutput as any);
    assert.ok(dashboard.enforcementActions.length > 0);
    assert.ok(dashboard.enforcementActions.find(a => a.actionId === 'ENF-LINEAGE-01') !== undefined);
    assert.equal(dashboard.confidenceBreakdown?.lineageContinuity, 'ORPHANED');
  });

  await it('Scenario D: Broken lineage -> FAIL_CLOSED', () => {
    const mockOutput = {
      status: 'COMPLETED',
      canonicalState: {
        confidence: 'BLOCKED',
        restrictions: [],
        warnings: [],
        isLineageIncomplete: true
      }
    };
    
    const dashboard = ConstitutionalGovernanceDashboardEngine.generate(mockOutput as any);
    assert.equal(dashboard.constitutionalStatus, 'FAIL_CLOSED');
    assert.equal(dashboard.confidenceBreakdown?.overallConfidence, 'FAIL_CLOSED');
    assert.equal(dashboard.axiomStatus.find(a => a.axiom === 'Lineage Integrity')?.status, 'RESTRICTED');
  });

  await it('Scenario E: Constitutional quarantine -> Quarantine dominates dashboard state', () => {
    const mockOutput = {
      status: 'CONSTITUTIONAL_QUARANTINE',
      constitutionalSection: {
        quarantineReason: 'Axiom conflict: survivability compromised'
      },
      canonicalState: {
        confidence: 'BLOCKED',
        restrictions: [],
        warnings: [],
        isLineageIncomplete: true
      }
    };
    
    const dashboard = ConstitutionalGovernanceDashboardEngine.generate(mockOutput as any);
    assert.equal(dashboard.constitutionalStatus, 'FAIL_CLOSED');
    assert.ok(dashboard.quarantineState !== undefined);
    assert.equal(dashboard.quarantineState?.isQuarantined, true);
    assert.ok(dashboard.quarantineState?.suppressedSystems.includes('Executive Timeline'));
    
    // Enforcement should include quarantine action
    assert.ok(dashboard.enforcementActions.find(a => a.severity === 'QUARANTINE') !== undefined);
  });

  await it('Scenario F: UI passive compliance -> Components do not import runtime engines', () => {
    const panelDir = path.join(__dirname, '../src/components/pages/governance');
    
    const files = [
      'ConstitutionalAxiomPanel.tsx',
      'ConstitutionalRestrictionPanel.tsx',
      'ConstitutionalEnforcementPanel.tsx',
      'ConstitutionalLineagePanel.tsx',
      'ConstitutionalConfidencePanel.tsx',
      'ConstitutionalGovernanceDashboardPanel.tsx'
    ];

    files.forEach(file => {
      const content = fs.readFileSync(path.join(panelDir, file), 'utf-8');
      
      // Should not import engines or calculators
      assert.ok(!/import.*Engine/.test(content), `File ${file} should not import Engine`);
      assert.ok(!/import.*calculate/.test(content), `File ${file} should not import calculate`);
    });
  });
});
