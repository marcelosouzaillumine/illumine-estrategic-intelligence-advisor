import { EngineDefinition, InstitutionalContext, EngineExecutionResult, CausalityChain, AdvisoryNarrative } from '../types';

export const StressTestAdapter: EngineDefinition = {
  name: 'StressTestAdapter',
  priority: 40, // Roda DEPOIS do Financial (10), DRE (20) e DFC (30)
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter'],
  requiredData: [],
  inferenceScope: 'Structural Stress Engine',
  minimumEvidenceLevel: 'DFC Validada',
  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const inferences = context.inferences || {};
      const dfcInference = inferences['Inteligência de Caixa (DFC)'];
      const financialInference = inferences['Balanço Patrimonial e Saúde Financeira'];
      const dreInference = inferences['DRE e Performance Operacional'];

      // Se qualquer um dos motores falhou ou não existe
      if (!dfcInference || !financialInference || !dreInference) {
        return {
          engineName: 'StressTestAdapter',
          success: false,
          confidence: 'LOW',
          violations: [{
            rule: 'MISSING_PREREQUISITES',
            severity: 'CRITICAL',
            message: 'Stress Testing não pode operar sem a Trindade Contábil (BP + DRE + DFC) previamente processada.',
            blocked: true
          }]
        };
      }

      // Herança Epistemológica
      const dfcConfidence = dfcInference.confidence;
      let confidence: 'LOW' | 'MEDIUM' | 'HIGH' = dfcConfidence;
      const isDfcInferred = dfcInference.evidenceLevel === 'Inferência Indireta (BP/DRE)';

      let violations: any[] = [];
      let evidenceLevel = isDfcInferred ? 'INFERRED_LOW_CONFIDENCE' : 'REAL_DATA_BASED';

      if (isDfcInferred) {
        violations.push({
          rule: 'INSUFFICIENT_STRESS_EVIDENCE',
          severity: 'HIGH',
          message: 'Simulação de estresse bloqueada para asserções absolutas devido à DFC puramente inferida.',
          blocked: false // não block total, mas barra impactos absolutos
        });
      }

      // Dados de Contexto
      const bpMetrics = financialInference.metrics || {};
      const dreMetrics = dreInference.metrics || {};
      const dfcMetrics = dfcInference.metrics || {};

      const ebitda = dreMetrics.ebitda || 0;
      const fco = dfcMetrics.fco || 0;
      const passivoCirculante = bpMetrics.passivoCirculante || 0;
      const passivosFinanceiros = bpMetrics.passivosFinanceiros || 0;
      const saldoCaixa = bpMetrics.caixaEquivalentes || 0;
      const shortTermDebt = passivoCirculante > 0 ? passivosFinanceiros * (passivoCirculante / (bpMetrics.passivoTotal || 1)) : passivosFinanceiros;

      // --- CÁLCULOS OFICIAIS DE STRESS ---

      // 1. DSCR Validado (Debt Service Coverage Ratio sobre CAIXA)
      // O legacy fazia EBITDA / Dívida, nós faremos FCO / Dívida, e o EBITDA como métrica secundária teórica.
      const dscrCausal = shortTermDebt > 0 ? (fco / (shortTermDebt / 12)) : (fco > 0 ? 99.9 : 0);
      const dscrEbitda = shortTermDebt > 0 ? (ebitda / (shortTermDebt / 12)) : (ebitda > 0 ? 99.9 : 0);

      // 2. Runway e Sobrevivência (Runway Validado)
      // Substitui o cashFlowService. Burn rate estrutural = FCO negativo.
      let runwayDays = 0;
      let isBurnRate = fco < 0;
      if (isBurnRate) {
        // Quantos dias o saldo de caixa segura o FCO negativo anualizado?
        const dailyBurn = Math.abs(fco) / 360;
        runwayDays = dailyBurn > 0 ? Math.round(saldoCaixa / dailyBurn) : 0;
      } else {
        runwayDays = 999; // Caixa crescente, sem runway deadline.
      }

      // --- CENÁRIOS E CAUSALIDADE ---
      const causality: CausalityChain[] = [];
      const scenarios: any[] = [];
      const blockedInferences = [];

      if (isDfcInferred) {
        blockedInferences.push('Runway Exato');
        blockedInferences.push('Data de Ruptura Garantida');
        blockedInferences.push('Resiliência Absoluta');
      }

      if (isBurnRate && runwayDays < 90) {
          scenarios.push({
             scenarioName: 'PRESSÃO ESTRUTURAL IMINENTE',
             severity: isDfcInferred ? 'Alta' : 'Crítica',
             description: 'Queima orgânica de caixa detectada com Runway inferior a 3 meses.',
             estimatedImpact: isDfcInferred ? 'Risco severo de default (carece de DFC oficial para validar).' : 'Default estrutural em menos de 90 dias caso injeções de capital não ocorram.'
          });
          causality.push({
            trigger: 'FCO Negativo Consumindo Tesouraria',
            consequence: 'Esgotamento iminente das reservas de liquidez imediata.',
            amplification: shortTermDebt > 0 ? 'Dívida bancária de curto prazo agrava a ruptura.' : null,
            mitigation: null,
            businessImpact: 'Perda de capacidade de giro',
            structuralRisk: isDfcInferred ? 'Alto' : 'Crítico',
            institutionalImpact: 'Descontinuidade operacional.'
          });
      }

      if (dscrEbitda > 1.2 && dscrCausal < 0.8) {
          scenarios.push({
             scenarioName: 'ILUSÃO DE LIQUIDEZ OPERACIONAL',
             severity: 'Alta',
             description: 'EBITDA indica capacidade de pagamento de dívida, mas o Fluxo Operacional real (FCO) é insuficiente.',
             estimatedImpact: 'Incapacidade de honrar serviço da dívida sem recorrer à alavancagem externa.'
          });
          causality.push({
            trigger: 'Incompatibilidade EBITDA vs FCO',
            consequence: 'Dificuldade de conversão do resultado econômico em liquidez para pagamento do principal.',
            amplification: null,
            mitigation: null,
            businessImpact: 'Aumento do endividamento para pagar juros',
            structuralRisk: 'Alto',
            institutionalImpact: 'Restruturação da carteira de passivos recomendada.'
          });
      }

      const metrics = {
        dscrCausal,
        dscrEbitda,
        runwayDays,
        isBurnRate,
        evidenceLevel,
        scenarios
      };

      const narrative: AdvisoryNarrative = {
        diagnostic: isDfcInferred 
            ? 'Simulações e projeções de ruptura operando sob premissas de LOW Confidence devido à falta de fluxo de caixa primário.'
            : 'Simulação de estresse financeiro validada com base no comportamento de caixa aferido.',
        cause: isBurnRate ? 'Consumo orgânico limitando runway' : 'Fluxos de sustentação estáveis',
        consequence: isBurnRate && runwayDays < 90 ? 'Esgotamento acelerado' : 'Sobrevivência do balanço preservada',
        sensitivity: isDfcInferred ? 'Incerteza elevada' : 'Determinística',
        risk: isBurnRate && runwayDays < 90 ? 'Ruptura Eminente' : 'Suportável',
        priority: isBurnRate ? 'Capitalização / Desalavancagem' : 'Manutenção da governança tática',
        strategicMovement: 'Calibragem de expectativas preditivas alinhadas à causalidade restrita.'
      };

      return {
        engineName: 'StressTestAdapter',
        success: true,
        confidence,
        violations,
        inference: {
          domain: 'Simulação de Estresse (Stress Engine)',
          metrics: { ...metrics, blockedInferences },
          causality,
          narrative,
          confidence,
          evidenceLevel,
          score: null
        }
      };
    } catch (error: any) {
      return {
        engineName: 'StressTestAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'STRESS_PROCESSING_ERROR',
          severity: 'CRITICAL',
          message: error.message || 'Erro catastrófico no processamento preditivo de Stress.',
          blocked: true
        }]
      };
    }
  }
};
