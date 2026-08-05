export interface IdentityProvisioningPort {
  /**
   * Invita/cria o usuário administrador real (ex: no Firebase Auth).
   * Retorna a referência física gerada (identityReference).
   */
  provisionAdminIdentity(email: string, tenantId: string): Promise<string>;
}

export interface TenantProvisioningPort {
  /**
   * Cria o workspace físico no banco de dados (ex: Firebase Firestore).
   */
  createPhysicalTenant(tenantId: string, payload: any): Promise<void>;
  
  /**
   * Bloqueia o acesso físico ao tenant.
   */
  suspendPhysicalTenant(tenantId: string): Promise<void>;
}
