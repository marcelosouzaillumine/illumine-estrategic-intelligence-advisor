import { executiveRuntime } from '../core/runtime/executive-intelligence-runtime';
import { ExecutiveEmptyStateResolver } from '../core/runtime/integrity/ExecutiveEmptyStateResolver';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`\n[Executive Integrity Audit FAILURE]: ${message}\n`);
    process.exit(1);
  }
}

console.log('Iniciando Executive Integrity Validation Audit...');

// Mock dataset 1: Completamente vazio (Empty Cycle)
const emptyDataset = {
  bpData: [],
  dreData: [],
  ledgerEntries: [],
  rawFinancialData: {
    recLiquida: null,
    bpSummary: {
      ativoTotal: null,
      passivoTotal: null
    }
  }
};

console.log('- Testando Empty Cycle Fail-Closed...');
const emptyReport = executiveRuntime.generateExecutiveReport(emptyDataset);
assert(!emptyReport.metrics.hasData, 'hasData deve ser false em ciclos vazios.');
assert(emptyReport.scores.composite === 0, 'Composite score deve ser 0 em ciclos vazios.');
assert(emptyReport.advisory.actionMatrix.length === 0, 'Matriz de ação deve estar vazia em ciclos vazios.');
assert(emptyReport.advisory.executiveSummary === ExecutiveEmptyStateResolver.EMPTY_CYCLE, 'Resumo executivo deve exibir mensagem de ciclo vazio.');
assert(emptyReport.causality.event === ExecutiveEmptyStateResolver.EMPTY_CYCLE, 'Causalidade deve exibir mensagem de ciclo vazio.');

// Mock dataset 2: Apenas 1 ano de histórico (Insufficient history)
const singleYearDataset = {
  bpData: [
    { conta: 'Ativo Total', val: 100000, entryType: 'Ativo', ordem: 1 },
    { conta: 'Passivo Total', val: 50000, entryType: 'Passivo', ordem: 2 },
    { conta: 'Patrimônio Líquido', val: 50000, entryType: 'Patrimônio Líquido', ordem: 3 }
  ],
  dreData: [
    { conta: 'Receita Líquida', val: 120000, ordem: 1 },
    { conta: 'Custos', val: -50000, ordem: 2 },
    { conta: 'EBITDA', val: 20000, ordem: 3 },
    { conta: 'Lucro Líquido do Exercício', val: 15000, ordem: 4 }
  ],
  ledgerEntries: [
    { id: '1', date: '2026-01-01', description: 'Lançamento Inicial', value: 1000 }
  ],
  historicalCyclesCount: 1, // < 2 cycles
  rawFinancialData: {
    segmentoEmpresa: 'Cosméticos',
    recLiquida: 120000,
    ebitda: 20000,
    lucroLiquido: 15000,
    bpSummary: {
      ativoTotal: 100000,
      passivoTotal: 50000,
      patrimonioLiquido: 50000
    }
  }
};

console.log('- Testando Scale Efficiency Fail-Closed...');
const singleYearReport = executiveRuntime.generateExecutiveReport(singleYearDataset);
assert(singleYearReport.metrics.scaleEfficiency.category === 'NOT_AVAILABLE', 'Categoria de scale deve ser NOT_AVAILABLE.');
assert(singleYearReport.metrics.scaleEfficiency.recGrowth === null, 'Crescimento de receita deve ser null.');
assert(singleYearReport.metrics.scaleEfficiency.description === ExecutiveEmptyStateResolver.INSUFFICIENT_HISTORY, 'A descrição deve apontar histórico insuficiente.');

// Mock dataset 3: Divisão por Zero (Valores nulos/zerados no divisor)
const divisionByZeroDataset = {
  bpData: [
    { conta: 'Ativo Total', val: 100000, entryType: 'Ativo', ordem: 1 },
    { conta: 'Passivo Total', val: 0, entryType: 'Passivo', ordem: 2 } // Passivo 0
  ],
  dreData: [
    { conta: 'Receita Líquida', val: 0, ordem: 1 }, // Receita 0
    { conta: 'EBITDA', val: 10000, ordem: 2 },
    { conta: 'Lucro Líquido do Exercício', val: 5000, ordem: 3 }
  ],
  ledgerEntries: [
    { id: '1', date: '2026-01-01', description: 'Lançamento', value: 1000 }
  ],
  historicalCyclesCount: 2,
  rawFinancialData: {
    segmentoEmpresa: 'Serviços',
    recLiquida: 0,
    ebitda: 10000,
    lucroLiquido: 5000,
    bpSummary: {
      ativoTotal: 100000,
      passivoTotal: 0,
      patrimonioLiquido: 100000
    }
  }
};

