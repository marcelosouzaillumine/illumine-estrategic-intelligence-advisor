import { StructuralCapitalSignal, ExecutiveAttentionMap } from './types';

export class ExecutiveAttentionPriorityMapper {
  /**
   * Mapeia os sinais estruturais ativos para níveis de atenção executiva (crítico e secundário).
   * Riscos vitais são classificados como críticos.
   * Se houver algum risco estrutural ativo grave, riscos de otimização genérica
   * são empurrados para "secundários".
   */
  static map(activeSignals: StructuralCapitalSignal[]): ExecutiveAttentionMap {
    const critical: string[] = [];
    const secondary: string[] = [];

    // Otimizações genéricas que sempre nascem aqui
    let optimizationFocus = ['Política de dividendos', 'Eficiência marginal de ROIC', 'Otimização de despesas (SG&A)'];

    // Mapeamento dos sinais
    if (activeSignals.includes('HIGH_INVENTORY_LIQUIDITY_PRESSURE') || activeSignals.includes('INVENTORY_CAPITAL_IMMOBILIZATION')) {
      critical.push('Concentração e imobilização excessiva em estoques');
    }

    if (activeSignals.includes('LOW_REAL_LIQUIDITY') || activeSignals.includes('CASH_COVERAGE_DEFICIT')) {
      critical.push('Baixa liquidez imediata e déficit de cobertura primária');
    }

    if (activeSignals.includes('HIGH_SUPPLIER_DEPENDENCY') || activeSignals.includes('SUPPLIER_OPERATIONAL_FRAGILITY')) {
      critical.push('Alavancagem passiva e dependência excessiva de fornecedores');
    }

    if (activeSignals.includes('HIGH_SHAREHOLDER_OPERATIONAL_INTERDEPENDENCE') || activeSignals.includes('SHAREHOLDER_PATRIMONIAL_CONCENTRATION')) {
      critical.push('Tensão patrimonial e conta corrente de sócios elevada');
    }

    // Se houver críticos, todas otimizações viram secundárias.
    // Se não houver críticos, focar no ROCE como primário (mas para a UI ExecutiveAttentionMap foca
    // em mostrar o que é urgência e o que pode esperar).
    // Aqui seguiremos a regra de que se não houver críticos, os secundários ficam vazios
    // ou apenas contêm as otimizações.
    
    optimizationFocus.forEach(opt => secondary.push(opt));

    return {
      critical,
      secondary
    };
  }
}
