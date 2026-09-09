import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { NaNEliminationGuard } from '../common/NaNEliminationGuard';

export class WorkingCapitalIntelligenceEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static analyze(summary: BPSummary, dreData: any[]): PatrimonialIndicator[] {
    const indicators: PatrimonialIndicator[] = [];
    const family = 'Working Capital Governance';

    // PMPC, PMRV, PMRE Calculation (Proxy via DRE se necessário)
    // Busca CMV e Receita na DRE
    const receitaNode = dreData.find(r => r.id === 'ROB' || (r.category || '').toLowerCase().includes('receita bruta') || (r.category || '').toLowerCase().includes('receita operacional bruta'));
    const cmvNode = dreData.find(r => r.id === 'CUSTOS' || (r.category || '').toLowerCase().includes('cmv') || (r.category || '').toLowerCase().includes('custo das mercadorias'));
    
    const receitaVal = receitaNode ? (receitaNode.computedValue || receitaNode.value || 0) : 0;
    const cmvVal = cmvNode ? Math.abs(cmvNode.computedValue || cmvNode.value || 0) : 0;

    let pmrv: string | number = 'Não calculável com os dados disponíveis';
    let pmre: string | number = 'Não calculável com os dados disponíveis';
    let pmpc: string | number = 'Não calculável com os dados disponíveis';

    if (receitaVal > 0) {
      pmrv = ((summary.clientes / receitaVal) * 360).toFixed(0);
    }
    if (cmvVal > 0) {
      pmre = ((summary.estoques / cmvVal) * 360).toFixed(0);
      pmpc = ((summary.fornecedores / cmvVal) * 360).toFixed(0); // Usando Nível 2 (CMV) como proxy, já que não temos 'Compras' isoladas.
    }

    const safePMRV = NaNEliminationGuard.sanitizeNumber(pmrv);
    const safePMRE = NaNEliminationGuard.sanitizeNumber(pmre);
    const safePMPC = NaNEliminationGuard.sanitizeNumber(pmpc);

    const isAllSafe = typeof safePMRV === 'number' && typeof safePMRE === 'number' && typeof safePMPC === 'number' 
                      && !Number.isNaN(safePMRV) && !Number.isNaN(safePMRE) && !Number.isNaN(safePMPC);

    indicators.push({
      metricName: 'Ciclo Financeiro (Estimativa Indireta)',
      value: isAllSafe 
        ? (safePMRV as number) + (safePMRE as number) - (safePMPC as number)
        : 'INSUFFICIENT_DATA',
      classification: 'NEUTRAL',
      severity: 'NEUTRAL',
      confidence: 70, // Proxy confidence
      evidence: { PMRV: pmrv, PMRE: pmre, PMPC: pmpc, proxySource: 'DRE' },
      rationale: 'Aproximação do ciclo financeiro utilizando Receita Bruta e CMV (Proxy Nível 2).',
      lineageHash: `WCIE-CF-${Date.now().toString(16)}`,
      family,
      format: 'decimal'
    });

    // Capital Allocation Intelligence
    const totalGiro = summary.clientes + summary.estoques + summary.caixaEquivalentes;
    if (totalGiro > 0) {
      const pctEstoque = summary.estoques / totalGiro;
      const pctClientes = summary.clientes / totalGiro;
      const pctCaixa = summary.caixaEquivalentes / totalGiro;

      indicators.push({
        metricName: 'Alocação de Capital de Giro',
        value: pctEstoque,
        classification: pctEstoque > 0.6 ? 'ATTENTION' : 'HEALTHY',
        severity: pctEstoque > 0.6 ? 'ATTENTION' : 'HEALTHY',
        confidence: 95,
        evidence: { Estoque: pctEstoque, Clientes: pctClientes, Caixa: pctCaixa },
        rationale: pctEstoque > 0.6 
          ? `${(pctEstoque * 100).toFixed(0)}% do capital de giro encontra-se aprisionado em ativos de baixa liquidez (estoques).`
          : 'Alocação do capital de giro encontra-se pulverizada.',
        lineageHash: `WCIE-ALLOC-${Date.now().toString(16)}`,
        family,
        format: 'percentage'
      });
    }

    return indicators;
  }
}
