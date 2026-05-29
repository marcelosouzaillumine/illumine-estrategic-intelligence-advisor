import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTenancy } from '../TenancyProvider';
import {
  GovernanceIncident,
  GovernanceSupervisionEvent,
  GovernanceIncidentStatus,
  GovernanceSupervisionMode,
  RuntimeHealthState,
  EscalationTopology,
  MultiTenantSupervision,
  SupervisionActionType
} from '../../core/runtime/governance-command-center/types';
import { GovernanceIncidentOrchestrator } from '../../core/runtime/governance-command-center/GovernanceIncidentOrchestrator';
import { ExecutiveSupervisionEngine } from '../../core/runtime/governance-command-center/ExecutiveSupervisionEngine';
import { RuntimeHealthMonitoringEngine } from '../../core/runtime/governance-command-center/RuntimeHealthMonitoringEngine';

interface CommandCenterContextType {
  activeIncidents: Array<{ incident: GovernanceIncident; currentStatus: GovernanceIncidentStatus; isCollapsed: boolean }>;
  runtimeHealth: RuntimeHealthState | null;
  escalationTopology: EscalationTopology | null;
  supervisionMode: GovernanceSupervisionMode;
  propagationStatus: string;
  supervisionEvents: GovernanceSupervisionEvent[];
  selectedIncident: GovernanceIncident | null;
  commandIntegrity: 'VERIFIED' | 'FAIL_CLOSED';
  operationalStress: number;
  tenantSupervisionMap: MultiTenantSupervision | null;
  setSelectedIncident: (incident: GovernanceIncident | null) => void;
  switchSupervisionMode: (mode: GovernanceSupervisionMode) => void;
  acknowledgeIncident: (incidentId: string) => Promise<void>;
  superviseIncident: (incidentId: string) => Promise<void>;
  escalateIncident: (incidentId: string) => Promise<void>;
  containIncident: (incidentId: string) => Promise<void>;
  resolveIncident: (incidentId: string) => Promise<void>;
  triggerFailClosedState: () => void;
  triggerRecoveryState: () => void;
}

const CommandCenterContext = createContext<CommandCenterContextType>({
  activeIncidents: [],
  runtimeHealth: null,
  escalationTopology: null,
  supervisionMode: 'EXECUTIVE',
  propagationStatus: 'STABLE',
  supervisionEvents: [],
  selectedIncident: null,
  commandIntegrity: 'VERIFIED',
  operationalStress: 0,
  tenantSupervisionMap: null,
  setSelectedIncident: () => {},
  switchSupervisionMode: () => {},
  acknowledgeIncident: async () => {},
  superviseIncident: async () => {},
  escalateIncident: async () => {},
  containIncident: async () => {},
  resolveIncident: async () => {},
  triggerFailClosedState: () => {},
  triggerRecoveryState: () => {}
});

export const useCommandCenter = () => useContext(CommandCenterContext);

