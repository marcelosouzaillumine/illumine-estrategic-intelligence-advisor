import { describe, it, expect } from 'vitest';
import { ExperienceHierarchyValidator, ExperienceHierarchyError } from '../ExperienceHierarchyValidator';
import { ExperienceSectionOrder } from '../ExecutiveHierarchyContract';
import { ExecutiveProductConstitution } from '../ExecutiveProductConstitution';
import { ExecutiveProductSchema } from '../../schema/ExecutiveProductSchema';

describe('Executive Hierarchy Enforcement', () => {

  it('should pass for a correctly ordered hierarchy', () => {
    const validHierarchy = [
      ExperienceSectionOrder.EXECUTIVE_SUMMARY,
      ExperienceSectionOrder.STRATEGIC_INTERPRETATION,
      ExperienceSectionOrder.TECHNICAL_EVIDENCE
    ];
    
    expect(() => {
      ExperienceHierarchyValidator.validateOrder(validHierarchy);
      ExperienceHierarchyValidator.validateEvidenceIsLast(validHierarchy);
    }).not.toThrow();
  });

  it('should throw if sections are out of order', () => {
    const invalidHierarchy = [
      ExperienceSectionOrder.STRATEGIC_INTERPRETATION,
      ExperienceSectionOrder.EXECUTIVE_SUMMARY
    ];
    
    expect(() => {
      ExperienceHierarchyValidator.validateOrder(invalidHierarchy);
    }).toThrow(ExperienceHierarchyError);
  });

  it('should throw if TECHNICAL_EVIDENCE is not the absolute last section', () => {
    const invalidHierarchy = [
      ExperienceSectionOrder.EXECUTIVE_SUMMARY,
      ExperienceSectionOrder.TECHNICAL_EVIDENCE,
      ExperienceSectionOrder.CFO_QUESTIONS
    ];
    
    // Ordered strictly ascending, but TECHNICAL_EVIDENCE isn't last
    // Wait, technically 1, 6, 5 will fail the validateOrder first.
    // Let's test just the validateEvidenceIsLast directly
    expect(() => {
      ExperienceHierarchyValidator.validateEvidenceIsLast(invalidHierarchy);
    }).toThrow(/TECHNICAL_EVIDENCE must always be the absolute last section/);
  });

  it('should validate an entire product contract successfully', () => {
    const validProduct: any = {
      id: 'test.product',
      office: 'CFO_OFFICE',
      purpose: 'Preservar valor',
      primaryUser: 'CFO',
      executiveDecisionSupported: ['Alocação de capital'],
      hierarchy: [
        { type: 'EXECUTIVE_SUMMARY', components: [] },
        { type: 'TECHNICAL_EVIDENCE', components: [] }
      ],
      allowedVisualPatterns: []
    };

    expect(() => {
      ExecutiveProductConstitution.validateProductContract(validProduct);
    }).not.toThrow();
  });
});
