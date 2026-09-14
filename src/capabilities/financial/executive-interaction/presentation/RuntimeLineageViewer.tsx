import React from 'react';
import { History, ShieldCheck, Database, FileText } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface RuntimeLineageViewerProps {
  lineageHash?: string;
  sourceDataset?: string;
  auditTrail?: { action: string; timestamp: string; hash: string }[];
}

export const RuntimeLineageViewer: React.FC<RuntimeLineageViewerProps> = ({
  lineageHash = 'SHA256-fiduciary-certified-99b821',
  sourceDataset = 'certified-bp-basic.json',
  auditTrail = [
    { action: 'Importação e Assinatura do Dataset', timestamp: '26/05/2026 15:45', hash: 'SHA256-88b11a' },
    { action: 'Processamento do Balanço Patrimonial', timestamp: '26/05/2026 15:46', hash: 'SHA256-cc339b' },
    { action: 'Homologação e Congelamento de Causalidade', timestamp: '26/05/2026 15:48', hash: 'SHA256-ee882d' }
  ]
}) => {
  const { translateLabel: t } = useLanguage();
  return (
    <div className="card-premium p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Integridade Criptográfica de Lineage
          </h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Rastreabilidade matemática ponta a ponta de todas as transformações de dados.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-success-soft0/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Assinado
        </span>
      </div>

      <div className="p-4 bg-slate-950/40 border border-border/10 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
          <span>{t("overlays.origin")} {sourceDataset}</span>
          <span>{t("overlays.root_hash")} {lineageHash.substring(0, 16)}...</span>
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Histórico de Transformação (Audit Trail)</h5>
        <div className="relative border-l border-border/10 pl-6 ml-3 space-y-6">
          {auditTrail.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-primary border-4 border-border" />
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.action}</p>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.timestamp}</span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">{t("overlays.node_hash")} {item.hash}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
