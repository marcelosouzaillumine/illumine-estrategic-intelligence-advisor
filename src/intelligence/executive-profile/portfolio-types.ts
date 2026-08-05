import { DiagnosticDomain, MaturityLevel } from '../diagnostics/core/diagnostic-types';
import { ExecutiveProfileRecord } from './profile-types';

export interface ExecutiveDomainState {
  status: 'pending' | 'in_progress' | 'completed';
  currentMaturity?: MaturityLevel;
  lastExecution?: string;
  confidence: 'low' | 'medium' | 'high'; // low for self-assessment, high for validated data
  dataSources: string[]; // e.g. "Questionnaire", "ERP Connector", "Advisor Validation"
  profileRecord?: ExecutiveProfileRecord;
}

export interface ExecutiveProfilePortfolio {
  organizationId: string;
  domains: Partial<Record<DiagnosticDomain, ExecutiveDomainState>>;
  completedJourneys: DiagnosticDomain[];
  intelligenceIndex: number;
  updatedAt: string;
}
