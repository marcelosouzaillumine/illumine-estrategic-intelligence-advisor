import { ExperienceSectionOrder } from './ExecutiveHierarchyContract';

export class ExperienceHierarchyError extends Error {
  constructor(message: string) {
    super(`[Experience Governance Error]: ${message}`);
    this.name = 'ExperienceHierarchyError';
  }
}

export class ExperienceHierarchyValidator {
  /**
   * Validates if a provided array of section orders complies with the strict hierarchy rules.
   * Sections must be in strictly ascending order.
   */
  static validateOrder(sections: ExperienceSectionOrder[]): void {
    if (!sections || sections.length === 0) {
      throw new ExperienceHierarchyError('A product must contain at least one section.');
    }

    for (let i = 0; i < sections.length - 1; i++) {
      if (sections[i] >= sections[i + 1]) {
        const currentName = ExperienceSectionOrder[sections[i]];
        const nextName = ExperienceSectionOrder[sections[i + 1]];
        throw new ExperienceHierarchyError(`Hierarchy violation: ${nextName} cannot appear before or equal to ${currentName}.`);
      }
    }
  }

  /**
   * Ensures that TECHNICAL_EVIDENCE is always the absolute last section if it is included.
   */
  static validateEvidenceIsLast(sections: ExperienceSectionOrder[]): void {
    const evidenceIndex = sections.indexOf(ExperienceSectionOrder.TECHNICAL_EVIDENCE);
    if (evidenceIndex !== -1 && evidenceIndex !== sections.length - 1) {
      throw new ExperienceHierarchyError('Hierarchy violation: TECHNICAL_EVIDENCE must always be the absolute last section in the product.');
    }
  }
}
