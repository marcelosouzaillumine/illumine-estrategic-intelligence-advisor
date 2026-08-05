import { describe, it, expect } from 'vitest';
import { ExecutiveProductConstitution } from '../ExecutiveProductConstitution';
import { ExecutiveProductSchema } from '../../schema/ExecutiveProductSchema';

describe('Product Constitution Regression', () => {
  it('must enforce that all products have a valid executive purpose and office', () => {
    const invalidProduct = {
      id: 'test',
      // Missing office, purpose, etc.
    } as ExecutiveProductSchema;

    expect(() => {
      ExecutiveProductConstitution.validateProductContract(invalidProduct);
    }).toThrow(/Missing required product definitions/);
  });

  it('must enforce that all products declare executive decisions supported', () => {
    const invalidProduct = {
      id: 'test',
      office: 'CFO_OFFICE',
      purpose: 'Test',
      // missing executiveDecisionSupported
    } as ExecutiveProductSchema;

    expect(() => {
      ExecutiveProductConstitution.validateProductContract(invalidProduct);
    }).toThrow(/Missing required product definitions/);
  });
});
