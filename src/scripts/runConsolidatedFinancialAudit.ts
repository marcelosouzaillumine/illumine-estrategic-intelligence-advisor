import { logger } from "../services/logging/InstitutionalLogger";
import { ConsolidatedFinancialOrchestrator } from '../capabilities/financial/runtime/consolidated/ConsolidatedFinancialOrchestrator';
import { ConsolidatedFinancialInput } from '../capabilities/financial/runtime/consolidated/types';

async function runAudit() {
  logger.audit('Iniciando Consolidated Financial Audit', {});

  // MOCK DATA PARA TESTE
  const inputMulti: ConsolidatedFinancialInput = {
    groupId: 'group-alpha',
    fiscalYear: '2026',
    entities: [
      { id: 'holding', name: 'Holding SA', role: 'PARENT', ownershipPercentage: 100, consolidationMethod: 'FULL' },
      { id: 'sub-A', name: 'Sub A', role: 'SUBSIDIARY', ownershipPercentage: 100, consolidationMethod: 'FULL' }
    ],
    consolidationScope: ['holding', 'sub-A'],
    confidenceByEntity: { 'holding': 'HIGH', 'sub-A': 'MEDIUM' },
    topologySnapshot: {
      groupId: 'group-alpha',
      nodes: [],
      edges: [],
      intercompanyOperations: [
        {
          operationId: 'op-match',
          sourceEntityId: 'holding',
          targetEntityId: 'sub-A',
          type: 'RECEITA_DESPESA',
          amount: 20000,
          sourceAccountCategory: 'Receitas Intragrupo',
          targetAccountCategory: 'Custos Intragrupo',
          reconciled: true
        },
        {
          operationId: 'op-unmatch-material',
          sourceEntityId: 'sub-A',
          targetEntityId: 'holding',
          type: 'MUTUO',
          amount: 100000, // Acima de 50k
          sourceAccountCategory: 'Mútuo a Receber',
          targetAccountCategory: 'Mútuo a Pagar',
          reconciled: false
        }
      ]
    },
    bpByEntity: {
      'holding': [
        { accountId: 'a1', category: 'Ativo Circulante', value: 100000, type: 'ativo' },
        { accountId: 'a2', category: 'Passivo Circulante', value: 30000, type: 'passivo' },
        { accountId: 'a3', category: 'Patrimônio Líquido', value: 70000, type: 'pl' },
        { accountId: 'a4', category: 'Mútuo a Pagar', value: 0, type: 'passivo' } // Faltou lançar
      ],
      'sub-A': [
        { accountId: 'b1', category: 'Ativo Circulante', value: 150000, type: 'ativo' },
        { accountId: 'b2', category: 'Mútuo a Receber', value: 100000, type: 'ativo' }, // Registrou mútuo
        { accountId: 'b3', category: 'Passivo Circulante', value: 50000, type: 'passivo' },
        { accountId: 'b4', category: 'Patrimônio Líquido', value: 200000, type: 'pl' }
      ]
    },
    dreByEntity: {
      'holding': [
        { accountId: 'd1', category: 'Receita Bruta', value: 500000 },
        { accountId: 'd2', category: 'Receitas Intragrupo', value: 20000 }
      ],
      'sub-A': [
        { accountId: 'd3', category: 'Custos Intragrupo', value: 20000 },
        { accountId: 'd4', category: 'Receita Bruta', value: 300000 }
      ]
    },
    sourceMetadata: {}
  };

  const outputMulti = ConsolidatedFinancialOrchestrator.run(inputMulti);

  console.log('======================================');
  
  console.log('======================================\n');

  // Teste 1: Degradação de Confidence
  if (outputMulti.confidence === 'LOW') {
    console.log('✅ Test 1 Passed: Confidence degradada para LOW devido ao mútuo UNMATCHED material.');
  } else {
    console.error(`❌ Test 1 Failed: Confidence esperada LOW, recebido ${outputMulti.confidence}`);
    process.exit(1);
  }

  // Teste 2: Bloqueio de Execução (Validated Consolidation)
  if (outputMulti.consolidatedBP.length === 0 && outputMulti.consolidatedDRE.length === 0) {
    console.log('✅ Test 2 Passed: Emissão do consolidado bloqueada devido à violation CRITICAL.');
  } else {
    console.error('❌ Test 2 Failed: Emissão não foi bloqueada.');
    process.exit(1);
  }

  // Teste 3: Single Entity & Elimination (Sem o mútuo problemático)
  const inputSingle = JSON.parse(JSON.stringify(inputMulti));
  inputSingle.topologySnapshot.intercompanyOperations.pop(); // Tira o mútuo unmatched
  inputSingle.bpByEntity['sub-A'] = [
    { accountId: 'b1', category: 'Ativo Circulante', value: 250000, type: 'ativo' }, // Sem mútuo a receber
    { accountId: 'b3', category: 'Passivo Circulante', value: 50000, type: 'passivo' },
    { accountId: 'b4', category: 'Patrimônio Líquido', value: 200000, type: 'pl' }
  ];

  const outputSingle = ConsolidatedFinancialOrchestrator.run(inputSingle);
  
  // Teste de Lineage e Soma de Receita
  const receitaConsolidada = outputSingle.consolidatedDRE.find(d => d.category === 'Receita Bruta');
  const receitaIntragrupo = outputSingle.consolidatedDRE.find(d => d.category === 'Receitas Intragrupo');
  const custoIntragrupo = outputSingle.consolidatedDRE.find(d => d.category === 'Custos Intragrupo');

  if (receitaConsolidada && receitaConsolidada.consolidatedValue === 800000) {
    logger.audit('Test 3 Passed', {});
  } else {
    logger.error('Test 3 Failed: Soma DRE incorreta', new Error('Consolidated Calculation Error'));
    process.exit(1);
  }

  if (receitaIntragrupo && receitaIntragrupo.consolidatedValue === 0 && custoIntragrupo && custoIntragrupo.consolidatedValue === 0) {
    console.log('✅ Test 4 Passed: Receitas e Custos Intragrupo eliminados corretamente (valor líquido 0).');
  } else {
    logger.error('Test 4 Failed: Eliminação DRE falhou', new Error('Consolidated Elimination Error'));
    process.exit(1);
  }

  if (receitaConsolidada && receitaConsolidada.provenance.length === 2) {
    console.log('✅ Test 5 Passed: Lineage de contas detalhado preservado (Receita originou-se de holding e sub-A).');
  } else {
    console.error('❌ Test 5 Failed: Lineage de contas quebrado.');
    process.exit(1);
  }

  // Teste 6: Entidade sem BP ou DRE
  const inputMissing = JSON.parse(JSON.stringify(inputSingle));
  inputMissing.dreByEntity = { 'holding': inputMissing.dreByEntity['holding'] }; // Remove DRE da sub-A
  const outputMissing = ConsolidatedFinancialOrchestrator.run(inputMissing);
  
  if (outputMissing.confidence === 'LOW' && outputMissing.warnings.some(w => w.includes('Entidades sem DRE: sub-A'))) {
    logger.audit('Test 6 Passed', {});
  } else {
    logger.error('Test 6 Failed', new Error('Consolidated Degradation Error'));
    process.exit(1);
  }

  logger.audit('Consolidated Financial Audit Finalizada', {});
}

runAudit().catch(console.error);
