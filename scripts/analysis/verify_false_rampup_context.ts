import { BPSummary } from './src/lib/bpEngine';
import { calculateFinancialMetrics } from './src/lib/financial-engine';
import { calculateScores } from './src/lib/score-engine';
import { evaluateMasterCausality } from './src/lib/master-causal-engine';
import { inferBusinessIdentity } from './src/lib/business-identity-engine';
import { evaluateInventoryQuality } from './src/core/intelligence/inventory-quality-engine';
import { evaluateMaturityContext } from './src/core/intelligence/industry-maturity-context-engine';

function run() {
  console.log("====================================================================");
  console.log("SIMULAÇÃO DE STRESS ADVERSARIAL: FALSE RAMP-UP (EXPANSÃO DESTRUTIVA)");
  console.log("====================================================================\n");

  // Dados Mockados de uma "Falsa Expansão":
  // - Estoque elevado (narrativa de expansão)
  // - DRE Data Length > 1 (não é o primeiro ciclo)
  // - EBITDA destrutivo recorrente
  // - Patrimônio líquido deteriorando/negativo
  // - Dívida Bancária alta (capital externo oneroso cobrindo o buraco)

  const bpSummary = {
    ativoTotal: 1000000,
    ativoCirculante: 1800000, // Ativo alto
    ativoNaoCirculante: 700000,
    caixaEquivalentes: 20000, // Caixa quase zero
    estoques: 1500000, // Estoque gigante (narrativa de "estamos crescendo")
    clientes: 280000,
    passivoTotal: 3000000, // Maior que ativo
    passivoCirculante: 2200000, // Passivo de curto prazo estourado
    passivoNaoCirculante: 800000,
    fornecedores: 500000, // Fornecedores pressionados
    passivosFinanceiros: 1500000, // Dívida Bancária Gigantesca (Dependência extrema)
    patrimonioLiquido: -500000, // PL Negativo (Insolvência Técnica)
    capitalSocial: 1000000,
    lucrosPrejuizos: -200000,
    
    
    restritaConversibilidade: 0
  } as BPSummary;

  const ebitda = -300000; // Destruição recorrente de caixa operacional
  const lucroLiquido = -500000;
  const dreDataLength = 3; // Já não é o primeiro ciclo
  const salesGrowthRate = 0.30; // Receita crescendo, mascarando a destruição de valor
  const setor = 'Varejo / Comercial';

  const metrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido);
  const businessIdentity = inferBusinessIdentity(setor, dreDataLength);
  
  const causality = evaluateMasterCausality(bpSummary, metrics, businessIdentity, dreDataLength, salesGrowthRate);
  const scores = calculateScores(bpSummary, metrics, dreDataLength, -300000, businessIdentity, causality);

  console.log('MATEMÁTICA BRUTA (INPUTS)');
  console.log(`- Patrimônio Líquido: ${bpSummary.patrimonioLiquido}`);
  console.log(`- Estoques: ${bpSummary.estoques} (${((bpSummary.estoques/bpSummary.ativoCirculante)*100).toFixed(1)}% do AC)`);
  console.log(`- EBITDA: ${ebitda}`);
  console.log(`- Dívida Bancária: ${bpSummary.passivosFinanceiros} (Dependência: ${(metrics.dependenciaBancaria*100).toFixed(1)}%)`);
  console.log(`- Crescimento de Vendas (Proxy): ${(salesGrowthRate*100).toFixed(1)}%`);

  console.log('\n======================================');
  console.log('1. MODULATION LOG (TESTE DE BLOQUEIO)');
  console.log('======================================');
  
  let blockedCount = 0;
  causality.scenarios.forEach(s => {
    console.log(`\nCenário Identificado: ${s.id}`);
    if (s.modulationLog) {
      console.log(`  => Original Severity: ${s.modulationLog.originalSeverity}`);
      console.log(`  => Contextual Severity: ${s.modulationLog.contextualSeverity}`);
      console.log(`  => Modulação Permitida? ${s.modulationLog.modulationAllowed}`);
      if (!s.modulationLog.modulationAllowed) {
        blockedCount++;
        console.log(`  => [BLOCKED] Motivo do Bloqueio: ${s.modulationLog.reasonForBlocking}`);
      }
      console.log(`  => Evidência Matemática: ${s.modulationLog.mathematicalEvidence.join(' | ')}`);
      console.log(`  => Evidência Contextual: ${s.modulationLog.contextualEvidence.join(' | ')}`);
    }
  });

  console.log('\n======================================');
  console.log('2. EXPLICABILITY BLOCK (PARECER TÉCNICO)');
  console.log('======================================');
  console.log(`- Realidade Matemática: ${causality.explicabilityBlock?.realidadeMatematica}`);
  console.log(`- Risco Residual: ${causality.explicabilityBlock?.riscoResidual}`);
  console.log(`- Tendência Estrutural: ${causality.explicabilityBlock?.tendenciaEstrutural}`);

  console.log('\n======================================');
  console.log('3. SCORE PATRIMONIAL (MANTIDO CRÍTICO)');
  console.log('======================================');
  console.log(`- Resiliência Global: ${scores.resilienciaGlobal.toFixed(0)} / 100`);
  console.log(`- Score de Liquidez: ${scores.hsLiquidez.toFixed(0)} / 100`);

  if (blockedCount > 0 && scores.resilienciaGlobal < 40) {
    console.log('\n✅ TESTE ADVERSARIAL BEM SUCEDIDO: A engine recusou a modulação narrativa e manteve o rigor crítico da realidade matemática da insolvência.');
  } else {
    console.log('\n❌ TESTE FALHOU: A engine modulou o risco indevidamente.');
  }
}

run();
