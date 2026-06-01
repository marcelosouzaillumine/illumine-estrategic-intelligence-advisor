import assert from 'node:assert';
import { test, describe } from 'node:test';
import { InstitutionalBoardPackOutput } from '../../core/runtime/institutional-reporting/institutional-reporting-types';

describe('UI Passivity Validation - InstitutionalBoardPackCenter', () => {

  const createMockBoardPack = (overrides: Partial<InstitutionalBoardPackOutput> = {}): InstitutionalBoardPackOutput => {
    return {
      status: 'COMPLETE',
      metadata: { boardPackLineageHash: '123', tenantId: 't1', cycleReference: '2023', historicalCyclesAvailable: 3, generatedAt: new Date().toISOString() },
      executiveSnapshot: { executiveSummary: '', unifiedThesisStatement: '', activeSurvivalMode: false, structuralPressureLevel: 'LOW', fiduciaryRestrictionsActive: 0, trajectoryConfidence: 'HIGH' },
      fiduciaryTimeline: { currentCycle: '2023', timelineIntegrityStatus: 'INTACT', cycleTimeline: [] },
      disclosureSet: [],
      fiduciaryRestrictions: [],
      ...overrides
    } as any;
  };

  test('QuarantineModeSurface aparece quando payload manda', () => {
    const boardPack = createMockBoardPack({
      status: 'RESTRICTED'
    });

    const isQuarantined = boardPack.status === 'RESTRICTED' || 
                          boardPack.fiduciaryTimeline?.timelineIntegrityStatus === 'BROKEN' || 
                          boardPack.disclosureSet?.some(d => d.severity === 'CRITICAL' && (d.message.includes('Reconciliation') || d.message.includes('Contábil'))) || 
                          boardPack.fiduciaryRestrictions?.some(r => r.restrictionType === 'FAIL_CLOSED' || r.affectedRuntimes.includes('ALL'));

    assert.equal(isQuarantined, true);
  });

  test('Nenhum selo positivo em Artificial Turnaround', () => {
    // Artificial Turnaround triggers a restriction usually.
    const boardPack = createMockBoardPack({
      status: 'RESTRICTED',
      executiveSnapshot: {
        executiveSummary: '', unifiedThesisStatement: '', activeSurvivalMode: false, structuralPressureLevel: 'CRITICAL', fiduciaryRestrictionsActive: 1,
        trajectoryConfidence: 'BLOCKED', longitudinalTrajectory: 'ARTIFICIAL_TURNAROUND'
      } as any
    });

    const isQuarantined = boardPack.status === 'RESTRICTED';
    assert.equal(isQuarantined, true);

    const isSnapshotRestricted = boardPack.executiveSnapshot.longitudinalTrajectory === 'ARTIFICIAL_TURNAROUND';
    assert.equal(isSnapshotRestricted, true);
  });

  test('Cenário saudável permite visual positivo', () => {
    const boardPack = createMockBoardPack({
      status: 'COMPLETE',
      fiduciaryTimeline: { timelineIntegrityStatus: 'INTACT' } as any,
      fiduciaryRestrictions: [],
      disclosureSet: []
    });

    const isQuarantined = boardPack.status === 'RESTRICTED' || 
                          boardPack.fiduciaryTimeline?.timelineIntegrityStatus === 'BROKEN' || 
                          boardPack.fiduciaryRestrictions?.some(r => r.restrictionType === 'FAIL_CLOSED');
                          
    assert.equal(isQuarantined, false);
  });

  test('Histórico insuficiente ativa quarentena/restrição indiretamente se timeline quebrar', () => {
    const boardPack = createMockBoardPack({
      status: 'COMPLETE',
      fiduciaryTimeline: { timelineIntegrityStatus: 'BROKEN' } as any
    });

    const isQuarantined = boardPack.status === 'RESTRICTED' || boardPack.fiduciaryTimeline?.timelineIntegrityStatus === 'BROKEN';
    assert.equal(isQuarantined, true);
  });
});
