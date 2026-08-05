import { DiagnosticDomain } from '../diagnostics/core/diagnostic-types';

export interface EvolutionNode {
  preferred: DiagnosticDomain[];
}

export const DiagnosticEvolutionRoadmap: Record<string, EvolutionNode> = {
  financial: {
    preferred: ['governance', 'operational']
  },
  governance: {
    preferred: ['operational', 'people'] // people == leadership
  },
  operational: {
    preferred: ['commercial', 'innovation']
  },
  commercial: {
    preferred: ['innovation', 'risk']
  },
  people: {
    preferred: ['governance', 'risk']
  }
};
