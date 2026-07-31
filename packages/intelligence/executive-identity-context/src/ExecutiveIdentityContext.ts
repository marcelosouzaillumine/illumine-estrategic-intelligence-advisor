export type OperationalRole = "CLIENT" | "ADVISOR" | "ADMIN" | "PARTNER";
export type IdentitySource = "AUTH" | "SYSTEM" | "DELEGATED";

/**
 * Contrato Constitucional: Identidade Executiva.
 * Nenhum relacionamento ou recuperação de memória pode ser feito 
 * sem que a identidade do usuário esteja resolvida e validada.
 */
export interface ExecutiveIdentityContext {
  userId: string;
  tenantId: string;
  organizationId: string;
  operationalRole: OperationalRole;
  executivePersona: string;
  permissions: string[];
  sessionId: string;
  issuedAt: Date;
  expiresAt: Date;
  identitySource: IdentitySource;
}

/**
 * Validador de integridade do contexto de identidade
 */
export function isValidIdentity(context: ExecutiveIdentityContext): boolean {
  if (!context.tenantId || !context.userId || !context.organizationId) return false;
  if (context.expiresAt < new Date()) return false;
  return true;
}
