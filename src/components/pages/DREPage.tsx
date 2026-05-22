import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database, TrendingUp, TrendingDown, Info, PieChart as PieChartIcon, AlertTriangle, Sparkles } from 'lucide-react';
import { DATA } from '../../data';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn, formatCurrency, formatValue, getThemeColors } from '../../lib/utils';
import { PageHeader, KpiCard } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

type ToastType = { type: 'success' | 'error'; message: string } | null;

export function DREPage({ clients, selectedClient, selectedYear }: any) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [, setThemeTrigger] = useState(0);
  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const colors = getThemeColors();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca dados anuais ──────────────────────────────────────────────────────
  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE, refetch: refetchDRE } =
    useAnnualFinancialData(selectedClient, filterYear, 'DRE');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDRE;
  const dbData = dbDataDRE;
  const docIds = docIdsDRE;


  
  // Agrega dados preservando level, categoria e tipo
  const rows = useMemo(() => {
    if (dbData.length > 0) {
      const aggregated: any = {};
      dbData.forEach((d: any) => {
        const key = d.conta || d.category;
        if (!aggregated[key]) {
          aggregated[key] = { 
            ...d, 
            val: 0,
            level: d.level ?? 1  // preserve level from manual launch
          };
        }
        aggregated[key].val += (d.val || d.valor || d.value || 0);
      });
      return Object.values(aggregated);
    }
    return [];
  }, [dbData]);

  const getRobustRow = (source: any[], possibleNames: string[]) => {
    return source.find(s => {
      const sName = (s.conta || s.category || '').toLowerCase();
      const cleanName = sName.replace(/^[(-/+)\s]+/, '').trim();
      return possibleNames.some(p => {
        const cleanP = p.toLowerCase().replace(/^[(-/+)\s]+/, '').trim();
        return cleanName === cleanP || cleanName.includes(cleanP);
      });
    });
  };

  const getValue = (source: any[], name: string) => {
    const row = getRobustRow(source, [name]);
    return row?.val || row?.valor || 0;
  };

  // 1. RECEITA OPERACIONAL BRUTA
  const receitaBruta = getValue(rows, 'Receita Operacional Bruta') || getValue(rows, 'Receita Bruta') || getValue(rows, 'Faturamento Bruto') || getValue(rows, 'Faturamento') || 0;

  // 2. DEDUÇÕES DA RECEITA BRUTA
  const deducoesRow = getRobustRow(rows, ['Deduções e Impostos', 'Deduções da Receita', 'Impostos sobre Vendas', 'Deduções', 'Devoluções', 'Vendas Canceladas', 'Cancelamentos', 'Abatimentos']);
  const deducoesReceita = Math.abs(deducoesRow?.val || deducoesRow?.valor || 0);

  // 3. RECEITA OPERACIONAL LÍQUIDA
  let recLiquida = getValue(rows, 'Receita Líquida') || getValue(rows, 'Receita Operacional Líquida') || 0;
  if (recLiquida === 0 && receitaBruta > 0) {
    recLiquida = receitaBruta - deducoesReceita;
  }

  // 4. ÍNDICE DAS DEDUÇÕES DA RECEITA
  const indiceDeducoes = receitaBruta > 0 ? (deducoesReceita / receitaBruta) * 100 : 0;

  // 5. CUSTOS VARIÁVEIS E LABEL DINÂMICO
  const cmvRow = getRobustRow(rows, ['Custo das Mercadorias Vendidas', 'Custo dos Produtos Vendidos', 'Custo dos Serviços Prestados', 'Custos (CPV/CSP)', 'Custos Variáveis', 'CMV', 'CPV', 'CSV']);
  const custosVar = Math.abs(cmvRow?.val || cmvRow?.valor || 0);
  
  let cmvLabelRaw = cmvRow ? (cmvRow.conta || cmvRow.category) : 'Custos Variáveis';
  // limpar o label dinâmico retirando prefixos como (-)
  const cmvLabel = cmvLabelRaw.replace(/^[(-/+)\s]+/, '').trim();

  // 6. MARGEM DE CONTRIBUIÇÃO
  const margemContrib = recLiquida - custosVar;

  // 7. ÍNDICE DA MARGEM DE CONTRIBUIÇÃO
  const indiceMargemContrib = recLiquida > 0 ? margemContrib / recLiquida : 0;

  // 8. DESPESAS FIXAS (Consolidação Inteligente V2)
  const despOperacionaisMae = Math.abs(getValue(rows, 'Despesas Operacionais') || getValue(rows, 'Despesas') || getValue(rows, 'Despesas Operacionais Fixas') || 0);
  const despVendas = Math.abs(getValue(rows, 'Despesas de Vendas') || getValue(rows, 'Despesas Comerciais') || 0);
  const despAdmin = Math.abs(getValue(rows, 'Despesas Administrativas') || 0);
  const despFin = Math.abs(getValue(rows, 'Despesas Financeiras') || 0);
  const outrasRecOp = Math.abs(getValue(rows, 'Outras Receitas Operacionais') || 0);
  
  const somaAnaliticas = despVendas + despAdmin + despFin;
  let despesasFixas = 0;

  if (somaAnaliticas > 0) {
    despesasFixas = somaAnaliticas - outrasRecOp;
  } else {
    despesasFixas = despOperacionaisMae - outrasRecOp;
  }

  // 9. PONTO DE EQUILÍBRIO CONTÁBIL
  let pontoEquilibrio = 0;
  if (indiceMargemContrib > 0) {
    pontoEquilibrio = Math.abs(despesasFixas) / indiceMargemContrib;
  }

  // 12. PROTEÇÕES OBRIGATÓRIAS
  if (pontoEquilibrio < 0) {
    pontoEquilibrio = Math.abs(pontoEquilibrio);
  }
  if (!isFinite(pontoEquilibrio)) {
    pontoEquilibrio = 0;
  }

  // 9. GAP PARA EQUILÍBRIO
  const gapEquilibrio = pontoEquilibrio - recLiquida;

  // 10. MARGEM DE SEGURANÇA
  let margemSegurancaValor = 0;
  if (recLiquida > pontoEquilibrio) {
    margemSegurancaValor = recLiquida - pontoEquilibrio;
  } else {
    margemSegurancaValor = -gapEquilibrio;
  }

  // 11. MARGEM DE SEGURANÇA (KPI %)
  const margemSeguranca = recLiquida > 0 ? (margemSegurancaValor / recLiquida) * 100 : 0;

  // 12. ÍNDICE DE COBERTURA OPERACIONAL
  const indiceCoberturaOperacional = pontoEquilibrio > 0 ? (recLiquida / pontoEquilibrio) * 100 : 0;

  // CÁLCULOS ADICIONAIS (EBITDA, etc)
  const lucroBruto = getValue(rows, 'Lucro Bruto');
  let ebitda       = getValue(rows, 'EBITDA') || getValue(rows, 'LAJIDA') || 0;
  const lucroLiq   = getValue(rows, 'Lucro Líquido') || getValue(rows, 'Lucro Líquido do Exercício');
  const depreciacao = Math.abs(getValue(rows, 'Depreciação e Amortização') || getValue(rows, 'Depreciação') || getValue(rows, 'Amortização') || 0);
  const ebitVal = getValue(rows, 'EBIT') || getValue(rows, 'Lucro Operacional') || getValue(rows, 'Resultado Operacional') || 0;

  if (ebitda === 0) {
    if (ebitVal !== 0) {
      ebitda = ebitVal + depreciacao;
    } else {
      ebitda = lucroBruto - despOperacionaisMae + depreciacao;
    }
  }

  // AUDITORIA MATEMÁTICA INTERNA
  const internalAuditErrors: string[] = [];
  if (recLiquida !== 0) {
    const calcLB = recLiquida - custosVar;
    if (lucroBruto !== 0 && Math.abs(calcLB - lucroBruto) > (recLiquida * 0.01)) {
        internalAuditErrors.push(`Divergência matemática detectada: O Lucro Bruto contabilizado difere do cálculo (Receita Líquida - Custos Variáveis).`);
    }
    const calcOp = calcLB - despesasFixas;
    if (ebitVal !== 0 && Math.abs(calcOp - ebitVal) > (recLiquida * 0.01)) {
        internalAuditErrors.push(`Divergência matemática detectada: O Resultado Operacional contabilizado difere da dedução de Despesas Fixas do Lucro Bruto.`);
    }
  }

  // NOVOS INDICADORES MATEMÁTICOS DE ALTA PERFORMANCE
  const indiceDespesasAdministrativas = recLiquida > 0 ? (despAdmin / recLiquida) * 100 : 0;
  const indiceDespesasComerciais = recLiquida > 0 ? (despVendas / recLiquida) * 100 : 0;
  const indiceDespesasFinanceiras = recLiquida > 0 ? (despFin / recLiquida) * 100 : 0;

  const margemOperacional = recLiquida !== 0 ? (ebitVal / recLiquida) * 100 : 0;
  const margemLiquida = recLiquida !== 0 ? (lucroLiq / recLiquida) * 100 : 0;
  
  const capacidadeAbsorcaoEstrutura = despesasFixas > 0 ? margemContrib / despesasFixas : margemContrib > 0 ? Infinity : 0;
  const grauAlavancagemOperacional = ebitVal !== 0 ? margemContrib / ebitVal : 0;
  const indiceConversaoOperacional = lucroBruto !== 0 ? (ebitVal / lucroBruto) * 100 : 0;
  
  const receitaMediaDiaria = recLiquida / 360;
  const breakEvenDays = receitaMediaDiaria > 0 ? pontoEquilibrio / receitaMediaDiaria : 0;
  const burnRateOperacional = despesasFixas / 12;

  const mbVal = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;
  const cmvVal = recLiquida > 0 ? (custosVar / recLiquida) * 100 : 0;
  const ebitdaVal = recLiquida > 0 ? (ebitda / recLiquida) * 100 : 0;

  // SCORE DE SAÚDE FINANCEIRA (Parte Operacional - 85%)
  let healthScoreBase = 0;
  if (recLiquida > 0) {
     const scoreMargemOp = Math.min(Math.max((margemOperacional / 15) * 100, 0), 100) * 0.20; 
     const scoreLiquidez = Math.min(Math.max((ebitdaVal / 15) * 100, 0), 100) * 0.20; 
     const scoreEstrutura = Math.min(Math.max(capacidadeAbsorcaoEstrutura * 100, 0), 100) * 0.15; 
     const scoreCaixa = Math.min(Math.max((indiceConversaoOperacional / 80) * 100, 0), 100) * 0.15; 
     const debtRatio = ebitda > 0 ? despFin / ebitda : despFin > 0 ? 1 : 0;
     const scoreDivida = Math.max((1 - debtRatio) * 100, 0) * 0.15;
     
     healthScoreBase = scoreMargemOp + scoreLiquidez + scoreEstrutura + scoreCaixa + scoreDivida;
  }

  // TEXTOS INTERPRETATIVOS
  const performanceNote = useMemo(() => {
    if (recLiquida === 0 || pontoEquilibrio === 0) return "Aguardando dados para análise operacional completa.";
    
    if (recLiquida < pontoEquilibrio) {
      return `A empresa apresentou Receita Operacional Líquida de ${formatCurrency(recLiquida)}, enquanto o ponto de equilíbrio estimado da operação foi de ${formatCurrency(pontoEquilibrio)}. \n\nIsso indica que a operação permaneceu ${formatCurrency(Math.abs(gapEquilibrio))} abaixo do faturamento mínimo necessário para cobertura integral de seus custos e despesas.\n\nO índice de cobertura operacional foi de ${indiceCoberturaOperacional.toFixed(2)}%, demonstrando que a empresa conseguiu sustentar apenas parte da estrutura operacional necessária para atingir equilíbrio financeiro.`;
    } else {
      return `A empresa apresentou Receita Operacional Líquida superior ao ponto de equilíbrio estimado, gerando margem de segurança operacional de ${formatCurrency(margemSegurancaValor)} no período analisado.`;
    }
  }, [recLiquida, pontoEquilibrio, gapEquilibrio, indiceCoberturaOperacional, margemSegurancaValor]);

  // CORES E ALERTAS DE RISCO
  let riskColor = 'text-emerald-600';
  if (margemSeguranca < 5) riskColor = 'text-rose-600';
  else if (margemSeguranca <= 15) riskColor = 'text-amber-500';

  const marginIndices = [
    { 
      name: 'Margem Bruta',  
      val: mbVal, 
      unit: '%', 
      status: mbVal > 40 ? 'Verde' : mbVal >= 20 ? 'Amarelo' : 'Vermelho',
      trend: mbVal > 40 ? 'Sólida' : mbVal >= 20 ? 'Atenção' : 'Baixa'
    },
    { 
      name: 'Índice de CMV', 
      val: cmvVal,  
      unit: '%', 
      status: cmvVal < 50 ? 'Verde' : cmvVal <= 70 ? 'Amarelo' : 'Vermelho',
      trend: cmvVal < 50 ? 'Eficiente' : cmvVal <= 70 ? 'Atenção' : 'Crítico'
    },
    { 
      name: 'Margem EBITDA', 
      val: ebitdaVal,     
      unit: '%', 
      status: ebitdaVal > 15 ? 'Verde' : ebitdaVal >= 5 ? 'Amarelo' : 'Vermelho',
      trend: ebitdaVal > 15 ? 'Forte' : ebitdaVal >= 5 ? 'Razoável' : 'Crítico'
    },
    { 
      name: 'Margem Operacional', 
      val: margemOperacional,     
      unit: '%', 
      status: margemOperacional > 10 ? 'Verde' : margemOperacional >= 0 ? 'Amarelo' : 'Vermelho',
      trend: margemOperacional > 10 ? 'Saudável' : margemOperacional >= 0 ? 'Atenção' : 'Prejuízo'
    },
    { 
      name: 'Margem Líquida', 
      val: margemLiquida,     
      unit: '%', 
      status: margemLiquida > 10 ? 'Verde' : margemLiquida >= 0 ? 'Amarelo' : 'Vermelho',
      trend: margemLiquida > 10 ? 'Lucrativa' : margemLiquida >= 0 ? 'Atenção' : 'Prejuízo'
    },
    { 
      name: 'Conversão Operacional', 
      val: indiceConversaoOperacional,     
      unit: '%', 
      status: indiceConversaoOperacional > 50 ? 'Verde' : indiceConversaoOperacional >= 20 ? 'Amarelo' : 'Vermelho',
      trend: indiceConversaoOperacional > 50 ? 'Forte' : indiceConversaoOperacional >= 20 ? 'Moderada' : 'Crítica'
    },
    { 
      name: 'Absorção de Estrutura', 
      val: isFinite(capacidadeAbsorcaoEstrutura) ? capacidadeAbsorcaoEstrutura : 0,     
      unit: 'x', 
      status: capacidadeAbsorcaoEstrutura >= 1.5 ? 'Verde' : capacidadeAbsorcaoEstrutura >= 1.0 ? 'Amarelo' : 'Vermelho',
      trend: capacidadeAbsorcaoEstrutura >= 1.5 ? 'Confortável' : capacidadeAbsorcaoEstrutura >= 1.0 ? 'Equilíbrio' : 'Insustentável'
    },
    { 
      name: 'Break-Even Days', 
      val: breakEvenDays, 
      unit: 'd', 
      status: breakEvenDays <= 20 ? 'Verde' : breakEvenDays <= 25 ? 'Amarelo' : 'Vermelho',
      trend: breakEvenDays <= 20 ? 'Eficiente' : breakEvenDays <= 25 ? 'Atenção' : 'Lento'
    },
  ];

  // ── Histórico para Gráfico ────────────────────────────────────────────────
  const chartData = useMemo(() => {
    return [5, 4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => {
        if (Number(d.year) !== y) return false;
        const et = (d.entryType || '').toLowerCase();
        if (['receitas', 'despesas', 'dre', 'resultado'].includes(et)) return true;
        if (!['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(et) && d.type === 'DRE') return true;
        return false;
      });
      
      let rl = 0;
      let ebt = 0;
      let ll = 0;
      let cmv = 0;

      if (yearEntries.length > 0) {
        rl = yearEntries.filter(d => {
          const name = (d.conta || d.category || '').toLowerCase();
          return name === 'receita líquida' || name === 'receita operacional líquida';
        }).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
        
        ebt = yearEntries.filter(d => {
          const name = (d.conta || d.category || '').toLowerCase();
          return name === 'ebitda' || name.includes('ebitda') || name === 'lajida';
        }).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);

        if (ebt === 0) {
          const ebitHist = yearEntries.filter(d => {
            const name = (d.conta || d.category || '').toLowerCase();
            return name === 'ebit' || name.includes('lucro operacional') || name.includes('resultado operacional');
          }).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
          
          const depHist = yearEntries.filter(d => {
            const name = (d.conta || d.category || '').toLowerCase();
            return name.includes('deprecia') || name.includes('amortiza');
          }).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);

          if (ebitHist !== 0) {
            ebt = ebitHist + Math.abs(depHist);
          } else {
             const lbHist = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('lucro bruto')).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
             const despHist = yearEntries.filter(d => {
               const name = (d.conta || d.category || '').toLowerCase();
               return name.includes('despesas operacionais') || name === 'despesas';
             }).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
             ebt = lbHist - Math.abs(despHist) + Math.abs(depHist);
          }
        }
        
        ll = yearEntries.filter(d => {
          const name = (d.conta || d.category || '').toLowerCase();
          return name === 'lucro líquido' || name === 'lucro líquido do exercício';
        }).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);

        cmv = yearEntries.filter(d => {
          const name = (d.conta || d.category || '').toLowerCase();
          return name.includes('custos variáveis') || name === 'cmv' || name === 'cpv' || name === 'csv' || name.includes('custo das mercadorias') || name.includes('custo dos serviços');
        }).reduce((acc, d) => acc + Math.abs(d.val || d.valor || d.value || 0), 0);

      } else {
        const mockYear = DATA.dre.filter((r: any) => r.id === selectedClient && r.ano === y);
        rl = mockYear.find(m => m.conta === 'Receita Líquida')?.valor || 0;
        ebt = mockYear.find(m => m.conta === 'EBITDA')?.valor || 0;
        ll = mockYear.find(m => m.conta === 'Lucro Líquido')?.valor || 0;
        cmv = Math.abs(mockYear.find(m => m.conta === 'Custos Variáveis')?.valor || mockYear.find(m => m.conta === 'CMV')?.valor || 0);
      }

      return {
        year: y.toString(),
        receita: rl,
        cmv: cmv,
        ebitda: ebt,
        lucro: ll
      };
    }).filter(d => d.receita > 0 || d.ebitda > 0 || d.lucro > 0 || d.cmv > 0 || d.year === filterYear.toString());
  }, [allHistoryData, selectedClient, filterYear]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async () => {
    if (!auth.currentUser) {
      showToast('error', 'Você precisa estar logado para excluir dados.');
      return;
    }
    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', selectedClient),
        where('type',     '==', 'DRE'),
        where('year',     '==', filterYear)
      );
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'financial_entries', d.id))));
      showToast('success', `${snap.docs.length} registro(s) excluído(s) com sucesso.`);
      refetchDRE();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };


  const tableRows = [
    { name: 'Receita Operacional Bruta', level: 1 },
    { name: '(-) Deduções e Impostos', level: 2 },
    { name: 'Receita Líquida', level: 1 },
    { name: '(-) Custos (CPV/CSP)', level: 2 },
    { name: 'Lucro Bruto', level: 1 },
    { name: '(-) Despesas Operacionais', level: 2 },
    { name: 'EBITDA', level: 1 },
    { name: '(-) Depreciação e Amortização', level: 2 },
    { name: 'EBIT', level: 1 },
    { name: '(+/-) Resultado Financeiro', level: 2 },
    { name: 'LAIR (Lucro Antes do IR)', level: 1 },
    { name: '(-) Provisão IR/CSLL', level: 2 },
    { name: 'Lucro Líquido', level: 1 },
  ];

  // Histórico para AH no ano anterior
  const prevYearRows = useMemo(() => {
    const prevEntries = allHistoryData.filter((d: any) => {
      if (Number(d.year) !== (filterYear - 1)) return false;
      const et = (d.entryType || '').toLowerCase();
      if (['receitas', 'despesas', 'dre', 'resultado'].includes(et)) return true;
      if (!['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(et) && d.type === 'DRE') return true;
      return false;
    });
    if (prevEntries.length > 0) {
      const agg: any = {};
      prevEntries.forEach((d: any) => {
        const key = d.conta || d.category;
        if (!agg[key]) agg[key] = { ...d, val: 0 };
        agg[key].val += (d.val || d.valor || d.value || 0);
      });
      return Object.values(agg);
    }
    return [];
  }, [allHistoryData, filterYear]);

  const getPrevValue = (name: string) => {
    const search = name.toLowerCase();
    return (prevYearRows as any[]).find(s => (s.conta || s.category || '').toLowerCase() === search)?.val || 0;
  };

  // Histórico para AH de 5 anos atrás
  const prev5YearRows = useMemo(() => {
    const prevEntries = allHistoryData.filter((d: any) => {
      if (Number(d.year) !== (filterYear - 5)) return false;
      const et = (d.entryType || '').toLowerCase();
      if (['receitas', 'despesas', 'dre', 'resultado'].includes(et)) return true;
      if (!['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(et) && d.type === 'DRE') return true;
      return false;
    });
    if (prevEntries.length > 0) {
      const agg: any = {};
      prevEntries.forEach((d: any) => {
        const key = d.conta || d.category;
        if (!agg[key]) agg[key] = { ...d, val: 0 };
        agg[key].val += (d.val || d.valor || d.value || 0);
      });
      return Object.values(agg);
    }
    return [];
  }, [allHistoryData, filterYear]);

  const getPrev5Value = (name: string) => {
    const search = name.toLowerCase();
    return (prev5YearRows as any[]).find(s => (s.conta || s.category || '').toLowerCase() === search)?.val || 0;
  };

  const trendNote = useMemo(() => {
    if (chartData.length < 2) return null;
    const current = chartData[chartData.length - 1];
    const oldest = chartData.find(d => d.receita > 0) || chartData[0];
    
    if (!oldest || oldest.year === current.year) return null;

    const calcGrowth = (curr: number, old: number) => old !== 0 ? ((curr / old) - 1) * 100 : 0;
    
    const recGrowth = calcGrowth(current.receita, oldest.receita);
    const cmvGrowth = calcGrowth(current.cmv, oldest.cmv);
    const ebtGrowth = calcGrowth(current.ebitda, oldest.ebitda);
    const lucGrowth = calcGrowth(current.lucro, oldest.lucro);

    return {
      period: `${oldest.year} a ${current.year}`,
      receita: recGrowth,
      cmv: cmvGrowth,
      ebitda: ebtGrowth,
      lucro: lucGrowth
    };
  }, [chartData]);

  const finalHealthScore = useMemo(() => {
      if (recLiquida <= 0) return 0;
      let score = healthScoreBase;
      
      // Rebalanceamento: Se Margem Bruta é boa (> 30%) mas a escala é baixa, suavizar penalização.
      const margemBrutaVal = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;
      if (margemBrutaVal > 30 && capacidadeAbsorcaoEstrutura < 1) {
          score += 10; // Compensação por escala vs margem primária
      }

      if (trendNote && trendNote.receita) {
          const scoreGrowth = Math.min(Math.max((trendNote.receita / 20) * 100, 0), 100) * 0.15;
          score += scoreGrowth;
      } else {
          score = (score / 85) * 100;
      }
      return Math.min(Math.max(score, 0), 100);
  }, [healthScoreBase, trendNote, recLiquida, lucroBruto, capacidadeAbsorcaoEstrutura]);

  const smartInsights = useMemo(() => {
      const insights = [];
      if (recLiquida === 0) return insights;
      
      const margemBrutaVal = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;

      if (indiceDespesasAdministrativas > 20) {
          insights.push("A estrutura administrativa está consumindo uma parcela muito elevada da receita, pressionando a margem final.");
      }
      if (margemOperacional > 0 && margemLiquida < 0 && indiceDespesasFinanceiras > 5) {
          insights.push("A operação é lucrativa no core business, mas o custo financeiro elevado está consumindo o resultado e gerando prejuízo líquido.");
      }
      if (capacidadeAbsorcaoEstrutura < 1) {
          if (margemBrutaVal > 30) {
              insights.push("A margem bruta da operação é saudável, porém a atual escala operacional é insuficiente para absorção da estrutura fixa existente.");
          } else {
              insights.push("A margem de contribuição gerada não é suficiente para a absorção da estrutura fixa existente (operação pressionada).");
          }
      } else if (capacidadeAbsorcaoEstrutura < 1.3) {
          insights.push("A operação apresenta baixa absorção estrutural, dependendo de aumento de escala ou redução de custos fixos para sustentar-se com folga.");
      }
      if (margemOperacional > 15 && indiceConversaoOperacional > 60) {
          insights.push("Operação apresenta alta performance executiva, combinando rentabilidade com forte conversão de lucros em caixa operacional.");
      } else if (indiceConversaoOperacional < 0) {
          insights.push("A operação atual está consumindo caixa e destruindo margem operacional, exigindo revisão profunda da estrutura de custos.");
      }
      return insights;
  }, [indiceDespesasAdministrativas, margemOperacional, margemLiquida, indiceDespesasFinanceiras, capacidadeAbsorcaoEstrutura, indiceConversaoOperacional, recLiquida, lucroBruto]);

  const systemAlerts = useMemo(() => {
      const alerts = [];
      
      // Auditoria Lógica
      internalAuditErrors.forEach(err => {
         alerts.push({ type: 'danger', msg: err });
      });

      if (recLiquida === 0) return alerts;
      if (recLiquida < pontoEquilibrio) alerts.push({ type: 'warning', msg: 'Escala Insuficiente: Faturamento abaixo do ponto de equilíbrio contábil.' });
      if (margemOperacional < 0) alerts.push({ type: 'danger', msg: 'Operação Sensível: Margem Operacional destruindo valor.' });
      if (capacidadeAbsorcaoEstrutura < 1) alerts.push({ type: 'warning', msg: 'Estrutura Pressionada: Incapacidade de absorver despesas fixas atuais.' });
      if (indiceDespesasFinanceiras > 10) alerts.push({ type: 'warning', msg: 'Pressão Administrativa Elevada e dependência de capital externo.' });
      return alerts;
  }, [recLiquida, pontoEquilibrio, margemOperacional, capacidadeAbsorcaoEstrutura, indiceDespesasFinanceiras, internalAuditErrors]);


  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Demonstração do Resultado (DRE)" 
        subtitle="Análise de performance operacional, lucratividade e rentabilidade do exercício contábil."
        icon={BarChart3}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={dbData.length > 0 ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', dbData.length > 0 ? 'text-success' : 'text-muted-foreground')}>
              {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center">
            <Calendar size={12} className="ml-2 text-muted-foreground" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground"
            >
              {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-3 bg-surface-container hover:bg-success hover:text-white text-success border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Lançar Dados
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-3 bg-surface-container hover:bg-secondary hover:text-white text-secondary border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Upload size={14} /> Importar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-surface-container hover:bg-destructive hover:text-white text-destructive border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>



      {/* ALERTAS INTELIGENTES */}
      {systemAlerts.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          {systemAlerts.map((alert, idx) => (
            <div key={idx} className={cn("px-4 py-4 rounded-2xl border flex items-center gap-3 text-sm font-bold shadow-sm", 
              alert.type === 'danger' ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-amber-50 border-amber-200 text-amber-700")}>
              <AlertTriangle size={20} className={alert.type === 'danger' ? 'text-rose-500' : 'text-amber-500'} />
              {alert.msg}
            </div>
          ))}
        </div>
      )}

      {/* SCORE DE SAÚDE & INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h3 className="text-lg font-black mb-1">Health Score</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-6">Saúde Financeira Operacional</p>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray="440" 
                strokeDashoffset={440 - (440 * finalHealthScore) / 100}
                className={finalHealthScore >= 80 ? "text-emerald-500" : finalHealthScore >= 50 ? "text-amber-500" : "text-rose-500"} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">{finalHealthScore.toFixed(0)}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          <p className="text-xs text-center mt-6 text-slate-400 font-medium">
            {finalHealthScore >= 80 ? 'Alta Performance' : finalHealthScore >= 50 ? 'Operação Estável' : 'Atenção Crítica'}
          </p>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">AI Advisory Insights</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Análise Operacional Inteligente</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {smartInsights.length > 0 ? smartInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-start">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{insight}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-400 italic text-center">Aguardando dados suficientes para gerar insights operacionais...</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {marginIndices.map((idx, i) => (
          <KpiCard 
            key={i}
            title={idx.name}
            value={idx.unit === 'currency' ? formatValue(idx.val, 'currency') : isFinite(idx.val) ? idx.val.toFixed(1) : '0.0'}
            suffix={idx.unit}
            status={idx.status as any}
            trend={idx.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 mb-10">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h3 className="text-lg font-black text-slate-900">Evolução de Performance</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Receita, EBITDA e Lucro</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold uppercase" style={{ color: colors.mutedForeground }}>Receita Líquida</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-[9px] font-bold uppercase" style={{ color: colors.mutedForeground }}>{cmvLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold uppercase" style={{ color: colors.mutedForeground }}>EBITDA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-[9px] font-bold uppercase" style={{ color: colors.mutedForeground }}>Resultado Líquido</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: colors.mutedForeground }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/50">{payload[0].payload.year}</p>
                          <div className="space-y-1.5">
                            {payload.map((p: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between gap-8">
                                <span className="text-[10px] font-bold text-white/70 uppercase">{p.name}</span>
                                <span className="text-xs font-black">{formatCurrency(p.value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="receita" name="Receita Líquida" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cmv" name={cmvLabel} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lucro" name="Resultado Líquido" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h3 className="text-lg font-black mb-1">Destaques</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">Insights de Resultado</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2 relative z-10 h-fit">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Composição da Receita</p>
              
              <div className="flex justify-between items-center text-xs text-white/70 mb-2">
                <span>Receita Operacional Bruta:</span>
                <span className="font-bold">{formatCurrency(receitaBruta)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/70 mb-3">
                <span>(-) Deduções da Receita:</span>
                <span className="font-bold text-rose-300">{formatCurrency(deducoesReceita)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-white font-bold border-t border-white/10 pt-3 mt-2">
                <span>(=) Receita Operacional Líquida:</span>
                <span className="text-emerald-400">{formatCurrency(recLiquida)}</span>
              </div>
              
              <p className="text-xs text-white/50 font-medium mt-6 italic leading-relaxed">
                A empresa apresentou Receita Operacional Bruta de {formatCurrency(receitaBruta)}, com deduções operacionais e tributárias de {formatCurrency(deducoesReceita)}, equivalentes a {indiceDeducoes.toFixed(2)}% da receita bruta, resultando em Receita Operacional Líquida de {formatCurrency(recLiquida)}.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative z-10 h-fit flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Ponto de Equilíbrio & Cobertura</p>
                
                <div className="flex justify-between items-center text-xs text-white/70 mb-2">
                  <span>Receita Operacional Líquida:</span>
                  <span className="font-bold">{formatCurrency(recLiquida)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/70 mb-3">
                  <span>(-) {cmvLabel}:</span>
                  <span className="font-bold text-rose-300">{formatCurrency(custosVar)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-white font-bold border-t border-white/10 pt-3 mt-2">
                  <span>(=) Margem de Contribuição ({ (indiceMargemContrib * 100).toFixed(2) }%):</span>
                  <span className="text-emerald-400">{formatCurrency(margemContrib)}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>Despesas Fixas:</span>
                    <span className="font-bold text-rose-300">{formatCurrency(despesasFixas)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white font-bold bg-white/5 p-3 rounded-xl mt-2 border border-white/5">
                    <span>Ponto de Equilíbrio (Absoluto):</span>
                    <span className="text-blue-400">{dbData.length > 0 ? formatCurrency(pontoEquilibrio) : '---'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>Gap para Equilíbrio:</span>
                    <span className="font-bold text-rose-300">{dbData.length > 0 ? formatCurrency(gapEquilibrio) : '---'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>Margem de Segurança:</span>
                    <span className="font-bold text-emerald-400">{dbData.length > 0 ? formatCurrency(margemSegurancaValor) : '---'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>Índice de Cobertura Operacional:</span>
                    <span className={cn("font-bold text-sm", indiceCoberturaOperacional >= 100 ? "text-emerald-400" : indiceCoberturaOperacional >= 85 ? "text-blue-400" : indiceCoberturaOperacional >= 60 ? "text-amber-400" : "text-rose-400")}>
                      {dbData.length > 0 ? `${indiceCoberturaOperacional.toFixed(2)}%` : '---'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/60 font-medium mt-6 italic leading-relaxed whitespace-pre-line border-t border-white/10 pt-4">{dbData.length > 0 ? performanceNote : 'Aguardando dados estruturados para análise operacional.'}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Database size={18} className="text-white" />
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inteligência de Dados</p>
               <p className="text-[10px] font-medium text-white/70 italic">Análise baseada em ciclos históricos</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-10">
        <div className="px-5 md:px-8 py-3 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detalhamento da DRE</h4>
          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600">
            Análise Horizontal e Vertical
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conta</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor (R$)</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AV (%)</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AH (1 Ano)</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AH (5 Anos)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.length > 0
                // ── Dados reais do banco: renderiza exatamente as linhas lançadas ──
                ? (rows as any[]).map((row: any, i: number) => {
                    const name = row.conta || row.category || '';
                    const val = row.val || 0;
                    const level = row.level ?? 1;
                    
                    let baseForAV = recLiquida;
                    const nameLower = name.toLowerCase();
                    if (nameLower.includes('receita operacional bruta') || nameLower.includes('receita bruta') || nameLower.includes('faturamento') || nameLower.includes('deduções') || nameLower.includes('impostos sobre vendas') || nameLower.includes('abatimentos')) {
                      baseForAV = receitaBruta;
                    }
                    const av = baseForAV > 0 ? (val / baseForAV) * 100 : 0;
                    const prevVal = getPrevValue(name);
                    const ah = prevVal > 0 ? ((val / prevVal) - 1) * 100 : null;
                    const prev5Val = getPrev5Value(name);
                    const ah5 = prev5Val > 0 ? ((val / prev5Val) - 1) * 100 : null;
                    const isTotal = level === 1;

                    return (
                      <tr key={i} className={cn('hover:bg-slate-50 transition-colors group', isTotal ? 'bg-slate-50/30 font-bold' : '')}>
                        <td className="py-2.5 md:py-4 px-5 md:px-8">
                          <span
                            className={cn('block break-words overflow-visible', isTotal ? 'text-primary font-bold' : 'text-slate-600 font-medium')}
                            style={{ paddingLeft: level > 1 ? `${(level - 1) * 20}px` : '0px' }}
                          >
                            {level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-slate-300 mr-2 mb-0.5" />
                            )}
                            {name}
                          </span>
                        </td>
                        <td className={cn("py-2.5 md:py-4 px-5 md:px-8 text-right font-mono", val < 0 ? "text-rose-500" : "text-slate-700")}>
                          {formatCurrency(val)}
                        </td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right font-bold text-slate-500 text-xs">
                          {av.toFixed(2)}%
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah === null ? "text-slate-300" : ah > 0 ? "text-emerald-500" : ah < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah5 === null ? "text-slate-300" : ah5 > 0 ? "text-emerald-500" : ah5 < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah5 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah5 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah5).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                // ── Sem dados: mostra template estático como guia ──
                : tableRows.map((row, i) => {
                    const isTotal = row.level === 1;
                    return (
                      <tr key={i} className={cn('transition-colors group', isTotal ? 'bg-slate-50/30 font-bold' : '')}>
                        <td className="py-2.5 md:py-4 px-5 md:px-8">
                          <span
                            className={cn('block break-words overflow-visible', isTotal ? 'text-slate-300 font-bold' : 'text-slate-200 font-medium')}
                            style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 20}px` : '0px' }}
                          >
                            {row.level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-slate-200 mr-2 mb-0.5" />
                            )}
                            {row.name}
                          </span>
                        </td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right font-mono text-slate-200">R$ 0,00</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">0,00%</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">—</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">—</td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      {trendNote && (
        <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">Nota Explicativa de Evolução</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tendência Histórica Acumulada ({trendNote.period})</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Crescimento de Receita</p>
              <div className="flex items-center gap-2">
                {trendNote.receita > 0 ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
                <p className={cn("text-2xl font-black", trendNote.receita > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.receita > 0 ? '+' : ''}{trendNote.receita.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Evolução de {cmvLabel}</p>
              <div className="flex items-center gap-2">
                {trendNote.cmv > 0 ? <TrendingUp size={16} className="text-rose-500" /> : <TrendingDown size={16} className="text-emerald-500" />}
                <p className={cn("text-2xl font-black", trendNote.cmv > 0 ? "text-rose-500" : "text-emerald-500")}>
                  {trendNote.cmv > 0 ? '+' : ''}{trendNote.cmv.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Evolução de EBITDA</p>
              <div className="flex items-center gap-2">
                {trendNote.ebitda > 0 ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
                <p className={cn("text-2xl font-black", trendNote.ebitda > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.ebitda > 0 ? '+' : ''}{trendNote.ebitda.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Evolução do Lucro</p>
              <div className="flex items-center gap-2">
                {trendNote.lucro > 0 ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
                <p className={cn("text-2xl font-black", trendNote.lucro > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.lucro > 0 ? '+' : ''}{trendNote.lucro.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-6 leading-relaxed">
            A análise histórica demonstra um {trendNote.receita > 0 ? 'crescimento' : 'decréscimo'} de <strong>{Math.abs(trendNote.receita).toFixed(2)}%</strong> nas receitas líquidas no período de {trendNote.period}.
            Este movimento foi acompanhado por uma variação de <strong>{trendNote.cmv > 0 ? '+' : ''}{trendNote.cmv.toFixed(2)}%</strong> em <strong>{cmvLabel}</strong>.
            No que tange à geração de caixa operacional, o EBITDA obteve uma variação de <strong>{trendNote.ebitda > 0 ? '+' : ''}{trendNote.ebitda.toFixed(2)}%</strong>, resultando
            finalmente num impacto na linha de Lucro Líquido de <strong>{trendNote.lucro > 0 ? '+' : ''}{trendNote.lucro.toFixed(2)}%</strong> no acumulado de cinco anos.
          </p>
        </div>
      )}

      <ExecutiveCommentary
        reportType="DRE"
        clientId={selectedClient}
        year={filterYear}
        month={1}
      />

      {showImportModal && (
        <ImportFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchDRE();
            showToast('success', 'Dados importados com sucesso!');
          }}
        />
      )}

      {showManualModal && (
        <ManualFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchDRE();
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Excluir Dados?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Esta ação removerá todos os registros da DRE para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
