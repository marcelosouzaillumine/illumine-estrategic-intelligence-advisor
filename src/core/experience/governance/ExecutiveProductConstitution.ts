import { ExperienceHierarchyValidator } from './ExperienceHierarchyValidator';
import { ExecutiveProductSchema } from '../schema/ExecutiveProductSchema';
import { ExperienceSectionOrder } from './ExecutiveHierarchyContract';

export class ExecutiveProductConstitution {
  /**
   * Validates if a proposed intelligence product complies with the Constitution.
   */
  static validateProductContract(product: ExecutiveProductSchema): void {
    if (!product.id || !product.office || !product.purpose || !product.executiveDecisionSupported) {
      throw new Error('[Executive Product Constitution]: Missing required product definitions (id, office, purpose, decisionSupported).');
    }

    if (!product.hierarchy || product.hierarchy.length === 0) {
      throw new Error('[Executive Product Constitution]: A product must specify its hierarchy of sections.');
    }

    // Constitutional Rule: Hierarchy is strictly governed.
    // Map the string keys to their enum values for validation
    const orderValues = product.hierarchy.map(s => ExperienceSectionOrder[s.type]);
    ExperienceHierarchyValidator.validateOrder(orderValues);
    ExperienceHierarchyValidator.validateEvidenceIsLast(orderValues);
  }
}

