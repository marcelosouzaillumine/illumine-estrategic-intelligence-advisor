import React from 'react';
import { ExecutiveProductSchema } from '../schema/ExecutiveProductSchema';
import { ExecutiveExperienceContext } from './ExecutiveExperienceContext';
import { ExecutiveSectionResolver } from './ExecutiveSectionResolver';
import { ExecutiveProductConstitution } from '../governance/ExecutiveProductConstitution';

export interface ExecutiveProductRendererProps {
  product: ExecutiveProductSchema;
  context: ExecutiveExperienceContext;
}

export const ExecutiveProductRenderer: React.FC<ExecutiveProductRendererProps> = ({ product, context }) => {
  // Phase 1: Validate Product Constitution
  try {
    ExecutiveProductConstitution.validateProductContract(product);
  } catch (error: any) {
    return (
      <div className="p-8 border-2 border-critical bg-critical/5 text-critical rounded-xl">
        <h2 className="text-xl font-bold mb-2">Executive Experience Violation</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  // Phase 2 & 3: Resolve Sections and Components
  return (
    <div className="executive-product-runtime" data-product-id={product.id}>
      {product.hierarchy.map((section, index) => {
        return ExecutiveSectionResolver.resolve(section, context, `section-${index}`);
      })}
    </div>
  );
};
