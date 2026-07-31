import { create } from 'zustand';

// Sub-registries definitions
export interface PageKnowledge {
  domain: string;
  module: string;
  capability: string;
  title: string;
  description: string;
  breadcrumbs: string[];
}

export interface MetricKnowledge {
  id: string;
  name: string;
  description: string;
  formula?: string;
  trend?: 'up' | 'down' | 'stable';
  isFavorable?: boolean;
}

export interface CapabilityKnowledge {
  id: string;
  name: string;
  description: string;
  supportedActions: string[];
}

export interface ActionKnowledge {
  id: string;
  label: string;
  intent: string;
  requiresParameters: string[];
}

export interface KnowledgeState {
  page: PageKnowledge | null;
  metrics: Record<string, MetricKnowledge>;
  capabilities: Record<string, CapabilityKnowledge>;
  actions: Record<string, ActionKnowledge>;
  
  setPageKnowledge: (page: PageKnowledge | null) => void;
  registerMetric: (metric: MetricKnowledge) => void;
  registerCapability: (capability: CapabilityKnowledge) => void;
  registerAction: (action: ActionKnowledge) => void;
  clearRegistries: () => void;
}

export const useExecutiveKnowledgeStore = create<KnowledgeState>((set) => ({
  page: null,
  metrics: {},
  capabilities: {},
  actions: {},

  setPageKnowledge: (page) => set({ page }),
  
  registerMetric: (metric) => set((state) => ({
    metrics: { ...state.metrics, [metric.id]: metric }
  })),
  
  registerCapability: (capability) => set((state) => ({
    capabilities: { ...state.capabilities, [capability.id]: capability }
  })),
  
  registerAction: (action) => set((state) => ({
    actions: { ...state.actions, [action.id]: action }
  })),

  clearRegistries: () => set({
    page: null,
    metrics: {},
    capabilities: {},
    actions: {}
  }),
}));
