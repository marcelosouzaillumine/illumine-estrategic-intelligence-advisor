export enum KnowledgeDomain {
  FINANCIAL = 'FINANCIAL',
  COMMERCIAL = 'COMMERCIAL',
  PEOPLE = 'PEOPLE',
  STRATEGY = 'STRATEGY',
  RISK = 'RISK',
  OPERATIONS = 'OPERATIONS'
}

export enum KnowledgeSensitivity {
  PUBLIC = 'PUBLIC',             // Safe for any audience
  INTERNAL = 'INTERNAL',         // Safe for any employee of the tenant
  CONFIDENTIAL = 'CONFIDENTIAL', // Restricted to specific roles (e.g. C-level, Board)
  RESTRICTED = 'RESTRICTED'      // Restricted to named individuals only
}

export interface KnowledgeClassification {
  domain: KnowledgeDomain;
  sensitivity: KnowledgeSensitivity;
  confidence: number; // 0 to 100
}
