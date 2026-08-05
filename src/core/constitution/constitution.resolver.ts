import { CONSTITUTION } from './constitution.registry';
import { Workspace, Module, Feature, ResolveContext } from './types';

/**
 * Constitution Resolver
 * 
 * Read-only interface to the Constitution Layer.
 * All projection and execution layers must consume the constitution through this resolver.
 */
export class ConstitutionResolver {
  /**
   * Retrieves a Workspace by ID
   */
  public static getWorkspace(workspaceId: string, context?: ResolveContext): Workspace | undefined {
    return CONSTITUTION.workspaces[workspaceId];
  }

  /**
   * Retrieves a Module by ID
   */
  public static getModule(moduleId: string, context?: ResolveContext): Module | undefined {
    return CONSTITUTION.modules[moduleId];
  }

  /**
   * Retrieves a Feature by ID
   */
  public static getFeature(featureId: string, context?: ResolveContext): Feature | undefined {
    return CONSTITUTION.features[featureId];
  }

  /**
   * Lists all Workspaces
   */
  public static listWorkspaces(context?: ResolveContext): Workspace[] {
    return Object.values(CONSTITUTION.workspaces);
  }

  /**
   * Lists all Modules for a given Workspace
   */
  public static listModules(workspaceId: string, context?: ResolveContext): Module[] {
    const workspace = this.getWorkspace(workspaceId, context);
    if (!workspace) return [];
    
    return workspace.modules
      .map(moduleId => this.getModule(moduleId, context))
      .filter((m): m is Module => m !== undefined);
  }

  /**
   * Lists all Features for a given Module
   */
  public static listFeatures(moduleId: string, context?: ResolveContext): Feature[] {
    const module = this.getModule(moduleId, context);
    if (!module) return [];

    return module.features
      .map(featureId => this.getFeature(featureId, context))
      .filter((f): f is Feature => f !== undefined);
  }

  /**
   * Resolves structural dependencies for a Module or Feature
   */
  public static resolveStructuralDependencies(id: string, type: 'module' | 'feature', context?: ResolveContext): string[] {
    const item = type === 'module' ? this.getModule(id, context) : this.getFeature(id, context);
    return item?.structuralDependencies || [];
  }

  /**
   * Resolves knowledge dependencies for a Module or Feature
   */
  public static resolveKnowledgeDependencies(id: string, type: 'module' | 'feature', context?: ResolveContext): string[] {
    const item = type === 'module' ? this.getModule(id, context) : this.getFeature(id, context);
    return item?.knowledgeDependencies || [];
  }
}
