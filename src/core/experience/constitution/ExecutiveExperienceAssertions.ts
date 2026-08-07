import { ExecutiveProductDefinition } from './ExecutiveProductDefinition';
import { ExecutiveExperienceValidator } from './ExecutiveExperienceValidator';
import { expect } from 'vitest';

export class ExecutiveExperienceAssertions {
  private product: ExecutiveProductDefinition;

  constructor(product: ExecutiveProductDefinition) {
    this.product = product;
  }

  hasUniqueLayers() {
    const layerIds = this.product.experience.layers.map(l => l.id);
    const unique = new Set(layerIds);
    expect(unique.size).toBe(layerIds.length);
    return this;
  }

  hasValidOrder() {
    const orders = this.product.experience.layers.map(l => l.order);
    for (let i = 0; i < orders.length - 1; i++) {
      expect(orders[i]).toBeLessThan(orders[i + 1]);
    }
    return this;
  }

  hasSingleRoot() {
    const rootIds = this.product.experience.layers.map(l => l.rootComponentId);
    const unique = new Set(rootIds);
    expect(unique.size).toBe(rootIds.length);
    
    // Check for internal component naming leaks
    rootIds.forEach(id => {
      expect(id).not.toMatch(/LiquiditySection/i);
      expect(id).not.toMatch(/CapitalStructure/i);
      expect(id).not.toMatch(/WorkingCapital/i);
      expect(id).not.toMatch(/AssetQuality/i);
    });
    return this;
  }

  hasRegisteredComponents(registryKeys: string[]) {
    this.product.experience.layers.forEach(layer => {
      expect(registryKeys).toContain(layer.rootComponentId);
    });
    return this;
  }

  hasNoForbiddenDependencies() {
    ExecutiveExperienceValidator.validateSemanticRules(this.product);
    return this;
  }
}

export function expectExperience(product: ExecutiveProductDefinition) {
  return new ExecutiveExperienceAssertions(product);
}
