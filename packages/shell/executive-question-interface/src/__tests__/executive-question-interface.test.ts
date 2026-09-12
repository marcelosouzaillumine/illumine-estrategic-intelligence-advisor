import { describe, it, expect } from 'vitest';
import { ContextualQuestionMenu, PageQuestionLauncher } from '../index';

describe('@illumine/executive-question-interface (Wave 17.5 Phase 3 Question Menu & Launcher)', () => {
  it('should launch contextual page question payload preserving user role and page context (ADR-056)', () => {
    const menuOptions = ContextualQuestionMenu.getMenuOptions('DREPage');
    expect(menuOptions.length).toBe(6);

    const payload = PageQuestionLauncher.launchQuestion('Explique os indicadores', 'DREPage', 'CEO', ['EBITDA', 'NET_INCOME']);
    expect(payload.pageContext).toBe('DREPage');
    expect(payload.userRole).toBe('CEO');
    expect(payload.relevantKPIs).toContain('EBITDA');
  });
});
