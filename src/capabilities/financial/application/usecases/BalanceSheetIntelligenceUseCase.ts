import { FinancialPositionIntelligenceContract } from '../../../../core/experience/contracts/FinancialPositionPureViewModel';
import { BalanceSheetAnalysisInput } from '../../domain/models/BalanceSheetAnalysisInput';
import { BalanceSheetNormalizer } from '../../infrastructure/adapters/BalanceSheetNormalizer';
import { HistoricalEvolutionEngine } from '../../intelligence/historical/HistoricalEvolutionEngine';
import { ExecutivePositionSummaryEngine } from '../../intelligence/narrative/ExecutivePositionSummaryEngine';
import { FinancialPositionScoreEngine } from '../../intelligence/score/FinancialPositionScoreEngine';
import { BalanceSheetIntelligenceEngine } from '../../intelligence/BalanceSheetIntelligenceEngine';
import { SignalIntelligenceEngine } from '../../intelligence/signals/SignalIntelligenceEngine';
import { ExecutiveQuestionEngine } from '../../intelligence/questions/ExecutiveQuestionEngine';
import { HistoricalNarrativeEngine } from '../../intelligence/historical/HistoricalNarrativeEngine';
import { AnalyticalEvidenceResolver } from '../../intelligence/missing/AnalyticalEvidenceResolver';

