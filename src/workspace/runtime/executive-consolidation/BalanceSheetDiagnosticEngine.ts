export interface BalanceSheetData {
  ativoTotal: number;
  ativoCirculante: number;
  ativoNaoCirculante: number;
  passivoTotal: number;
  passivoCirculante: number;
  passivoNaoCirculante: number;
  patrimonioLiquido: number;
  caixaEquivalentes: number;
  estoques: number;
  clientes: number;
  fornecedores: number;
  obrigacoesTrabalhistas?: number;
  tributos?: number;
  imobilizado?: number;
}

export interface FleurietClassification {
  type: string;
  label: string;
  cgl: 'positive' | 'negative' | 'neutral';
  ncg: 'positive' | 'negative' | 'neutral';
  treasury: 'positive' | 'negative' | 'neutral';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface RedFlag {
  id: string;
  category: string;
  level: 'WARNING' | 'ATTENTION' | 'CRITICAL';
  message: string;
  metric: string;
  value: number;
}

export interface BalanceSheetDiagnostics {
  fleuriet: FleurietClassification;
  indicators: {
    assetLiquidity: number;
    operationalLiabilityRatio: number;
    patrimonialLeverage: number;
    permanentAssetCoverage: number;
    thirdPartyDependency: number;
  };
  risks: RedFlag[];
  executiveNarrative: {
    financialPosition: 'STRONG' | 'STABLE' | 'VULNERABLE' | 'CRITICAL';
    message: string;
  };
}

/**
 * @deprecated This engine is being replaced by the new Financial Intelligence Capability
 * Use `BalanceSheetIntelligenceUseCase` in `src/capabilities/financial/application/usecases/` instead.
 * Maintained for legacy compatibility during transition.
 */
export class BalanceSheetDiagnosticEngine {
  public static evaluate(data: BalanceSheetData): BalanceSheetDiagnostics {
    const {
      ativoTotal,
      ativoCirculante,
      ativoNaoCirculante,
      passivoTotal,
      passivoCirculante,
      passivoNaoCirculante,
      patrimonioLiquido,
      caixaEquivalentes,
      estoques,
      clientes,
      fornecedores,
      obrigacoesTrabalhistas = 0,
      tributos = 0,
      imobilizado = 0
    } = data;

    // 1. Fleuriet Model Classification
    const cglValue = ativoCirculante - passivoCirculante;
    
    // Simplification for Operational Assets and Liabilities if we don't have full breakdown
    const ativoOperacional = clientes + estoques;
    const passivoOperacional = fornecedores + obrigacoesTrabalhistas + tributos;
    const ncgValue = ativoOperacional - passivoOperacional;
    
    const treasuryValue = cglValue - ncgValue;

    const cgl = cglValue > 0 ? 'positive' : cglValue < 0 ? 'negative' : 'neutral';
    const ncg = ncgValue > 0 ? 'positive' : ncgValue < 0 ? 'negative' : 'neutral';
    const treasury = treasuryValue > 0 ? 'positive' : treasuryValue < 0 ? 'negative' : 'neutral';

    let fleuriet: FleurietClassification;

    if (cgl === 'positive' && ncg === 'negative' && treasury === 'positive') {
      fleuriet = { type: 'TYPE_1', label: 'Excelente', cgl, ncg, treasury, riskLevel: 'LOW', description: 'A empresa apresenta folga financeira, financiando sua operação com recursos próprios e mantendo saldo de tesouraria positivo.' };
    } else if (cgl === 'positive' && ncg === 'positive' && treasury === 'positive') {
      fleuriet = { type: 'TYPE_2', label: 'Sólida', cgl, ncg, treasury, riskLevel: 'LOW', description: 'A empresa financia sua operação com recursos próprios e mantém reserva financeira positiva.' };
    } else if (cgl === 'positive' && ncg === 'positive' && treasury === 'negative') {
      fleuriet = { type: 'TYPE_3', label: 'Insatisfatória', cgl, ncg, treasury, riskLevel: 'MEDIUM', description: 'O capital de giro próprio é insuficiente para financiar a operação, exigindo recursos de ciclo imediato.' };
    } else if (cgl === 'negative' && ncg === 'positive' && treasury === 'negative') {
      fleuriet = { type: 'TYPE_4', label: 'Alto Risco', cgl, ncg, treasury, riskLevel: 'HIGH', description: 'A empresa apresenta dependência estrutural de capital de terceiros de ciclo imediato para financiar a operação e o imobilizado.' };
    } else if (cgl === 'negative' && ncg === 'negative' && treasury === 'positive') {
      fleuriet = { type: 'TYPE_5', label: 'Estrutura Atípica', cgl, ncg, treasury, riskLevel: 'MEDIUM', description: 'A empresa financia o ativo permanente com recursos de ciclo imediato, mas a operação gera caixa suficiente para cobrir.' };
    } else {
      fleuriet = { type: 'TYPE_6', label: 'Crítica', cgl, ncg, treasury, riskLevel: 'CRITICAL', description: 'Descompasso financeiro severo, com falta de capital de giro e operação consumindo recursos sem cobertura.' };
    }

    // 2. Indicators Calculation
    const assetLiquidity = ativoTotal > 0 ? (caixaEquivalentes + clientes) / ativoTotal : 0;
    const operationalLiabilityRatio = passivoTotal > 0 ? passivoOperacional / passivoTotal : 0;
    const patrimonialLeverage = patrimonioLiquido > 0 ? ativoTotal / patrimonioLiquido : 0;
    const permanentAssetCoverage = ativoNaoCirculante > 0 ? patrimonioLiquido / ativoNaoCirculante : 0;
    const thirdPartyDependency = ativoTotal > 0 ? (passivoCirculante + passivoNaoCirculante) / ativoTotal : 0;

    // 3. Contextual Risk Thresholds
    const risks: RedFlag[] = [];
    
    // Inventory Risk
    const inventoryRatio = ativoTotal > 0 ? estoques / ativoTotal : 0;
    if (inventoryRatio > 0.5) {
      risks.push({ id: 'INV_CRITICAL', category: 'Asset Quality', level: 'CRITICAL', metric: 'Estoque / Ativo', value: inventoryRatio, message: 'Concentração crítica em estoques. Risco severo de obsolescência e iliquidez.' });
    } else if (inventoryRatio > 0.35) {
      risks.push({ id: 'INV_HIGH', category: 'Asset Quality', level: 'ATTENTION', metric: 'Estoque / Ativo', value: inventoryRatio, message: 'Elevada concentração em estoques. Acompanhar giro.' });
    } else if (inventoryRatio > 0.20) {
      risks.push({ id: 'INV_MODERATE', category: 'Asset Quality', level: 'WARNING', metric: 'Estoque / Ativo', value: inventoryRatio, message: 'Concentração moderada de estoques.' });
    }

    // Cash Excess Risk
    const cashRatio = ativoTotal > 0 ? caixaEquivalentes / ativoTotal : 0;
    if (cashRatio > 0.5) {
      risks.push({ id: 'CASH_EXCESS', category: 'Capital Allocation', level: 'WARNING', metric: 'Disponibilidades / Ativo', value: cashRatio, message: 'Capital líquido elevado. Avaliar retorno sobre capital e eficiência da alocação.' });
    } else if (cashRatio < 0.1) {
      risks.push({ id: 'CASH_LOW', category: 'Liquidity', level: 'ATTENTION', metric: 'Disponibilidades / Ativo', value: cashRatio, message: 'Baixa liquidez imediata. Acompanhar obrigações de ciclo imediato.' });
    }

    // Short-term Pressure
    const currentLiabilitiesRatio = passivoTotal > 0 ? passivoCirculante / passivoTotal : 0;
    const currentLiquidity = passivoCirculante > 0 ? ativoCirculante / passivoCirculante : 0;
    
    if (currentLiabilitiesRatio > 0.8 && currentLiquidity < 1.5) {
      risks.push({ id: 'ST_PRESSURE', category: 'Solvency', level: 'CRITICAL', metric: 'PC / Passivo Total', value: currentLiabilitiesRatio, message: 'Forte pressão de ciclo imediato associada a baixa margem de liquidez.' });
    }

    // 4. Executive Narrative
    let position: 'STRONG' | 'STABLE' | 'VULNERABLE' | 'CRITICAL' = 'STABLE';
    let message = '';
    const autonomy = ativoTotal > 0 ? patrimonioLiquido / ativoTotal : 0;

    if (fleuriet.riskLevel === 'LOW' && autonomy > 0.4) {
      position = 'STRONG';
      message = `A empresa apresenta elevada autonomia financeira (${(autonomy * 100).toFixed(1)}%), liquidez corrente de ${currentLiquidity.toFixed(2)}x e estrutura de capital robusta. `;
    } else if (fleuriet.riskLevel === 'CRITICAL' || autonomy < 0.1) {
      position = 'CRITICAL';
      message = `A empresa apresenta dependência crítica de capital de terceiros (${((1 - autonomy) * 100).toFixed(1)}%), pressionando a liquidez (${currentLiquidity.toFixed(2)}x). `;
    } else if (fleuriet.riskLevel === 'HIGH' || currentLiquidity < 1) {
      position = 'VULNERABLE';
      message = `A posição financeira requer atenção, com capital de giro líquido pressionado e dependência de terceiros de ${(thirdPartyDependency * 100).toFixed(1)}%. `;
    } else {
      position = 'STABLE';
      message = `A estrutura patrimonial está equilibrada, com autonomia de ${(autonomy * 100).toFixed(1)}% e liquidez adequada para as operações vigentes. `;
    }

    if (cashRatio > 0.3 || inventoryRatio > 0.3) {
      const parts = [];
      if (cashRatio > 0.3) parts.push('disponibilidades');
      if (inventoryRatio > 0.3) parts.push('estoques');
      message += `Principal atenção: O capital está concentrado em ${parts.join(' e ')}, sugerindo necessidade de avaliação da eficiência de utilização dos recursos.`;
    } else if (currentLiabilitiesRatio > 0.6) {
       message += `Principal atenção: O endividamento está concentrado no ciclo imediato, exigindo monitoramento ativo do ciclo financeiro.`;
    } else {
       message += `Não foram identificadas anomalias estruturais severas na composição patrimonial.`;
    }

    return {
      fleuriet,
      indicators: {
        assetLiquidity,
        operationalLiabilityRatio,
        patrimonialLeverage,
        permanentAssetCoverage,
        thirdPartyDependency
      },
      risks,
      executiveNarrative: {
        financialPosition: position,
        message
      }
    };
  }
}
