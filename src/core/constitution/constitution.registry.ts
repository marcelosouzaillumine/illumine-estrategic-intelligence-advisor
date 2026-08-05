import { WORKSPACES } from './workspace.registry';
import { MODULES } from './module.registry';
import { FEATURES } from './feature.registry';
import { CONSTITUTION_MANIFEST } from './constitution.manifest';
import { CONSTITUTION_PRINCIPLES } from './constitution.principles';
import { DESIGN_SYSTEM_REGISTRY } from './design-system.registry';

export const CONSTITUTION = {
  manifest: CONSTITUTION_MANIFEST,
  principles: CONSTITUTION_PRINCIPLES,
  designTokens: DESIGN_SYSTEM_REGISTRY,
  workspaces: WORKSPACES,
  modules: MODULES,
  features: FEATURES
};
