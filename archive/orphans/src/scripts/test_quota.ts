import { buildBPHierarchy } from '../lib/bpEngine';
import { calculateFinancialMetrics } from '../lib/financial-engine';
import { InstitutionalContextEngine } from '../core/runtime/institutional-context/InstitutionalContextEngine';
import { ExecutiveActionMatrixEngine } from '../core/runtime/integrity/ExecutiveActionMatrixEngine';

const cycles = [
  {
    year: 2023,
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 100 },
      { code: '1.1.2', accountName: 'Estoque', value: 100 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 100 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  },
  {
    year: 2024,
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 90 },
      { code: '1.1.2', accountName: 'Estoque', value: 120 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 120 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  },
  {
    year: 2025,
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 50 },
      { code: '1.1.2', accountName: 'Estoque', value: 150 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 200 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  }
];

const payload = {
  isMockData: false,
  historicalCyclesCount: 3,
  runtimeHistory: cycles,
  rawFinancialData: {
    segmentoEmpresa: 'Varejo',
    bpSummary: {
      ativoTotal: 1000,
      ativoCirculante: 500,
      passivoCirculante: 400,
      passivoTotal: 600,
      patrimonioLiquido: 400,
      caixaEquivalentes: 50,
      estoques: 150
    }
  },
  bpData: [
    { code: '1.1.1', accountName: 'Caixa', value: 50 },
    { code: '1.1.2', accountName: 'Estoque', value: 150 }
  ]
};

const hierarchy = buildBPHierarchy(payload.bpData);
const bpSummary = hierarchy.summary;
const metrics = calculateFinancialMetrics(bpSummary as any, 0, 0, 'Varejo');
const institutionalContext = InstitutionalContextEngine.resolve(payload);

const originalActions = [
  'Preservação e reforço imediato de liquidez estrutural.',
  'Reforço patrimonial por meio de capitalização proporcional.',
  'Mitigação e redução da dependência de fornecedores operacionais.',
  'Otimização do ciclo financeiro e eficiência de capital de giro.',
  'Garantia de margem de contribuição saudável',
  'Aceleração comercial',
  'Otimização de capital de giro',
  'Crescimento operacional sem reforço proporcional de capital próprio.'
];

console.log('Building matrix...');
const matrix = ExecutiveActionMatrixEngine.buildMatrix(originalActions, metrics, bpSummary, {}, 'SENSÍVEL');
console.log('Matrix returned:', matrix);

for (const act of originalActions) {
  const item = (ExecutiveActionMatrixEngine as any).mapAction(act, 0, metrics, bpSummary, {}, 'SENSÍVEL');
  console.log(`Action: "${act}" -> fiduciaryEvidence: "${item?.fiduciaryEvidence}"`);
}
