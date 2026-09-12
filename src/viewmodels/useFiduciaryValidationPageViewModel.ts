import { useState, useEffect, useMemo } from 'react';
import { useExecutiveCognitive } from '../context/executive-cognitive/ExecutiveCognitiveProvider';
import { CognitiveSignal } from '../workspace/runtime/executive-orchestration/cognitive/types';
import {
  FiduciaryValidationProjection,
  GovernanceSeverity,
  GovernanceStatus
} from '../contracts/governance/FiduciaryValidationProjection';
import {
  FiduciaryValidationViewModelContract,
  ValidationFilters
} from '../contracts/governance/FiduciaryValidationViewModelContract';

const mockProjection: FiduciaryValidationProjection = {
  executiveCaseId: 'CASE-FID-2026-0941',
  fiduciaryHealth: {
    score: 94,
    status: 'HEALTHY',
    declaredConflictsCount: 3,
    monitoredPartiesCount: 12,
    blockedDecisionsCount: 1,
    pendingDisclosuresCount: 2
  },
  decisionIntegrityIndex: 94.8,
  provenance: {
    lineageHash: 'LIN-EVC-L4-99014-FID',
    issuerId: 'CFO-BOARD-GATEWAY',
    timestamp: '2026-07-28T00:00:00.000Z',
    auditVerified: true
  },
  evidenceChain: [
    {
      id: 'EV-01',
      source: 'Declaração de Impedimento Societário Estatutário',
      provenanceHash: '0x8f2a...1102',
      collectedAt: '2026-07-28T00:00:00.000Z',
      confidenceScore: 98
    },
    {
      id: 'EV-02',
      source: 'Análise de Participação Cruzada em Fornecedor',
      provenanceHash: '0x3c99...4419',
      collectedAt: '2026-07-28T00:00:00.000Z',
      confidenceScore: 94
    }
  ],
  conflicts: [
    {
      id: 'c-1',
      conflictId: 'FID-CONF-001',
      director: 'João Silva',
      role: 'Diretor Financeiro (CFO)',
      type: 'Atuação em Concorrente / Participação Societária',
      partiesInvolved: ['João Silva (CFO)', 'TechCorp Consultoria S.A.'],
      relationship: 'Sócio Majoritário (35% capital votante)',
      financialExposure: 'R$ 4.500.000,00',
      severity: 'CRITICAL',
      status: 'OPEN',
      recommendation: 'Abstenção compulsória em pautas de contratação de TI.',
      approvalState: 'Voto Impedido',
      evidence: [
        {
          id: 'ev-101',
          source: 'Junta Comercial / QSA Atualizado',
          provenanceHash: '0x9910...ab41',
          collectedAt: '2026-07-28T00:00:00.000Z',
          confidenceScore: 99
        }
      ],
      provenance: {
        lineageHash: 'LIN-CONF-100234-Y',
        issuerId: 'GOV-ENGINE-V12',
        timestamp: '2026-07-28T00:00:00.000Z',
        auditVerified: true
      }
    },
    {
      id: 'c-2',
      conflictId: 'FID-CONF-002',
      director: 'Maria Costa',
      role: 'Conselheira Independente',
      type: 'Vínculo Familiar com Auditor Externo',
      partiesInvolved: ['Maria Costa (Conselho)', 'Alpha Auditores Independentes'],
      relationship: 'Parentesco de 2º Grau (Sócio de Auditoria)',
      financialExposure: 'R$ 1.200.000,00',
      severity: 'MEDIUM',
      status: 'UNDER_REVIEW',
      recommendation: 'Registrar em ata e abster-se na escolha do auditor.',
      approvalState: 'Registrado sem Impedimento Total',
      evidence: [
        {
          id: 'ev-102',
          source: 'Formulário Anual de Independência do Conselheiro',
          provenanceHash: '0x7721...bc90',
          collectedAt: '2026-07-28T00:00:00.000Z',
          confidenceScore: 92
        }
      ],
      provenance: {
        lineageHash: 'LIN-CONF-902341-X',
        issuerId: 'GOV-ENGINE-V12',
        timestamp: '2026-07-28T00:00:00.000Z',
        auditVerified: true
      }
    }
  ],
  decisions: [
    {
      id: 'd-1',
      title: 'Aprovação de Orçamento Anual de Marketing & Growth',
      status: 'UNDER_REVIEW',
      reason: 'Aviso: Recomendada abstenção voluntária devido a vínculo societário menor.',
      hash: 'LIN-902342-X',
      confidenceScore: 96,
      lineageStages: [
        { stage: 'Evidence Collected', completed: true },
        { stage: 'Validation Performed', completed: true },
        { stage: 'Conflict Identified', completed: true },
        { stage: 'Reasoning Generated', completed: true },
        { stage: 'Recommendation Issued', completed: true },
        { stage: 'Board Decision', completed: false },
        { stage: 'Resolution Executed', completed: false }
      ]
    },
    {
      id: 'd-2',
      title: 'Contratação de Consultoria Externa (TechCorp S.A.)',
      status: 'BLOCKED',
      reason: 'Impedimento Estatutário: Aprovador é acionista majoritário da fornecedora.',
      hash: 'LIN-100234-Y',
      confidenceScore: 99,
      lineageStages: [
        { stage: 'Evidence Collected', completed: true },
        { stage: 'Validation Performed', completed: true },
        { stage: 'Conflict Identified', completed: true },
        { stage: 'Reasoning Generated', completed: true },
        { stage: 'Recommendation Issued', completed: true },
        { stage: 'Board Decision', completed: true },
        { stage: 'Resolution Executed', completed: true }
      ]
    }
  ]
};

