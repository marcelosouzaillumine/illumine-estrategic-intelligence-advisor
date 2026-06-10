import { InstitutionalAuditEvent } from "../../types/observability/AuditEvent";
import { getErrorMessage } from "../../types/runtime/RuntimeErrorGuards";

export class InstitutionalObservabilityRegistry {
  private static readonly COLLECTION = "institutional_observability_logs";

  static async recordEvent(event: InstitutionalAuditEvent): Promise<void> {
    try {
      // Aqui haverá inserção no Firestore no futuro.
      // Por enquanto, valida a integridade do modelo.
      if (!event.tenantId || !event.correlationId || !event.engineId) {
        throw new Error("Invalid observability event. Missing critical context.");
      }
      
      // Phase 5: Obrigatoriedade de payload
      if (event.metadata && 'objectId' in event.metadata && !event.metadata.objectId) {
        throw new Error("Invalid observability event. objectId is required when applicable to the event.");
      }
      if (event.metadata && 'tenantId' in event.metadata && !event.metadata.tenantId) {
        throw new Error("Invalid observability event. tenantId is required when applicable to the event.");
      }
      
      console.log(`[ObservabilityRegistry] Event ${event.eventType} recorded for trace ${event.correlationId}`);
    } catch (error: unknown) {
      console.error(`[ObservabilityRegistry] Failed to record observability event:`, getErrorMessage(error));
    }
  }

  // --- Executive Experience Observability Helpers ---

