import { WidgetDefinition } from '../../../workspace/types';
import { useAuthorization } from '../../../hooks/useAuthorization';

export class WidgetRegistry {
  private static instance: WidgetRegistry;
  private registry: Map<string, WidgetDefinition> = new Map();

  private constructor() {}

  public static getInstance(): WidgetRegistry {
    if (!WidgetRegistry.instance) {
      WidgetRegistry.instance = new WidgetRegistry();
    }
    return WidgetRegistry.instance;
  }

  public register(definition: WidgetDefinition): void {
    if (this.registry.has(definition.id)) {
      console.warn(`Widget ${definition.id} is already registered. Overwriting.`);
    }
    // Basic validation
    if (!definition.component) {
      throw new Error(`Widget ${definition.id} must provide a component`);
    }
    this.registry.set(definition.id, definition);
  }

  public get(widgetId: string): WidgetDefinition | undefined {
    return this.registry.get(widgetId);
  }

  public validate(widgetId: string, can: (cap: any) => any): { valid: boolean; reason?: string } {
    const def = this.get(widgetId);
    if (!def) return { valid: false, reason: 'NOT_FOUND' };
    
    // Check capabilities
    const hasCapability = def.requiredPermissions.every(cap => can(cap) === true);
    if (!hasCapability) return { valid: false, reason: 'NO_PERMISSION' };

    return { valid: true };
  }
}

export const widgetRegistry = WidgetRegistry.getInstance();
