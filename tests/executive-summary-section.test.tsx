import 'global-jsdom/register';
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { ExecutiveSummarySection } from '../src/components/executive-architecture/executive-summary-section';

describe('ExecutiveSummarySection', () => {
  afterEach(() => {
    cleanup();
  });
  
  it('should render as a section element with data-eac-block and accessible role', () => {
    render(<ExecutiveSummarySection aria-label="Síntese Executiva">Content</ExecutiveSummarySection>);
    
    // Testa acessibilidade: se tem tag section + aria-label, expõe role="region"
    const region = screen.getByRole('region', { name: 'Síntese Executiva' });
    assert.ok(region, 'Deve ser acessível como region');
    
    assert.strictEqual(region.tagName.toLowerCase(), 'section');
    assert.strictEqual(region.getAttribute('data-eac-block'), 'executive-summary');
    assert.ok(!region.className.includes('contents'), 'Não deve possuir display: contents');
  });

  it('should preserve aria-label and id', () => {
    render(
      <ExecutiveSummarySection aria-label="Test Summary" id="test-id">
        Content
      </ExecutiveSummarySection>
    );
    const region = screen.getByRole('region', { name: 'Test Summary' });
    assert.strictEqual(region.getAttribute('aria-label'), 'Test Summary');
    assert.strictEqual(region.id, 'test-id');
  });

  it('should forward refs properly', () => {
    const ref = React.createRef<HTMLElement>();
    render(<ExecutiveSummarySection aria-label="Ref Test" ref={ref}>Content</ExecutiveSummarySection>);
    assert.ok(ref.current !== null);
    assert.strictEqual(ref.current?.tagName.toLowerCase(), 'section');
  });
});
