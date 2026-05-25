import { ConsolidatedAdvisoryOrchestrator } from '../core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator';
import { ConsolidatedFinancialOutput, ConsolidationEntity } from '../core/runtime/consolidated/types';

async function runAudit() {
  console.log('Iniciando Consolidated Advisory Audit...\n');

  // MOCK DATA 1: Operational Parasitism & Treasury Collapse Propagation
  const entities: ConsolidationEntity[] = [
    { id: 'holding', name: 'Holding Patrimonial', role: 'PARENT', ownershipPercentage: 100, consolidationMethod: 'FULL' },
    { id: 'sub-operacional', name: 'Filial Operacional', role: 'SUBSIDIARY', ownershipPercentage: 100, consolidationMethod: 'FULL' }
  ];

  const financialOutputParasitism: ConsolidatedFinancialOutput = {
    groupId: 'group-parasitism',
    fiscalYear: '2026',
    consolidatedBP: [],
    consolidatedDRE: [
      { accountId: 'd1', category: 'Receita Bruta', value: 0, consolidatedValue: 1000000, eliminatedValue: 0, provenance: [{ entityId: 'sub-operacional', accountId: 'd1', value: 1000000 }] },
      { accountId: 'd2', category: 'Custo', value: 0, consolidatedValue: -500000, eliminatedValue: 0, provenance: [{ entityId: 'sub-operacional', accountId: 'd2', value: -500000 }] }
    ],
    eliminations: [
      {
        eliminationId: 'mutuo-parasita',
        type: 'MUTUO',
        sourceEntityId: 'sub-operacional',
        targetEntityId: 'holding',
        sourceAccountCategory: 'Mútuo a Receber',
        targetAccountCategory: 'Mútuo a Pagar',
        amount: 800000,
        status: 'MATCHED',
        isMaterial: true,
        impactOnConsolidated: 800000,
        confidence: 'HIGH'
      }
    ],
    entityLineage: {},
    accountLineage: {},
    confidence: 'HIGH',
    violations: [],
    warnings: [],
    auditTrail: []
  };

  const report1 = ConsolidatedAdvisoryOrchestrator.run(financialOutputParasitism, entities);

  console.log('======================================');
  console.log('CONSOLIDATED ADVISORY TESTS');
  console.log('======================================\n');

  const hasParasitism = report1.causalities.some(c => c.causalityType === 'OPERATIONAL_PARASITISM');
  if (hasParasitism) {
    console.log('✅ Test 1 Passed: Operational Parasitism detectado corretamente (Holding drena Filial Operacional via Mútuo).');
  } else {
    console.error('❌ Test 1 Failed: Falha ao detectar Operational Parasitism.');
    process.exit(1);
  }

  const hasTreasuryContamination = report1.systemicRisks.some(r => r.riskType === 'TREASURY_CONTAMINATION');
  if (hasTreasuryContamination) {
    console.log('✅ Test 2 Passed: Treasury Collapse Propagation rastreado (risco de asfixia de liquidez na filial).');
  } else {
    console.error('❌ Test 2 Failed: Risco sistêmico de Treasury Contamination ignorado.');
    process.exit(1);
  }

  if (report1.finalConfidence === 'MEDIUM' || report1.finalConfidence === 'LOW') {
    console.log(`✅ Test 3 Passed: Confidence recalibrada pela causalidade estrutural para ${report1.finalConfidence}.`);
  } else {
    console.error('❌ Test 3 Failed: Confidence não foi degradada apesar do parasitismo.');
    process.exit(1);
  }

  if (report1.narrative.includes('asfixia da liquidez')) {
    console.log('✅ Test 4 Passed: Narrative Engine produziu texto executivo baseado em causalidade financeira verdadeira.');
  } else {
    console.error('❌ Test 4 Failed: Narrative Engine falhou em traduzir o parasitismo.');
    process.exit(1);
  }

  // MOCK DATA 2: Artificial Revenue Inflation
  const financialOutputInflation: ConsolidatedFinancialOutput = {
    ...financialOutputParasitism,
    groupId: 'group-inflation',
    consolidatedDRE: [
      { accountId: 'd1', category: 'Receita Bruta', value: 0, consolidatedValue: 1000000, eliminatedValue: 0, provenance: [{ entityId: 'sub-operacional', accountId: 'd1', value: 1000000 }] }
    ],
    eliminations: [
      {
        eliminationId: 'rev-inflat',
        type: 'RECEITA_DESPESA',
        sourceEntityId: 'sub-operacional',
        targetEntityId: 'holding',
        sourceAccountCategory: 'Receitas Intragrupo',
        targetAccountCategory: 'Despesas Intragrupo',
        amount: 450000, // 45% do faturamento
        status: 'MATCHED',
        isMaterial: true,
        impactOnConsolidated: 450000,
        confidence: 'HIGH'
      }
    ]
  };

  const report2 = ConsolidatedAdvisoryOrchestrator.run(financialOutputInflation, entities);
  const hasInflation = report2.causalities.some(c => c.causalityType === 'ARTIFICIAL_GROWTH');
  if (hasInflation) {
    console.log('✅ Test 5 Passed: Artificial Revenue Inflation detectada (>30% de receita intragrupo).');
  } else {
    console.error('❌ Test 5 Failed: Falha ao detectar crescimento artificial via receita cruzada.');
    process.exit(1);
  }

  // MOCK DATA 3: Bloqueio do Advisory se houver CRITICAL Violation herdada
  const financialOutputBlocked: ConsolidatedFinancialOutput = {
    ...financialOutputParasitism,
    groupId: 'group-blocked',
    violations: [
      { rule: 'CONSOLIDATED_EQUATION_MISMATCH', severity: 'CRITICAL', message: 'Equação quebrou', blocked: true }
    ]
  };

  const report3 = ConsolidatedAdvisoryOrchestrator.run(financialOutputBlocked, entities);
  if (report3.narrative.includes('BLOCKED')) {
    console.log('✅ Test 6 Passed: Advisory bloqueado imediatamente devido à violação crítica herdada (Active Governance).');
  } else {
    console.error('❌ Test 6 Failed: Advisory rodou em cima de dados com violation crítica.');
    process.exit(1);
  }

  console.log('\nConsolidated Advisory Audit Finalizada. Status: COMPLIANT');
}

runAudit().catch(console.error);
