import { describe, it, expect } from 'vitest';
import { PageQuestionLauncher } from '@illumine/executive-question-interface';

describe('@illumine/intelligence (Wave 17.6 Phase 4 Page Context Propagation)', () => {
  it('should propagate page context, active filters and user persona to question launcher', () => {
    const payload = PageQuestionLauncher.launchQuestion('Quais são os principais riscos?', 'EFOSPage', 'CFO', ['RUNWAY', 'FCO']);

    expect(payload.pageContext).toBe('EFOSPage');
    expect(payload.userRole).toBe('CFO');
    expect(payload.relevantKPIs).toContain('RUNWAY');
  });
});
