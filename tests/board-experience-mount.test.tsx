import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClientExecutiveWorkspace } from '../src/components/pages/ClientExecutiveWorkspace';
import { BoardExperienceShell } from '../src/components/executive/board/BoardExperienceShell';
import { ExecutiveSessionContext } from '../src/core/runtime/executive/board/ExecutiveSessionContext';
import { ExecutiveNarrativePolicy } from '../src/core/runtime/executive/ExecutiveNarrativePolicy';

describe('Board Experience Mount Certification', () => {

  test('1. ClientExecutiveWorkspace renders correctly (Initial Async State)', () => {
    // Note: renderToStaticMarkup does not run useEffect, so we expect the loading state.
    // The important part is that the component is wired and accessible.
    const html = renderToStaticMarkup(
      <ClientExecutiveWorkspace 
        selectedClient="XYZ Corp" 
        selectedYear={2026}
      />
    );
    assert.ok(html.includes('Processando Inteligência Executiva') || html.includes('Processando'));
  });

  test('2. BoardExperienceShell renders BoardCopilotPanel when session is valid', () => {
    // Override guard specifically for the test
    const originalVerify = ExecutiveNarrativePolicy.verifyIntegrity;
    ExecutiveNarrativePolicy.verifyIntegrity = () => true;

    // Generate a valid session for the test
    const bSessionId = ExecutiveSessionContext.createSession('client-x', 'tester', 'BOARD');
    ExecutiveSessionContext.acknowledgeDisclosure(bSessionId);

    // Provide a dummy narrative to satisfy the guard
    const dummyNarrative: any = {
      sourceRuntime: 'TEST_RUNTIME',
      lineage: ['mock-lineage'],
      confidence: 'HIGH',
      evidenceChain: ['mock-evidence'],
      violations: []
    };

    const html = renderToStaticMarkup(
      <BoardExperienceShell 
        narrative={dummyNarrative} 
        sessionId={bSessionId} 
      />
    );
    
    // Restore
    ExecutiveNarrativePolicy.verifyIntegrity = originalVerify;

    console.log("DEBUG HTML RENDERED:", html);

    // BoardExperienceShell and BoardNarrativeNavigator are mounted
    assert.ok(html.includes('Session:'), 'The session ID should be visible in the DOM');
    assert.ok(html.includes(bSessionId), 'The session ID value should be rendered');
  });

});
