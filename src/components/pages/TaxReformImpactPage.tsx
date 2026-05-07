
import React, { useState } from 'react';
import { Percent, TrendingUp, TrendingDown, ShieldCheck, Lightbulb, Target, BookOpen, Database, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';

function TimelineItem({ year, event, desc, active }: any) {
  return (
    <div className="relative pl-12">
      <div className={cn(
        "absolute left-0 w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center text-[10px] font-black",
        active ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-slate-200 text-slate-500"
      )}>
        {year.substring(0, 4)}
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-900">{event}</h4>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}

function RecommendationCard({ title, desc }: any) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
      <h5 className="text-xs font-black text-slate-900 mb-1">{title}</h5>
      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function TacticalAction({ icon: Icon, title, items, colorClass }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colorClass)}>
        <Icon size={24} />
      </div>
      <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">{title}</h4>
      <ul className="space-y-3">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex gap-3">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-slate-600 font-medium leading-tight">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TaxReformImpactPage({ clients, selectedClient }: any) {
  const [currentTax, setCurrentTax] = useState(16.25); // PIS/COFINS/ISS
  const [newTax, setNewTax] = useState(26.5); // IBS/CBS Estimated
  const [revenue, setRevenue] = useState(1000000);
  const [costWithCredits, setCostWithCredits] = useState(400000);

  const currentTaxValue = isNaN(revenue) || isNaN(currentTax) ? 0 : revenue * (currentTax / 100);
  const newTaxValue = isNaN(revenue) || isNaN(newTax) || isNaN(costWithCredits) 
    ? 0 
    : (revenue * (newTax / 100)) - (costWithCredits * (newTax / 100) * 0.8);
  const diff = newTaxValue - currentTaxValue;

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Simulador de Impacto: Reforma Tributária" 
        description="Análise estratégica da transição para o modelo de IVA (IBS/CBS) e seus impactos no EBITDA e precificação." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
            <h3 className="text-xl font-display font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Percent size={20} className="text-blue-600" />
              </div>
              Simulação de Cenários (Regime Atual vs. IVA)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Receita Bruta Mensal (R$)</label>
                  <input 
                    type="number" 
                    value={revenue} 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRevenue(isNaN(val) ? 0 : val);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-lg font-black text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Custo Creditável (Insumos/Serviços R$)</label>
                  <input 
                    type="number" 
                    value={costWithCredits} 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCostWithCredits(isNaN(val) ? 0 : val);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-lg font-black text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <div className="space-y-8">
                   <div className="flex justify-between items-end border-b border-slate-800 pb-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Carga Atual (Média)</p>
                        <p className="text-2xl font-black">{formatCurrency(currentTaxValue)}</p>
                      </div>
                      <p className="text-xs font-bold text-slate-400">{currentTax}%</p>
                   </div>
                   <div className="flex justify-between items-end border-b border-slate-800 pb-6">
                      <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Estimativa de IVA (CBS+IBS-Créditos)</p>
                        <p className="text-2xl font-black text-blue-400">{formatCurrency(newTaxValue)}</p>
                      </div>
                      <p className="text-xs font-bold text-slate-400">{newTax}% (Nominal)</p>
                   </div>
                   <div className="pt-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Impacto no Resultado</p>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest",
                        diff > 0 ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      )}>
                        {diff > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {diff > 0 ? 'Aumento de Carga: ' : 'Redução de Carga: '}
                        {formatCurrency(Math.abs(diff))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[40px] text-white">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="text-secondary" />
              <h3 className="text-xl font-display font-extrabold">Board de Recomendações Táticas</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TacticalAction 
                icon={BookOpen}
                title="Cláusulas Contratuais"
                colorClass="bg-blue-500/20 text-blue-400"
                items={[
                  "Adição de cláusula de Gross-Up para IBS/CBS em contratos de longo prazo.",
                  "Previsão de renegociação por desequilíbrio econômico-financeiro pós-reforma.",
                  "Inclusão de 'Tax Netting' para garantir repasse de créditos não aproveitados."
                ]}
              />
              <TacticalAction 
                icon={Database}
                title="Saneamento de Cadastro"
                colorClass="bg-purple-500/20 text-purple-400"
                items={[
                  "Auditoria integral de NCMs e CESTs para evitar glosa de créditos.",
                  "Qualificação de fornecedores: priorizar contribuintes do Regime Normal.",
                  "Parametrização do ERP para destaque individualizado de IBS e CBS."
                ]}
              />
              <TacticalAction 
                icon={Tag}
                title="Revisão de Pricing"
                colorClass="bg-amber-500/20 text-amber-400"
                items={[
                  "Definição de Net Price (Preço Líquido) para manter margem EBITDA.",
                  "Adoção do princípio do 'Não Cumulativo Pleno' na composição de custos.",
                  "Plano de comunicação para clientes sobre transição de tributos por fora."
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 p-10">
            <h3 className="text-xl font-display font-extrabold text-slate-900 mb-8">Timeline de Transição (Brasil)</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100"></div>
              <div className="space-y-10">
                <TimelineItem year="2026" event="Início CBS (0,9%) e IBS (0,1%) como teste." desc="Compensação total com PIS/COFINS." active />
                <TimelineItem year="2027" event="Extinção de PIS e COFINS." desc="CBS entra em vigor integralmente (~8.8%)." />
                <TimelineItem year="2029 - 2032" event="Transição Gradual ICMS/ISS para IBS." desc="Redução progressiva dos impostos atuais e aumento do IBS." />
                <TimelineItem year="2033" event="Plena vigência do novo modelo." desc="Extinção total de ICMS e ISS." />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl border bg-blue-50 text-blue-600 border-blue-100">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-none mb-1">Parecer Consultivo</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Diretrizes Estratégicas Illumine</p>
            </div>
          </div>
          
          <div className="bg-white border-2 border-primary rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Target size={120} />
            </div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Lightbulb size={16} className="text-secondary" />
              Recomendações CFO
            </h4>
            
            <div className="space-y-6 mb-8 mt-4">
              <RecommendationCard 
                title="Cláusula de Gross-up" 
                desc="Revisar contratos de longo prazo para incluir cláusulas de reajuste automático baseadas na variação do IVA." 
              />
              <RecommendationCard 
                title="Saneamento de Cadastro" 
                desc="A rastreabilidade dos créditos será baseada em documentos fiscais eletrônicos. Iniciar auditoria de fornecedores agora." 
              />
              <RecommendationCard 
                title="Revisão de Pricing" 
                desc="Empresas de serviços podem ter aumento de 10-15%. Iniciar plano de comunicação de valor para clientes." 
              />
            </div>

            <button className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
              Gerar Relatório de Impacto PDF
            </button>
          </div>

          <ExecutiveCommentary 
            reportType="TAX_REFORM"
            clientId={selectedClient}
            year={2026}
            month={3}
          />
        </div>
      </div>
    </div>
  );
}
