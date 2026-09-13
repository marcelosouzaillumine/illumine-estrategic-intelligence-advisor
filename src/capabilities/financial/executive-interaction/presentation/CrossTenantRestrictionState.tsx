import React from 'react';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface CrossTenantRestrictionStateProps {
  tenantId?: string;
  violatingTenantId?: string;
}

export const CrossTenantRestrictionState: React.FC<CrossTenantRestrictionStateProps> = ({
  tenantId = 'TENANT-HQ',
  violatingTenantId
}) => {
  const { translateLabel: t } = useLanguage();
  return (
    <div className="card-premium p-12 text-center max-w-xl mx-auto space-y-6 border-red-500/25 bg-red-500/5">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20 shadow-inner">
        <Lock className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-bold text-red-400 uppercase tracking-wider">{t("overlays.multi_tenant_restriction")}</h4>
        <p className="text-[10px] text-red-400 uppercase tracking-widest font-mono font-bold">Security Boundary Violation (Sovereignty Check)</p>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
        Seu contexto ativo está configurado para o Tenant <strong className="text-muted-foreground font-bold">{tenantId}</strong>. A tentativa de acessar recursos ou dados de outro tenant foi bloqueada preventivamente pela camada fiduciária da plataforma.
      </p>

      <div className="pt-4 border-t border-border/10 flex flex-col gap-2 text-[10px] font-mono text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>{t("overlays.active_context")} {tenantId}</span>
          {violatingTenantId && <span className="text-red-400 font-bold">{t("overlays.attempted")} {violatingTenantId}</span>}
        </div>
        <p className="text-left text-[9px] text-muted-foreground mt-2">
          * Todas as tentativas de violação de limite de tenant são criptografadas e registradas nos logs de auditoria globais do Master Admin.
        </p>
      </div>
    </div>
  );
};