console.log('- Testando Divisão por Zero e Invalid Metric Guard...');
const divZeroReport = executiveRuntime.generateExecutiveReport(divisionByZeroDataset);

// Verificar que nenhuma eficiência ou KPI exibe Infinity ou NaN
divZeroReport.metrics.efficiencies.forEach(eff => {
  assert(!String(eff.value).includes('Infinity') && !String(eff.value).includes('NaN'), `Eficiência ${eff.name} possui valor inválido.`);
  assert(!String(eff.desc).includes('Infinity') && !String(eff.desc).includes('NaN'), `Descrição de ${eff.name} possui valor inválido.`);
});

divZeroReport.metrics.kpis.forEach(kpi => {
  assert(!String(kpi.val).includes('Infinity') && !String(kpi.val).includes('NaN'), `KPI ${kpi.name} possui valor inválido.`);
});

// Mock dataset 4: Relatório Válido para verificar Matriz de Ação e Benchmarks
const validDataset = {
  bpData: [
    { conta: 'Ativo Total', val: 100000, entryType: 'Ativo', ordem: 1 },
    { conta: 'Passivo Total', val: 40000, entryType: 'Passivo', ordem: 2 },
    { conta: 'Patrimônio Líquido', val: 60000, entryType: 'Patrimônio Líquido', ordem: 3 }
  ],
  dreData: [
    { conta: 'Receita Líquida', val: 150000, ordem: 1 },
    { conta: 'Custos', val: -60000, ordem: 2 },
    { conta: 'EBITDA', val: 30000, ordem: 3 },
    { conta: 'Lucro Líquido do Exercício', val: 10000, ordem: 4 }
  ],
  ledgerEntries: [
    { id: '1', date: '2026-01-01', description: 'Lançamento', value: 1000 }
  ],
  historicalCyclesCount: 2,
  rawFinancialData: {
    segmentoEmpresa: 'Cosméticos',
    recLiquida: 150000,
    ebitda: 30000,
    lucroLiquido: 10000,
    bpSummary: {
      ativoTotal: 100000,
      passivoTotal: 40000,
      patrimonioLiquido: 60000
    }
  }
};

console.log('- Testando Enriquecimento e Evidência Fiduciária da Matriz...');
const validReport = executiveRuntime.generateExecutiveReport(validDataset);
assert(validReport.advisory.actionMatrix.length > 0, 'Deve conter ações na matriz.');
validReport.advisory.actionMatrix.forEach(act => {
  assert(typeof act === 'object', 'Cada recomendação na matriz de ação deve ser um objeto.');
  assert(act.title && act.title.length > 0, 'Recomendação deve conter um título.');
  assert(act.category && act.category.length > 0, 'Recomendação deve conter uma categoria.');
  assert(act.fiduciaryEvidence && act.fiduciaryEvidence.length > 0, 'Recomendação deve conter evidência fiduciária associada.');
});

console.log('- Testando Mapeamento e Auditabilidade de Benchmarks...');
validReport.metrics.efficiencies.forEach(eff => {
  assert(eff.desc.includes('Benchmark:') || eff.desc.includes('Referência definida'), `A eficiência ${eff.name} deve possuir uma referência de benchmark explícita.`);
});

console.log('- Testando Hardening de Terminologia Executiva...');
assert(!validReport.advisory.executiveSummary.includes('Primeiro Ano Operacional'), 'Resumo executivo não deve conter o termo "Primeiro Ano Operacional".');
assert(!validReport.advisory.executiveSummary.includes('Asfixia iminente'), 'Resumo executivo não deve conter o termo "Asfixia iminente".');

console.log('SUCCESS: Executive Integrity Validation Audit COMPLETED. 100% compliant.');
process.exit(0);
