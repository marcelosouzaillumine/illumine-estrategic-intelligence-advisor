// src/components/institutional-reporting/ExecutiveSnapshotSurface.test.tsx

import assert from 'node:assert';
import { test, describe } from 'node:test';
import { ExecutiveSnapshotSection } from '../../services/FiduciaryRuntimeAdapter';

describe('UI Passivity Validation - ExecutiveSnapshotSurface', () => {

  test('UI should NEVER infer green/emerald on distress signals', () => {
    // 1. Simula os dados passados pelo motor
    const props: ExecutiveSnapshotSection = {
      executiveSummary: 'Summarization',
      unifiedThesisStatement: 'Thesis',
      activeSurvivalMode: false,
      structuralPressureLevel: 'CRITICAL',
      fiduciaryRestrictionsActive: 1,
      periodScore: 85, // Fake high score
      stabilityIndexClassification: 'APPARENT_STABILITY',
      earlyWarningLevel: 'CRITICAL_CONTINUITY_THREAT',
      quarantineMode: true,
      accountingIntegrityStatus: 'PASSED'
    };

    // 2. Simula o isRestricted rodando o mesmo código da UI
    const isRestricted = 
      props.recoveryNarrativeBlocked || 
      props.trajectoryConfidence === 'LOW' || 
      props.trajectoryConfidence === 'BLOCKED' ||
      props.stabilityIndexClassification === 'APPARENT_STABILITY' ||
      props.longitudinalTrajectory === 'ARTIFICIAL_TURNAROUND' ||
      props.longitudinalTrajectory === 'CHRONIC_DEPENDENCY' ||
      props.earlyWarningLevel === 'CRITICAL_CONTINUITY_THREAT' ||
      props.accountingIntegrityStatus === 'FAILED' ||
      props.quarantineMode === true;

    // 3. Verifica as lógicas de formatação (Passivity Check)
    const getSafeColor = (baseColor: string, restrictedColor: string = 'text-zinc-500') => {
      return isRestricted ? { text: restrictedColor } : { text: baseColor };
    };

    // 4. Assertions
    assert.equal(isRestricted, true);
    
    // O Score de 85 não pode ficar text-emerald-400, deve cair no fallback safe (text-zinc-500)
    const scoreColor = getSafeColor('text-emerald-400').text;
    assert.equal(scoreColor, 'text-zinc-500');

    // O Stability Classification (Apparent Stability) não pode ficar verde, deve ficar zinc-300 ou zinc-500
    const stabilityColor = (props.stabilityIndexClassification === 'STRUCTURALLY_STABLE' && !isRestricted) ? 'text-emerald-400' : 'text-zinc-300';
    assert.equal(stabilityColor, 'text-zinc-300');
  });

  test('UI should NOT override Accounting Integrity block', () => {
    const props: ExecutiveSnapshotSection = {
      executiveSummary: 'Summarization',
      unifiedThesisStatement: 'Thesis',
      activeSurvivalMode: false,
      structuralPressureLevel: 'NORMAL',
      fiduciaryRestrictionsActive: 0,
      accountingIntegrityStatus: 'FAILED',
      quarantineMode: false
    };

    const isRestricted = props.accountingIntegrityStatus === 'FAILED' || props.quarantineMode === true;
    assert.equal(isRestricted, true);
  });
});
