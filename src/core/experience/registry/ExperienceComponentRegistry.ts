import React from 'react';
import { ExperienceSectionOrder } from '../governance/ExecutiveHierarchyContract';

export interface ComponentMetadata {
  id: string;
  component: React.ComponentType<any>;
  allowedSections: Array<keyof typeof ExperienceSectionOrder>;
  requiredData: string[];
  governance: {
    executiveOnly: boolean;
  };
}

export class ExperienceComponentRegistry {
  private static components = new Map<string, ComponentMetadata>();

  /**
   * Registers a component with its associated metadata.
   */
  static register(metadata: ComponentMetadata): void {
    this.components.set(metadata.id, metadata);
  }

  /**
   * Retrieves a component metadata by its ID.
   */
  static getComponentMetadata(id: string): ComponentMetadata {
    const metadata = this.components.get(id);
    if (!metadata) {
      throw new Error(`[Experience Component Registry]: Component ${id} is not registered.`);
    }
    return metadata;
  }

  /**
   * Clears the registry (useful for testing).
   */
  static clear(): void {
    this.components.clear();
  }
}
