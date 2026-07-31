export type OntologyEntityType = 
  | 'Domain' 
  | 'Capability' 
  | 'Package' 
  | 'Component' 
  | 'Page' 
  | 'Metric' 
  | 'Formula' 
  | 'Decision' 
  | 'Evidence' 
  | 'Observation' 
  | 'Certification' 
  | 'Constitution' 
  | 'Rule' 
  | 'Wave';

export interface ArchitectureOntologyDefinition {
  readonly type: OntologyEntityType;
  readonly description: string;
}

export const ARCHITECTURE_ONTOLOGY: Record<OntologyEntityType, ArchitectureOntologyDefinition> = {
  Domain: { type: 'Domain', description: 'Área de negócio ou fronteira lógica macro' },
  Capability: { type: 'Capability', description: 'Capacidade funcional específica dentro de um Domínio' },
  Package: { type: 'Package', description: 'Módulo de software ou biblioteca empacotada' },
  Component: { type: 'Component', description: 'Unidade estrutural (React, Vue, Class, etc.)' },
  Page: { type: 'Page', description: 'Ponto de entrada de roteamento/UI' },
  Metric: { type: 'Metric', description: 'Indicador quantitativo mensurável' },
  Formula: { type: 'Formula', description: 'Cálculo derivado de métricas base' },
  Decision: { type: 'Decision', description: 'Resolução formal tomada pelo Architecture Review Board' },
  Evidence: { type: 'Evidence', description: 'Base probatória rastreável' },
  Observation: { type: 'Observation', description: 'Fato cru detectado na base de código' },
  Certification: { type: 'Certification', description: 'Selo de aderência a uma política' },
  Constitution: { type: 'Constitution', description: 'Artigo normativo do Illumine OS' },
  Rule: { type: 'Rule', description: 'Regra executável da governança' },
  Wave: { type: 'Wave', description: 'Ciclo de evolução arquitetural' }
};
