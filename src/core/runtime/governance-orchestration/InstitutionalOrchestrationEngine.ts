import { GovernanceCoordinationResult, RecommendationEvidence } from './GovernanceOrchestrationTypes';
import { GovernancePlaybookRegistry } from './GovernancePlaybookRegistry';
import { GovernancePlaybookOrchestrator } from './GovernancePlaybookOrchestrator';
import { InstitutionalActionPlanner } from './InstitutionalActionPlanner';
import { GovernancePriorityResolver } from './GovernancePriorityResolver';
import { GovernanceEscalationOrchestrator } from './GovernanceEscalationOrchestrator';
import { InstitutionalRecoveryEngine } from './InstitutionalRecoveryEngine';
import { CrossDomainResponseEngine } from './CrossDomainResponseEngine';
import { OperationalImpactCoordinator } from './OperationalImpactCoordinator';
import { PlaybookExecutionSimulator } from './PlaybookExecutionSimulator';
import { StrategicResponseCoordinator } from './StrategicResponseCoordinator';
import { OrchestrationAuditLogger } from './OrchestrationAuditLogger';

export class InstitutionalOrchestrationEngine {
  private static activeCoordinations: GovernanceCoordinationResult[] = [];

  static coordinate(tenantId: string, playbookId: string, evidence: RecommendationEvidence): GovernanceCoordinationResult | null {
    const playbook = GovernancePlaybookRegistry.getPlaybook(playbookId);
    if (!playbook) return null;

    OrchestrationAuditLogger.logEvent(tenantId, 'ORCHESTRATION_STARTED', 'Iniciando orquestração para Playbook: ' + playbook.name);

    // 1. Emite Recomendação Supervisionada
    const recommendation = GovernancePlaybookOrchestrator.emit(tenantId, playbook, evidence);
    OrchestrationAuditLogger.logEvent(tenantId, 'RECOMMENDATION_GENERATED', 'Recomendação gerada com hash fiduciário: ' + evidence.lineage.lineageHash);

    // 2. Orquestração Escalonada
    const plan = InstitutionalActionPlanner.planSequence(recommendation.recommendationId, playbookId);
    const priorities = GovernancePriorityResolver.resolve(playbookId);
    OrchestrationAuditLogger.logEvent(tenantId, 'PRIORITY_SEQUENCE_CREATED', priorities.length + ' prioridades mapeadas.');

    // 3. Escalada Fiduciária
    const escalation = GovernanceEscalationOrchestrator.orchestrate(playbookId);
    OrchestrationAuditLogger.logEvent(tenantId, 'ESCALATION_COORDINATED', 'Target: ' + escalation.targetAudience);

    // 4. Domínios Cruzados e Recuperação
    const recovery = InstitutionalRecoveryEngine.projectPath(playbookId);
    OrchestrationAuditLogger.logEvent(tenantId, 'RECOVERY_PATH_PROJECTED', 'Recuperação projetada em ' + recovery.length + ' domínios.');

    const crossDomain = CrossDomainResponseEngine.mapImpacts(playbookId);
    OrchestrationAuditLogger.logEvent(tenantId, 'CROSS_DOMAIN_RESPONSE_MAPPED', 'Mapa de cross-domain consolidado.');

    const operational = OperationalImpactCoordinator.coordinate(playbookId);
    const projection = PlaybookExecutionSimulator.simulateExecution(playbookId);
    const responses = StrategicResponseCoordinator.coordinate(playbookId);

    const result: GovernanceCoordinationResult = {
      coordinationId: 'COORD-' + Date.now(),
      tenantId,
      playbook,
      recommendation,
      plan,
      priorities,
      escalation,
      recovery,
      crossDomain,
      operational,
      projection,
      responses,
      timestamp: new Date().toISOString()
    };

    OrchestrationAuditLogger.logEvent(tenantId, 'PLAYBOOK_TRIGGERED', 'Playbook orquestrado. Aguardando supervisão humana.');
    
    this.activeCoordinations.push(result);
    return result;
  }

  static getActiveCoordination(tenantId: string): GovernanceCoordinationResult | null {
    return this.activeCoordinations.find(c => c.tenantId === tenantId) || null;
  }

  static clearSandbox(tenantId: string): void {
    this.activeCoordinations = this.activeCoordinations.filter(c => c.tenantId !== tenantId);
    OrchestrationAuditLogger.clear(tenantId);
  }
}
