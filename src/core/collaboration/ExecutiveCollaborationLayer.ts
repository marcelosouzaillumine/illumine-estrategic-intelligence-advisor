import { DataAccessContext } from '../security/data-access-context';
import { AuditEventBus } from '../security/audit/AuditEventBus';
import { PermissionEngine } from '../security/permission-engine';

export interface ExecutiveComment {
  commentId: string;
  tenantId: string;
  actorId: string;
  role: string;
  content: string;
  resourceId: string;
  resourceType: string;
  lineageReference: string;
  visibilityPolicy: 'PRIVATE_TO_OWNER' | 'BOARD_ONLY' | 'CFO_ONLY' | 'PUBLIC_WITHIN_TENANT' | 'INTERNAL';
  isArchived: boolean;
  createdAt: string;
}

export class ExecutiveCollaborationLayer {
  private static comments: ExecutiveComment[] = [];

  public static clearComments() {
    this.comments = [];
  }

  /**
   * Posts a new board comment or annotation with strict lineage and isolation checks.
   */
  public static async postComment(
    context: DataAccessContext,
    input: {
      content: string;
      resourceId: string;
      resourceType: string;
      lineageReference: string;
      visibilityPolicy: ExecutiveComment['visibilityPolicy'];
    }
  ): Promise<ExecutiveComment> {
    if (!context || !context.tenantId || !context.actorId || !context.role) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    if (!input.lineageReference) {
      throw new Error('[Collaboration Layer] Rejeitado: Comentário sem lineageReference é proibido.');
    }

    // Verify isolation
    if (context.resourceTenantId && context.tenantId !== context.resourceTenantId) {
      AuditEventBus.emit({
        tenantId: context.tenantId,
        actorId: context.actorId,
        role: context.role,
        sessionId: context.sessionId || 'N/A',
        eventType: 'CROSS_TENANT_ATTEMPT',
        resourceType: 'Collaboration',
        auditSeverity: 'CRITICAL',
        requestSource: 'ExecutiveCollaborationLayer',
        metadata: { action: 'postComment', targetTenantId: context.resourceTenantId }
      });
      throw new Error('[Collaboration Layer] Rejeitado: Acesso cross-tenant negado.');
    }

    // RBAC validation: use PermissionEngine to see if they can create notes/annotations
    const decision = PermissionEngine.evaluatePermission({
      tenantId: context.tenantId,
      actorId: context.actorId,
      userRole: context.role,
      permissions: context.permissions || [],
      requestedAction: 'CREATE_NOTE',
      resourceType: input.resourceType,
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
      throw new Error(`[Collaboration Layer] Acesso negado: ${decision.reason} (${decision.decisionCode})`);
    }

    const comment: ExecutiveComment = {
      commentId: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      content: input.content,
      resourceId: input.resourceId,
      resourceType: input.resourceType,
      lineageReference: input.lineageReference,
      visibilityPolicy: input.visibilityPolicy,
      isArchived: false,
      createdAt: new Date().toISOString()
    };

    this.comments.push(comment);

    // Audit and telemetry
    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: 'CREATE_COLLABORATIVE_COMMENT',
      resourceType: 'Collaboration',
      resourceId: comment.commentId,
      auditSeverity: 'INFO',
      requestSource: 'ExecutiveCollaborationLayer',
      metadata: { resourceId: comment.resourceId, resourceType: comment.resourceType }
    });

    return comment;
  }

  /**
   * Lists comments for a resource under strict tenant isolation.
   */
  public static async listComments(
    context: DataAccessContext,
    resourceId: string
  ): Promise<ExecutiveComment[]> {
    if (!context || !context.tenantId) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    // Filter comments belonging ONLY to the caller's tenant
    const tenantComments = this.comments.filter(
      c => c.tenantId === context.tenantId && c.resourceId === resourceId && !c.isArchived
    );

    // Filter visibility based on role
    return tenantComments.filter(c => {
      if (c.visibilityPolicy === 'PRIVATE_TO_OWNER') {
        return c.actorId === context.actorId;
      }
      if (c.visibilityPolicy === 'BOARD_ONLY') {
        return context.role === 'BOARD_MEMBER' || context.role === 'SUPER_ADMIN' || context.role === 'CFO';
      }
      if (c.visibilityPolicy === 'CFO_ONLY') {
        return context.role === 'CFO' || context.role === 'SUPER_ADMIN';
      }
      return true;
    });
  }

  /**
   * Edits comment content.
   */
  public static async editComment(
    context: DataAccessContext,
    commentId: string,
    newContent: string
  ): Promise<ExecutiveComment> {
    const comment = this.comments.find(c => c.commentId === commentId);
    if (!comment) {
      throw new Error('[Collaboration Layer] Comentário não encontrado.');
    }

    if (comment.tenantId !== context.tenantId) {
      throw new Error('[Collaboration Layer] Rejeitado: Acesso cross-tenant negado.');
    }

    if (comment.actorId !== context.actorId && context.role !== 'SUPER_ADMIN') {
      throw new Error('[Collaboration Layer] Permissão negada para editar.');
    }

    comment.content = newContent;

    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: 'EDIT_COLLABORATIVE_COMMENT',
      resourceType: 'Collaboration',
      resourceId: commentId,
      auditSeverity: 'INFO',
      requestSource: 'ExecutiveCollaborationLayer'
    });

    return comment;
  }

  /**
   * Archives a comment.
   */
  public static async archiveComment(
    context: DataAccessContext,
    commentId: string
  ): Promise<void> {
    const comment = this.comments.find(c => c.commentId === commentId);
    if (!comment) {
      throw new Error('[Collaboration Layer] Comentário não encontrado.');
    }

    if (comment.tenantId !== context.tenantId) {
      throw new Error('[Collaboration Layer] Rejeitado: Acesso cross-tenant negado.');
    }

    if (comment.actorId !== context.actorId && context.role !== 'CFO' && context.role !== 'SUPER_ADMIN') {
      throw new Error('[Collaboration Layer] Permissão negada para arquivar.');
    }

    comment.isArchived = true;

    AuditEventBus.emit({
      tenantId: context.tenantId,
      actorId: context.actorId,
      role: context.role,
      sessionId: context.sessionId || 'N/A',
      eventType: 'ARCHIVE_COLLABORATIVE_COMMENT',
      resourceType: 'Collaboration',
      resourceId: commentId,
      auditSeverity: 'INFO',
      requestSource: 'ExecutiveCollaborationLayer'
    });
  }
}
