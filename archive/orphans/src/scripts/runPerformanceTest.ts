import { orchestrateSynchronousIntelligence } from '../core/orchestration/executiveOrchestrationEngine';
import { buildHistoricalSeries } from '../core/adapters/historical-series-adapter';
import { BPSummary } from '../lib/bpEngine';

// Simula 10 anos de dados financeiros com muitos itens para testar performance
function generateLargeHistory() {
  const allEntries: any[] = [];
  
  for (let year = 2014; year <= 2023; year++) {
    // Balanço (vários nós)
    for (let i = 0; i < 50; i++) {
      allEntries.push({
        type: 'BP',
        year,
        category: `Ativo Circulante Detalhe ${i}`,
        value: Math.random() * 100000,
        tipo: 'Ativo'
      });
      allEntries.push({
        type: 'BP',
        year,
        category: `Passivo Detalhe ${i}`,
        value: Math.random() * 50000,
        tipo: 'Passivo'
      });
    }

    // DRE (vários nós)
    for (let i = 0; i < 50; i++) {
      allEntries.push({
        type: 'DRE',
        year,
        category: `Receita Específica ${i}`,
        value: Math.random() * 200000,
        tipo: 'Receitas'
      });
      allEntries.push({
        type: 'DRE',
        year,
        category: `Custo/Despesa ${i}`,
        value: Math.random() * 100000,
        tipo: 'Despesas'
      });
    }
  }

  return allEntries;
}

export function runPerformanceTests() {
  console.log('\n======================================');
  console.log('EXECUTIVE UI STABILITY VALIDATION - PERF TEST');
  console.log('======================================\n');

  const rawEntries = generateLargeHistory();
  console.log(`[PERF] Gerados ${rawEntries.length} nós de dados brutos (10 Anos)...`);

  const tStartAdapter = performance.now();
  const historical = buildHistoricalSeries('client-perf-test', rawEntries);
  const tEndAdapter = performance.now();
  console.log(`[PERF] Historical Adapter Execution Time: ${(tEndAdapter - tStartAdapter).toFixed(2)}ms`);

  const mockBPSummary: BPSummary = {
    ativoCirculante: 1000000,
    passivoCirculante: 500000,
    patrimonioLiquido: 800000,
    estoques: 200000,
    passivosFinanceiros: 300000,
    ativoTotal: 2000000,
    ativoNaoCirculante: 1000000,
    caixaEquivalentes: 100000,
    clientes: 150000,
    passivoTotal: 1200000,
    passivoNaoCirculante: 700000,
    fornecedores: 100000,
    capitalSocial: 500000,
    lucrosPrejuizos: 300000,
    altaConversibilidade: 0,
    mediaConversibilidade: 0,
    baixaConversibilidade: 0,
    restritaConversibilidade: 0,
    creditosSocios: 0,
    salariosEncargos: 0
  } as any; // Cast para any para ignorar a validação estrita de tipos no teste de performance

  console.log('\n[PERF] Iniciando Execução do Orchestrator com Payload Massivo...');
  
  const tStartOrchestrator = performance.now();
  const result = orchestrateSynchronousIntelligence(
    mockBPSummary,
    500000, // Ebitda mock
    200000, // Lucro
    'Tecnologia',
    10, // DRE length
    750000, // Prev PL
    undefined,
    undefined,
    historical.series
  );
  const tEndOrchestrator = performance.now();
  
  console.log(`[PERF] Total Orchestrator Sync Time: ${(tEndOrchestrator - tStartOrchestrator).toFixed(2)}ms`);
  
  console.log('\nRESULTADOS DA AUDITORIA TEMPORAL:');
  console.log(`- Advisory Gerado: ${result.causalInsights.diagnostico ? 'SIM' : 'NÃO'}`);
  console.log(`- Scores Gerados: ${result.scores ? 'SIM' : 'NÃO'}`);
  
  if (tEndOrchestrator - tStartOrchestrator > 200) {
    console.warn('\n⚠️  ALERTA DE PERFORMANCE: Execução Síncrona acima de 200ms!');
  } else {
    console.log('\n✅  TESTE DE PERFORMANCE PASSOU COM EXCELÊNCIA!');
  }
}

runPerformanceTests();
