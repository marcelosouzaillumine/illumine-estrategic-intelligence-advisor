import { ExecutiveNarrative, ExecutiveViolation } from './types';

export class ViolationVisibilityPolicy {
  /**
   * Ensures violations are strictly visible and rendered correctly.
   */
  static assertVisibilityCompliance(narrative: ExecutiveNarrative, renderedViolations: ExecutiveViolation[]) {
    const originalIds = new Set(narrative.violations.map(v => v.violationId));
    const renderedIds = new Set(renderedViolations.map(v => v.violationId));

    if (originalIds.size !== renderedIds.size) {
      throw new Error('VIOLATION_VISIBILITY_BREACH: UI is hiding violations.');
    }

    for (const v of narrative.violations) {
      if (!renderedIds.has(v.violationId)) {
        throw new Error(`VIOLATION_VISIBILITY_BREACH: Violation ${v.violationId} was hidden.`);
      }
      const rendered = renderedViolations.find(rv => rv.violationId === v.violationId);
      if (rendered?.severity !== v.severity) {
        throw new Error(`VIOLATION_DOWNGRADE: Severity of violation ${v.violationId} was modified from ${v.severity} to ${rendered?.severity}.`);
      }
    }
  }

  static getMandatoryRenderList(narrative: ExecutiveNarrative): ExecutiveViolation[] {
    return [...narrative.violations]; // Immutable return
  }
}
