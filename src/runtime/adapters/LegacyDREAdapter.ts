import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../types';
import { calculateDreCascade } from '../../lib/dreCascade';
import { generateDreInsights, DreMetrics } from '../../lib/dreInsights';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';

export const LegacyDREAdapter: EngineDefinition = {
  name: 'LegacyDREAdapter',
  priority: 11, // Executa depois ou junto do FinancialAdapter
  dependencies: [],
  requiredData: ['dreData'],
  inferenceScope: 'Inteligência Operacional, Escala e Eficiência',
  minimumEvidenceLevel: 'DRE Básica',
  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const input = context.input;
      const { dreData, historicalCyclesCount } = input;

      if (!dreData || dreData.length === 0) {
        return {
          engineName: 'LegacyDREAdapter',
          success: false,
          confidence: 'LOW',
          violations: [{
            rule: 'MISSING_DRE_DATA',
            severity: 'CRITICAL',
            message: 'Base informacional insuficiente para estruturar a DRE.',
            blocked: true
          }]
        };
      }

      const allHistoryData = dreData;
      const filterYear = input.rawFinancialData?.filterYear || new Date().getFullYear();
      const segmentoEmpresa = (input.rawFinancialData?.segmentoEmpresa || 'Serviços').toLowerCase();

      // 1. Map current year data
      const yearEntries = allHistoryData.filter((d: any) => {
        const typeNorm = (d.type || d.docType || '').toLowerCase();
        const isDRE = typeNorm.includes('dre') || typeNorm === 'resultado';
        return isDRE && Number(d.year) === filterYear && (d.entryType || '').toLowerCase() !== 'ativo' && (d.entryType || '').toLowerCase() !== 'passivo' && (d.entryType || '').toLowerCase() !== 'patrimônio líquido';
      });

      if (yearEntries.length === 0) {
        return {
          engineName: 'LegacyDREAdapter',
          success: false,
          confidence: 'LOW',
          violations: [{
            rule: 'NO_DATA_FOR_YEAR',
            severity: 'CRITICAL',
            message: `Nenhum dado operacional encontrado para o exercício de ${filterYear}.`,
            blocked: true
          }]
        };
      }

      const mappedEntries = yearEntries.sort((a:any, b:any) => (a.ordem || 0) - (b.ordem || 0)).map((d: any) => {
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
        return { ...d, parentId, value: d.val || d.valor || d.value || 0 };
      }).filter(Boolean);

      const allRows = [
         ...DRE_OFFICIAL_STRUCTURE.map(account => ({ ...account, value: 0 })),
         ...mappedEntries
      ];

      const cascadeResult = calculateDreCascade(allRows);

      const getValue = (idMatch: string) => {
        const exactMatch = cascadeResult.find((s: any) => s.id === idMatch);
        if (exactMatch) {
          return exactMatch.computedValue !== undefined ? exactMatch.computedValue : (exactMatch.val || exactMatch.value || exactMatch.valor || 0);
        }
        return 0;
      };

      const receitaBruta = getValue('ROB');
      const deducoesReceita = getValue('DED');
      const recLiquida = getValue('ROL');
      const custosVar = getValue('CUSTOS');
      
      const cmvRow = cascadeResult.find((r: any) => r.parentId === 'CUSTOS' && r.tipo !== 'SINTETICA') || cascadeResult.find((r: any) => r.id === 'CUSTOS');
      const cmvLabelRaw = cmvRow ? (cmvRow.conta || cmvRow.category || cmvRow.nome || 'Custos Variáveis') : 'Custos Variáveis';
      const cmvLabel = cmvLabelRaw.replace(/^[(-/+)\s]+/, '').trim();

      const lucroBruto = getValue('LUCRO_BRUTO');
      const margemContrib = lucroBruto;
      const indiceMargemContrib = recLiquida > 0 ? margemContrib / recLiquida : 0;
      
      const despesasFixas = getValue('DESP_OPER');
      const despVendas = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);
      const despAdmin = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);
      const despFin = getValue('RESULT_FIN');
      const depreciacao = getValue('DEP_AMORT');

      let pontoEquilibrio = 0;
      if (indiceMargemContrib > 0) {
        pontoEquilibrio = Math.abs(despesasFixas) / indiceMargemContrib;
      }
      if (pontoEquilibrio < 0) pontoEquilibrio = Math.abs(pontoEquilibrio);
      if (!isFinite(pontoEquilibrio)) pontoEquilibrio = 0;

      const gapEquilibrio = pontoEquilibrio - recLiquida;
      let margemSegurancaValor = 0;
      if (recLiquida > pontoEquilibrio) {
        margemSegurancaValor = recLiquida - pontoEquilibrio;
      } else {
        margemSegurancaValor = -gapEquilibrio;
      }

      const indiceCoberturaOperacional = pontoEquilibrio > 0 ? (recLiquida / pontoEquilibrio) * 100 : 0;
      const ebitda = getValue('EBITDA');
      const lucroLiq = getValue('LUCRO_LIQ');
      const ebitVal = getValue('EBIT');
      const provisaoIR = getValue('PROV_IR_CSLL');

      const internalAuditErrors: string[] = [];
      if (recLiquida !== 0) {
        const calcLB = recLiquida - Math.abs(custosVar);
        if (lucroBruto !== 0 && Math.abs(calcLB - lucroBruto) > (Math.abs(recLiquida) * 0.01)) {
            internalAuditErrors.push(`Divergência matemática detectada: Lucro Bruto.`);
        }
        const calcOp = calcLB - Math.abs(despesasFixas) - Math.abs(depreciacao);
        if (ebitVal !== 0 && Math.abs(calcOp - ebitVal) > (Math.abs(recLiquida) * 0.01)) {
            internalAuditErrors.push(`Divergência matemática detectada: Resultado Operacional.`);
        }
      }

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

      const mbVal = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;
      const cmvVal = recLiquida > 0 ? (custosVar / recLiquida) * 100 : 0;
      const ebitdaVal = recLiquida > 0 ? (ebitda / recLiquida) * 100 : 0;

      let cmvMin = 0; let cmvMax = 60; let cmvCritical = 75; 
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

      // EFFICIENCY
      const burdenTributario = receitaBruta > 0 ? (deducoesReceita + Math.abs(provisaoIR)) / receitaBruta : 0;
      const eficienciaComercial = cmvVal <= cmvMax ? 100 : Math.max(100 - (((cmvVal - cmvMax) / (cmvCritical - cmvMax)) * 100), 0);
      const eficienciaOperacional = ebitdaVal >= 15 ? 100 : ebitdaVal < 0 ? 0 : (ebitdaVal / 15) * 100;
      const eficienciaAdministrativa = indiceDespesasAdministrativas <= 10 ? 100 : Math.max(100 - (((indiceDespesasAdministrativas - 10) / 15) * 100), 0);
      const eficienciaFinanceira = indiceDespesasFinanceiras <= 3 ? 100 : Math.max(100 - (((indiceDespesasFinanceiras - 3) / 7) * 100), 0);
      const eficienciaTributaria = burdenTributario <= 0.15 ? 100 : Math.max(100 - (((burdenTributario - 0.15) / 0.15) * 100), 0);
      const eficienciaEstrutural = capacidadeAbsorcaoEstrutura >= 1.5 ? 100 : (capacidadeAbsorcaoEstrutura < 1 ? 0 : ((capacidadeAbsorcaoEstrutura - 1) / 0.5) * 100);

      // TRENDS
      const chartData = [5, 4, 3, 2, 1, 0].map(offset => {
        const y = filterYear - offset;
        const yearHist = allHistoryData.filter((d: any) => Number(d.year) === y && d.type === 'DRE' && (d.entryType || '').toLowerCase() !== 'ativo' && (d.entryType || '').toLowerCase() !== 'passivo');
        
        let rl = 0; let ebt = 0; let ll = 0; let cmv = 0;
        if (yearHist.length > 0) {
          const m = yearHist.map((d: any) => ({ ...d, value: d.val || d.valor || 0 }));
          const res = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map(a => ({ ...a, value: 0 })), ...m]);
          rl = res.find((r: any) => r.id === 'ROL')?.computedValue || 0;
          ebt = res.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;
          ll = res.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;
          cmv = Math.abs(res.find((r: any) => r.id === 'CUSTOS')?.computedValue || 0);
        }
        return { year: y.toString(), receita: rl, cmv, ebitda: ebt, lucro: ll };
      }).filter(d => d.receita > 0 || d.ebitda > 0 || d.lucro > 0 || d.cmv > 0 || d.year === filterYear.toString());

      let recGrowth = 0;
      let ebitdaGrowth = 0;
      let trendNote = null;
      if (chartData.length >= 2) {
        const current = chartData[chartData.length - 1];
        const oldest = chartData.find(d => d.receita > 0) || chartData[0];
        if (oldest && oldest.year !== current.year) {
          recGrowth = oldest.receita !== 0 ? ((current.receita / oldest.receita) - 1) * 100 : 0;
          ebitdaGrowth = oldest.ebitda !== 0 ? ((current.ebitda / oldest.ebitda) - 1) * 100 : 0;
          const cmvGrowth = oldest.cmv !== 0 ? ((current.cmv / oldest.cmv) - 1) * 100 : 0;
          const lucroGrowth = oldest.lucro !== 0 ? ((current.lucro / oldest.lucro) - 1) * 100 : 0;
          trendNote = {
            period: `${oldest.year} a ${current.year}`,
            receita: recGrowth,
            ebitda: ebitdaGrowth,
            cmv: cmvGrowth,
            lucro: lucroGrowth
          };
        }
      }

      // HEALTH SCORE
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
      
      let finalHealthScore = healthScoreBase;
      if (recLiquida > 0) {
          if (mbVal > 30 && capacidadeAbsorcaoEstrutura < 1) finalHealthScore += 10;
          if (trendNote && trendNote.receita > 0) finalHealthScore += Math.min((trendNote.receita / 20) * 10, 10);
          if (ebitda < 0 || margemOperacional < 0 || recLiquida < pontoEquilibrio) {
              finalHealthScore = Math.min(finalHealthScore, 40);
          }
      }
      finalHealthScore = Math.min(Math.max(finalHealthScore, 0), 100);

      // ADVISORY
      const metrics: DreMetrics = {
        recLiquida, lucroBruto, pontoEquilibrio, gapEquilibrio, indiceCoberturaOperacional,
        margemSegurancaValor, cmvVal, cmvCritical, cmvLabel, capacidadeAbsorcaoEstrutura,
        margemOperacional, margemLiquida, indiceDespesasAdministrativas, indiceDespesasFinanceiras,
        breakEvenDays, indiceConversaoOperacional, ebitda, recGrowth, ebitdaGrowth, internalAuditErrors,
        margemContrib, receitaPorOpex: Math.abs(despesasFixas) > 0 ? recLiquida / Math.abs(despesasFixas) : 0
      };

      const insights = generateDreInsights(metrics);

      const causality: CausalityChain[] = insights.smartInsights.map(si => ({
        trigger: si.category,
        consequence: si.text,
        businessImpact: '',
        structuralRisk: si.category === 'Risco Estrutural' ? si.text : '',
        institutionalImpact: si.category === 'Recomendação Estratégica' ? si.text : '',
        amplification: null,
        mitigation: null
      }));

      const narrative: AdvisoryNarrative = {
        diagnostic: insights.performanceNote,
        cause: '',
        consequence: '',
        sensitivity: '',
        risk: '',
        priority: '',
        strategicMovement: insights.smartInsights.find(si => si.category === 'Recomendação Estratégica')?.text || ''
      };

      const indiceDeducoes = receitaBruta > 0 ? (deducoesReceita / receitaBruta) * 100 : 0;

      const inference: InferenceBlock = {
        domain: 'Operational Intelligence',
        metrics: {
          cascadeResult,
          ebitda, ebitVal, recLiquida, lucroBruto, lucroLiq,
          mbVal, cmvVal, ebitdaVal, margemOperacional, margemLiquida,
          indiceConversaoOperacional, capacidadeAbsorcaoEstrutura, breakEvenDays,
          margemSegurancaValor, cmvLabel,
          despesasFixas, pontoEquilibrio, gapEquilibrio, indiceDeducoes, margemContrib,
          receitaBruta, deducoesReceita, custosVar,
          efficiencies: {
            eficienciaComercial, eficienciaOperacional, eficienciaAdministrativa,
            eficienciaFinanceira, eficienciaTributaria, eficienciaEstrutural
          },
          scaleCategory: insights.scaleCategory,
          scaleColor: insights.scaleColor,
          chartData,
          trendNote,
          systemAlerts: insights.systemAlerts
        },
        causality,
        narrative,
        confidence: historicalCyclesCount >= 3 ? 'HIGH' : (historicalCyclesCount >= 1 ? 'MEDIUM' : 'LOW'),
        evidenceLevel: 'Demonstração de Resultados (DRE)',
        score: finalHealthScore
      };

      // Handle Violations
      const violations = [];
      if (internalAuditErrors.length > 0) {
        violations.push({
          rule: 'INTERNAL_MATH_ERROR',
          severity: 'HIGH' as any,
          message: internalAuditErrors.join(' | '),
          blocked: false
        });
      }
      if (ebitda < 0 && recLiquida > 0) {
        violations.push({
          rule: 'EBITDA_DESTRUCTIVE',
          severity: 'HIGH' as any,
          message: 'Operação com EBITDA negativo. Geração de caixa operacional destruída.',
          blocked: false
        });
      }

      return {
        engineName: 'LegacyDREAdapter',
        success: true,
        confidence: inference.confidence,
        inference,
        violations
      };

    } catch (error: any) {
      return {
        engineName: 'LegacyDREAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'ADAPTER_CRASH',
          severity: 'CRITICAL',
          message: error.message || 'Erro crítico na consolidação da DRE',
          blocked: true
        }]
      };
    }
  }
};
