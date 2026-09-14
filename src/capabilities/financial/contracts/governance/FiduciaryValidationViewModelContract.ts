import {
  FiduciaryValidationProjection,
  ConflictProjection,
  DecisionProjection,
  GovernanceSeverity,
  GovernanceStatus,
  ConfidenceLevel,
  OriginType
} from '../../../../contracts/governance/FiduciaryValidationProjection';

export interface ValidationFilters {
  searchQuery: string;
  severity: GovernanceSeverity | 'ALL';
  status: GovernanceStatus | 'ALL';
  confidence: ConfidenceLevel | 'ALL';
  origin: OriginType | 'ALL';
}

export interface FiduciaryValidationViewModelContract {
  state?: {
    activeSection: 'overview' | 'conflicts' | 'decisions' | 'related_parties' | 'audit_trail';
    searchQuery: string;
    severityFilter: GovernanceSeverity | 'ALL';
    statusFilter: GovernanceStatus | 'ALL';
  };
  computed?: {
    projection: FiduciaryValidationProjection;
    filters: ValidationFilters;
    filteredConflicts: ConflictProjection[];
    filteredDecisions: DecisionProjection[];
  };
  actions?: {
    setActiveSection: (section: 'overview' | 'conflicts' | 'decisions' | 'related_parties' | 'audit_trail') => void;
    setSearchQuery: (query: string) => void;
    setSeverityFilter: (severity: GovernanceSeverity | 'ALL') => void;
    setStatusFilter: (status: GovernanceStatus | 'ALL') => void;
  };
  projection: FiduciaryValidationProjection;
  activeSection: 'overview' | 'conflicts' | 'decisions' | 'related_parties' | 'audit_trail';
  setActiveSection: (section: 'overview' | 'conflicts' | 'decisions' | 'related_parties' | 'audit_trail') => void;
  filters: ValidationFilters;
  setSearchQuery: (query: string) => void;
  setSeverityFilter: (severity: GovernanceSeverity | 'ALL') => void;
  setStatusFilter: (status: GovernanceStatus | 'ALL') => void;
  filteredConflicts: ConflictProjection[];
  filteredDecisions: DecisionProjection[];
}
