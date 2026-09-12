import { OntologyEntityType } from '../ontology/ArchitectureOntology';
import { KnowledgeVersioning } from '../ontology/KnowledgeVersioning';

export interface BaseKnowledgeNode {
  readonly versioning: KnowledgeVersioning;
  readonly type: OntologyEntityType;
  readonly label: string;
}

export interface DomainNode extends BaseKnowledgeNode { type: 'Domain'; }
export interface CapabilityNode extends BaseKnowledgeNode { type: 'Capability'; }
export interface PackageNode extends BaseKnowledgeNode { type: 'Package'; }
export interface DecisionNode extends BaseKnowledgeNode { type: 'Decision'; }
export interface EvidenceNode extends BaseKnowledgeNode { type: 'Evidence'; }
export interface RuleNode extends BaseKnowledgeNode { type: 'Rule'; }
export interface MetricNode extends BaseKnowledgeNode { type: 'Metric'; }
export interface FormulaNode extends BaseKnowledgeNode { type: 'Formula'; }
export interface ConstitutionNode extends BaseKnowledgeNode { type: 'Constitution'; }
export interface WaveNode extends BaseKnowledgeNode { type: 'Wave'; }
export interface CertificationNode extends BaseKnowledgeNode { type: 'Certification'; }

export type KnowledgeNode = 
  | DomainNode 
  | CapabilityNode 
  | PackageNode 
  | DecisionNode 
  | EvidenceNode 
  | RuleNode 
  | MetricNode 
  | FormulaNode 
  | ConstitutionNode 
  | WaveNode 
  | CertificationNode;
