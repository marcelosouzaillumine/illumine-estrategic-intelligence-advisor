
import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Scale, 
  Search,
  Download,
  Filter,
  Zap,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface CompliancePageProps {
  clientId: string;
}

export function CompliancePage({ clientId }: CompliancePageProps) {
  const policies = [
    { id: 1, title: 'Código de Ética e Conduta', status: 'Ativo', lastUpdate: '2025-01-15', health: 100 },
    { id: 2, title: 'Política de Segurança de Dados (LGPD)', status: 'Revisão', lastUpdate: '2024-11-20', health: 85 },
    { id: 3, title: 'Manual de Compras e Suprimentos', status: 'Ativo', lastUpdate: '2025-02-10', health: 95 },
    { id: 4, title: 'Política de Reembolsos e Viagens', status: 'Crítico', lastUpdate: '2023-05-01', health: 40 }
  ];

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Compliance & Políticas</h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Gestão de Integridade e Conformidade</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-100">
              <Download size={14} /> Baixar Manual Global
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">
              <Lock size={14} /> Auditoria Rápida
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Policy List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                     <FileText size={20} className="text-primary" /> Catálogo de Políticas Internas
                  </h3>
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="Pesquisar política..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none" />
                  </div>
               </div>

               <div className="space-y-4">
                  {policies.map(policy => (
                    <div key={policy.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            policy.health > 80 ? "bg-emerald-50 text-emerald-500" : 
                            policy.health > 50 ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                          )}>
                             <ShieldCheck size={20} />
                          </div>
                          <div>
                             <h4 className="text-xs font-black text-slate-800 uppercase">{policy.title}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Última Atualização: {policy.lastUpdate}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <span className={cn(
                               "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                               policy.status === 'Ativo' ? "bg-emerald-100 text-emerald-600" :
                               policy.status === 'Revisão' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                             )}>
                               {policy.status}
                             </span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                             <div className={cn(
                               "h-full",
                               policy.health > 80 ? "bg-emerald-500" : 
                               policy.health > 50 ? "bg-amber-500" : "bg-rose-500"
                             )} style={{ width: `${policy.health}%` }} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Compliance Assessment */}
         <div className="space-y-6">
            <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute right-0 top-0 p-8 text-emerald-500/10">
                  <Scale size={120} strokeWidth={1} />
               </div>
               <div className="relative z-10 space-y-8">
                  <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-3">
                     <Zap size={20} /> Análise de Risco Compliance
                  </h3>
                  <div className="space-y-6">
                     {[
                       { label: 'Exposição Regulatória', val: 'Baixa', color: 'text-emerald-400' },
                       { label: 'Maturidade de Processos', val: 'Média', color: 'text-amber-400' },
                       { label: 'Cultura de Ética', val: 'Alta', color: 'text-emerald-400' }
                     ].map((risk, i) => (
                       <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{risk.label}</span>
                          <span className={cn("text-xs font-black uppercase tracking-widest", risk.color)}>{risk.val}</span>
                       </div>
                     ))}
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                     <p className="text-[10px] text-slate-300 font-medium leading-relaxed italic">
                        "Foco imediato na atualização da Política de Reembolsos, que apresenta gap de conformidade com as novas diretrizes fiscais."
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Próximos Treinamentos</h4>
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0 font-black text-xs">24/02</div>
                     <div>
                        <p className="text-xs font-black text-slate-800 uppercase">LGPD para Gestores</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Online • 40 participantes</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
