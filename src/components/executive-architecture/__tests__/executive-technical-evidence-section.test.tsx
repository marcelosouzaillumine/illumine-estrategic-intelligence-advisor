import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ExecutiveTechnicalEvidenceSection } from '../executive-technical-evidence-section';

describe('ExecutiveTechnicalEvidenceSection', () => {
  it('renders a native section element', () => {
    render(
      <ExecutiveTechnicalEvidenceSection aria-label="Evidence section">
        <div>Content</div>
      </ExecutiveTechnicalEvidenceSection>
    );
    const section = screen.getByRole('region', { name: 'Evidence section' });
    assert.strictEqual(section.tagName.toLowerCase(), 'section');
  });

  it('enforces aria-label and region role', () => {
    render(
      <ExecutiveTechnicalEvidenceSection aria-label="My Evidence">
        <span>Test</span>
      </ExecutiveTechnicalEvidenceSection>
    );
    assert.ok(screen.getByRole('region', { name: 'My Evidence' }));
  });

  it('injects data-eac-block="technical-evidence"', () => {
    render(
      <ExecutiveTechnicalEvidenceSection aria-label="Block test">
        <span>Test</span>
      </ExecutiveTechnicalEvidenceSection>
    );
    const section = screen.getByRole('region', { name: 'Block test' });
    assert.strictEqual(section.getAttribute('data-eac-block'), 'technical-evidence');
  });

  it('passes className without injecting default styles', () => {
    render(
      <ExecutiveTechnicalEvidenceSection aria-label="Class test" className="custom-class">
        <span>Test</span>
      </ExecutiveTechnicalEvidenceSection>
    );
    const section = screen.getByRole('region', { name: 'Class test' });
    assert.ok(section.className.includes('custom-class'));
  });

  it('preserves children', () => {
    render(
      <ExecutiveTechnicalEvidenceSection aria-label="Children test">
        <div data-testid="child">Child Content</div>
      </ExecutiveTechnicalEvidenceSection>
    );
    assert.ok(screen.getByTestId('child'));
    assert.ok(screen.getByText('Child Content'));
  });
});
