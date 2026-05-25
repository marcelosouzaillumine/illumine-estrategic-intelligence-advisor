import fs from 'fs';
import path from 'path';
import { EntityGraph } from '../topology/EntityGraph';
import { ConsolidationEngine } from '../topology/ConsolidationEngine';
import { EntityGraphData } from '../topology/types';
import { runInstitutionalAnalysis } from '../runtime/RuntimeOrchestrator';

async function runAudit() {
  console.log('Iniciando Topology Audit...\n');

  // 1. Carregar Golden Dataset
  const jsonPath = path.resolve(process.cwd(), 'src/topology/golden-datasets/topology.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data: EntityGraphData = JSON.parse(rawData);
  
  const graph = new EntityGraph(data);

  // 2. Definir o escopo de consolidação (Todo o grupo)
  const scopeIds = ['holding-alpha', 'sub-bravo', 'sub-charlie'];
  const targetEntityId = 'holding-alpha';

  const result = ConsolidationEngine.consolidate(graph, scopeIds, targetEntityId);

  // --- Validações ---

  console.log('======================================');
  console.log('TOPOLOGY CONSOLIDATION TESTS');
  console.log('======================================\n');

  // Teste 1: Eliminação Cruzada e Mútuos
  // Apenas as reconciliadas devem ser eliminadas (op-1 = 500k)
  if (result.eliminatedAmount === 500000) {
    console.log('✅ Test 1 Passed: Receitas cruzadas e mútuos eliminados corretamente (500,000).');
  } else {
    console.error(`❌ Test 1 Failed: Valor eliminado esperado era 500000, recebeu ${result.eliminatedAmount}.`);
    process.exit(1);
  }

  // Teste 2: Identificação de Intercompany Não-Reconciliado
  if (result.unreconciledOperations.length === 1 && result.unreconciledOperations[0].operationId === 'op-2') {
    console.log('✅ Test 2 Passed: Mútuo não reconciliado detectado corretamente e retido para revisão.');
  } else {
    console.error('❌ Test 2 Failed: Falha ao detectar operações não reconciliadas.');
    process.exit(1);
  }

  // Teste 3: Degradação de Confidence Consolidada
  // 'sub-charlie' tem LOW, então a holding deve consolidar como LOW.
  if (result.confidence === 'LOW') {
    console.log('✅ Test 3 Passed: Confidence consolidada degradou corretamente devido à subsidiária (LOW).');
  } else {
    console.error(`❌ Test 3 Failed: Confidence esperada era LOW, recebeu ${result.confidence}.`);
    process.exit(1);
  }

  // Teste 4: Preservação de Lineage
  if (result.lineage.length === 3 && result.lineage.some(l => l.originEntityId === 'sub-charlie')) {
    console.log('✅ Test 4 Passed: Lineage multi-entidade preservado no output.');
  } else {
    console.error('❌ Test 4 Failed: Lineage incompleto ou mal formado.');
    process.exit(1);
  }

  // Teste 5: Runtime Single-Entity Backward Compatibility
  const singleInput = {
    rawFinancialData: {},
    historicalCyclesCount: 1,
    isMockData: true
    // Sem os campos opcionais de Topology
  };

  const runtimeOut = await runInstitutionalAnalysis(singleInput);
  if (runtimeOut && runtimeOut.status) {
    console.log('✅ Test 5 Passed: Runtime single-entity legada continua funcionando perfeitamente.');
  } else {
    console.error('❌ Test 5 Failed: Quebra na compatibilidade do Runtime legacy.');
    process.exit(1);
  }

  console.log('\nTopology Audit Finalizada. Status: COMPLIANT');
}

runAudit().catch(console.error);