export const GovernanceCommandCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { context } = useTenancy();

  // Estados principais
  const [incidents, setIncidents] = useState<GovernanceIncident[]>([]);
  const [supervisionEvents, setSupervisionEvents] = useState<GovernanceSupervisionEvent[]>([]);
  const [supervisionMode, setSupervisionMode] = useState<GovernanceSupervisionMode>('EXECUTIVE');
  const [selectedIncident, setSelectedIncident] = useState<GovernanceIncident | null>(null);

  // Estados de Integridade e Telemetria
  const [telemetryContinuous, setTelemetryContinuous] = useState<boolean>(true);
  const [failedLineageCount, setFailedLineageCount] = useState<number>(0);
  const [hasBrokenPropagation, setHasBrokenPropagation] = useState<boolean>(false);
  const [forcedFailClosed, setForcedFailClosed] = useState<boolean>(false);

  const tenantId = context?.activeTenantId || 'default-tenant';

  // 1. Inicializar incidentes resolvidos a partir do Runtime do Inquilino
  useEffect(() => {
    // Simulamos a colheita das engines do runtime correspondente a este tenant
    const seededIncidents: GovernanceIncident[] = [
      {
        incidentId: `inc-${tenantId}-01`,
        tenantId,
        entityId: 'ENT-CORE-01',
        type: 'LIQUIDITY_PRESSURE',
        severity: 'CRITICAL',
        title: 'Alerta Crítico: Pressão Extrema de Liquidez Detectada',
        description: 'Projeção de DFC indica quebra de buffer de tesouraria nos próximos 60 dias devido a custos fixos recorrentes.',
        detectedAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4h atrás
        lineageHash: '0xAUDIT-LINEAGE-DFC-998',
        correlationId: 'corr-dfc-998',
        sourceRuntimeReferences: ['CashFlowAdapter', 'GovernanceForecastEngine']
      },
      {
        incidentId: `inc-${tenantId}-02`,
        tenantId,
        entityId: 'ENT-CORE-01',
        type: 'FIDUCIARY_ESCALATION',
        severity: 'SYSTEMIC',
        title: 'Desalinhamento Societário e Alerta de Intervenção do CFO',
        description: 'Detecção de quebra recorrente de diretrizes de governança na concessão de garantias intercompany.',
        detectedAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8h atrás
        lineageHash: '0xAUDIT-LINEAGE-IML-123',
        correlationId: 'corr-iml-123',
        sourceRuntimeReferences: ['AdvisoryContinuityEngine', 'PatternRecognitionEngine']
      },
      {
        incidentId: `inc-${tenantId}-03`,
        tenantId,
        entityId: 'ENT-SUB-02',
        type: 'CROSS_ENTITY_CONTAGION',
        severity: 'HIGH',
        title: 'Contágio em Subsidiária: Gargalo na Cadeia de Suprimentos',
        description: 'Atraso de liquidez da controladora gera efeito cascata com risco de calote em fornecedor crítico.',
        detectedAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12h atrás
        lineageHash: '0xAUDIT-LINEAGE-PROP-442',
        correlationId: 'corr-prop-442',
        sourceRuntimeReferences: ['PropagationSimulationEngine']
      },
      {
        incidentId: `inc-${tenantId}-04`,
        tenantId,
        entityId: 'ENT-CORE-01',
        type: 'OPERATIONAL_DETERIORATION',
        severity: 'MODERATE',
        title: 'Deterioração Linear de Maturidade Operacional',
        description: 'Maturidade de governança apresenta declínio de 12% nos últimos 3 ciclos devido a anomalias não tratadas.',
        detectedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24h atrás
        lineageHash: '0xAUDIT-LINEAGE-DET-881',
        correlationId: 'corr-det-881',
        sourceRuntimeReferences: ['ScenarioSimulationEngine']
      }
    ];

    setIncidents(seededIncidents);
    // Limpar eventos antigos e incidentes selecionados ao alternar inquilino
    setSupervisionEvents([]);
    setSelectedIncident(null);
  }, [tenantId]);

  // 2. Avaliar a Saúde do Runtime
  const currentLineageHash = incidents[0]?.lineageHash || '0xINIT-HASH';
  const currentCorrelationId = incidents[0]?.correlationId || 'corr-init';

  const runtimeHealth = RuntimeHealthMonitoringEngine.evaluateHealth({
    tenantId: forcedFailClosed ? undefined : tenantId, // Força FAIL_CLOSED
    correlationId: forcedFailClosed ? undefined : currentCorrelationId,
    lineageHash: forcedFailClosed ? undefined : currentLineageHash,
    telemetryContinuous,
    failedLineagesCount: failedLineageCount,
    hasBrokenPropagation
  });

  const commandIntegrity = runtimeHealth.status === 'FAIL_CLOSED' ? 'FAIL_CLOSED' : 'VERIFIED';

  // 3. Orquestrar e Priorizar Incidentes sob Pacing Cognitivo
  const rawPrioritized = GovernanceIncidentOrchestrator.getPrioritizedIncidents(incidents, supervisionEvents, tenantId);
  
  // Se estiver em FAIL_CLOSED, todos os incidentes entram em estado de alerta fail-closed virtual na UI
  const processedPrioritized = rawPrioritized.map(item => {
    if (commandIntegrity === 'FAIL_CLOSED') {
      return {
        ...item,
        currentStatus: 'FAIL_CLOSED' as const
      };
    }
    return item;
  });

  const activeIncidents = ExecutiveSupervisionEngine.prioritizeForExecutive(processedPrioritized, 2);

  // 4. Derivar Estado da Topologia de Escalada
  const activeUnresolvedCount = activeIncidents.filter(
    i => i.currentStatus !== 'RESOLVED' && i.currentStatus !== 'CONTAINED'
  ).length;

  let topologyState: EscalationTopology['state'] = 'CONTAINED';
  let riskLevel = 10;

  if (activeUnresolvedCount >= 3) {
    topologyState = 'SYSTEMIC_CONTAGION';
    riskLevel = 85;
  } else if (activeUnresolvedCount >= 2) {
    topologyState = 'CRITICAL_CHAIN';
    riskLevel = 60;
  } else if (activeUnresolvedCount >= 1) {
    topologyState = 'PROPAGATING';
    riskLevel = 35;
  }

  const escalationTopology: EscalationTopology = {
    state: topologyState,
    criticalPropagationChain: activeIncidents
      .filter(i => i.currentStatus !== 'RESOLVED')
      .map(i => `${i.incident.entityId} [${i.incident.severity}]`),
    contagionRiskLevel: riskLevel
  };

  // 5. Expor status de propagação textual
  const propagationStatus = topologyState === 'SYSTEMIC_CONTAGION' 
    ? 'CRITICAL CONTAGION' 
    : topologyState === 'CRITICAL_CHAIN' 
    ? 'ELEVATED CHAIN' 
    : 'STABLE';

  // 6. Calcular estresse operacional agregado (0-100)
  const operationalStress = Math.min(
    100,
    activeIncidents.reduce((sum, item) => {
      if (item.currentStatus === 'RESOLVED' || item.currentStatus === 'CONTAINED') return sum;
      const severityScores = { SYSTEMIC: 30, CRITICAL: 25, HIGH: 20, MODERATE: 10, LOW: 5 };
      return sum + (severityScores[item.incident.severity] || 0);
    }, 0)
  );

  // 7. Supervision Map de múltiplos inquilinos para advisors
  const tenantSupervisionMap: MultiTenantSupervision = {
    activeTenantsCount: 3,
    tenantStressMap: {
      [tenantId]: operationalStress,
      'tenant-alpha-group': 45,
      'tenant-beta-holding': 15
    },
    crossTenantRiskTrends: [
      'Aumento generalizado na volatilidade de liquidez de tesouraria do setor de serviços.',
      'Melhoria nas cadeias de governança de varejo.'
    ]
  };

  // 8. Funções de comando de incidentes (Append-Only Event Sourcing)
  const appendAction = async (incidentId: string, action: SupervisionActionType, details?: string) => {
    // Bloquear se estiver em FAIL_CLOSED
    if (commandIntegrity === 'FAIL_CLOSED') {
      throw new Error('FAIL_CLOSED: Ações de comando desabilitadas devido a quebra de integridade de auditoria.');
    }

    const targetIncident = incidents.find(i => i.incidentId === incidentId);
    if (!targetIncident) return;

    const newEvent = GovernanceIncidentOrchestrator.createSupervisionEvent(
      targetIncident,
      action,
      'executive-user-01', // actorId
      details
    );

    setSupervisionEvents(prev => [...prev, newEvent]);
  };

  const acknowledgeIncident = async (incidentId: string) => {
    await appendAction(incidentId, 'ACKNOWLEDGE', 'Incidente sob supervisão executiva ativa.');
  };

  const superviseIncident = async (incidentId: string) => {
    await appendAction(incidentId, 'SUPERVISION', 'Iniciado protocolo detalhado de mitigação fiduciária.');
  };

  const escalateIncident = async (incidentId: string) => {
    await appendAction(incidentId, 'ESCALATION', 'Escalado formalmente para intervenção imediata do CFO/Conselho.');
  };

  const containIncident = async (incidentId: string) => {
    await appendAction(incidentId, 'CONTAINMENT', 'Contágio contido. Mitigação de riscos em andamento.');
  };

  const resolveIncident = async (incidentId: string) => {
    await appendAction(incidentId, 'RESOLUTION', 'Incidente encerrado. Auditoria de encerramento registrada.');
  };

  // Controles de estado de saúde do runtime (Mocks de telemetria)
  const triggerFailClosedState = () => {
    setForcedFailClosed(true);
  };

  const triggerRecoveryState = () => {
    setForcedFailClosed(false);
    setTelemetryContinuous(true);
    setFailedLineageCount(0);
    setHasBrokenPropagation(false);
  };

  const switchSupervisionMode = (mode: GovernanceSupervisionMode) => {
    setSupervisionMode(mode);
  };

  return (
    <CommandCenterContext.Provider
      value={{
        activeIncidents,
        runtimeHealth,
        escalationTopology,
        supervisionMode,
        propagationStatus,
        supervisionEvents,
        selectedIncident,
        commandIntegrity,
        operationalStress,
        tenantSupervisionMap,
        setSelectedIncident,
        switchSupervisionMode,
        acknowledgeIncident,
        superviseIncident,
        escalateIncident,
        containIncident,
        resolveIncident,
        triggerFailClosedState,
        triggerRecoveryState
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
};
