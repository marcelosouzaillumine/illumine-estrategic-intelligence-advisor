import { describe, it, expect } from 'vitest';
import { ExecutiveCopilotLayer } from '@illumine/executive-experience-composer';

describe('@illumine/intelligence (Wave 17.11 Copilot Contextual Initial Opening)', () => {
  it('should resolve contextual opening greeting for DRE page and active company', () => {
    const opening = ExecutiveCopilotLayer.resolveInitialCopilotState({
      companyName: 'Acme Corp',
      pageId: 'DREPage'
    });

    expect(opening.greetingText).toContain('Ambiente DRE de Acme Corp identificado');
    expect(opening.suggestedQuestions.length).toBeGreaterThan(0);
  });
});
