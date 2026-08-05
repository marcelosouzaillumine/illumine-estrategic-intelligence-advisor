import { CONSTITUTION } from './constitution.registry';

export class ConstitutionValidator {
  private errors: string[] = [];

  public validate(): string[] {
    this.errors = [];
    
    this.validateNamespaces();
    this.validateOrphans();
    this.validateCycles();
    this.validateLocalization();

    return this.errors;
  }

  private validateNamespaces() {
    // Check Workspace namespaces
    for (const [id, workspace] of Object.entries(CONSTITUTION.workspaces)) {
      if (id !== workspace.id) {
        this.errors.push(`Workspace key mismatch: ${id} !== ${workspace.id}`);
      }
      if (workspace.namespace !== id) {
        this.errors.push(`Workspace namespace mismatch: ${workspace.namespace} !== ${id}`);
      }
      if (id !== id.toLowerCase()) {
        this.errors.push(`Workspace id must be lowercase: ${id}`);
      }
    }

    // Check Module namespaces
    for (const [id, module] of Object.entries(CONSTITUTION.modules)) {
      if (id !== module.id) {
        this.errors.push(`Module key mismatch: ${id} !== ${module.id}`);
      }
      if (module.namespace !== id) {
        this.errors.push(`Module namespace mismatch: ${module.namespace} !== ${id}`);
      }
      if (id !== id.toLowerCase()) {
        this.errors.push(`Module id must be lowercase: ${id}`);
      }
      const parts = id.split('.');
      if (parts.length !== 2) {
        this.errors.push(`Module id must follow format workspace.module: ${id}`);
      }
    }

    // Check Feature namespaces
    for (const [id, feature] of Object.entries(CONSTITUTION.features)) {
      if (id !== feature.id) {
        this.errors.push(`Feature key mismatch: ${id} !== ${feature.id}`);
      }
      if (feature.namespace !== id) {
        this.errors.push(`Feature namespace mismatch: ${feature.namespace} !== ${id}`);
      }
      if (id !== id.toLowerCase()) {
        this.errors.push(`Feature id must be lowercase: ${id}`);
      }
      const parts = id.split('.');
      if (parts.length !== 3) {
        this.errors.push(`Feature id must follow format workspace.module.feature: ${id}`);
      }
    }
  }

  private validateOrphans() {
    const referencedModules = new Set<string>();
    const referencedFeatures = new Set<string>();

    for (const workspace of Object.values(CONSTITUTION.workspaces)) {
      for (const moduleId of workspace.modules) {
        if (!CONSTITUTION.modules[moduleId]) {
          this.errors.push(`Workspace ${workspace.id} references missing module ${moduleId}`);
        }
        referencedModules.add(moduleId);
      }
    }

    for (const module of Object.values(CONSTITUTION.modules)) {
      for (const featureId of module.features) {
        if (!CONSTITUTION.features[featureId]) {
          this.errors.push(`Module ${module.id} references missing feature ${featureId}`);
        }
        referencedFeatures.add(featureId);
      }
    }

    for (const moduleId of Object.keys(CONSTITUTION.modules)) {
      if (!referencedModules.has(moduleId)) {
        this.errors.push(`Orphan Module: ${moduleId} is not referenced by any Workspace`);
      }
    }

    for (const featureId of Object.keys(CONSTITUTION.features)) {
      if (!referencedFeatures.has(featureId)) {
        this.errors.push(`Orphan Feature: ${featureId} is not referenced by any Module`);
      }
    }
  }

  private validateCycles() {
    // structuralDependencies check for cycles
    const checkCycle = (id: string, type: 'module' | 'feature', visited: Set<string>, recursionStack: Set<string>) => {
      visited.add(id);
      recursionStack.add(id);

      const item = type === 'module' ? CONSTITUTION.modules[id] : CONSTITUTION.features[id];
      if (item && item.structuralDependencies) {
        for (const dep of item.structuralDependencies) {
          if (!visited.has(dep)) {
            checkCycle(dep, type, visited, recursionStack);
          } else if (recursionStack.has(dep)) {
            this.errors.push(`Cyclic structural dependency detected: ${id} -> ${dep}`);
          }
        }
      }

      recursionStack.delete(id);
    };

    const visitedModules = new Set<string>();
    const recursionStackModules = new Set<string>();
    for (const moduleId of Object.keys(CONSTITUTION.modules)) {
      if (!visitedModules.has(moduleId)) {
        checkCycle(moduleId, 'module', visitedModules, recursionStackModules);
      }
    }

    const visitedFeatures = new Set<string>();
    const recursionStackFeatures = new Set<string>();
    for (const featureId of Object.keys(CONSTITUTION.features)) {
      if (!visitedFeatures.has(featureId)) {
        checkCycle(featureId, 'feature', visitedFeatures, recursionStackFeatures);
      }
    }
  }

  private validateLocalization() {
    for (const workspace of Object.values(CONSTITUTION.workspaces)) {
      if (!workspace.titleKey) this.errors.push(`Workspace ${workspace.id} is missing titleKey`);
    }
    for (const module of Object.values(CONSTITUTION.modules)) {
      if (!module.titleKey) this.errors.push(`Module ${module.id} is missing titleKey`);
    }
    for (const feature of Object.values(CONSTITUTION.features)) {
      if (!feature.titleKey) this.errors.push(`Feature ${feature.id} is missing titleKey`);
    }
  }
}

// If run as a standalone script
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const validator = new ConstitutionValidator();
  const errors = validator.validate();
  
  if (errors.length > 0) {
    console.error('❌ Constitution Validation Failed:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('✅ Constitution Validation Passed.');
    process.exit(0);
  }
}
