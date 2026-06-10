import React, { useMemo, useState, useEffect } from 'react';
import { Loader2, TrendingUp, BarChart3, AlertCircle, FileText } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../ui/button';
import { GenerateBoardReportModal } from '../modals/GenerateBoardReportModal';
import { useHistoricalDemonstracoes } from '../../hooks/useHistoricalDemonstracoes';
import { formatCurrency, formatValue } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';

interface RelatorioDemonstracoes5AnosProps {
  clientId: string;
  selectedYear: number;
}

export function RelatorioDemonstracoes5Anos({ clientId, selectedYear }: RelatorioDemonstracoes5AnosProps) {
  const { dbData, loading, error } = useHistoricalDemonstracoes(clientId, selectedYear);
  const yearsWithData = new Set(dbData.map((d: any) => d.year)).size;
  const runtimeInput = {
    rawFinancialData: {},
    historicalCyclesCount: yearsWithData,
    isMockData: false
  };
  const { runtimeOutput } = useInstitutionalRuntime({ input: runtimeInput });
  const memoryInference = runtimeOutput?.inferences['InstitutionalMemoryEngine'];
  const isMemoryBlocked = memoryInference?.metrics?.memoryType === 'STRUCTURAL_SNAPSHOT' || memoryInference?.metrics?.memoryType === 'LIMITED_COMPARISON' || memoryInference?.metrics?.memoryType === 'BLOCKED_INSUFFICIENT_HISTORY';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState<string>('Empresa');
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    async function fetchClient() {
      if (!clientId) return;
      const snap = await getDoc(doc(db, 'clients', clientId));
      if (snap.exists()) {
        const data = snap.data();
        setClientName(data.fantasia || data.razao || 'Empresa');
        setClientData(data);
      }
    }
    fetchClient();
  }, [clientId]);

  const years = useMemo(() => {
    return [
      selectedYear - 5,
      selectedYear - 4,
      selectedYear - 3,
      selectedYear - 2,
      selectedYear - 1,
      selectedYear,
    ];
  }, [selectedYear]);

  const extractMetric = (data: any[], year: number, keywords: string[], exclude: string[] = [], allowedDocTypes?: string[]) => {
    const yearData = data.filter(d => {
      const matchesYear = d.year === year;
      if (!matchesYear) return false;
      if (allowedDocTypes && allowedDocTypes.length > 0) {
        return allowedDocTypes.includes(d.docType);
      }
      return true;
    });
    let total = 0;
    yearData.forEach(item => {
      const contaLower = (item.conta || '').toLowerCase();
      const typeLower = (item.type || '').toLowerCase();
      
      const hasKeyword = keywords.some(kw => contaLower.includes(kw) || typeLower.includes(kw));
      const hasExclude = exclude.length > 0 && exclude.some(ex => contaLower.includes(ex) || typeLower.includes(ex));
      
      if (hasKeyword && !hasExclude) {
        total += Number(item.val || 0);
      }
    });
    return total;
  };

  const chartData = useMemo(() => {
    if (!dbData.length) return [];
    
    return years.map(year => {
      const yearData = dbData.filter(d => d.year === year);
      
      // DRE Estimations
      const receitas = extractMetric(yearData, year, ['receita', 'venda', 'faturamento'], ['deduções', 'imposto'], ['DRE', 'DRE Gerencial', 'DRE Contábil']);
      const ebitda = extractMetric(yearData, year, ['ebitda', 'lajida'], [], ['DRE', 'DRE Gerencial', 'DRE Contábil']);
      const lucroLiquido = extractMetric(yearData, year, ['lucro líquido', 'resultado líquido'], [], ['DRE', 'DRE Gerencial', 'DRE Contábil']);
      
      // BP Estimations
      const ativo = extractMetric(yearData, year, ['ativo', 'total do ativo'], ['circulante', 'não circulante'], ['BP', 'Balanço Patrimonial']);
      const passivo = extractMetric(yearData, year, ['passivo', 'total do passivo'], ['circulante', 'não circulante', 'patrimônio', 'pl'], ['BP', 'Balanço Patrimonial']);
      const pl = extractMetric(yearData, year, ['patrimônio líquido', 'pl'], [], ['BP', 'Balanço Patrimonial']);

      // Se Ativo não foi extraído exatamente, vamos somar tudo do tipo 'ativo' para ter uma ideia, cuidado para não duplicar.
      // O ideal é que o DRE/BP já tenha totais, ou possamos mostrar algo que represente o crescimento.
      const ativoCalc = ativo > 0 ? ativo : extractMetric(yearData, year, ['ativo'], [], ['BP', 'Balanço Patrimonial']);
      const plCalc = pl > 0 ? pl : extractMetric(yearData, year, ['patrimônio líquido', 'pl'], [], ['BP', 'Balanço Patrimonial']);
      const lucroCalc = lucroLiquido !== 0 ? lucroLiquido : extractMetric(yearData, year, ['resultado do exercício'], [], ['DRE', 'DRE Gerencial', 'DRE Contábil']);

      return {
        year: year.toString(),
        Receita: receitas,
        EBITDA: ebitda,
        Lucro: lucroCalc,
        Ativo: ativoCalc,
        PL: plCalc,
        Passivo: passivo,
      };
    });
  }, [dbData, years]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
        <Loader2 className="animate-spin w-8 h-8 text-secondary" />
        <p className="text-[10px] font-medium uppercase tracking-widest">Carregando série histórica de 6 anos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-destructive space-y-4">
        <AlertCircle className="w-8 h-8" />
        <p className="text-[10px] font-medium uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  if (dbData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4 bg-surface-container rounded-md border border-border">
        <BarChart3 className="w-8 h-8 opacity-50" />
        <p className="text-[10px] font-medium uppercase tracking-widest text-center px-4">
          Nenhum dado contábil encontrado para o cliente no período ({selectedYear - 5} - {selectedYear}).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="bg-executive text-white rounded-md p-8 shadow-premium border border-white/5 relative overflow-hidden flex justify-between items-center">
        <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none">
          <TrendingUp size={150} />
        </div>
        <div className="relative z-10">
           <h3 className="text-xl font-medium tracking-tight mb-2">Visão Histórica Consolidada ({selectedYear - 5} - {selectedYear})</h3>
           <p className="text-xs text-white/60 font-medium max-w-2xl">
             Análise de tendências financeiras baseada nas Demonstrações Contábeis importadas.
           </p>
        </div>
        <div className="relative z-10">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF8552] text-white hover:bg-[#FF8552]/90 font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <FileText size={16} /> Gerar Advisory Board Report
          </Button>
        </div>
      </div>

      {isMemoryBlocked && (
        <div className="bg-critical-soft border border-destructive/20 rounded-md p-4 flex items-center gap-3 text-destructive">
          <AlertCircle size={18} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">Aviso de Inferência</p>
            <p className="text-sm">Histórico insuficiente para inferência longitudinal. Gráficos abaixo exibidos apenas como visualização estática e não configuram tendência institucional válida.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Gráfico 1: Evolução de Receita e Lucro */}
        <div className="bg-card p-6 rounded-md border border-border shadow-sm">
          <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 size={14} className="text-secondary" /> Evolução: Receita vs Lucro Líquido
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.2} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }} 
                  tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', fontSize: '12px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Receita" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Receita" />
                <Bar dataKey="Lucro" fill="#10b981" radius={[2, 2, 0, 0]} name="Lucro Líquido" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Evolução Patrimonial */}
        <div className="bg-card p-6 rounded-md border border-border shadow-sm">
          <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" /> Evolução Patrimonial (Ativo Total vs PL)
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.2} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }} 
                  tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', fontSize: '12px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="Ativo" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Ativo Total" />
                <Line type="monotone" dataKey="PL" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} name="Patrimônio Líquido" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela de Dados Consolidados */}
      <div className="bg-card rounded-md border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest flex items-center gap-2">
            Matriz de Dados Consolidados
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-1/4">Rubrica Resumida</th>
                {years.map(year => (
                  <th key={year} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">{year}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-border/50 hover:bg-surface-container/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Receitas (Estimado)</td>
                {chartData.map((d, i) => <td key={i} className="px-6 py-4 text-right text-muted-foreground">{formatCurrency(d.Receita)}</td>)}
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface-container/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">EBITDA (Estimado)</td>
                {chartData.map((d, i) => <td key={i} className="px-6 py-4 text-right text-muted-foreground">{formatCurrency(d.EBITDA)}</td>)}
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface-container/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Lucro Líquido</td>
                {chartData.map((d, i) => <td key={i} className="px-6 py-4 text-right text-muted-foreground">{formatCurrency(d.Lucro)}</td>)}
              </tr>
              <tr className="border-b border-border/50 hover:bg-surface-container/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Ativo Total (Estimado)</td>
                {chartData.map((d, i) => <td key={i} className="px-6 py-4 text-right text-muted-foreground">{formatCurrency(d.Ativo)}</td>)}
              </tr>
              <tr className="hover:bg-surface-container/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Patrimônio Líquido</td>
                {chartData.map((d, i) => <td key={i} className="px-6 py-4 text-right text-muted-foreground">{formatCurrency(d.PL)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <GenerateBoardReportModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientId={clientId}
        companyName={clientName}
        financialData={dbData}
        clientData={clientData}
        selectedYear={selectedYear}
      />
    </div>
  );
}
