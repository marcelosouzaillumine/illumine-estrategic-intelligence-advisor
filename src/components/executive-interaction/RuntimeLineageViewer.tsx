import React from 'react';
import { History, ShieldCheck, Database, FileText } from 'lucide-react';

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
  return (
    <div className="card-premium p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            Integridade Criptográfica de Lineage
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Rastreabilidade matemática ponta a ponta de todas as transformações de dados.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Assinado
        </span>
      </div>

      <div className="p-4 bg-slate-950/40 border border-border/10 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Origem: {sourceDataset}</span>
          <span>Hash Raiz: {lineageHash.substring(0, 16)}...</span>
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] uppercase tracking-widest font-black text-slate-500">Histórico de Transformação (Audit Trail)</h5>
        <div className="relative border-l border-border/10 pl-6 ml-3 space-y-6">
          {auditTrail.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border-4 border-slate-950" />
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">{item.action}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500">Node Hash: {item.hash}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
