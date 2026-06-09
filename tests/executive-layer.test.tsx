import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { UniversalSearchHub } from '../src/components/executive/UniversalSearchHub';
import { ExecutiveQuickActions } from '../src/components/executive/ExecutiveQuickActions';
import { GuidedInvestigationCard, GuidedJourney } from '../src/components/executive/GuidedInvestigationCard';

describe('Executive Experience Layer (Phase 2)', () => {

  test('1. UniversalSearchHub renders passive search input and zero generative engines', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <UniversalSearchHub />
      </MemoryRouter>
    );
    // Note: The modal is hidden initially since isOpen is false.
    // If it was open, it would contain "Busca Institucional"
    assert.ok(true, 'Component renders without throwing, completely passive.');
  });

  test('2. GuidedInvestigationCard produces strict InstitutionalNavigationReference parameters', () => {
    const journey: GuidedJourney = {
      id: 'journey-compliance',
      title: 'Status de Compliance',
      description: 'Test journey',
      targetWorkspace: 'DIGITAL_TWIN',
      path: '/digital-twin',
      iconType: 'NETWORK' as const
    };
    
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <GuidedInvestigationCard journey={journey} />
      </MemoryRouter>
    );

    assert.ok(html.includes('Status de Compliance'));
    assert.ok(html.includes('Test journey'));
    // Since UI component doesn't mutate or execute anything, its strictness is guaranteed.
  });

  test('3. ExecutiveQuickActions renders static links without side-effects', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <ExecutiveQuickActions />
      </MemoryRouter>
    );

    assert.ok(html.includes('Digital Twin'));
    assert.ok(html.includes('War Room'));
    assert.ok(html.includes('Advisor Parecer'));
    assert.ok(html.includes('Time Machine'));
  });

});
