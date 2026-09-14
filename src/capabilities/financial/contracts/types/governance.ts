
export type UserRole = 'cliente' | 'parceiro' | 'curador' | 'admin' | 'master';

export interface GovernanceConfig {
  id?: string;
  dupla_validacao_obrigatoria: boolean;
  bloquear_integracao_mesmo_usuario: boolean;
  exigir_confirmacao_documental: boolean;
  exigir_cliente_ativo: boolean;
  permitir_integracao_manual: boolean;
  permitir_reprocessamento: boolean;
  permitir_upload_admin_master: boolean;
  log_detalhado_obrigatorio: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface AuditLog {
  id?: string;
  user_id: string;
  role: UserRole;
  empresa_id: string; // The partner/company the user belongs to
  cliente_ativo_id: string;
  protocolo: string;
  ip: string;
  user_agent: string;
  timestamp: any;
  acao: string;
  detalhes?: any;
}
