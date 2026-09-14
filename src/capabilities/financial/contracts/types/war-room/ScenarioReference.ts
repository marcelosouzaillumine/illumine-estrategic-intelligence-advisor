import { InstitutionalObject } from '../../../../../types/intelligence/InstitutionalObject';

export interface ScenarioReference extends InstitutionalObject {
  executionId: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
}
