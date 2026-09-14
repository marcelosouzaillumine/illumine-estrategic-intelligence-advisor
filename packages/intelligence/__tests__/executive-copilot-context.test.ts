import { describe, it, expect } from 'vitest';
import { ExecutiveCopilotLayer } from '../executive-experience-composer/src';

describe('@illumine/governance (Wave 17.11 Copilot Contextual Initial Opening)', () => {
  it('should resolve contextual opening greeting for DRE page and active company', () => {
    const opening = ExecutiveCopilotLayer.resolveInitialCopilotState({
      companyName: 'Acme Corp',
      pageId: 'DREPage',
      period: '2026'
    });

    expect(opening.greetingText).toContain('Acme Corp');
    expect(opening.suggestedQuestions.length).toBeGreaterThan(0);
  });
});
