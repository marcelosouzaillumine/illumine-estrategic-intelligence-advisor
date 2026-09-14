export interface TwinRelationship {
  relationshipId: string;
  tenantId: string;
  
  sourceDomainId: string;
  targetDomainId: string;
  
  type: 'DEPENDS_ON' | 'IMPACTS' | 'CAUSES' | 'EVIDENCES' | 'GOVERNS';
  
  // Origin graph reference for traceability
  originGraphRelationshipId?: string;
  
  createdAt: string;
}