export class BalanceSheetIntelligenceUseCase {
  analyzeBalanceSheet(input: BalanceSheetAnalysisInput): FinancialPositionIntelligenceContract {
    try {
      const dataset = BalanceSheetNormalizer.normalize(input);
      const output = BalanceSheetIntelligenceEngine.execute(dataset.current);
      
      const liquidityInd = output.indicators?.filter(i => i.category === 'LIQUIDITY') || [];
      const structureInd = output.indicators?.filter(i => i.category === 'STRUCTURE' || i.category === 'LIABILITY_QUALITY') || [];
      const qualityInd = output.indicators?.filter(i => i.category === 'ASSET_QUALITY') || [];
      const wcInd = output.indicators?.filter(i => i.category === 'WORKING_CAPITAL') || [];
      
      const fleuriet = output.evidence?.fleuriet;
      if (fleuriet) {
        wcInd.push({
          name: 'Modelo de Fleuriet',
          value: fleuriet.classification,
          status: fleuriet.riskLevel,
          interpretation: fleuriet.description
        } as any);
      }
      
      const diagnostic = output.diagnostics[0] || {} as any;
      const healthStatus = diagnostic.status || 'NEUTRAL';
      let financialMeaning = 'A estrutura requer monitoramento executivo contínuo.';
      if (healthStatus === 'STRONG') financialMeaning = 'A autonomia financeira proporciona estabilidade nas operações e expansões.';
      if (healthStatus === 'ATTENTION') financialMeaning = 'Um ponto de atenção específico demanda acompanhamento, mas a estrutura central permanece robusta.';
      if (healthStatus === 'CRITICAL') financialMeaning = 'O risco de ruptura financeira expõe a estrutura de capital a elevada instabilidade.';
      if (healthStatus === 'VULNERABLE') financialMeaning = 'O acúmulo de fatores de atenção expõe a estrutura de capital a riscos materiais.';

      const overview = {
        healthStatus,
        confidence: output.confidence?.level || 'HIGH',
        confidenceDetail: output.confidence,
        drivers: [...(diagnostic.attention || []), ...(diagnostic.strengths || [])],
        observation: diagnostic.executiveMessage || 'A estrutura patrimonial foi avaliada.',
        evidence: 'Dados contábeis consolidados do Balanço Patrimonial e classificação de liquidez.',
        financialMeaning
      };

      const mapIndicator = (raw: any) => {
        let availability = 'AVAILABLE';
        let value = raw.value;
        if (value === undefined || value === null) availability = 'UNAVAILABLE';
        else if (value === 'NOT_APPLICABLE') availability = 'NOT_APPLICABLE';
        else if (value === 0) availability = 'ZERO';

        let formattedValue = '';
        if (availability === 'UNAVAILABLE') formattedValue = 'Dados insuficientes';
        else if (availability === 'NOT_APPLICABLE') formattedValue = 'Não aplicável';
        else {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            if (raw.unit === 'x' || raw.name?.toLowerCase().includes('liquidez')) formattedValue = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'x';
            else if (raw.unit === '%') formattedValue = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
            else if (raw.unit === 'BRL') formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numValue);
            else formattedValue = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else formattedValue = String(value);
        }

        return {
          ...raw,
          code: raw.id || raw.code || 'UNKNOWN',
          value: typeof value === 'number' ? value : undefined,
          formattedValue,
          availability
        };
      };

      const diagnosis = {
        liquidity: liquidityInd.map(mapIndicator),
        solvencyAndCapitalStructure: structureInd.map(mapIndicator),
        workingCapital: wcInd.map(mapIndicator),
        assetQuality: qualityInd.map(mapIndicator)
      };

      const signalsWrapper = SignalIntelligenceEngine.synthesize(output.exposures || [], dataset.history, dataset.current);
      const signals = {
        state: signalsWrapper.length > 0 ? 'AVAILABLE_WITH_SIGNALS' as const : 'AVAILABLE_EMPTY' as const,
        available: true,
        items: signalsWrapper
      };

      const executiveQuestionsWrapper = ExecutiveQuestionEngine.generateQuestionsForSignals(signalsWrapper);
      const executiveQuestions = executiveQuestionsWrapper;
      
      // Map questions back to signals for complete traceability
      signalsWrapper.forEach(signal => {
        const question = executiveQuestions.find(q => q.originSignalId === signal.id);
        if (question) {
          signal.relatedQuestion = question.id;
        }
      });

      let historicalEvolution: any;
      if (dataset.coverage && dataset.coverage.available) {
        const { filteredPeriods, firstPeriod, lastPeriod } = dataset.coverage;
        const movements = HistoricalEvolutionEngine.extractMovements(dataset.history);
        const historicalIntell = HistoricalNarrativeEngine.synthesize(movements, filteredPeriods.length, firstPeriod, lastPeriod);
        historicalEvolution = {
          available: true,
          ...historicalIntell
        };
      } else {
        historicalEvolution = AnalyticalEvidenceResolver.resolveMissingHistory() as any;
      }

      let technicalEvidence: any;
      const current = dataset.current;

      const hasMinimalStructuralData = 
          Object.values(current?.assets || {}).some(v => v !== undefined) ||
          Object.values(current?.liabilities || {}).some(v => v !== undefined) ||
          Object.values(current?.equity || {}).some(v => v !== undefined);

      if (current && hasMinimalStructuralData) {
        const structuralRows = [
          { item: 'Caixa e Equivalentes', value: current.assets.cashAndEquivalents, type: 'account' },
          { item: 'Contas a Receber', value: current.assets.accountsReceivable, type: 'account' },
          { item: 'Estoques', value: current.assets.inventory, type: 'account' },
          { item: 'Ativo Circulante', value: current.assets.currentAssets, type: 'subtotal' },
          { item: 'Ativo Imobilizado/Intangível', value: current.assets.fixedAssets, type: 'account' },
          { item: 'Ativo Não Circulante', value: current.assets.nonCurrentAssets, type: 'subtotal' },
          { item: 'Ativo Total', value: current.assets.total, type: 'total' },
          { item: 'Fornecedores', value: current.liabilities.suppliers, type: 'account' },
          { item: 'Obrigações Trabalhistas', value: current.liabilities.laborObligations, type: 'account' },
          { item: 'Impostos e Tributos', value: current.liabilities.taxes, type: 'account' },
          { item: 'Dívidas Financeiras (Curto Prazo)', value: current.liabilities.financialDebtsShortTerm, type: 'account' },
          { item: 'Passivo Circulante', value: current.liabilities.currentLiabilities, type: 'subtotal' },
          { item: 'Dívidas Financeiras (Longo Prazo)', value: current.liabilities.financialDebtsLongTerm, type: 'account' },
          { item: 'Passivo Não Circulante', value: current.liabilities.nonCurrentLiabilities, type: 'subtotal' },
          { item: 'Capital Social', value: current.equity.capital, type: 'account' },
          { item: 'Lucros Retidos / Prejuízos Acumulados', value: current.equity.retainedEarnings, type: 'account' },
          { item: 'Patrimônio Líquido', value: current.equity.total, type: 'subtotal' },
          { item: 'Passivo + Patrimônio Líquido', value: (current.liabilities.total || 0) + (current.equity.total || 0), type: 'total' }
        ];

        const structuralTables = output.indicators ? [{
          familyName: 'Métricas Patrimoniais Essenciais',
          indicators: output.indicators.map(ind => ({
            label: ind.name,
            value: ind.value,
            unit: ind.unit,
            classificationLabel: ind.status,
            analysis: ind.interpretation,
            formula: ind.formula,
            purpose: ind.purpose,
            limitations: ind.limitations,
            referenceRange: ind.referenceRange,
            methodologicalNotes: ind.methodologicalNotes
          }))
        }] : [];

        technicalEvidence = {
          available: true,
          bpSummary: {
            totalAssets: current.assets.total ?? 0,
            totalLiabilities: current.liabilities.total ?? 0,
            equity: current.equity.total ?? 0
          },
          rows: structuralRows,
          auditMetadata: {
            source: 'NormalizedBalanceSheet',
            year: current.year,
            balanceIntegrity: output.evidence?.balanceIntegrity || 'OK'
          },
          structuralTables
        };
      } else {
        technicalEvidence = {
          available: false,
          availabilityReason: { type: "INCOMPLETE_DATA_SOURCE", title: "Dados insuficientes", explanation: "Não há dados estruturais.", impact: "Não disponível" }
        };
      }

      const summaryData = ExecutivePositionSummaryEngine.synthesize(
        signalsWrapper,
        executiveQuestions,
        healthStatus
      );

      const executiveSummary = {
        available: true,
        ...summaryData
      };

      const scoreData = FinancialPositionScoreEngine.calculate(
        { 
          liquidity: liquidityInd,
          solvencyAndCapitalStructure: structureInd, 
          workingCapital: wcInd, 
          assetQuality: qualityInd
        },
        dataset.history.length,
        undefined
      );
      
      const score = {
        available: hasMinimalStructuralData,
        ...scoreData
      };

      return {
        pureViewModel: {
          executiveSummary,
          score,
          overview,
          diagnosis,
          signals,
          historicalEvolution,
          executiveQuestions,
          technicalEvidence
        },
        filterYear: input.analysisPeriod || new Date().getFullYear()
      };

    } catch (error) {
      console.error('[BalanceSheetGovernanceUseCase] Failed to analyze balance sheet:', error);
      return {
        pureViewModel: {
          executiveSummary: { available: false, status: { classification: '', narrative: '' }, strengths: [], attentionPoints: [], centralQuestion: { question: '' } },
          score: { 
            available: false, 
            overall: { value: 0, classification: 'UNAVAILABLE', finalStatus: 'UNAVAILABLE', confidence: 'LOW', explanation: 'Error', structuralEvents: [] },
            dimensions: {
              liquidity: { value: 0, weight: 0, contribution: 0, interpretation: '', evidence: { metrics: [] }, confidence: 'LOW' },
              solvencyAndCapitalStructure: { value: 0, weight: 0, contribution: 0, interpretation: '', evidence: { metrics: [] }, confidence: 'LOW' },
              workingCapital: { value: 0, weight: 0, contribution: 0, interpretation: '', evidence: { metrics: [] }, confidence: 'LOW' },
              assetQuality: { value: 0, weight: 0, contribution: 0, interpretation: '', evidence: { metrics: [] }, confidence: 'LOW' },
              evolution: { value: 0, weight: 0, contribution: 0, interpretation: '', evidence: { metrics: [] }, confidence: 'LOW' }
            },
            methodology: { version: '', calculatedAt: '', dataPeriods: 0, weights: { liquidity: 0, solvencyAndCapitalStructure: 0, workingCapital: 0, assetQuality: 0, evolution: 0 } }
          },
          overview: { healthStatus: 'NEUTRAL', confidence: 'LOW', drivers: [], observation: '', evidence: '', financialMeaning: '' },
          diagnosis: { liquidity: [], solvencyAndCapitalStructure: [], workingCapital: [], assetQuality: [] },
          signals: { state: 'UNAVAILABLE', available: false, items: [] },
          historicalEvolution: { 
            available: false,
            periodCoverage: { firstYear: 0, lastYear: 0, periodsAnalyzed: 0 },
            trajectory: { classification: 'insufficient', confidence: 'LOW', explanation: '' },
            movements: [],
            executiveContext: { observation: '', implication: '' }
          },
          executiveQuestions: [],
          technicalEvidence: { available: false, bpSummary: {}, rows: [], auditMetadata: {}, structuralTables: [] }
        },
        filterYear: input.analysisPeriod || new Date().getFullYear()
      };
    }
  }
}

export const financialAnalysisService = new BalanceSheetIntelligenceUseCase();
