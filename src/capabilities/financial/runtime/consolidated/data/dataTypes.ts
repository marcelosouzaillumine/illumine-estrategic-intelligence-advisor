import { ConsolidationEntity } from '../types';

export interface ConsolidatedGroupInput {
  groupId: string;
  groupName: string;
  fiscalYear: string;
  entities: ConsolidationEntity[];
  bpByEntity: Record<string, any[]>;
  dreByEntity: Record<string, any[]>;
  intercompanyRelations: any[];
  ownershipStructure: any[];
  consolidationScope: string[];
  dataSource: 'FIREBASE' | 'DEMO' | 'HYBRID';
  lineage: {
    extractedAt: string;
    extractionMethod: string;
    legacyMappingNote?: string;
  };
}
