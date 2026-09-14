import { ExecutiveProductDefinition, ProductMetadata, ProductCapabilities, ExecutiveExperienceDefinition } from '../constitution/ExecutiveProductDefinition';
import { ExecutiveOffice } from '../governance/offices/ExecutiveOffice';
import { ExecutiveProductType, AdvisoryLevel } from '../products/ExecutiveProductType';

export interface ExecutiveProductTemplateConfig {
  metadata: ProductMetadata;
  office: ExecutiveOffice;
  productType: ExecutiveProductType;
  advisoryLevel: AdvisoryLevel;
  capabilities: ProductCapabilities;
  experience: ExecutiveExperienceDefinition;
}

/**
 * Factory for creating Executive Products according to the Constitution.
 * Ensures that all products instantiate through a controlled template.
 */
export class ExecutiveProductTemplate {
  static create(config: ExecutiveProductTemplateConfig): ExecutiveProductDefinition {
    // We could add deeper validation here before returning if needed
    return {
      metadata: config.metadata,
      office: config.office,
      productType: config.productType,
      advisoryLevel: config.advisoryLevel,
      capabilities: config.capabilities,
      experience: config.experience
    };
  }
}
