import { DreExecutiveFacts, DreExecutiveFactsBuilder } from './DreExecutiveFactsBuilder';
import { DreEconomicScenario, DreScenarioClassifier } from './DreScenarioClassifier';
import { DreExecutiveDecisionContract, DreDecisionPolicyLayer } from './DreDecisionPolicyLayer';
import { DreExecutiveLanguageCompiler } from './DreExecutiveLanguageCompiler';
import { formatCurrency } from '../../../lib/utils';
import { 
  DRERevenueEconomicStructureViewModel, 
  DREEconomicBurnRateViewModel, 
  DREBreakEvenAnalysisViewModel, 
  DRETechnicalLayerViewModel, 
  DRETechnicalRowViewModel
} from '../../../components/pages/dre/view-models';
export interface DreExecutiveViewModel {
  isValid: boolean;
  facts: DreExecutiveFacts;
  scenario: DreEconomicScenario;
  policy: DreExecutiveDecisionContract;
  executiveMetrics: {
    receitaLiquida: number;
    lucroBruto: number;
    margemBruta: number;
    margemContrib: number;
    indiceMargemContrib: number;
    ebitda: number;
    margemEbitda: number;
    ebit: number;
    margemEbit: number;
    lucroLiq: number;
    margemLiquida: number;
    pontoEquilibrio: number;
    margemSegurancaValor: number;
    coberturaBreakEven: number;
  };
  economicBreakdown: {
    structureVM: DRERevenueEconomicStructureViewModel;
    burnRateVM: DREEconomicBurnRateViewModel;
    breakEvenVM: DREBreakEvenAnalysisViewModel;
  };
  technicalLayer: DRETechnicalLayerViewModel;
}

export class DreExecutiveViewModelBuilder {
  public static build(rawPayload: any, historicalPayloads: any[] = []): DreExecutiveViewModel {
    const facts = new DreExecutiveFactsBuilder(rawPayload, historicalPayloads).build();
    
    // Se não há receita ou é 0, a DRE não tem contexto econômico executável
    if (facts.netRevenue <= 0) {
      return {
        isValid: false,
        facts,
        scenario: DreEconomicScenario.UNCATEGORIZED,
        policy: this.getEmptyPolicy(),
        executiveMetrics: {
          receitaLiquida: 0,
          lucroBruto: 0,
          margemBruta: 0,
          margemContrib: 0,
          indiceMargemContrib: 0,
          ebitda: 0,
          margemEbitda: 0,
          ebit: 0,
          margemEbit: 0,
          lucroLiq: 0,
          margemLiquida: 0,
          pontoEquilibrio: 0,
          margemSegurancaValor: 0,
          coberturaBreakEven: 0
        },
        economicBreakdown: this.getEmptyEconomicBreakdown(),
        technicalLayer: this.buildTechnicalLayer(facts)
      };
    }

    const scenario = DreScenarioClassifier.classify(facts);
    const year = rawPayload.year || rawPayload.data?.period || undefined;
    const policy = DreDecisionPolicyLayer.generatePolicy(facts, scenario, year);

    const vm: DreExecutiveViewModel = {
      isValid: true,
      facts,
      scenario,
      policy,
      executiveMetrics: {
        receitaLiquida: facts.netRevenue,
        lucroBruto: facts.grossProfit,
        margemBruta: facts.grossMargin,
        margemContrib: facts.contributionMarginValue,
        indiceMargemContrib: facts.contributionMarginRate,
        ebitda: facts.ebitda,
        margemEbitda: facts.ebitdaMargin,
        ebit: facts.ebit,
        margemEbit: facts.ebitMargin,
        lucroLiq: facts.netIncome,
        margemLiquida: facts.netMargin,
        pontoEquilibrio: facts.breakEvenRevenue,
        margemSegurancaValor: facts.breakEvenDistance,
        coberturaBreakEven: facts.breakEvenCoverage
      },
      economicBreakdown: this.buildEconomicBreakdown(facts),
      technicalLayer: this.buildTechnicalLayer(facts)
    };
    
    console.log("VIEWMODEL FINAL", vm);
    return vm;
  }

