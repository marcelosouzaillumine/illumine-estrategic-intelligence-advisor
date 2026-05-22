import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database, TrendingUp, TrendingDown, Info, PieChart as PieChartIcon, AlertTriangle, Sparkles, Bug, Target, Shield, Activity, Layers, Scale, Zap, Building2, Coins, Receipt } from 'lucide-react';
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
import { calculateDreCascade } from '../../lib/dreCascade';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
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

  const currentClient = clients?.find((c: any) => c.id === selectedClient);
  const segmentoEmpresa = (currentClient?.segmentoAtuacao || currentClient?.segmento || 'Serviços').toLowerCase();
  
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


  
  // Agrega dados baseados na estrutura oficial da DRE
  const rows = useMemo(() => {
    if (dbData.length === 0) return [];
    
    // Map db data to standard shape, auto-assigning parentId for legacy entries
    const mappedEntries = dbData.map((d: any) => {
      let parentId = d.parentId;
      const cat = (d.conta || d.category || '').toLowerCase();
      
      // Ignore totals from legacy data
      if (!parentId && (cat.includes('receita líquida') || cat.includes('receita operacional líquida') || cat.includes('lucro bruto') || cat.includes('ebitda') || cat === 'ebit' || cat.includes('resultado operacional líquido') || cat.includes('lajida') || cat.includes('lucro líquido') || cat.includes('lair') || cat.includes('resultado antes'))) {
         return null; 
      }
      
      if (!parentId) {
         if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') || (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
            parentId = 'ROB';
         } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
            parentId = 'DED';
         } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
            parentId = 'CUSTOS';
         } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
            parentId = 'DEP_AMORT';
         } else if (cat.includes('financeir') || cat.includes('juros')) {
            parentId = 'RESULT_FIN';
         } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
            parentId = 'PROV_IR_CSLL';
         } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais')) {
            parentId = 'OUTRAS_REC_DESP';
         } else {
            parentId = 'DESP_OPER'; // Default for generic expenses
         }
      }
      
      return {
         ...d,
         parentId,
         value: d.val || d.valor || d.value || 0
      };
    }).filter(Boolean);

    // Combine structural accounts and mapped analytic accounts
    const allRows = [
       ...DRE_OFFICIAL_STRUCTURE.map(account => ({
          ...account,
          value: 0
       })),
       ...mappedEntries
    ];

    return calculateDreCascade(allRows);
  }, [dbData]);

  const getValue = (source: any[], idMatch: string) => {
    const exactMatch = source.find((s: any) => s.id === idMatch);
    if (exactMatch) {
      return exactMatch.computedValue !== undefined ? exactMatch.computedValue : (exactMatch.val || exactMatch.value || exactMatch.valor || 0);
    }
    return 0;
  };

  // 1. RECEITA OPERACIONAL BRUTA
  const receitaBruta = getValue(rows, 'ROB');

  // 2. DEDUÇÕES DA RECEITA BRUTA
  const deducoesReceita = getValue(rows, 'DED');

  // 3. RECEITA OPERACIONAL LÍQUIDA
  const recLiquida = getValue(rows, 'ROL');

  // 4. ÍNDICE DAS DEDUÇÕES DA RECEITA
  const indiceDeducoes = receitaBruta > 0 ? (Math.abs(deducoesReceita) / receitaBruta) * 100 : 0;

  // 5. CUSTOS VARIÁVEIS E LABEL DINÂMICO
  const custosVar = getValue(rows, 'CUSTOS');
  const cmvRow = rows.find((r: any) => r.parentId === 'CUSTOS' && r.tipo !== 'SINTETICA') || rows.find((r: any) => r.id === 'CUSTOS');
  let cmvLabelRaw = cmvRow ? (cmvRow.conta || cmvRow.category || cmvRow.nome || 'Custos Variáveis') : 'Custos Variáveis';
  const cmvLabel = cmvLabelRaw.replace(/^[(-/+)\s]+/, '').trim();

  // 6. MARGEM DE CONTRIBUIÇÃO (Lucro Bruto na nova estrutura = ROL - Custos)
  const lucroBruto = getValue(rows, 'LUCRO_BRUTO');
  const margemContrib = lucroBruto;

  // 7. ÍNDICE DA MARGEM DE CONTRIBUIÇÃO
  const indiceMargemContrib = recLiquida > 0 ? margemContrib / recLiquida : 0;

  // 8. DESPESAS FIXAS / OPERACIONAIS
  const despesasFixas = getValue(rows, 'DESP_OPER');
  const outrasRecOp = getValue(rows, 'OUTRAS_REC_DESP');
  const despVendas = rows.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);
  const despAdmin = rows.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);
  const despFin = getValue(rows, 'RESULT_FIN');

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
  const ebitda = getValue(rows, 'EBITDA');
  const lucroLiq = getValue(rows, 'LUCRO_LIQ');
  const depreciacao = getValue(rows, 'DEP_AMORT');
  const ebitVal = getValue(rows, 'EBIT');
  const provisaoIR = getValue(rows, 'PROV_IR_CSLL');

  // AUDITORIA MATEMÁTICA INTERNA (agora inativa, pois a cascade garante a consistência, mas mantida por segurança)
  const internalAuditErrors: string[] = [];
  if (recLiquida !== 0) {
    const calcLB = recLiquida - Math.abs(custosVar);
    if (lucroBruto !== 0 && Math.abs(calcLB - lucroBruto) > (Math.abs(recLiquida) * 0.01)) {
        internalAuditErrors.push(`Divergência matemática detectada: O Lucro Bruto contabilizado difere do cálculo padrão.`);
    }
    const calcOp = calcLB - Math.abs(despesasFixas) - Math.abs(depreciacao);
    if (ebitVal !== 0 && Math.abs(calcOp - ebitVal) > (Math.abs(recLiquida) * 0.01)) {
        internalAuditErrors.push(`Divergência matemática detectada: O Resultado Operacional contabilizado difere do cálculo padrão.`);
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

  let cmvMin = 0;
  let cmvMax = 60; 
  let cmvCritical = 75; 

  if (segmentoEmpresa.includes('saas') || segmentoEmpresa.includes('tecnologia') || segmentoEmpresa.includes('consultoria')) {
     cmvMin = 10; cmvMax = 35; cmvCritical = 50;
  } else if (segmentoEmpresa.includes('indústria') || segmentoEmpresa.includes('industria') || segmentoEmpresa.includes('manufatura')) {
     cmvMin = 40; cmvMax = 70; cmvCritical = 80;
  } else if (segmentoEmpresa.includes('hospital') || segmentoEmpresa.includes('saúde') || segmentoEmpresa.includes('saude')) {
     cmvMin = 45; cmvMax = 65; cmvCritical = 75;
  } else if (segmentoEmpresa.includes('comércio') || segmentoEmpresa.includes('comercio') || segmentoEmpresa.includes('varejo')) {
     cmvMin = 50; cmvMax = 80; cmvCritical = 85;
  } else if (segmentoEmpresa.includes('distribui')) {
     cmvMin = 55; cmvMax = 85; cmvCritical = 90;
  }



  // OPERATIONAL EFFICIENCY INTELLIGENCE
  const burdenTributario = receitaBruta > 0 ? (deducoesReceita + Math.abs(provisaoIR)) / receitaBruta : 0;
  
  const eficienciaComercial = cmvVal <= cmvMax ? 100 : Math.max(100 - (((cmvVal - cmvMax) / (cmvCritical - cmvMax)) * 100), 0);
  const eficienciaOperacional = ebitdaVal >= 15 ? 100 : ebitdaVal < 0 ? 0 : (ebitdaVal / 15) * 100;
  const eficienciaAdministrativa = indiceDespesasAdministrativas <= 10 ? 100 : Math.max(100 - (((indiceDespesasAdministrativas - 10) / 15) * 100), 0);
  const eficienciaFinanceira = indiceDespesasFinanceiras <= 3 ? 100 : Math.max(100 - (((indiceDespesasFinanceiras - 3) / 7) * 100), 0);
  const eficienciaTributaria = burdenTributario <= 0.15 ? 100 : Math.max(100 - (((burdenTributario - 0.15) / 0.15) * 100), 0);
  const eficienciaEstrutural = capacidadeAbsorcaoEstrutura >= 1.5 ? 100 : (capacidadeAbsorcaoEstrutura < 1 ? 0 : ((capacidadeAbsorcaoEstrutura - 1) / 0.5) * 100);


  // SCORE DE SAÚDE FINANCEIRA (Parte Operacional)
  let healthScoreBase = 0;
  if (recLiquida > 0) {
     const scoreMargemBruta = Math.min(Math.max((mbVal / 40) * 100, 0), 100) * 0.15;
     
     let scoreCMV = 0;
     if (cmvVal <= cmvMax) scoreCMV = 100;
     else if (cmvVal >= cmvCritical) scoreCMV = 0;
     else scoreCMV = 100 - (((cmvVal - cmvMax) / (cmvCritical - cmvMax)) * 100);
     scoreCMV *= 0.10;

     const scoreMargemEbitda = Math.min(Math.max((ebitdaVal / 15) * 100, 0), 100) * 0.15; 
     const scoreMargemOp = Math.min(Math.max(((margemOperacional + 10) / 25) * 100, 0), 100) * 0.15; 
     const scoreCobertura = Math.min(Math.max((indiceCoberturaOperacional / 100) * 100, 0), 100) * 0.15;
     const scoreEstrutura = Math.min(Math.max(capacidadeAbsorcaoEstrutura * 100, 0), 100) * 0.10; 
     const scoreCaixa = Math.min(Math.max((indiceConversaoOperacional / 80) * 100, 0), 100) * 0.10; 
     
     const debtRatio = ebitda > 0 ? despFin / ebitda : despFin > 0 ? 1 : 0;
     const scoreDivida = Math.max((1 - debtRatio) * 100, 0) * 0.10;
     
     healthScoreBase = scoreMargemBruta + scoreCMV + scoreMargemEbitda + scoreMargemOp + scoreCobertura + scoreEstrutura + scoreCaixa + scoreDivida;
  }

  // TEXTOS INTERPRETATIVOS (BOARD ANALYTICS)
  const performanceNote = useMemo(() => {
    if (recLiquida === 0 || pontoEquilibrio === 0) return "Aguardando dados para análise operacional estrutural.";
    
    if (recLiquida < pontoEquilibrio) {
      return `Risco Estrutural Identificado: A operação não absorve o seu ponto de equilíbrio (${formatCurrency(pontoEquilibrio)}). Existe um gap de geração operacional na ordem de ${formatCurrency(Math.abs(gapEquilibrio))}, caracterizando um déficit de capacidade de absorção da estrutura instalada. A operação sustenta apenas ${indiceCoberturaOperacional.toFixed(2)}% do necessário para o break-even.`;
    } else {
      return `A operação demonstra sustentabilidade estrutural, superando o ponto de equilíbrio (${formatCurrency(pontoEquilibrio)}) e gerando uma capacidade de absorção positiva. A geração operacional absorveu a estrutura existente com margem de segurança efetiva de ${formatCurrency(margemSegurancaValor)} no período.`;
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
      status: cmvVal <= cmvMax ? 'Verde' : cmvVal <= cmvCritical ? 'Amarelo' : 'Vermelho',
      trend: cmvVal <= cmvMin ? 'Eficiente' : cmvVal <= cmvMax ? 'Saudável' : cmvVal <= cmvCritical ? 'Pressionado' : 'Crítico'
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
      name: indiceConversaoOperacional < 0 ? 'Consumo Operacional' : 'Conversão Operacional', 
      val: indiceConversaoOperacional,     
      unit: '%', 
      status: indiceConversaoOperacional > 50 ? 'Verde' : indiceConversaoOperacional >= 20 ? 'Amarelo' : 'Vermelho',
      trend: indiceConversaoOperacional >= 0 ? (indiceConversaoOperacional > 50 ? 'Forte' : indiceConversaoOperacional >= 20 ? 'Moderada' : 'Baixa') : (indiceConversaoOperacional > -20 ? 'Pressionado' : indiceConversaoOperacional > -50 ? 'Deteriorado' : 'Destruição Op.')
    },
    { 
      name: 'Absorção de Estrutura', 
      val: isFinite(capacidadeAbsorcaoEstrutura) ? capacidadeAbsorcaoEstrutura : 0,     
      unit: 'x', 
      status: capacidadeAbsorcaoEstrutura >= 1.0 ? 'Verde' : capacidadeAbsorcaoEstrutura >= 0.8 ? 'Amarelo' : 'Vermelho',
      trend: capacidadeAbsorcaoEstrutura > 1.3 ? 'Alta Absorção' : capacidadeAbsorcaoEstrutura >= 1.0 ? 'Sustentada' : capacidadeAbsorcaoEstrutura >= 0.8 ? 'Absorção Parcial' : capacidadeAbsorcaoEstrutura >= 0.5 ? 'Baixa Absorção' : 'Não Absorvida'
    },
    { 
      name: 'Break-Even Days', 
      val: breakEvenDays > 365 ? 'Estrutura anual não absorvida pela operação atual.' : breakEvenDays, 
      unit: breakEvenDays > 365 ? '' : 'd', 
      status: breakEvenDays <= 20 ? 'Verde' : breakEvenDays <= 365 ? 'Amarelo' : 'Vermelho',
      trend: breakEvenDays <= 20 ? 'Eficiente' : breakEvenDays <= 365 ? 'Atenção' : 'Insuficiente',
      tooltip: breakEvenDays > 365 ? `${breakEvenDays.toFixed(1)} dias` : undefined
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
        const mappedYearEntries = yearEntries.map((d: any) => {
          let parentId = d.parentId;
          const cat = (d.conta || d.category || '').toLowerCase();
          if (!parentId) {
             if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') || (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
                parentId = 'ROB';
             } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
                parentId = 'DED';
             } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
                parentId = 'CUSTOS';
             } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
                parentId = 'DEP_AMORT';
             } else if (cat.includes('financeir') || cat.includes('juros')) {
                parentId = 'RESULT_FIN';
             } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
                parentId = 'PROV_IR_CSLL';
             } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais')) {
                parentId = 'OUTRAS_REC_DESP';
             } else {
                parentId = 'DESP_OPER'; // Default for generic expenses
             }
          }
          return { ...d, parentId, value: d.val || d.valor || d.value || 0 };
        });

        const cascadeResult = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map(account => ({ ...account, value: 0 })), ...mappedYearEntries]);
        
        rl = cascadeResult.find((r: any) => r.id === 'ROL')?.computedValue || 0;
        ebt = cascadeResult.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;
        ll = cascadeResult.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;
        cmv = Math.abs(cascadeResult.find((r: any) => r.id === 'CUSTOS')?.computedValue || 0);
      } else {
        rl = 0;
        ebt = 0;
        ll = 0;
        cmv = 0;
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



  // Histórico para AH dos últimos 3 anos
  const pastYearsData = useMemo(() => {
    const dataByYear: Record<number, any[]> = {};
    [1, 2, 3].forEach(offset => {
      const prevEntries = allHistoryData.filter((d: any) => {
        if (Number(d.year) !== (filterYear - offset)) return false;
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
        dataByYear[offset] = Object.values(agg);
      } else {
        dataByYear[offset] = [];
      }
    });
    return dataByYear;
  }, [allHistoryData, filterYear]);

  const getPastValue = (offset: number, name: string) => {
    const searchRows = pastYearsData[offset] || [];
    const normalizedName = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const row = searchRows.find((r: any) => {
      const c = (r.conta || r.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      return c.includes(normalizedName);
    });
    return row?.val || row?.valor || 0;
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

  // SCALE EFFICIENCY INTELLIGENCE
  const ebitdaGrowth = trendNote ? trendNote.ebitda : 0;
  const recGrowth = trendNote ? trendNote.receita : 0;
  let scaleCategory = 'Análise Inicial';
  let scaleColor = 'text-slate-400';
  
  if (recGrowth > 0 && ebitdaGrowth > recGrowth) {
      scaleCategory = 'Crescimento Saudável';
      scaleColor = 'text-emerald-400';
  } else if (recGrowth > 0 && ebitdaGrowth > 0 && ebitdaGrowth <= recGrowth) {
      scaleCategory = 'Absorção de Estrutura';
      scaleColor = 'text-blue-400';
  } else if (recGrowth > 0 && ebitdaGrowth < 0) {
      scaleCategory = 'Crescimento Destrutivo';
      scaleColor = 'text-rose-400';
  } else if (recGrowth <= 0 && ebitdaGrowth < 0) {
      scaleCategory = 'Destruição de Valor';
      scaleColor = 'text-red-500';
  } else if (recGrowth < 0 && ebitdaGrowth > 0) {
      scaleCategory = 'Eficiência sob Retração';
      scaleColor = 'text-amber-400';
  }

  const finalHealthScore = useMemo(() => {
      if (recLiquida <= 0) return 0;
      let score = healthScoreBase;
      
      // Rebalanceamento: Se Margem Bruta é boa (> 30%) mas a escala é baixa, suavizar penalização.
      const margemBrutaVal = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;
      if (margemBrutaVal > 30 && capacidadeAbsorcaoEstrutura < 1) {
          score += 10; // Compensação por escala vs margem primária
      }

      if (trendNote && trendNote.receita > 0) {
          const scoreGrowth = Math.min((trendNote.receita / 20) * 10, 10);
          score += scoreGrowth;
      }
      
      // TRAVA DE PROTEÇÃO ESTRUTURAL (Punitive Cap)
      // Se a operação queima caixa operacional, ou destrói margem, ou não atingiu o break-even, o score nunca pode ser otimista.
      if (ebitda < 0 || margemOperacional < 0 || recLiquida < pontoEquilibrio) {
          score = Math.min(score, 40); // Força para a zona "Estrutura Pressionada" (Amarelo) ou pior
      }
      
      return Math.min(Math.max(score, 0), 100);
  }, [healthScoreBase, trendNote, recLiquida, lucroBruto, capacidadeAbsorcaoEstrutura, ebitda, margemOperacional, pontoEquilibrio]);

  const smartInsights = useMemo(() => {
      const insights = [];
      if (recLiquida === 0) return insights;
      
      const margemBrutaVal = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;
      
      let problemaPrincipal = '';
      let problemaSecundario = '';
      let potencial = '';
      let risco = '';
      let recomendacao = '';

      if (cmvVal > cmvCritical) {
         problemaPrincipal = `Custo do produto/serviço (${cmvLabel}) em patamar crítico (${cmvVal.toFixed(2)}%), esmagando a margem de contribuição.`;
         recomendacao = `Revisar precificação imediatamente ou renegociar contratos de fornecimento base.`;
      } else if (capacidadeAbsorcaoEstrutura < 1) {
         problemaPrincipal = `Baixa absorção da estrutura administrativa. A operação atual não paga os custos fixos.`;
         recomendacao = `Ampliar escala comercial sem crescimento proporcional da estrutura fixa.`;
      } else if (margemOperacional < 0) {
         problemaPrincipal = `Operação em prejuízo operacional, consumindo o caixa gerado.`;
         recomendacao = `Revisar eficiência do núcleo operacional e cortar despesas fixas não-essenciais.`;
      } else if (margemOperacional > 0 && margemLiquida < 0) {
         problemaPrincipal = `A operação core é lucrativa, mas o alto peso de despesas financeiras destrói o resultado líquido.`;
         recomendacao = `Priorizar reestruturação de dívidas e substituição por captação mais barata.`;
      } else {
         problemaPrincipal = `Nenhum gargalo primário crítico identificado.`;
         recomendacao = `Focar em expansão de market-share e proteção de margem.`;
      }

      if (indiceDespesasAdministrativas > 20 && capacidadeAbsorcaoEstrutura >= 1) {
         problemaSecundario = `Pressão administrativa moderada, consumindo parcela considerável da margem.`;
      } else if (breakEvenDays > 365) {
         problemaSecundario = `Escala operacional insuficiente para cobertura dos custos fixos anuais.`;
      } else if (margemBrutaVal < 20) {
         problemaSecundario = `Margem bruta baixa restringe o poder de reinvestimento.`;
      } else {
         problemaSecundario = `Operação rodando com gargalos secundários sob controle.`;
      }

      if (margemBrutaVal > 30) {
         potencial = `A margem bruta permanece forte (${margemBrutaVal.toFixed(2)}%), indicando alta eficiência no núcleo da atividade.`;
      } else if (indiceConversaoOperacional > 50) {
         potencial = `Excelente conversão de resultados em caixa operacional.`;
      } else {
         potencial = `Modelo de negócio com margens apertadas necessitando volume para gerar caixa.`;
      }

      if (capacidadeAbsorcaoEstrutura < 1) {
         risco = `A permanência do atual volume operacional pode pressionar o caixa no curto/médio prazo.`;
      } else if (indiceDespesasFinanceiras > 10) {
         risco = `Exposição elevada ao risco de juros e dependência contínua de alavancagem externa.`;
      } else {
         risco = `Risco estrutural baixo. A operação se sustenta de forma autônoma.`;
      }

      insights.push({ category: 'Problema Principal', text: problemaPrincipal, color: 'text-rose-600', bg: 'bg-rose-100', dot: 'bg-rose-500' });
      insights.push({ category: 'Problema Secundário', text: problemaSecundario, color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500' });
      insights.push({ category: 'Potencial Operacional', text: potencial, color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' });
      insights.push({ category: 'Risco Estrutural', text: risco, color: 'text-rose-400', bg: 'bg-rose-50 border border-rose-100', dot: 'bg-rose-400' });
      insights.push({ category: 'Recomendação Estratégica', text: recomendacao, color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500' });

      return insights;
  }, [indiceDespesasAdministrativas, margemOperacional, margemLiquida, indiceDespesasFinanceiras, capacidadeAbsorcaoEstrutura, indiceConversaoOperacional, recLiquida, lucroBruto, breakEvenDays, cmvVal, cmvCritical, cmvLabel]);

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


  // STANDARDIZED DRE LAYOUT (ESPELHO DO MANUAL)
  const standardDreRows = useMemo(() => {
    const getVal = (id: string) => {
      const match = (rows as any[]).find((r: any) => r.id === id);
      return match ? (match.computedValue !== undefined ? match.computedValue : match.value || match.val || 0) : 0;
    };

    const getChildren = (parentId: string) => {
      return (rows as any[]).filter((r: any) => r.parentId === parentId && r.tipo !== 'SINTETICA' && r.tipo !== 'RESULTADO_CALCULADO').map((r: any) => ({
         name: r.conta || r.category || r.nome,
         val: r.value || r.val || 0,
         level: 2
      }));
    };

    return [
      { name: '(+) Receita Operacional Bruta', val: getVal('ROB'), level: 1 },
      ...getChildren('ROB'),
      
      { name: '(-) Deduções da Receita Bruta', val: -Math.abs(getVal('DED')), level: 1 },
      ...getChildren('DED'),

      { name: '(=) Receita Operacional Líquida', val: getVal('ROL'), level: 1 },
      
      { name: '(-) Custos Mercadorias/Produtos/Serviços', val: -Math.abs(getVal('CUSTOS')), level: 1 },
      ...getChildren('CUSTOS'),

      { name: '(=) Lucro Bruto', val: getVal('LUCRO_BRUTO'), level: 1 },
      
      { name: '(-) Despesas Operacionais', val: -Math.abs(getVal('DESP_OPER')), level: 1 },
      ...getChildren('DESP_OPER'),

      { name: '(=) EBITDA', val: getVal('EBITDA'), level: 1 },
      
      { name: '(-) Depreciação e Amortização', val: -Math.abs(getVal('DEP_AMORT')), level: 1 },
      ...getChildren('DEP_AMORT'),

      { name: '(=) Resultado Operacional Líquido (EBIT)', val: getVal('EBIT'), level: 1 },
      
      { name: '(+/-) Resultado Financeiro', val: getVal('RESULT_FIN'), level: 1 },
      ...getChildren('RESULT_FIN'),

      { name: '(+/-) Outras Receitas / Despesas Operacionais', val: getVal('OUTRAS_REC_DESP'), level: 1 },
      ...getChildren('OUTRAS_REC_DESP'),

      { name: '(=) Resultado Antes de IR e CSLL', val: getVal('RAIR_CSLL'), level: 1 },

      { name: '(-) Provisões (IRPJ/CSLL)', val: -Math.abs(getVal('PROV_IR_CSLL')), level: 1 },
      ...getChildren('PROV_IR_CSLL'),

      { name: '(=) Lucro Líquido do Exercício', val: getVal('LUCRO_LIQ'), level: 1 }
    ];
  }, [rows]);

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

      {/* SCORE DE SAÚDE */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-slate-700/50 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-all duration-500" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
        
        <div className="w-full md:w-auto md:flex-1 flex flex-col items-center md:items-start z-10 text-center md:text-left mb-10 md:mb-0 md:mr-10">
          <h3 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Health Score Operacional</h3>
          <p className="text-sm md:text-base text-emerald-100/80 font-medium leading-relaxed w-full">
            Métrica consolidada da saúde financeira: avalia margens, conversão de caixa, alavancagem e a capacidade de absorção da estrutura.
          </p>
          
          <div className={cn("px-6 py-3 mt-8 rounded-full border shadow-inner backdrop-blur-sm text-xs font-bold uppercase tracking-wider inline-flex", 
            finalHealthScore >= 81 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            finalHealthScore >= 61 ? 'bg-emerald-500/5 text-emerald-300 border-emerald-500/10' : 
            finalHealthScore >= 41 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
            finalHealthScore >= 21 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-red-600/20 text-red-400 border-red-500/30')}>
            {finalHealthScore >= 81 ? 'Alta Performance' : finalHealthScore >= 61 ? 'Operação Saudável' : finalHealthScore >= 41 ? 'Estrutura Pressionada' : finalHealthScore >= 21 ? 'Operação Sensível' : 'Crítico Estrutural'}
          </div>
        </div>

        <div className="relative w-48 h-48 flex items-center justify-center shrink-0 z-10">
          {/* SVG Gradients */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={finalHealthScore >= 80 ? "#10b981" : finalHealthScore >= 50 ? "#f59e0b" : "#ef4444"} />
                <stop offset="100%" stopColor={finalHealthScore >= 80 ? "#34d399" : finalHealthScore >= 50 ? "#fbbf24" : "#f87171"} />
              </linearGradient>
            </defs>
          </svg>
          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800/80" />
            <circle cx="96" cy="96" r="84" stroke="url(#score-gradient)" strokeWidth="12" fill="transparent" 
              strokeDasharray="528" 
              strokeDashoffset={528 - (528 * finalHealthScore) / 100}
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-6xl font-black text-white filter drop-shadow-sm leading-none absolute">{finalHealthScore.toFixed(0)}</span>
             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest absolute bottom-9">/ 100</span>
          </div>
        </div>
      </div>
      
      {/* EFFICIENCY INTELLIGENCE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        {/* OPERATIONAL EFFICIENCY INTELLIGENCE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Layers size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">Operational Efficiency Intelligence</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Eficiência por Camada de Negócio</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             {[
               { name: 'Comercial', value: eficienciaComercial, desc: 'Gestão de Custos Diretos', icon: Target, color: 'emerald' },
               { name: 'Operacional', value: eficienciaOperacional, desc: 'Geração de EBITDA', icon: Activity, color: 'blue' },
               { name: 'Administrativa', value: eficienciaAdministrativa, desc: 'Gestão de Despesas', icon: Building2, color: 'amber' },
               { name: 'Financeira', value: eficienciaFinanceira, desc: 'Eficiência de Capital', icon: Coins, color: 'purple' },
               { name: 'Tributária', value: eficienciaTributaria, desc: 'Eficiência Fiscal', icon: Receipt, color: 'rose' },
               { name: 'Estrutural', value: eficienciaEstrutural, desc: 'Absorção Break-even', icon: Shield, color: 'slate' }
             ].map((eff, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                   <div className="flex items-center justify-between mb-1">
                      <div className={`text-${eff.color}-600`}>
                        <eff.icon size={14} />
                      </div>
                      <span className={`text-xs font-black text-${eff.color}-700`}>{eff.value.toFixed(0)}%</span>
                   </div>
                   <p className="text-xs font-bold text-slate-700">{eff.name}</p>
                   <p className="text-[9px] text-slate-400 uppercase tracking-wider">{eff.desc}</p>
                   <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full bg-${eff.color}-500 transition-all duration-1000`} style={{ width: `${eff.value}%` }} />
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* SCALE EFFICIENCY INTELLIGENCE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Scale size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">Scale Efficiency Intelligence</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Análise Temporal de Escala</p>
            </div>
          </div>
          
          <div className="flex flex-col flex-1 justify-center">
             <div className="text-center mb-8">
                <span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-black uppercase tracking-wider",
                  scaleColor.replace('text-', 'bg-').replace('400', '50/50').replace('500', '50/50'),
                  scaleColor.replace('text-', 'border-').replace('400', '200').replace('500', '200'),
                  scaleColor
                )}>
                   <Zap size={16} />
                   {scaleCategory}
                </span>
             </div>
             
             <div className="flex items-center justify-between gap-4">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Growth (Receita)</p>
                   <p className={cn("text-2xl font-black", recGrowth >= 0 ? "text-emerald-600" : "text-rose-600")}>
                     {recGrowth > 0 ? '+' : ''}{recGrowth.toFixed(2)}%
                   </p>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Profitability (EBITDA)</p>
                   <p className={cn("text-2xl font-black", ebitdaGrowth >= 0 ? "text-emerald-600" : "text-rose-600")}>
                     {ebitdaGrowth > 0 ? '+' : ''}{ebitdaGrowth.toFixed(2)}%
                   </p>
                </div>
             </div>
             
             <p className="text-xs font-medium text-slate-500 mt-6 text-center leading-relaxed">
               {scaleCategory === 'Crescimento Saudável' && "O EBITDA está crescendo a taxas superiores à Receita, demonstrando alavancagem operacional perfeita e captura de ganhos de escala."}
               {scaleCategory === 'Absorção de Estrutura' && "A operação cresce de forma estruturada, com o EBITDA acompanhando o ritmo da receita, porém sem forte alavancagem de escala."}
               {scaleCategory === 'Crescimento Destrutivo' && "A operação está queimando margem. A receita cresce, mas a estrutura de custos devora a rentabilidade e destrói o EBITDA."}
               {scaleCategory === 'Destruição de Valor' && "Cenário crítico. Retração de receita acompanhada por queda livre do EBITDA, indicando estrutura excessivamente pesada e rígida."}
               {scaleCategory === 'Eficiência sob Retração' && "Proteção de Margem. Apesar da queda no faturamento, cortes estruturais permitiram preservação (ou aumento) do EBITDA."}
               {scaleCategory === 'Análise Inicial' && "Aguardando histórico financeiro consolidado para gerar análise temporal de eficiência de escala."}
             </p>
          </div>
        </div>
      </div>

      {/* AI ADVISORY INSIGHTS */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-200/40 flex flex-col mb-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles size={22} className="relative z-10" />
          </div>
          <div>
            <h4 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">AI Advisory Insights</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400/80 mt-1">Análise Operacional Inteligente</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {smartInsights.length > 0 ? smartInsights.map((insight, idx) => (
            <div key={idx} className={cn("flex flex-col p-6 rounded-[24px] border items-start gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300", 
              insight.category === 'Problema Principal' || insight.category === 'Recomendação Estratégica' ? "lg:col-span-3 bg-white/80 border-slate-200/80 backdrop-blur-sm shadow-sm" : "lg:col-span-1 bg-white/60 border-slate-100 backdrop-blur-sm")}>
              <div className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm", insight.color, insight.bg)}>
                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", insight.dot)} />
                {insight.category}
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{insight.text}</p>
            </div>
          )) : (
            <p className="text-sm text-slate-400 italic text-center col-span-full py-10">Aguardando dados suficientes para gerar insights operacionais...</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {marginIndices.map((idx, i) => (
          <KpiCard 
            key={i}
            title={idx.name}
            value={typeof idx.val === 'string' ? idx.val : (idx.unit === 'currency' ? formatValue(idx.val as number, 'currency') : isFinite(idx.val as number) ? (idx.val as number).toFixed(2) : '0.0')}
            suffix={idx.unit}
            status={idx.status as any}
            trend={idx.trend}
            tooltip={idx.tooltip}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 mb-10">
        <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-200/40 flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0 flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Evolução de Performance</h3>
              <p className="text-[10px] text-slate-400/80 uppercase font-bold tracking-widest mt-1">Receita, EBITDA e Lucro</p>
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

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-slate-700/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h3 className="text-xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Destaques</h3>
          <p className="text-[10px] text-blue-400/80 uppercase font-bold tracking-widest mb-8">Insights de Resultado</p>
          
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
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AH (2 Anos)</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AH (3 Anos)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {standardDreRows.length > 0
                // ── Espelho Estrutural: Renderiza a base analítica das 14 linhas com os filhos aninhados ──
                ? standardDreRows.map((row: any, i: number) => {
                    const name = row.name || row.conta || row.category || '';
                    const val = row.val || 0;
                    const level = row.level ?? 1;
                    
                    let baseForAV = recLiquida;
                    const nameLower = name.toLowerCase();
                    if (nameLower.includes('receita operacional bruta') || nameLower.includes('receita bruta') || nameLower.includes('faturamento') || nameLower.includes('deduções') || nameLower.includes('impostos sobre vendas') || nameLower.includes('abatimentos')) {
                      baseForAV = receitaBruta;
                    }
                    const av = baseForAV > 0 ? (val / baseForAV) * 100 : 0;
                    const prev1Val = getPastValue(1, name);
                    const ah1 = prev1Val > 0 ? ((val / prev1Val) - 1) * 100 : null;
                    const prev2Val = getPastValue(2, name);
                    const ah2 = prev2Val > 0 ? ((val / prev2Val) - 1) * 100 : null;
                    const prev3Val = getPastValue(3, name);
                    const ah3 = prev3Val > 0 ? ((val / prev3Val) - 1) * 100 : null;
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
                          ah1 === null ? "text-slate-300" : ah1 > 0 ? "text-emerald-500" : ah1 < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah1 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah1 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah1).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah2 === null ? "text-slate-300" : ah2 > 0 ? "text-emerald-500" : ah2 < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah2 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah2 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah2).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah3 === null ? "text-slate-300" : ah3 > 0 ? "text-emerald-500" : ah3 < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah3 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah3 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah3).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                // ── Sem dados: mostra template estático como guia ──
                : [
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
                  ].map((row, i) => {
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
        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 rounded-[40px] shadow-xl shadow-slate-200/40 p-8 mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-sm">
              <TrendingUp size={22} />
            </div>
            <div>
              <h4 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Nota Explicativa de Evolução</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400/80 mt-1">Tendência Histórica Acumulada ({trendNote.period})</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title="Crescimento de Receita">Crescimento de Receita</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.receita > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.receita > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.receita > 0 ? '+' : ''}{trendNote.receita.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title={`Evolução de ${cmvLabel}`}>Evolução de {cmvLabel}</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.cmv > 0 ? <TrendingUp size={18} className="text-rose-500" /> : <TrendingDown size={18} className="text-emerald-500" />}
                <p className={cn("text-3xl font-black", trendNote.cmv > 0 ? "text-rose-500" : "text-emerald-500")}>
                  {trendNote.cmv > 0 ? '+' : ''}{trendNote.cmv.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title="Evolução de EBITDA">Evolução de EBITDA</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.ebitda > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.ebitda > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {trendNote.ebitda > 0 ? '+' : ''}{trendNote.ebitda.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-slate-200/60 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 truncate" title="Evolução do Lucro">Evolução do Lucro</p>
              <div className="flex items-center gap-2 mt-auto">
                {trendNote.lucro > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-rose-500" />}
                <p className={cn("text-3xl font-black", trendNote.lucro > 0 ? "text-emerald-500" : "text-rose-500")}>
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
