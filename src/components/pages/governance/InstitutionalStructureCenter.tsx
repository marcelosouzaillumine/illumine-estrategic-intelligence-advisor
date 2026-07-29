import React from 'react';
import { Users, Building2, Network, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutivePageTemplate } from '@/components/ui/executive-page-template';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveBadge } from '@/components/ui/executive-badge';

export function InstitutionalStructureCenter() {
  return (
    <ExecutivePageTemplate header={{ title: "Estrutura Institucional & Organograma", description: "Avaliação de organograma, segregação de funções (SoD), cadeias de autoridade e composição de comitês.", icon: Users }}>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel Principal: Organograma e Comitês */}
        <div className="lg:col-span-2 space-y-6">
          
          <ExecutiveSurface variant="default" padding="lg">
            <div className="flex justify-between items-center mb-6">
              <ExecutiveHeading as="h2" className="text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Cadeia de Autoridade Fiduciária
              </ExecutiveHeading>
              <button className="text-xs uppercase tracking-widest font-bold text-primary hover:text-primary/80 transition-colors">Expandir Visão</button>
            </div>
            
            <div className="aspect-video bg-muted/20 rounded-xl border border-border/40 flex items-center justify-center relative overflow-hidden">
               <div className="text-center">
                  <Network className="w-12 h-12 text-primary mx-auto mb-3" />
                  <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 font-medium">Organograma Dinâmico Renderizado Aqui</ExecutiveText>
               </div>
            </div>
          </ExecutiveSurface>

          <ExecutiveSurface variant="default" padding="lg">
            <ExecutiveHeading as="h2" className="text-foreground mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Comitês de Assessoramento
            </ExecutiveHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Comitê de Auditoria e Riscos', 'Comitê de Pessoas e Cultura', 'Comitê de Inovação', 'Comitê ESG e Ética'].map((comite, idx) => (
                <div key={idx} className="p-4 bg-muted/20 border border-border/40 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-card rounded-lg text-primary border border-border">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <ExecutiveHeading as="h3" className="text-foreground">{comite}</ExecutiveHeading>
                    <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 mt-1 font-medium">3 Membros • Ativo</ExecutiveText>
                  </div>
                </div>
              ))}
            </div>
          </ExecutiveSurface>

        </div>

        {/* Sidebar de Gaps e Avaliação */}
        <div className="space-y-6">
          
          {/* Card de Avaliação de Segregação (SoD) */}
          <ExecutiveSurface variant="default" padding="lg">
            <ExecutiveHeading as="h2" className="text-foreground mb-6">
              Segregação de Funções (SoD)
            </ExecutiveHeading>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <ExecutiveHeading as="h4" className="text-foreground">Aprovação vs Execução</ExecutiveHeading>
                  <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 mt-0.5 font-medium">Nenhum diretor executa e aprova o mesmo orçamento.</ExecutiveText>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserX className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <ExecutiveHeading as="h4" className="text-foreground">Gaps Identificados (1)</ExecutiveHeading>
                  <div className="text-xs mt-2 p-3 bg-warning/10 border border-warning/30 rounded-xl text-amber-600 dark:text-amber-300 leading-relaxed font-medium">
                    O CFO atual acumula a diretoria de Relações com Investidores. Risco de conflito.
                  </div>
                </div>
              </div>
            </div>
          </ExecutiveSurface>

          {/* Composição do Conselho */}
          <ExecutiveSurface variant="default" padding="lg">
            <ExecutiveHeading as="h2" className="text-foreground mb-6">
              Composição do Board
            </ExecutiveHeading>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <ExecutiveText as="span" variant="bodyStandard" className="text-slate-700 dark:text-slate-300 font-medium">Independentes</ExecutiveText>
                <ExecutiveText as="span" variant="bodyStandard" className="font-bold text-foreground">3 (60%)</ExecutiveText>
              </div>
              <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden border border-border/40">
                <div className="bg-emerald-500 h-full w-[60%]"></div>
              </div>
              
              <div className="mt-6 flex justify-between items-center text-sm pt-4 border-t border-border/40">
                <ExecutiveText as="span" variant="bodyStandard" className="text-slate-700 dark:text-slate-300 font-medium">Membros Familiares</ExecutiveText>
                <ExecutiveText as="span" variant="bodyStandard" className="font-bold text-foreground">2 (40%)</ExecutiveText>
              </div>
              
              <div className="mt-6 p-4 bg-muted/20 border border-border/40 rounded-xl text-xs text-slate-700 dark:text-slate-300 text-center leading-relaxed font-medium">
                Aderente às práticas recomendadas do IBGC para conselhos não listados.
              </div>
            </div>
          </ExecutiveSurface>

        </div>

      </div>
    </ExecutivePageTemplate>
  );
}
