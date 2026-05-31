import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InstitutionalContinuityMockFactory } from '../../../src/testing/fixtures/institutional-continuity/InstitutionalContinuityMockFactory.ts';
import { InstitutionalLifecycleSurface } from '../../../src/components/institutional-continuity/InstitutionalLifecycleSurface.tsx';
import { ResilienceAntifragilityRadar } from '../../../src/components/institutional-continuity/ResilienceAntifragilityRadar.tsx';
import { ExecutiveContinuityNarrativePanel } from '../../../src/components/institutional-continuity/ExecutiveContinuityNarrativePanel.tsx';
import { FiduciaryRestrictionOverlay } from '../../../src/components/institutional-continuity/FiduciaryRestrictionOverlay.tsx';
import { FiduciaryContinuityPanel } from '../../../src/components/institutional-continuity/FiduciaryContinuityPanel.tsx';

describe('Institutional Continuity Cockpit UI Governance Tests', () => {

  it('1. UI renders runtime outputs without recalculation (Narrative exact match)', () => {
    const mockState = InstitutionalContinuityMockFactory.createHealthyBaseline();
    const html = renderToStaticMarkup(
      <ExecutiveContinuityNarrativePanel 
        survivalNarrative={mockState.survivalReport.survivalNarrative}
        recoveryNarrative={mockState.recoveryReport.recoveryNarrative}
        regressionNarrative={mockState.regressionReport.regressionNarrative}
        resilienceNarrative={mockState.resilienceReport.resilienceNarrative}
        confidenceLevel={mockState.resilienceReport.confidenceLevel}
        failClosedTriggered={mockState.failClosedTriggered}
      />
    );
    
    // Check exact strings from runtime without frontend mutation
    assert.ok(html.includes(mockState.resilienceReport.resilienceNarrative), 'Narrative should be rendered exactly as provided by runtime');
    assert.ok(html.includes(mockState.survivalReport.survivalNarrative), 'Survival narrative should be rendered exactly');
  });

  it('2. Antifragility badge locks when confidence < HIGH', () => {
    const mockState = InstitutionalContinuityMockFactory.createHealthyBaseline();
    // Force confidence low to test the lock mechanism
    mockState.resilienceReport.confidenceLevel = 'LOW';
    
    const html = renderToStaticMarkup(
      <ResilienceAntifragilityRadar 
        resilienceScore={mockState.resilienceReport.resilienceScore}
        antifragilityScore={mockState.resilienceReport.antifragilityScore}
        vulnerabilityReductionScore={mockState.resilienceReport.vulnerabilityReductionScore}
        institutionalLearningScore={mockState.resilienceReport.institutionalLearningScore}
        shockAbsorptionScore={mockState.resilienceReport.shockAbsorptionScore}
        resilienceClassification={mockState.resilienceReport.resilienceClassification}
        antifragilityValidated={mockState.resilienceReport.antifragilityValidated}
        confidenceLevel={mockState.resilienceReport.confidenceLevel}
        blockedConclusions={mockState.resilienceReport.blockedConclusions}
        allowedConclusions={mockState.resilienceReport.allowedConclusions}
      />
    );

    // Should indicate locked status and NOT show unlocked visual cues
    assert.ok(html.includes('Antifragility badge locked'), 'Must lock antifragility badge when confidence is low');
  });

  it('3. Survival mode overrides optimistic visuals in Hero Panel', () => {
    const fragileState = InstitutionalContinuityMockFactory.createFragileState();
    
    const html = renderToStaticMarkup(
      <FiduciaryContinuityPanel 
        activeSurvivalMode={fragileState.survivalReport.activeSurvivalMode}
        activeRecoveryStage={fragileState.recoveryReport.activeRecoveryStage}
        regressionDetected={fragileState.regressionReport.regressionDetected}
        resilienceClassification={fragileState.resilienceReport.resilienceClassification}
        antifragilityValidated={fragileState.resilienceReport.antifragilityValidated}
        institutionalRecoveryConfidence={fragileState.recoveryReport.institutionalRecoveryConfidence}
        treasuryProtectionLevel={fragileState.fiduciaryOutput.treasuryProtectionLevel}
        institutionalContinuityRisk={fragileState.fiduciaryOutput.institutionalContinuityRisk}
        confidenceLevel={fragileState.resilienceReport.confidenceLevel}
      />
    );

    // Look for critical UI elements
    assert.ok(html.includes('bg-red-950'), 'Critical state (bg-red-950) should dominate panel colors');
    assert.ok(html.includes('SURVIVAL_MODE'), 'Must show SURVIVAL_MODE explicitly');
  });

  it('5. Restriction overlay displays active fiduciary locks', () => {
    const fragileState = InstitutionalContinuityMockFactory.createFragileState();
    
    const html = renderToStaticMarkup(
      <FiduciaryRestrictionOverlay 
        activeFiduciaryLocks={fragileState.fiduciaryOutput.activeFiduciaryLocks}
        blockedActions={fragileState.survivalReport.blockedActions}
        survivalTriggersActive={fragileState.survivalReport.survivalTriggersActive}
        consolidatedSeverity={fragileState.fiduciaryOutput.consolidatedSeverity}
        failClosedTriggered={fragileState.failClosedTriggered}
      />
    );

    // The component replaces underscores with spaces in lock labels, check for standard blocked strings
    assert.ok(html.includes('Distribuição de Dividendos Bloqueada') || html.includes('DIVIDEND_BLOCKED'), 'Must render dividend block');
    assert.ok(html.includes('FCO_NEGATIVO_CRITICO'), 'Must render active survival trigger');
    assert.ok(html.includes('bg-red-950/30') || html.includes('text-red-400'), 'Must render with critical severity colors');
  });

  it('7. Fail-closed state collapses optimistic surfaces', () => {
    const failState = InstitutionalContinuityMockFactory.createFailClosedState();
    
    const html = renderToStaticMarkup(
      <InstitutionalLifecycleSurface 
        activeSurvivalMode={failState.survivalReport.activeSurvivalMode}
        activeRecoveryStage={failState.recoveryReport.activeRecoveryStage}
        regressionDetected={failState.regressionReport.regressionDetected}
        resilienceClassification={failState.resilienceReport.resilienceClassification}
        antifragilityValidated={failState.resilienceReport.antifragilityValidated}
        confidenceLevel={failState.resilienceReport.confidenceLevel}
      />
    );

    assert.ok(html.includes('Garantia Fiduciária Ativa'), 'Must show active fiduciary guarantee warning');
    assert.ok(html.includes('Fail-Closed'), 'Must indicate fail-closed constraint');
  });
});
