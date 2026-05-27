import { DataAccessContext } from '../security/data-access-context';
import { AuditEventBus } from '../security/audit/AuditEventBus';
import { PermissionEngine } from '../security/permission-engine';

export interface KnowledgeItem {
  id: string;
  tenantId: string;
  type: 'PLAYBOOK' | 'ADVISORY_MEMORY' | 'LESSONS_LEARNED' | 'SIMULATION_HISTORY' | 'BOARD_KNOWLEDGE' | 'INSTITUTIONAL_NOTE';
  title: string;
  content: string;
  lineageReference: string;
  actorId: string;
  createdAt: string;
  visibilityPolicy: 'PRIVATE_TO_OWNER' | 'BOARD_ONLY' | 'CFO_ONLY' | 'PUBLIC_WITHIN_TENANT' | 'INTERNAL';
}

export class InstitutionalKnowledgeLayer {
  private static memoryItems: KnowledgeItem[] = [];

  public static clearMemory() {
    this.memoryItems = [];
  }

  /**
   * Adds an item to the institutional memory.
   */
  public static addKnowledgeItem(
    context: DataAccessContext,
    input: {
      type: KnowledgeItem['type'];
      title: string;
      content: string;
      lineageReference: string;
      visibilityPolicy: KnowledgeItem['visibilityPolicy'];
    }
  ): KnowledgeItem {
    if (!context || !context.tenantId) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    if (!input.lineageReference) {
      throw new Error('[Knowledge Layer] Rejeitado: Memória sem lineageReference é proibido.');
    }

    // RBAC validation: only authorized roles can record memory
    const decision = PermissionEngine.evaluatePermission({
      tenantId: context.tenantId,
      actorId: context.actorId,
      userRole: context.role,
      permissions: context.permissions || [],
      requestedAction: 'CREATE_NOTE',
      resourceType: 'Knowledge',
      resourceTenantId: context.tenantId,
      entityScope: context.entityScope || {
        tenantId: context.tenantId,
        requestedEntityScope: 'GLOBAL',
        allowedEntityIds: [],
        allowedGroupIds: [],
        consolidatedScope: true
      },
      visibilityPolicy: input.visibilityPolicy
    });

    if (!decision.allowed) {
      throw new Error(`[Knowledge Layer] Acesso negado: ${decision.reason}`);
    }

    const item: KnowledgeItem = {
      id: `kn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId: context.tenantId,
      type: input.type,
      title: input.title,
      content: input.content,
      lineageReference: input.lineageReference,
      actorId: context.actorId,
      createdAt: new Date().toISOString(),
      visibilityPolicy: input.visibilityPolicy
    };

    this.memoryItems.push(item);

    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: `RECORD_KNOWLEDGE_${input.type}`,
      resourceType: 'Knowledge',
      resourceId: item.id,
      lineageReference: item.lineageReference,
      auditSeverity: 'INFO',
      requestSource: 'InstitutionalKnowledgeLayer'
    });

    return item;
  }

  /**
   * Retrieves knowledge items under strict tenant isolation.
   */
  public static getKnowledgeItems(
    context: DataAccessContext,
    type?: KnowledgeItem['type']
  ): KnowledgeItem[] {
    if (!context || !context.tenantId) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    // Filter by tenant
    let filtered = this.memoryItems.filter(item => item.tenantId === context.tenantId);

    if (type) {
      filtered = filtered.filter(item => item.type === type);
    }

    // Filter by role/visibility policy
    filtered = filtered.filter(item => {
      if (item.visibilityPolicy === 'PRIVATE_TO_OWNER') {
        return item.actorId === context.actorId;
      }
      if (item.visibilityPolicy === 'BOARD_ONLY') {
        return context.role === 'BOARD_MEMBER' || context.role === 'SUPER_ADMIN' || context.role === 'CFO';
      }
      if (item.visibilityPolicy === 'CFO_ONLY') {
        return context.role === 'CFO' || context.role === 'SUPER_ADMIN';
      }
      return true;
    });

    // Temporal governance: sort by timestamp desc
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
