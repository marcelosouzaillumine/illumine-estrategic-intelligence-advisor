import { ExecutiveProductDefinition } from './ExecutiveProductDefinition';

export class ExecutiveExperienceError extends Error {
  constructor(message: string) {
    super(`[Executive Experience Validator]: ${message}`);
    this.name = 'ExecutiveExperienceError';
  }
}

export class ExecutiveExperienceValidator {
  /**
   * Validates the structural integrity of the Executive Experience.
   * Agnostic to any specific product (e.g., Financial, CFO).
   */
  static validateExperience(product: ExecutiveProductDefinition): void {
    if (!product || !product.experience || !product.experience.layers) {
      throw new ExecutiveExperienceError('Product must define an experience with at least one layer.');
    }

    const layers = product.experience.layers;
    if (layers.length === 0) {
      throw new ExecutiveExperienceError('Experience must contain at least one layer.');
    }

    const seenLayers = new Set<string>();
    const seenRoots = new Set<string>();

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];

      // 1. Unique Layers Check
      if (seenLayers.has(layer.id)) {
        throw new ExecutiveExperienceError(`Duplicate layer detected: ${layer.id}`);
      }
      seenLayers.add(layer.id);

      // 2. Unique Roots Check
      if (!layer.rootComponentId) {
        throw new ExecutiveExperienceError(`Layer ${layer.id} is empty (no rootComponentId).`);
      }
      if (seenRoots.has(layer.rootComponentId)) {
        throw new ExecutiveExperienceError(`Duplicate root component detected: ${layer.rootComponentId} in layer ${layer.id}. Each root must be unique.`);
      }
      seenRoots.add(layer.rootComponentId);

      // 3. Order Check (Strictly Ascending)
      if (i > 0) {
        const prevLayer = layers[i - 1];
        if (layer.order <= prevLayer.order) {
          throw new ExecutiveExperienceError(`Order violation: Layer ${layer.id} (order: ${layer.order}) must have a strictly higher order than ${prevLayer.id} (order: ${prevLayer.order}).`);
        }
      }
    }
  }

  static validateSemanticRules(product: ExecutiveProductDefinition): void {
    const rules = product.experience.rules;
    if (rules.decisionAuthority && product.office === 'CFO_OFFICE') {
      throw new ExecutiveExperienceError('CFO Office products cannot declare decision authority.');
    }
  }
}
