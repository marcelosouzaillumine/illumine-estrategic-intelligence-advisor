import { CashFlowCausalIntelligenceOutput, CashFlowCausalDriver } from '../cash-intelligence/CashIntelligenceTypes';
import { CashFlowRootCauseResolver } from './CashFlowRootCauseResolver';
import { CashFlowCausalSeverityEngine } from './CashFlowCausalSeverityEngine';

export class CashFlowCausalIntelligenceEngine {
  public static evaluate(
    fco: number,
    dreNetIncome: number,
    varClientes: number,
    varEstoque: number,
    varFornecedores: number,
    fcoBasis: 'OFFICIAL_FCO' | 'ADJUSTED_OPERATIONAL_BURN' = 'OFFICIAL_FCO'
  ): CashFlowCausalIntelligenceOutput {
    // Math: FCO = netIncome + varClientes + varEstoque + varFornecedores + varObrigações
    // So varObrigações = FCO - (netIncome + varClientes + varEstoque + varFornecedores)
    const varObrigações = fco - (dreNetIncome + varClientes + varEstoque + varFornecedores);

    const rawDrivers = [
      {
        rawName: 'Net Income',
        value: dreNetIncome,
        generatorName: 'Resultado Líquido Contábil (Lucro)',
        destroyerName: 'Estrutura Operacional Deficitária',
      },
      {
        rawName: 'Clientes',
        value: varClientes,
        generatorName: 'Redução de Clientes',
        destroyerName: 'Expansão de Clientes',
      },
      {
        rawName: 'Estoques',
        value: varEstoque,
        generatorName: 'Redução de Estoques',
        destroyerName: 'Formação de Estoque',
      },
      {
        rawName: 'Fornecedores',
        value: varFornecedores,
        generatorName: 'Financiamento via Fornecedores',
        destroyerName: 'Redução de Fornecedores',
      },
      {
        rawName: 'Obrigações',
        value: varObrigações,
        generatorName: 'Aumento de Outras Obrigações',
        destroyerName: 'Redução de Outras Obrigações',
      }
    ];

    const absFCO = Math.abs(fco) || 1;
    const drivers: CashFlowCausalDriver[] = rawDrivers.map(d => {
      const type = d.value >= 0 ? 'GENERATOR' as const : 'DESTROYER' as const;
      const name = type === 'GENERATOR' ? d.generatorName : d.destroyerName;
      const impactPercent = Math.round((Math.abs(d.value) / absFCO) * 1000) / 10;
      const category = CashFlowRootCauseResolver.resolve(d.rawName);
      const severity = CashFlowCausalSeverityEngine.classify(impactPercent);

      return {
        name,
        value: d.value,
        category,
        impactPercent,
        type,
        severity
      };
    });

    // Sort drivers by absolute impact percent in descending order
    const sortedDrivers = [...drivers].sort((a, b) => b.impactPercent - a.impactPercent);

    // Filter generators and destroyers
    const generators = sortedDrivers.filter(d => d.type === 'GENERATOR' && d.value !== 0);
    const destroyers = sortedDrivers.filter(d => d.type === 'DESTROYER' && d.value !== 0);

    // Build ranking
    const ranking = sortedDrivers.map((d, index) => ({
      rank: index + 1,
      name: d.name,
      value: d.value,
      impactPercent: d.impactPercent,
      category: d.category,
      severity: d.severity,
      type: d.type
    }));

    // Build narrative
    const isBurning = fco < 0;
    const question = isBurning ? 'O que está destruindo caixa?' : 'O que está gerando caixa?';
    
    let answer = '';
    const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedFco = formatter.format(fco);

    if (isBurning) {
      if (destroyers.length > 0) {
        const topD = destroyers.slice(0, 2).map(d => `${d.name} (${formatter.format(d.value)} / ${d.impactPercent}%)`);
        answer = `A destruição de caixa de ${formattedFco} decorre principalmente de: ${topD.join(' e ')}.`;
      } else {
        answer = `A operação consumiu ${formattedFco} de caixa, porém nenhum direcionador individual apresentou variação negativa isolada preponderante.`;
      }
    } else {
      if (generators.length > 0) {
        const topG = generators.slice(0, 2).map(g => `${g.name} (${formatter.format(g.value)} / ${g.impactPercent}%)`);
        answer = `A geração de caixa de ${formattedFco} é explicada principalmente por: ${topG.join(' e ')}.`;
      } else {
        answer = `A operação gerou ${formattedFco} de caixa de forma pulverizada entre as contas de capital de giro.`;
      }
    }

    const executiveOutput = {
      title: isBurning ? 'Principais Causas da Destruição de Caixa' : 'Principais Causas da Geração de Caixa',
      ranking
    };

    return {
      fcoBasis,
      fco,
      drivers,
      executiveOutput,
      boardOutput: {
        question,
        answer
      }
    };
  }
}
