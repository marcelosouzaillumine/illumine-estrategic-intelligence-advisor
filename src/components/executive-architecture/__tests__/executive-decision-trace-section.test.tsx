import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ExecutiveDecisionTraceSection } from '../executive-decision-trace-section';

describe('ExecutiveDecisionTraceSection', () => {
  it('renders a native section element', () => {
    render(
      <ExecutiveDecisionTraceSection aria-label="Trace section">
        <div>Content</div>
      </ExecutiveDecisionTraceSection>
    );
    const section = screen.getByRole('region', { name: 'Trace section' });
    assert.strictEqual(section.tagName.toLowerCase(), 'section');
  });

  it('enforces aria-label and region role', () => {
    render(
      <ExecutiveDecisionTraceSection aria-label="My Trace">
        <span>Test</span>
      </ExecutiveDecisionTraceSection>
    );
    assert.ok(screen.getByRole('region', { name: 'My Trace' }));
  });

  it('injects data-eac-block="decision-trace"', () => {
    render(
      <ExecutiveDecisionTraceSection aria-label="Block test">
        <span>Test</span>
      </ExecutiveDecisionTraceSection>
    );
    const section = screen.getByRole('region', { name: 'Block test' });
    assert.strictEqual(section.getAttribute('data-eac-block'), 'decision-trace');
  });

  it('passes className without injecting default styles', () => {
    render(
      <ExecutiveDecisionTraceSection aria-label="Class test" className="custom-trace-class">
        <span>Test</span>
      </ExecutiveDecisionTraceSection>
    );
    const section = screen.getByRole('region', { name: 'Class test' });
    assert.ok(section.className.includes('custom-trace-class'));
  });

  it('preserves children', () => {
    render(
      <ExecutiveDecisionTraceSection aria-label="Children test">
        <div data-testid="child">Child Content</div>
      </ExecutiveDecisionTraceSection>
    );
    assert.ok(screen.getByTestId('child'));
    assert.ok(screen.getByText('Child Content'));
  });
});