  private static getEmptyPolicy(): DreExecutiveDecisionContract {
    const compiler = new DreExecutiveLanguageCompiler();
    const emptyStatus = compiler.compileEmptyPolicyStatus();

    return {
      economicPositioning: emptyStatus.economicPositioning,
      healthIndex: 0,
      confidenceScore: 0,
      executiveDiagnosis: {
        currentSituation: emptyStatus.currentSituation,
        strategicPriority: emptyStatus.strategicPriority,
        operationalOutlook: emptyStatus.operationalOutlook,
        primaryRecommendation: emptyStatus.primaryRecommendation,
        primaryEconomicDriver: emptyStatus.primaryEconomicDriver,
        severityState: "neutral",
        recommendationPriority: "low",
        dominantStrength: "Aguardando dados",
        secondaryAttention: "Aguardando dados"
      },
      boardQuestions: {
        p1ValueCreation: { title: "P1 — Criação de Valor", response: emptyStatus.p1Response, rationale: "Dados ausentes.", recommendation: "Aguardar dados." },
        p2StructureSupport: { title: "P2 — Sustentação", response: emptyStatus.p2Response, rationale: "Dados ausentes.", recommendation: "Aguardar dados." },
        p3EconomicEquilibrium: { title: "P3 — Equilíbrio", response: emptyStatus.p3Response, rationale: "Dados ausentes.", recommendation: "Aguardar dados." },
        p4PrimaryConstraint: { title: "P4 — Restrição", response: emptyStatus.p4Response, rationale: "Dados ausentes.", recommendation: "Aguardar dados." },
        p5EconomicOpportunity: { title: "P5 — Oportunidade", response: emptyStatus.p5Response, rationale: "Dados ausentes.", recommendation: "Aguardar dados." },
        p6InactionRisk: { title: "P6 — Inação", response: emptyStatus.p6Response, rationale: "Dados ausentes.", recommendation: "Aguardar dados." },
        p7BoardPriority: { title: "P7 — Prioridade do Conselho", response: emptyStatus.p7Response, rationale: "Dados ausentes.", recommendation: "Aguardar dados." },
      },
      executivePlan: {
        shortTerm: emptyStatus.shortTerm,
        mediumTerm: emptyStatus.mediumTerm,
        longTerm: emptyStatus.longTerm,
      },
      historicalIntelligence: {
        message: emptyStatus.historicalIntelligence
      }
    };
  }



  private static buildEconomicBreakdown(facts: DreExecutiveFacts) {
    const formatPct = (val: number) => `${(val * 100).toFixed(1)}%`;
    const cogsMargin = facts.netRevenue > 0 ? (facts.cogs / facts.netRevenue) : 0;
    const fixedExpensesMargin = facts.netRevenue > 0 ? (facts.fixedExpenses / facts.netRevenue) : 0;

    return {
      structureVM: {
        available: true,
        narrative: `Para cada R$ 100 de Receita, a operação absorve ${formatPct(cogsMargin)} em Custos e ${formatPct(fixedExpensesMargin)} em Despesas Fixas, convertendo ${formatPct(facts.netMargin)} de Margem Líquida.`,
      },
      burnRateVM: {
        available: true,
        hasBurn: facts.netIncome < 0,
        narrative: facts.netIncome < 0 ? "A empresa opera com déficit econômico recorrente." : "Operação sustentável, sem risco de continuidade econômica no exercício.",
        monthlyEconomicBurnFormatted: facts.netIncome < 0 ? formatCurrency(Math.abs(facts.netIncome) / 12) : undefined,
        annualEconomicBurnFormatted: facts.netIncome < 0 ? formatCurrency(Math.abs(facts.netIncome)) : undefined,
      },
      breakEvenVM: {
        available: true,
        narrative: `O Ponto de Equilíbrio é ${formatCurrency(facts.breakEvenRevenue)}. A receita atual cobre ${formatPct(facts.breakEvenCoverage)} da necessidade.`,
        absorptionClassification: facts.breakEvenCoverage >= 1.2 ? "Plena" : facts.breakEvenCoverage >= 1 ? "Adequada" : "Parcial",
        absorptionTone: (facts.breakEvenCoverage >= 1.2 ? "success" : facts.breakEvenCoverage >= 1 ? "success" : "critical") as any
      }
    };
  }

