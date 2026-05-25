import { MaturityContextOutput } from './industry-maturity-context-engine';
import { InventoryQualityOutput } from './inventory-quality-engine';
import { ConfidenceInference } from './inference-confidence-engine';
import { CausalScenario } from '../../lib/master-causal-engine';
import { BPSummary } from '../../lib/bpEngine';
type FinancialMetrics = any;

export interface ModulatedCausality {
  scenarios: CausalScenario[];
  explicabilityBlock: {
    realidadeMatematica: string;
    contextoOperacional: string;
    impactoSistemico: string;
    riscoResidual: string;
    tendenciaEstrutural: string;
    confiancaInferencia: string;
  };
}

export function modulateSeverity(
  originalScenarios: CausalScenario[],
  maturity: MaturityContextOutput,
  inventory: InventoryQualityOutput,
  confidence: ConfidenceInference,
  bpSummary: BPSummary,
  metrics: FinancialMetrics
): ModulatedCausality {
  
  // DUAL VALIDATION RULE - EVIDÊNCIA MATEMÁTICA MÍNIMA
  const mathematicalEvidence: string[] = [];
  let isMathInsolvent = false;

  if (bpSummary.patrimonioLiquido > 0) {
    mathematicalEvidence.push('Patrimônio Líquido positivo (ausência de insolvência técnica).');
  } else {
    isMathInsolvent = true;
  }

  if (metrics.dependenciaBancaria < 0.3) {
    mathematicalEvidence.push('Baixa dependência bancária onerosa.');
  } else if (metrics.dependenciaBancaria > 0.5) {
    isMathInsolvent = true;
  }

  if (metrics.ebitda > 0) {
    mathematicalEvidence.push('EBITDA positivo (margem de contribuição operacional saudável).');
  } else if (metrics.lucroLiquido < 0 && metrics.ebitda < 0 && bpSummary.patrimonioLiquido < 0) {
    isMathInsolvent = true;
  }

  if (metrics.indiceCapitalizacao > 0.1) {
    mathematicalEvidence.push('Passivo não explosivo frente ao ativo.');
  }

  if (metrics.liqCorrente > 0.8 || metrics.liqSeca > 0.3) {
    mathematicalEvidence.push('Liquidez operacional parcialmente preservada.');
  }

  const hasMinimumMathEvidence = mathematicalEvidence.length >= 2 && !isMathInsolvent;

  // DUAL VALIDATION RULE - EVIDÊNCIA CONTEXTUAL COERENTE
  const contextualEvidence: string[] = [];
  
  if (maturity.stage === 'Early Stage') {
    contextualEvidence.push('Primeiro ciclo operacional (Ramp-up industrial).');
  }
  if (inventory.classification === 'Estoque de Expansão' || inventory.classification === 'Estoque Estratégico') {
    contextualEvidence.push('Formação de portfólio (Estoque Estratégico/Expansão).');
  }
  if (maturity.archetype === 'Premium Brand Formation' || maturity.archetype === 'Industrial Early Stage' || maturity.archetype === 'Scale Expansion Cycle') {
    contextualEvidence.push(`Setor e estágio compatíveis com maturação comercial (${maturity.archetype}).`);
  }
  if (bpSummary.passivoCirculante > 0 && (bpSummary.fornecedores / bpSummary.passivoCirculante) > 0.3) {
    contextualEvidence.push('Funding via fornecedores atenuando risco de caixa.');
  }

  const hasCoherentContext = contextualEvidence.length >= 2;

  const scenarios = originalScenarios.map(s => {
    const modulated = { ...s };
    let modulationAllowed = false;
    let reasonForBlocking = '';
    const originalSeverity = s.severity;
    let proposedSeverity = s.severity;
    let proposedName = s.name;
    let proposedDescription = s.description;
    let reasonForModulation = '';

    // Modulate OP_DEPENDENTE_GIRO
    if (s.id === 'OP_DEPENDENTE_GIRO') {
      if (maturity.archetype === 'Industrial Early Stage' || maturity.archetype === 'Scale Expansion Cycle' || maturity.archetype === 'Premium Brand Formation') {
        proposedSeverity = 'Média';
        proposedName = 'RETENÇÃO OPERACIONAL ESTRATÉGICA';
        proposedDescription = `Matematicamente há forte retenção de caixa no giro. Contextualmente, reflete ${inventory.classification.toLowerCase()} compatível com o estágio de ${maturity.archetype}. Risco real apenas se houver falha na esteira de conversão futura.`;
        reasonForModulation = 'Estoque estratégico identificado em ciclo de maturação ou expansão.';
      }
    }

    // Modulate PRESSAO_ESTRUTURAL
    if (s.id === 'PRESSAO_ESTRUTURAL') {
      if (maturity.lossArchetype === 'Prejuízo de Maturação') {
        proposedSeverity = 'Média';
        proposedName = 'PRESSÃO DE MATURAÇÃO OPERACIONAL';
        proposedDescription = `Matematicamente a liquidez aponta estrangulamento imediato. Contextualmente, o negócio opera em Ramp-up formando pipeline estrutural. É uma pressão de expansão, não de colapso insolvente.`;
        reasonForModulation = 'Liquidez apertada justificada pelo ciclo de investimento inicial sem dívida bancária excessiva.';
      }
    }

    // Modulate CORROSAO_PATRIMONIAL
    if (s.id === 'CORROSAO_PATRIMONIAL') {
      if (maturity.lossArchetype === 'Prejuízo de Maturação') {
        proposedSeverity = 'Alta'; 
        proposedName = 'QUEIMA DE CAPITAL (BURN RATE INICIAL)';
        proposedDescription = `A descapitalização espelha o esforço comercial e o CAC inicial. Desde que existam buffers de caixa, não configura ruptura sistêmica imediata de modelo.`;
        reasonForModulation = 'Queima de capital condizente com a fase de tração.';
      }
    }

    // Apply Dual Validation Rule
    if (proposedSeverity !== originalSeverity || proposedName !== s.name) {
      if (isMathInsolvent) {
        modulationAllowed = false;
        reasonForBlocking = 'Matemática indica insolvência real ou deterioração estrutural inegável. Contexto não pode mascarar o risco.';
      } else if (!hasMinimumMathEvidence) {
        modulationAllowed = false;
        reasonForBlocking = 'Evidência matemática mínima insuficiente. Faltam buffers patrimoniais ou operacionais para sustentar a narrativa de expansão saudável.';
      } else if (!hasCoherentContext) {
        modulationAllowed = false;
        reasonForBlocking = 'Ausência de coerência contextual robusta para justificar a flexibilização do risco matemático.';
      } else if (confidence.level === 'LOW') {
         modulationAllowed = false;
         reasonForBlocking = 'Confidence Score muito baixo para assumir o risco de modular a severidade original.';
      } else {
        modulationAllowed = true;
      }
    } else {
      // No modulation proposed
      modulationAllowed = false;
      reasonForBlocking = 'Não há proposta de modulação aplicável para este cenário.';
      reasonForModulation = 'Severidade matemática confirmada.';
    }

    if (modulationAllowed) {
      modulated.severity = proposedSeverity;
      modulated.name = proposedName;
      modulated.description = proposedDescription;
    }

    modulated.modulationLog = {
      originalSeverity,
      contextualSeverity: modulationAllowed ? proposedSeverity : originalSeverity,
      mathematicalEvidence: mathematicalEvidence.length > 0 ? mathematicalEvidence : ['Matemática deteriorada.'],
      contextualEvidence: contextualEvidence.length > 0 ? contextualEvidence : ['Sem contexto atenuante identificável.'],
      confidenceLevel: confidence.level,
      residualRisk: maturity.stressRecalibrationFactor >= 0.9 ? 'Risco estrutural eminente de insolvência.' : 'Risco moderado atrelado à conversão do giro.',
      modulationAllowed,
      reasonForModulation,
      reasonForBlocking: modulationAllowed ? undefined : reasonForBlocking
    };

    return modulated;
  });

  const explicabilityBlock = {
    realidadeMatematica: isMathInsolvent ? 'O balanço reflete deterioração severa e insolvência contábil inegável.' : `O balanço reflete as métricas frias naturais de um ${inventory.classification} impactando diretamente a composição de liquidez contábil.`,
    contextoOperacional: maturity.contextualNarrative,
    impactoSistemico: `O modelo de negócio em ${maturity.archetype} exige monitoramento da velocidade de conversão integral.`,
    riscoResidual: isMathInsolvent ? 'Risco crítico e iminente de colapso.' : (maturity.stressRecalibrationFactor >= 0.9 ? 'Risco estrutural eminente de insolvência severa.' : 'Risco concentrado na capacidade de tracionar vendas reais frente ao inventário.'),
    tendenciaEstrutural: maturity.stage === 'Early Stage' ? 'Formação direcional de ativo para sustentar market-share futuro.' : 'Necessidade imperativa de correção de eficiência de custos.',
    confiancaInferencia: confidence.explanation
  };

  return {
    scenarios,
    explicabilityBlock
  };
}
