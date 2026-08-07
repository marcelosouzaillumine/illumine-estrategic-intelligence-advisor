import { ExecutiveProductDefinition } from './ExecutiveProductDefinition';
import { ExecutiveExperienceManifest } from './ExecutiveExperienceManifest';
import { ExecutiveExperienceValidator } from './ExecutiveExperienceValidator';
import { ExperienceComponentRegistry } from '../registry/ExperienceComponentRegistry';

export class ExecutiveRuntimeGuards {
  /**
   * Applies the Structural and Semantic guards before rendering.
   * If valid, compiles the Product into a ready-to-render Experience Manifest.
   */
  static compileAndGuard(product: ExecutiveProductDefinition): ExecutiveExperienceManifest {
    // 1. Structural Guards (Quantity, Order, Duplicates)
    ExecutiveExperienceValidator.validateExperience(product);

    // 2. Semantic Guards (Language, Authority, Context)
    ExecutiveExperienceValidator.validateSemanticRules(product);

    // 3. Registry Guards (Exists in memory, Not an internal component)
    const layers = product.experience.layers;
    const resolvedLayers = layers.map(layer => {
      // Must be a registered root
      const metadata = ExperienceComponentRegistry.getComponentMetadata(layer.rootComponentId);
      if (!metadata) {
        throw new Error(`[Runtime Guard]: Root component ${layer.rootComponentId} is not registered in the ExperienceComponentRegistry.`);
      }

      // Safeguard: Ensure no internal detail components are registered as roots
      // e.g., anything containing 'Section' but not 'Root' could be flagged, or we rely on the registry boundaries.
      
      return {
        layerId: layer.id,
        order: layer.order,
        rootComponentId: layer.rootComponentId
      };
    });

    return {
      productId: product.metadata.id,
      office: product.office,
      layers: resolvedLayers
    };
  }
}
