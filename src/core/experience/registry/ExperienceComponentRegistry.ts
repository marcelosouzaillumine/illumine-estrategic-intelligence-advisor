import React from 'react';

export interface ComponentMetadata {
  id: string;
  factory: (props: any) => React.ReactNode;
}

export class ExperienceComponentRegistry {
  private static components = new Map<string, ComponentMetadata>();

  static register(metadata: ComponentMetadata): void {
    this.components.set(metadata.id, metadata);
  }

  static getComponentMetadata(id: string): ComponentMetadata {
    const metadata = this.components.get(id);
    if (!metadata) {
      throw new Error(`[Experience Component Registry]: Component ${id} is not registered.`);
    }
    return metadata;
  }

  static clear(): void {
    this.components.clear();
  }
}

