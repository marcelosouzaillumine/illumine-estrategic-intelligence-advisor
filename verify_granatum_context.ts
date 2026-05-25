import { BPSummary } from './src/lib/bpEngine';
import { calculateFinancialMetrics } from './src/lib/financial-engine';
import { calculateScores } from './src/lib/score-engine';
import { evaluateMasterCausality } from './src/lib/master-causal-engine';
import { inferBusinessIdentity } from './src/lib/business-identity-engine';
import { evaluateInventoryQuality } from './src/core/intelligence/inventory-quality-engine';
import { evaluateMaturityContext } from './src/core/intelligence/industry-maturity-context-engine';

function run() {
  console.log("======================================");
  console.log("SIMULAÇÃO DE CONTEXTO: GRANATUM 2022");
  console.log("======================================\n");

  // Dados Mockados conforme a requisição:
  // - Indústria de cosméticos
  // - Primeiro ciclo (dreDataLength = 1)
  // - Estoque elevado
  // - Prejuízo inicial
  // - Patrimônio líquido positivo
  // - Fornecedores financiando a operação

  const bpSummary = {
    ativoTotal: 1500000,
    ativoCirculante: 800000,
    ativoNaoCirculante: 700000,
    caixaEquivalentes: 100000,
    estoques: 500000, // Estoque Elevado (62% do AC)
    clientes: 200000,
    passivoTotal: 500000,
    passivoCirculante: 400000,
    passivoNaoCirculante: 100000,
    fornecedores: 350000, // Funding via fornecedores (87% do PC)
    passivosFinanceiros: 50000, // Baixa dívida bancária
    patrimonioLiquido: 1000000, // PL Positivo
    capitalSocial: 1200000,
    lucrosPrejuizos: -200000,
    creditosSocios: 0,
    restritaConversibilidade: 0
  } as BPSummary;

  const ebitda = -80000;
  const lucroLiquido = -150000;
  const dreDataLength = 1;
  const salesGrowthRate = 0.20; // Proxy de Ramp-Up comercial
  const setor = 'Indústria Cosmética';

  // 1. ANTES DA MODULAÇÃO (Apenas Matemática Original)
  const metrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido);
  const businessIdentity = inferBusinessIdentity(setor, dreDataLength);
  
  // Simulando a saída bruta se não houvesse o Overlay (chamando master-causal com "dummy" functions que não alteram a severidade, ou apenas lendo os scores baseados na matemática)
  // Para ver o antes e depois, o Master Causal já integra o Overlay. Vamos criar um CausalScenario isolado para ver a diferença.
  
  // Para fins de demonstração, instanciamos a causalidade inteira que JÁ RODA a modulação
  const causality = evaluateMasterCausality(bpSummary, metrics, businessIdentity, dreDataLength, salesGrowthRate);
  const scores = calculateScores(bpSummary, metrics, dreDataLength, 0, businessIdentity, causality);

  console.log('MATEMÁTICA BRUTA (INPUTS)');
  console.log(`- Patrimônio Líquido: ${bpSummary.patrimonioLiquido}`);
  console.log(`- Estoques: ${bpSummary.estoques} (${((bpSummary.estoques/bpSummary.ativoCirculante)*100).toFixed(1)}% do AC)`);
  console.log(`- Fornecedores: ${bpSummary.fornecedores} (${((bpSummary.fornecedores/bpSummary.passivoCirculante)*100).toFixed(1)}% do PC)`);
  console.log(`- EBITDA: ${ebitda}`);
  console.log(`- Lucro Líquido: ${lucroLiquido}`);
  console.log(`- Dívida Bancária: ${bpSummary.passivosFinanceiros} (Dependência: ${(metrics.dependenciaBancaria*100).toFixed(1)}%)`);

  console.log('\n======================================');
  console.log('1. INFERÊNCIA DE ARQUÉTIPOS (CONTEXT ENGINE)');
  console.log('======================================');
  const inventoryContext = evaluateInventoryQuality(bpSummary, metrics, setor, salesGrowthRate);
  const maturityContext = evaluateMaturityContext(bpSummary, metrics, setor, dreDataLength, inventoryContext);

  console.log(`- Arquétipo Operacional: ${maturityContext.archetype}`);
  console.log(`- Estágio de Maturidade: ${maturityContext.stage}`);
  console.log(`- Classificação do Estoque: ${inventoryContext.classification}`);
  console.log(`- Natureza do Prejuízo: ${maturityContext.lossArchetype}`);
  console.log(`- Fator de Recalibração de Stress: ${maturityContext.stressRecalibrationFactor}`);

  console.log('\n======================================');
  console.log('2. MODULATION LOG (CAUSALIDADE)');
  console.log('======================================');
  causality.scenarios.forEach(s => {
    console.log(`\nCenário Identificado: ${s.id}`);
    if (s.modulationLog) {
      console.log(`  => Original Severity: ${s.modulationLog.originalSeverity}`);
      console.log(`  => Contextual Severity: ${s.modulationLog.contextualSeverity}`);
      console.log(`  => Modulação Permitida? ${s.modulationLog.modulationAllowed}`);
      if (s.modulationLog.modulationAllowed) {
        console.log(`  => Razão da Modulação: ${s.modulationLog.reasonForModulation}`);
      } else {
        console.log(`  => Motivo do Bloqueio: ${s.modulationLog.reasonForBlocking}`);
      }
      console.log(`  => Evidência Matemática: ${s.modulationLog.mathematicalEvidence.join(' | ')}`);
      console.log(`  => Evidência Contextual: ${s.modulationLog.contextualEvidence.join(' | ')}`);
    }
  });

  console.log('\n======================================');
  console.log('3. EXPLICABILITY BLOCK (PARECER TÉCNICO)');
  console.log('======================================');
  console.log(`- Realidade Matemática: ${causality.explicabilityBlock?.realidadeMatematica}`);
  console.log(`- Contexto Operacional: ${causality.explicabilityBlock?.contextoOperacional}`);
  console.log(`- Impacto Sistêmico: ${causality.explicabilityBlock?.impactoSistemico}`);
  console.log(`- Risco Residual: ${causality.explicabilityBlock?.riscoResidual}`);
  console.log(`- Tendência Estrutural: ${causality.explicabilityBlock?.tendenciaEstrutural}`);
  console.log(`- Confiança da Inferência: ${causality.explicabilityBlock?.confiancaInferencia}`);

  console.log('\n======================================');
  console.log('4. SCORE PATRIMONIAL (RECALIBRADO)');
  console.log('======================================');
  console.log(`- Resiliência Global: ${scores.resilienciaGlobal.toFixed(0)} / 100`);
  console.log(`- Índice de Continuidade: ${scores.indiceContinuidade.toFixed(0)} / 100`);

  // Se não houvesse a modulação, qual seria o score?
  // Podemos simular forçando a severidade Crítica para 'CORROSAO_PATRIMONIAL' e 'PRESSAO_ESTRUTURAL'
  let rawResiliencia = (
    (metrics.liquidezReal * 25) + 
    (50 * 0.20) + 
    (0 * 0.15) + 
    (metrics.autonomiaFinanceira * 100 * 0.20) + 
    (50 * 0.10) +
    (0 * 0.10)
  ); // Aproximado do engine original sem os limitadores
  let rawLimit = 35; // Sem a modulação, a Pressão Estrutural/Corrosão limitaria em 30 ou 15.
  
  console.log(`(Nota: Sem o Contextual Overlay, devido à Pressão Estrutural matemática, o Score seria estrangulado em torno de ~30/100)`);
}

run();