const FIDUCIARY_SIGNALS: CognitiveSignal[] = [
  {
    id: 'fid-1',
    sourceModule: 'Fiduciary',
    title: 'Declaração de Conflito Pendente',
    description: 'João Silva (CFO) possui impedimento societário registrado sob a pauta atual.',
    timestamp: '2026-07-28T00:00:00.000Z',
    rawSeverity: 'WARNING',
    fiduciaryEscalation: true
  },
  {
    id: 'fid-2',
    sourceModule: 'Fiduciary',
    title: 'Impedimento Estatutário de Fornecedor',
    description: 'Contratação de consultoria externa TechCorp bloqueada devido ao conflito de interesses com o aprovisionador.',
    timestamp: '2026-07-28T00:00:00.000Z',
    rawSeverity: 'CRITICAL',
    fiduciaryEscalation: true,
    lineageHash: 'LIN-100234-Y'
  }
];

export function useFiduciaryValidationPageViewModel(): FiduciaryValidationViewModelContract {
  const [activeSection, setActiveSection] = useState<'overview' | 'conflicts' | 'decisions' | 'related_parties' | 'audit_trail'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<GovernanceSeverity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<GovernanceStatus | 'ALL'>('ALL');
  
  const { setSignals } = useExecutiveCognitive();

  // Mount effect with empty dependency array to prevent infinite re-render loop
  useEffect(() => {
    setSignals(FIDUCIARY_SIGNALS);
    return () => setSignals([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredConflicts = useMemo(() => {
    return mockProjection.conflicts.filter(c => {
      const matchesSearch = searchQuery === '' || 
        c.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.conflictId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [searchQuery, severityFilter, statusFilter]);

  const filteredDecisions = useMemo(() => {
    return mockProjection.decisions.filter(d => {
      const matchesSearch = searchQuery === '' || d.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const filters: ValidationFilters = {
    searchQuery,
    severity: severityFilter,
    status: statusFilter,
    confidence: 'ALL',
    origin: 'ALL'
  };

  return {
    state: { activeSection, searchQuery, severityFilter, statusFilter },
    computed: { projection: mockProjection, filters, filteredConflicts, filteredDecisions },
    actions: { setActiveSection, setSearchQuery, setSeverityFilter, setStatusFilter },
    projection: mockProjection,
    activeSection,
    setActiveSection,
    filters,
    setSearchQuery,
    setSeverityFilter,
    setStatusFilter,
    filteredConflicts,
    filteredDecisions
  };
}
