import { TreasuryEarlyWarningOutput, TreasuryEarlyWarningAlert } from '../cash-intelligence/CashIntelligenceTypes';

export class TreasuryEarlyWarningEngine {
  public static evaluate(
    fco: number,
    runwayMonths: number,
    consecutiveNegativeFCOCycles: number,
    fundingRatio: number,
    isInventoryGrowthExceedingRevenue: boolean,
    isReceivablesGrowthExceedingRevenue: boolean
  ): TreasuryEarlyWarningOutput {
    const alerts: TreasuryEarlyWarningAlert[] = [];

    // 1. Runway Warning
    let runwayStatus: TreasuryEarlyWarningAlert['status'] = 'NORMAL';
    let runwayMsg = 'Prazo de sobrevivência de caixa confortável.';
    if (runwayMonths < 1.0) {
      runwayStatus = 'SURVIVABILITY_THREAT';
      runwayMsg = `Ameaça à continuidade: Runway extremamente crítico de ${runwayMonths.toFixed(1)} meses.`;
    } else if (runwayMonths < 3.0) {
      runwayStatus = 'CRITICAL';
      runwayMsg = `Risco crítico: Runway de ${runwayMonths.toFixed(1)} meses exige captação urgente.`;
    } else if (runwayMonths < 6.0) {
      runwayStatus = 'WARNING';
      runwayMsg = `Atenção: Runway de ${runwayMonths.toFixed(1)} meses sinaliza deterioração de liquidez.`;
    } else if (runwayMonths < 12.0) {
      runwayStatus = 'WATCH';
      runwayMsg = `Acompanhamento: Runway de ${runwayMonths.toFixed(1)} meses (meta: >12 meses).`;
    }
    alerts.push({
      metric: 'Runway',
      value: `${runwayMonths.toFixed(1)} meses`,
      status: runwayStatus,
      message: runwayMsg
    });

    // 2. FCO Warning
    let fcoStatus: TreasuryEarlyWarningAlert['status'] = 'NORMAL';
    let fcoMsg = 'Fluxo de Caixa Operacional saudável.';
    
    if (fco < 0) {
      if (runwayMonths < 3.0) {
        fcoStatus = 'CRITICAL';
        fcoMsg = 'FCO negativo sob runway crítico. Consumo severo de caixa com alto risco de insolvência de curto prazo.';
      } else if (consecutiveNegativeFCOCycles >= 4) {
        fcoStatus = 'CRITICAL';
        fcoMsg = `FCO negativo persistente por ${consecutiveNegativeFCOCycles} ciclos. Risco crítico de colapso estrutural.`;
      } else if (consecutiveNegativeFCOCycles === 3) {
        fcoStatus = 'WARNING';
        fcoMsg = `FCO negativo por 3 ciclos consecutivos. Alerta de fragilidade operacional.`;
      } else if (consecutiveNegativeFCOCycles === 2) {
        fcoStatus = 'ALERT';
        fcoMsg = `FCO negativo por 2 ciclos consecutivos. Necessidade de readequação de capital de giro.`;
      } else {
        fcoStatus = 'ALERT';
        fcoMsg = 'Fluxo de Caixa Operacional deficitário no período.';
      }
    }
    
    alerts.push({
      metric: 'FCO',
      value: `${consecutiveNegativeFCOCycles} ciclos`,
      status: fcoStatus,
      message: fcoMsg
    });

    // 3. Shareholder Dependency Warning (Funding Ratio)
    let fundingStatus: TreasuryEarlyWarningAlert['status'] = 'NORMAL';
    let fundingMsg = 'Estrutura de capital equilibrada sem dependência excessiva dos sócios.';
    const pct = Math.round(fundingRatio * 100);
    if (fundingRatio > 0.70) {
      fundingStatus = 'CRITICAL';
      fundingMsg = `Dependência Crítica: Sócios financiam ${pct}% da necessidade de capitalização institucional.`;
    } else if (fundingRatio > 0.50) {
      fundingStatus = 'WARNING';
      fundingMsg = `Dependência Alta: Sócios financiam ${pct}% da necessidade de capitalização institucional.`;
    } else if (fundingRatio > 0.30) {
      fundingStatus = 'WATCH';
      fundingMsg = `Acompanhamento: Sócios financiam ${pct}% da necessidade de capitalização institucional.`;
    }
    alerts.push({
      metric: 'Dependência dos Sócios',
      value: `${pct}%`,
      status: fundingStatus,
      message: fundingMsg
    });

    // 4. Estoques Warning
    if (isInventoryGrowthExceedingRevenue) {
      alerts.push({
        metric: 'Estoques',
        value: 'Crescimento > Receita',
        status: 'ALERT',
        message: 'Crescimento de Estoques superior ao crescimento de Receita (Aprisionamento de capital de giro).'
      });
    } else {
      alerts.push({
        metric: 'Estoques',
        value: 'Equilibrado',
        status: 'NORMAL',
        message: 'Giro de estoques compatível com a escala de receita.'
      });
    }

    // 5. Clientes Warning
    if (isReceivablesGrowthExceedingRevenue) {
      alerts.push({
        metric: 'Clientes',
        value: 'Crescimento > Receita',
        status: 'ALERT',
        message: 'Crescimento de Clientes superior ao crescimento de Receita (Dilação de prazo médio de recebimento).'
      });
    } else {
      alerts.push({
        metric: 'Clientes',
        value: 'Equilibrado',
        status: 'NORMAL',
        message: 'Prazo de recebimento de clientes compatível com a receita.'
      });
    }

    // Filter out NORMAL alerts for top threat listing
    const nonNormalAlerts = alerts.filter(a => a.status !== 'NORMAL');

    // Sort priority
    const statusPriority = {
      'SURVIVABILITY_THREAT': 5,
      'CRITICAL': 4,
      'WARNING': 3,
      'ALERT': 2,
      'WATCH': 1,
      'NORMAL': 0
    };

    const sortedAlerts = [...nonNormalAlerts].sort((a, b) => statusPriority[b.status] - statusPriority[a.status]);
    const topThreats = sortedAlerts.map(a => `${a.metric} (${a.status}): ${a.message}`);
    const hasSurvivabilityThreat = alerts.some(a => a.status === 'SURVIVABILITY_THREAT');

    const alertsWithBasis = alerts.map(a => ({
      ...a,
      fcoBasis: 'ADJUSTED_OPERATIONAL_BURN' as const
    }));

    return {
      alerts: alertsWithBasis,
      topThreats: topThreats.slice(0, 5),
      hasSurvivabilityThreat,
      fcoBasis: 'ADJUSTED_OPERATIONAL_BURN'
    };
  }
}
