
import React from 'react';
import { ChevronRight, ShieldCheck, Database, Tag, Target, Printer, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';

interface ActionItemProps {
  title: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'Em curso' | 'Pendente' | 'Concluído';
  deadline: string;
  desc: string;
}

function ActionItem({ title, priority, status, deadline, desc }: ActionItemProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-sm font-black text-slate-900">{title}</h4>
            <span className={cn(
              "text-[8px] font-black uppercase px-2 py-0.5 rounded",
              priority === 'Alta' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
            )}>{priority}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{desc}</p>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest shrink-0">
          <div className="text-right">
            <p className="text-slate-400 mb-1">Prazo Estimado</p>
            <p className="text-slate-900">{deadline}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 mb-1">Status</p>
            <span className={cn(
              status === 'Concluído' ? "text-emerald-500" : "text-blue-500"
            )}>{status}</span>
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:text-blue-600 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TacticalRecommendation({ icon: Icon, title, desc, colorClass }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
        <Icon size={18} />
      </div>
      <div>
        <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">{title}</h5>
        <p className="text-[10px] text-slate-500 font-medium leading-normal">{desc}</p>
      </div>
    </div>
  );
}

export function PlanoAcaoPage({ clients, selectedClient }: any) {
  return (
    <div className="space-y-8 pb-20 print:p-0">
      <div className="flex justify-between items-center no-print">
        <PageHeader 
          title="Roadmap Estratégico (Plano de Voo)" 
          description="Acompanhamento tático das metas e soluções propostas pela consultoria." 
        />
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Printer size={16} /> Imprimir Plano
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-display font-extrabold text-slate-900 mb-8 flex items-center gap-2">
              <Target size={20} className="text-blue-600" />
              Prioridades de Execução
            </h3>
            
            <div className="flex items-center gap-10 mb-12">
              {['Fase 1: Estabilização', 'Fase 2: Otimização', 'Fase 3: Expansão'].map((phase, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center font-black",
                    i === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                  )}>{i + 1}</div>
                  <p className={cn("text-xs font-black uppercase tracking-widest", i === 0 ? "text-slate-900" : "text-slate-400")}>{phase}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
               <ActionItem 
                title="Redução de Alavancagem Financeira" 
                priority="Alta" 
                status="Em curso" 
                deadline="Jun/2026" 
                desc="Troca de dívida de curto prazo (CDI+8%) por BNDES (SELIC+2%)."
               />
               <ActionItem 
                title="Implantação de Budget Semestral" 
                priority="Média" 
                status="Pendente" 
                deadline="Jul/2026" 
                desc="Treinamento de gerentes e definição de KPIs por departamento."
               />
               <ActionItem 
                title="Auditoria de Receitas (Revenue Assurance)" 
                priority="Baixa" 
                status="Concluído" 
                deadline="Ago/2026" 
                desc="Verificação de 100% dos contratos vs repasse de cartões."
               />
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-display font-extrabold text-slate-900 mb-8 flex items-center gap-2">
              <ClipboardCheck size={20} className="text-blue-600" />
              Checklist de Governança & Conformidade
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Segregação de Funções (Tesouraria vs. Lançamento)", status: true },
                { label: "Conciliação Bancária Diária Automática", status: true },
                { label: "Aprovação de Pagamentos Alçada Dupla", status: false },
                { label: "Controle de Inadimplência (Régua de Cobrança)", status: true },
                { label: "Inventário de Estoque Trimestral", status: false },
                { label: "Manual de Normas e Procedimentos Internos", status: false },
                { label: "Certidões Negativas Integradas (CND)", status: true },
                { label: "Seguro de D&O para Administradores", status: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  {item.status ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={14} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
              <p className="text-xs font-medium text-blue-700 leading-relaxed italic">
                "A maturidade de governança reduz o custo de captação em até 1.5% ao ano junto aos bancos devido ao rating de risco operacional."
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Gestão Financeira Tática</h3>
          
          <TacticalRecommendation 
            icon={ShieldCheck}
            title="Cláusulas Blindadas"
            colorClass="bg-blue-50 text-blue-600"
            desc="Revisão de contratos com fornecedores e clientes para blindagem contra variação do IVA (Gross-up e Renegociação)."
          />
          
          <TacticalRecommendation 
            icon={Database}
            title="Higiene de Cadastro"
            colorClass="bg-purple-50 text-purple-600"
            desc="Saneamento de NCM, CEST e origens de mercadorias para garantir o crédito fiscal integral no novo sistema IBS/CBS."
          />
          
          <TacticalRecommendation 
            icon={Tag}
            title="Pricing Strategy"
            colorClass="bg-amber-50 text-amber-600"
            desc="Reavaliação da precificação em função da extinção do ISS/ICMS e o impacto real da alíquota final do IVA na margem líquida."
          />

          <div className="p-6 rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={60} /></div>
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Risk Assessment</h4>
            <p className="text-xs font-medium text-slate-300 leading-relaxed mb-4">
              A inação em pontos de cadastro pode resultar em perda de margem de até <span className="text-rose-400 font-bold">12%</span> por falta de créditos fiscais.
            </p>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