  static async recordExecutiveEvent(eventType: string, tenantId: string, correlationId: string, metadata: Record<string, unknown> = {}): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "ExecutiveExperienceLayer",
      eventType,
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "ExecutiveHub",
      targetOutput: "UI",
      metadata
    });
  }

  // --- Cross-Navigation Observability Helpers ---

  static async recordWorkspaceSwitched(tenantId: string, correlationId: string, sourceWorkspace: string, targetWorkspace: string, lineageId?: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "NavigationFramework",
      eventType: "WORKSPACE_SWITCHED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: lineageId || "N/A",
      runtimeAuthority: "System",
      sourceModule: sourceWorkspace,
      targetOutput: targetWorkspace,
      metadata: { sourceWorkspace, targetWorkspace }
    });
  }

  static async recordObjectOpened(tenantId: string, correlationId: string, objectId: string, workspace: string, lineageId?: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "NavigationFramework",
      eventType: "OBJECT_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: lineageId || "N/A",
      runtimeAuthority: "System",
      sourceModule: workspace,
      targetOutput: "UI",
      metadata: { objectId, workspace }
    });
  }

  static async recordObjectNavigated(tenantId: string, correlationId: string, objectId: string, sourceWorkspace: string, targetWorkspace: string, lineageId?: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "NavigationFramework",
      eventType: "OBJECT_NAVIGATED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: lineageId || "N/A",
      runtimeAuthority: "System",
      sourceModule: sourceWorkspace,
      targetOutput: targetWorkspace,
      metadata: { objectId, sourceWorkspace, targetWorkspace }
    });
  }

  // --- Graph Persistence Observability Helpers ---

  static async recordGraphNodeCreation(tenantId: string, correlationId: string, nodeId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "KnowledgeGraphStorage",
      eventType: "GRAPH_NODE_PERSISTED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "KnowledgeGraph",
      targetOutput: "Persistence",
      metadata: { nodeId }
    });
  }

  static async recordGraphRelationshipCreation(tenantId: string, correlationId: string, relationshipId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "KnowledgeGraphStorage",
      eventType: "GRAPH_RELATIONSHIP_PERSISTED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "KnowledgeGraph",
      targetOutput: "Persistence",
      metadata: { relationshipId }
    });
  }

  static async recordGraphSnapshot(tenantId: string, correlationId: string, snapshotId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "GraphSnapshotEngine",
      eventType: "GRAPH_SNAPSHOT_CREATED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "KnowledgeGraph",
      targetOutput: "Persistence",
      metadata: { snapshotId }
    });
  }

  static async recordGraphQuery(tenantId: string, correlationId: string, queryType: string, targetId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "InstitutionalGraphQueryEngine",
      eventType: "HISTORICAL_GRAPH_QUERY",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId: "SYSTEM",
      role: "SYSTEM",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "KnowledgeGraph",
      targetOutput: "Persistence",
      metadata: { queryType, targetId }
    });
  }

  // --- Investigation Observability Helpers ---

  static async recordInvestigationStart(tenantId: string, correlationId: string, userId: string, targetNodeId: string, originSurface?: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "BoardInvestigationRuntime",
      eventType: "INVESTIGATION_STARTED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "InvestigationWorkspace",
      targetOutput: "UI",
      metadata: { targetNodeId, originSurface }
    });
  }

  static async recordInvestigationLinkOpened(tenantId: string, correlationId: string, userId: string, targetNodeId: string, originSurface: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "BoardInvestigationRuntime",
      eventType: "INVESTIGATION_LINK_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "InvestigationWorkspace",
      targetOutput: "UI",
      metadata: { targetNodeId, originSurface }
    });
  }

  static async recordInvestigationEnd(tenantId: string, correlationId: string, userId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "BoardInvestigationRuntime",
      eventType: "INVESTIGATION_ENDED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "InvestigationWorkspace",
      targetOutput: "UI"
    });
  }
  // --- Time Machine Observability Helpers ---

  static async recordTimelineOpened(tenantId: string, correlationId: string, userId: string, timelineId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "GovernanceTimeMachineRuntime",
      eventType: "TIMELINE_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "TimeMachineWorkspace",
      targetOutput: "UI",
      metadata: { timelineId }
    });
  }

  static async recordSnapshotCompared(tenantId: string, correlationId: string, userId: string, sourceSnapshotId: string, targetSnapshotId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "GovernanceTimeMachineRuntime",
      eventType: "SNAPSHOT_COMPARED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "TimeMachineWorkspace",
      targetOutput: "UI",
      metadata: { sourceSnapshotId, targetSnapshotId }
    });
  }

  // --- Digital Twin Observability Helpers ---

  static async recordDigitalTwinOpened(tenantId: string, correlationId: string, userId: string, domainId?: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "InstitutionalDigitalTwinRuntime",
      eventType: "DIGITAL_TWIN_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "DigitalTwinWorkspace",
      targetOutput: "UI",
      metadata: { domainId }
    });
  }

  static async recordDomainSelected(tenantId: string, correlationId: string, userId: string, domainId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "InstitutionalDigitalTwinRuntime",
      eventType: "DOMAIN_SELECTED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "DigitalTwinWorkspace",
      targetOutput: "UI",
      metadata: { domainId }
    });
  }

  // --- Advisor Workspace Observability Helpers ---

  static async recordAdvisorWorkspaceOpened(tenantId: string, correlationId: string, userId: string, organizationId?: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "AdvisorWorkspaceRuntime",
      eventType: "ADVISOR_WORKSPACE_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "ADVISOR",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "AdvisorCommandCenter",
      targetOutput: "UI",
      metadata: { organizationId }
    });
  }

  static async recordOrganizationSelected(tenantId: string, correlationId: string, userId: string, organizationId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "AdvisorContextEngine",
      eventType: "ORGANIZATION_SELECTED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "ADVISOR",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "AdvisorWorkspaceShell",
      targetOutput: "UI",
      metadata: { organizationId }
    });
  }

  // --- War Room & Scenario Intelligence Observability Helpers ---

  static async recordWarRoomOpened(tenantId: string, correlationId: string, userId: string, scenarioId?: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "WarRoomRuntime",
      eventType: "WAR_ROOM_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "ScenarioCommandCenter",
      targetOutput: "UI",
      metadata: { scenarioId }
    });
  }

  static async recordScenarioSelected(tenantId: string, correlationId: string, userId: string, scenarioId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "ScenarioNavigationEngine",
      eventType: "SCENARIO_SELECTED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "ScenarioCatalog",
      targetOutput: "UI",
      metadata: { scenarioId }
    });
  }

  static async recordImpactExplored(tenantId: string, correlationId: string, userId: string, impactId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "ScenarioNavigationEngine",
      eventType: "IMPACT_EXPLORED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "ImpactExplorer",
      targetOutput: "UI",
      metadata: { impactId }
    });
  }

  static async recordRiskChainViewed(tenantId: string, correlationId: string, userId: string, impactId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "ScenarioNavigationEngine",
      eventType: "RISK_CHAIN_VIEWED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "RiskPropagationViewer",
      targetOutput: "UI",
      metadata: { impactId }
    });
  }

  static async recordEvidenceOpened(tenantId: string, correlationId: string, userId: string, evidenceId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "ScenarioNavigationEngine",
      eventType: "EVIDENCE_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "EvidenceCorrelationPanel",
      targetOutput: "UI",
      metadata: { evidenceId }
    });
  }

  // --- Memory & Data Fabric Observability Helpers ---

  static async recordMemoryOpened(tenantId: string, correlationId: string, userId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "InstitutionalMemoryRuntime",
      eventType: "MEMORY_OPENED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "InstitutionalMemoryWorkspace",
      targetOutput: "UI",
      metadata: {}
    });
  }

  static async recordMemoryRecordViewed(tenantId: string, correlationId: string, userId: string, memoryId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "InstitutionalMemoryRuntime",
      eventType: "MEMORY_RECORD_VIEWED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "InstitutionalMemoryWorkspace",
      targetOutput: "UI",
      metadata: { memoryId }
    });
  }

  static async recordRecurrenceAnalyzed(tenantId: string, correlationId: string, userId: string, memoryId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "InstitutionalLearningQueryEngine",
      eventType: "RECURRENCE_ANALYZED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "RecurrenceExplorer",
      targetOutput: "UI",
      metadata: { memoryId }
    });
  }

  static async recordEvidenceLineageViewed(tenantId: string, correlationId: string, userId: string, memoryId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "InstitutionalLearningQueryEngine",
      eventType: "EVIDENCE_LINEAGE_VIEWED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "MemoryLineageViewer",
      targetOutput: "UI",
      metadata: { memoryId }
    });
  }

  static async recordDataSourceAccessed(tenantId: string, correlationId: string, userId: string, sourceId: string): Promise<void> {
    return this.recordEvent({
      eventId: crypto.randomUUID(),
      tenantId,
      correlationId,
      engineId: "DataFabricRuntime",
      eventType: "DATA_SOURCE_ACCESSED",
      timestamp: new Date().toISOString(),
      severity: "INFO",
      userId,
      role: "EXECUTIVE",
      lineageId: "N/A",
      runtimeAuthority: "System",
      sourceModule: "DataFabric",
      targetOutput: "UI",
      metadata: { sourceId }
    });
  }
}
