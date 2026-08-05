export type LifecycleStatus = 'Draft' | 'Active' | 'Deprecated' | 'Archived';

export type Visibility = 'public' | 'internal' | 'restricted';
export type Stability = 'experimental' | 'stable' | 'legacy';

export type CapabilityModelAction = 'View' | 'Edit' | 'Approve' | 'Export' | 'AI' | 'Admin';

export interface IntelligenceMetadata {
  knowledgeInputs?: string[];
  knowledgeOutputs?: string[];
  knowledgeProviders?: string[];
  knowledgeConsumers?: string[];
  observability?: string[];
  constraints?: string[];
}

export interface BaseMetadata {
  id: string;
  namespace: string;
  version: string;
  status: LifecycleStatus;
  owner: string;
  visibility: Visibility;
  localizationKey?: string;
  stability: Stability;
  tags?: string[];
  introducedIn?: string;
  deprecatedIn?: string;
  archivedIn?: string;
}

export interface Workspace extends BaseMetadata {
  titleKey: string;
  descriptionKey: string;
  modules: string[]; // List of module IDs
}

export interface Module extends BaseMetadata {
  titleKey: string;
  descriptionKey: string;
  structuralDependencies?: string[];
  knowledgeDependencies?: string[];
  features: string[]; // List of feature IDs
}

export interface Feature extends BaseMetadata {
  titleKey: string;
  descriptionKey?: string;
  structuralDependencies?: string[];
  knowledgeDependencies?: string[];
  capabilityModel?: CapabilityModelAction[];
  intelligence?: IntelligenceMetadata;
}

export interface ResolveContext {
  workspace?: string;
  module?: string;
  locale?: string;
  tenant?: string;
  version?: string;
  environment?: string;
}