  private static getEmptyEconomicBreakdown() {
    return {
      structureVM: { available: false, reason: 'INSUFFICIENT_DATA' as any },
      burnRateVM: { available: false, reason: 'INSUFFICIENT_DATA' as any, hasBurn: false },
      breakEvenVM: { available: false, reason: 'INSUFFICIENT_DATA' as any }
    };
  }

  private static buildTechnicalLayer(facts: DreExecutiveFacts): DRETechnicalLayerViewModel {
    // Vamos construir as linhas lendo do cascadeResult original injetado nos facts
    const rawData = facts.rawPayload?.cascadeResult;
    const rows: DRETechnicalRowViewModel[] = [];

    if (Array.isArray(rawData)) {
      // Filtrar sinteticos e montar tree
      const items = rawData.filter((r: any) => r.tipo !== 'SINTETICA' && r.tipo !== 'RESULTADO_CALCULADO' && r.dreTipo !== 'SINTETICA' && r.dreTipo !== 'RESULTADO_CALCULADO');
      
      const getVal = (id: string) => {
        const match = rawData.find((r: any) => r.id === id);
        return match ? (match.computedValue !== undefined ? match.computedValue : match.value || match.val || 0) : 0;
      };

      const getChildren = (parentId: string) => {
        return items
          .filter((r: any) => r.parentId === parentId)
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
          .map((r: any) => {
            const val = r.value || r.val || 0;
            const av = facts.netRevenue > 0 ? (val / facts.netRevenue) * 100 : 0;
            return {
             label: r.conta || r.category || r.nome,
             val,
             av,
             ah1: null,
             ah2: null,
             ah3: null,
             level: 2,
             isTotal: false
          };
        });
      };

      const addRoot = (id: string, label: string) => {
        const val = getVal(id);
        const av = facts.netRevenue > 0 ? (val / facts.netRevenue) * 100 : 0;
        rows.push({ label, val, av, ah1: null, ah2: null, ah3: null, level: 1, isTotal: true });
        rows.push(...getChildren(id));
      };

      addRoot('ROB', '(+) Receita Operacional Bruta');
      addRoot('DED', '(-) Deduções da Receita Bruta');
      addRoot('ROL', '(=) Receita Operacional Líquida');
      addRoot('CUSTOS', '(-) Custos Mercadorias/Produtos/Serviços');
      addRoot('LUCRO_BRUTO', '(=) Lucro Bruto');
      addRoot('DESP_OPER', '(-) Despesas Operacionais');
      addRoot('EBITDA', '(=) EBITDA');
      addRoot('DEP_AMORT', '(-) Depreciação e Amortização');
      addRoot('EBIT', '(=) Resultado Operacional Líquido (EBIT)');
      addRoot('RESULT_FIN', '(+/-) Resultado Financeiro');
      addRoot('OUTRAS_REC_DESP', '(+/-) Outras Receitas / Despesas Operacionais');
      addRoot('RAIR_CSLL', '(=) Resultado Antes de IR e CSLL');
      addRoot('PROV_IR_CSLL', '(-) Provisões (IRPJ/CSLL)');
      addRoot('LUCRO_LIQ', '(=) Lucro Líquido do Exercício');
    }

    return { rows };
  }
}
