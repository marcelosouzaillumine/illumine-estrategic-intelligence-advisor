import { ExecutiveIntelligenceProfile } from '../diagnostics/models/executive-intelligence-profile';
import { DiagnosticDataSource } from '../diagnostics/core/diagnostic-types';

export type ProfileConsumer = 'advisory' | 'agent' | 'dashboard' | 'board';

export interface ExecutiveProfileRecord {
  id: string;
  organizationId: string;
  domain: string;
  generatedAt: string;
  dataSource: DiagnosticDataSource;
  consumers: ProfileConsumer[];
  profile: ExecutiveIntelligenceProfile;
}
