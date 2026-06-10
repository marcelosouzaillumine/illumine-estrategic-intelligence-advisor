
import React from 'react';
import { BookOpen, TrendingUp, Activity, Info, Users } from 'lucide-react';
import { PageHeader } from '../Common';
import { formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';

export function PremissasTributariasPage({ clients }: any) {
  const p = DATA.premissas.tributarias;
  
  return (
    <div className="space-y-12">
      <PageHeader 
        title="Premissas Tributárias 2026" 
        subtitle="Parâmetros legais e alíquotas vigentes para Simples Nacional, Lucro Presumido e Lucro Real."
      />

      {/* Regimes Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white border border-border p-8 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-muted-foreground">Cenário Tributário</h4>
            <p className="text-sm text-muted-foreground mt-1">Visão geral dos regimes adotados pela carteira de clientes atual.</p>
          </div>
          <div className="flex gap-8">
             <div className="text-center">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Clientes</span>
                <span className="text-2xl font-black text-muted-foreground">{clients.length}</span>
             </div>
             <div className="text-center">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Divergências</span>
                <span className="text-2xl font-black text-emerald-500">0</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Distribuição</h4>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Lucro Real', count: clients.filter((c: any) => c.regime === 'Lucro Real').length },
                { label: 'Lucro Presumido', count: clients.filter((c: any) => c.regime === 'Lucro Presumido').length },
                { label: 'Simples Nacional', count: clients.filter((c: any) => c.regime === 'Simples Nacional').length },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-default">
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(item.count / (clients.length || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black font-mono">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 text-white/5">
            <BookOpen size={120} />
          </div>
        </div>
      </div>
      
      {/* Simples Nacional */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-muted-foreground">Simples Nacional</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tabelas Progressivas (Anexos 2026)</p>
          </div>
        </div>

        <div className="mb-8 p-6 bg-slate-50 border border-border rounded-2xl flex gap-6 items-center">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-muted-foreground mb-1">Cálculo da Alíquota Efetiva</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A alíquota exibida nas tabelas é a <strong>Nominal</strong>. Para encontrar a taxa real paga sobre o faturamento do mês, utilize a fórmula:
            </p>
          </div>
          <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-xl border border-border shadow-sm">
             <code className="text-xs font-black text-muted-foreground">
               ((RBT12 × Alíq. Nom) - Ded) / RBT12
             </code>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {p.simplesNacional.map((anexo: any, idx: number) => (
            <div key={idx} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm flex flex-col">
              <div className="bg-slate-50 px-4 md:px-6 py-2.5 md:py-4 border-b border-border flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Anexo {anexo.anexo}</span>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{anexo.descricao}</p>
                </div>
                {anexo.fatorR && (
                  <div className="flex items-center gap-1.5 bg-warning-soft text-amber-700 px-2.5 py-1 rounded-lg border border-amber-100">
                    <Activity size={10} />
                    <span className="text-[9px] font-black uppercase tracking-tight">Fator R</span>
                  </div>
                )}
              </div>
              
              {anexo.fatorR && (
                <div title={anexo.fatorR} className="px-4 md:px-6 py-1.5 md:py-2 bg-warning-soft/30 border-b border-amber-100/50">
                  <p className="text-[9px] text-amber-800 font-medium flex items-center gap-2 italic">
                    <Info size={10} />
                    {anexo.fatorR}
                  </p>
                </div>
              )}

              {anexo.obs && (
                <div className="px-4 md:px-6 py-1.5 md:py-2 bg-slate-50/50 border-b border-border">
                  <p className="text-[9px] text-muted-foreground font-medium italic">Nota: {anexo.obs}</p>
                </div>
              )}

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[400px]">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Faixa de Faturamento (12m)</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Alíquota Nom.</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Dedução</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {anexo.faixas.map((faixa: any, fidx: number) => (
                      <tr key={fidx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-medium">Até {faixa.ate === 4800000 ? "R$ 4.800.000" : formatCurrency(faixa.ate)}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 font-bold text-emerald-600">{(faixa.aliq * 100).toFixed(2)}%</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-mono">{formatCurrency(faixa.deducao)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lucro Presumido & Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Lucro Presumido */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-muted-foreground">Lucro Presumido</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Carga Tributária Federal e Municipal</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 md:px-6 py-2.5 md:py-4 border-b border-border">
                <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Percentuais de Presunção</span>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Base de cálculo aplicada sobre a Receita Bruta</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Atividade Econômica</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">IRPJ (%)</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">CSLL (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {p.lucroPresumido.presuncao.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-medium">{item.atividade}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 font-bold text-primary">{(item.irpj * 100).toFixed(item.irpj === 0.016 ? 1 : 0)}%</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 font-bold text-primary">{(item.csll * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border">
                <h4 className="text-sm font-bold text-muted-foreground">Tributos Federais</h4>
              </div>
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                {p.lucroPresumido.federal.map((imp: any, idx: number) => (
                  <div key={idx} className="px-4 md:px-6 py-2.5 md:py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-muted-foreground">{imp.imposto}</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Base Presumida: {(imp.base * 100)}%</span>
                    </div>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                      {(imp.aliq * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-muted-foreground">ISS (Municipal)</span>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">Variável por município</p>
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">{(p.lucroPresumido.municipal.aliq_min * 100).toFixed(2)}% ~ {(p.lucroPresumido.municipal.aliq_max * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lucro Real */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-muted-foreground">Lucro Real</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Regime Especial e Não-Cumulativo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 md:px-6 py-2.5 md:py-4 border-b border-border">
                <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Modelos PIS/COFINS (Lucro Real)</span>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Enquadramento conforme atividade e legislação</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Modelo / Regime</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Descrição</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">PIS</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">COFINS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {p.lucroReal.modelos.map((modelo: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 md:px-6 py-2.5 md:py-4">
                          <span className="text-sm font-bold text-muted-foreground block">{modelo.nome}</span>
                          <span className="text-[9px] text-muted-foreground font-medium italic mt-0.5">{modelo.obs}</span>
                        </td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-[11px] text-muted-foreground leading-relaxed max-w-xs">{modelo.descricao}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 font-bold text-primary">
                          {typeof modelo.pis === 'number' ? `${(modelo.pis * 100).toFixed(2)}%` : modelo.pis}
                        </td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 font-bold text-primary">
                          {typeof modelo.cofins === 'number' ? `${(modelo.cofins * 100).toFixed(2)}%` : modelo.cofins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border">
              <h4 className="text-sm font-bold text-muted-foreground">Tributos Federais</h4>
            </div>
            <div className="grid grid-cols-1 divide-y divide-slate-100">
              {p.lucroReal.federal.map((imp: any, idx: number) => (
                <div key={idx} className="px-4 md:px-6 py-2.5 md:py-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-muted-foreground">{imp.imposto}</span>
                    {imp.adicional && (
                      <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">+ Adicional de {(imp.adicional * 100)}% {">"} {formatCurrency(imp.teto_mensal)}/mês</span>
                    )}
                  </div>
                  <span className="bg-primary text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary">
                    {(imp.aliq * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-primary border-t border-primary">
              <p className="text-[11px] text-primary leading-relaxed font-medium">
                <strong>Nota:</strong> PIS e COFINS no Lucro Real seguem o regime de não-cumulatividade, permitindo a apropriação de créditos sobre insumos permitidos por lei.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Encargos de Folha de Pagamento */}
      <section className="pt-12 border-t border-border">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display text-muted-foreground">Encargos Sociais & Trabalhistas</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Parâmetros para cálculo de custo de pessoal 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Encargos Patronais */}
          <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-5 md:px-8 py-3 md:py-5 border-b border-border">
              <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Encargos Patronais (Empresa)</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Aplicado sobre a folha bruta mensal</p>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">FGTS</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Fundo de Garantia</p>
                </div>
                <span className="text-lg font-display text-primary">8.00%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">INSS Patronal</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Regime Geral (Varia p/ Regime)</p>
                </div>
                <span className="text-lg font-display text-primary">20.00%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">RAT / FAP</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Acid. Trabalho (Médio)</p>
                </div>
                <span className="text-lg font-display text-primary">2.00%</span>
              </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Outras Entidades</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Sistema S (Médio)</p>
                </div>
                <span className="text-lg font-display text-primary">5.80%</span>
              </div>
            </div>
            <div className="p-6 bg-warning-soft/50 border-t border-amber-100">
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed italic">
                * Clientes no <strong>Simples Nacional</strong> (exceto Anexo IV) são isentos de INSS Patronal, RAT e Terceiros na cota patronal regular.
              </p>
            </div>
          </div>

          {/* Provisões e Multas */}
          <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-5 md:px-8 py-3 md:py-5 border-b border-border">
              <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Provisões & Riscos</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Reservas financeiras obrigatórias</p>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">13º Salário</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Provisão Mensal (1/12)</p>
                </div>
                <span className="text-lg font-display text-emerald-600">8.33%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Férias + 1/3</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Provisão Mensal (1/12 + 1/3)</p>
                </div>
                <span className="text-lg font-display text-emerald-600">11.11%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Multa FGTS</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Rescisão s/ Justa Causa</p>
                </div>
                <span className="text-lg font-display text-rose-600">40.00%</span>
              </div>
            </div>
          </div>

          {/* IRRF Tabela */}
          <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-5 md:px-8 py-3 md:py-5 border-b border-border">
              <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">IRRF - Folha (Retenção)</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Tabela Progressiva Mensal</p>
            </div>
            <div className="flex-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/50">
                    <th className="px-4 md:px-6 py-2 md:py-3 font-black text-muted-foreground uppercase tracking-widest">Base de Cálculo</th>
                    <th className="px-4 md:px-6 py-2 md:py-3 font-black text-muted-foreground uppercase tracking-widest text-center">Alíquota</th>
                    <th className="px-4 md:px-6 py-2 md:py-3 font-black text-muted-foreground uppercase tracking-widest text-right">Dedução</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-bold">Até R$ 2.259,20</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 font-black text-muted-foreground text-center">-</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-right text-muted-foreground">Isento</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-bold">Até R$ 2.826,65</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 font-black text-blue-600 text-center">7.5%</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-right text-muted-foreground font-mono">169,44</td>
                  </tr>
                   <tr className="hover:bg-slate-50">
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-bold">Até R$ 3.751,05</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 font-black text-blue-600 text-center">15.0%</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-right text-muted-foreground font-mono">381,44</td>
                  </tr>
                   <tr className="hover:bg-slate-50">
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-bold">Até R$ 4.664,68</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 font-black text-blue-600 text-center">22.5%</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-right text-muted-foreground font-mono">662,77</td>
                  </tr>
                   <tr className="hover:bg-slate-50">
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-muted-foreground font-bold">Acima de R$ 4.664,68</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 font-black text-blue-600 text-center">27.5%</td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-right text-muted-foreground font-mono">896,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 border-t border-border">
               <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                  <span>Dedução p/ Dependente:</span>
                  <span>R$ 189,59</span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
