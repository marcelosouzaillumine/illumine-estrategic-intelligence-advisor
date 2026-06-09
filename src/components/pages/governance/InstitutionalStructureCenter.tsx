import React from 'react';
import { Users, Building2, Network, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { PageHeader } from '../../Common';

export function InstitutionalStructureCenter() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Cabeçalho */}
      <PageHeader 
        title="Estrutura Institucional de Governança"
        subtitle="Avaliação de organograma, segregação de funções (SoD), cadeias de autoridade e composição de comitês."
        icon={Users}
        transparent
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel Principal: Organograma e Comitês */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="card-premium p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                Cadeia de Autoridade Fiduciária
              </h2>
              <button className="text-xs uppercase tracking-widest font-black text-teal-400 hover:text-teal-300 transition-colors">Expandir Visão</button>
            </div>
            
            <div className="aspect-video bg-slate-950/60 rounded-xl border border-border/10 flex items-center justify-center relative overflow-hidden shadow-inner">
               <div className="text-center">
                  <Network className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Organograma Dinâmico Renderizado Aqui</p>
               </div>
            </div>
          </div>

          <div className="card-premium p-8">
            <h2 className="text-lg font-medium text-muted-foreground mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              Comitês de Assessoramento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Comitê de Auditoria e Riscos', 'Comitê de Pessoas e Cultura', 'Comitê de Inovação', 'Comitê ESG e Ética'].map((comite, idx) => (
                <div key={idx} className="p-4 bg-slate-950/40 border border-border/10 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-muted-foreground border border-border/5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{comite}</h3>
                    <p className="text-xs text-muted-foreground mt-1">3 Membros • Ativo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar de Gaps e Avaliação */}
        <div className="space-y-6">
          
          {/* Card de Avaliação de Segregação (SoD) */}
          <div className="card-premium p-8">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
              Segregação de Funções (SoD)
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Aprovação vs Execução</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Nenhum diretor executa e aprova o mesmo orçamento.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserX className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Gaps Identificados (1)</h4>
                  <div className="text-xs mt-2 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-amber-400 leading-relaxed">
                    O CFO atual acumula a diretoria de Relações com Investidores. Risco de conflito.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Composição do Conselho */}
          <div className="card-premium p-8">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
              Composição do Board
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Independentes</span>
                <span className="font-medium text-muted-foreground">3 (60%)</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-border/5">
                <div className="bg-emerald-500 h-full w-[60%]"></div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-4 border-t border-border/10">
                <span className="text-muted-foreground">Membros Familiares</span>
                <span className="font-medium text-muted-foreground">2 (40%)</span>
              </div>
              
              <div className="mt-6 p-4 bg-slate-950/40 border border-border/10 rounded-xl text-xs text-muted-foreground text-center leading-relaxed">
                Aderente às práticas do IBGC para conselhos não listados.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
