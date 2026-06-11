import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export interface BoardConsistencyReport {
  originalText: string;
  scrubbedText: string;
  auditTrail: string[];
}

export class BoardConsistencyEngine {
  public static validate(
    text: string,
    indicators: PatrimonialIndicator[]
  ): BoardConsistencyReport {
    let scrubbedText = text;
    const auditTrail: string[] = [];

    // Extracted values
    const liqReal = indicators.find(i => i.metricName === 'Liquidez Real')?.value as number | 'INSUFFICIENT_DATA';
    const lossAbsorption = indicators.find(i => i.metricName === 'Loss Absorption Capacity')?.value as number | 'INSUFFICIENT_DATA';
    const fundingCapacity = indicators.find(i => i.metricName === 'Funding Capacity Ratio')?.classification || '';

    // Condition 1: Liquidez Real < 0.50
    if (typeof liqReal === 'number' && liqReal < 0.50) {
      const prohibitedLiquidez = ['confortável', 'robusta', 'sólida', 'excelente liquidez', 'liquidez confortável', 'liquidez adequada', 'liquidez robusta'];
      prohibitedLiquidez.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (regex.test(scrubbedText)) {
          scrubbedText = scrubbedText.replace(regex, 'restrita');
          auditTrail.push(`Override Executado: Substituição do termo '${word}' para 'restrita' devido a Liquidez Real crítica (< 0.50).`);
        }
      });
    }

    // Condition 2: Funding Capacity Limitada (Baixa ou Crítica)
    if (fundingCapacity === 'Baixa' || fundingCapacity === 'Crítica' || fundingCapacity === 'Moderada') {
      const prohibitedCapital = ['forte capacidade de expansão', 'estrutura preparada para crescimento', 'alto potencial de investimento', 'equilibrado', 'confortável', 'robusto', 'preparado para expansão'];
      prohibitedCapital.forEach(phrase => {
        const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
        if (regex.test(scrubbedText)) {
          scrubbedText = scrubbedText.replace(regex, 'capacidade de expansão condicionada à reestruturação de capital');
          auditTrail.push(`Override Executado: Remoção de otimismo expansivo devido a Funding Capacity não exceder 'Moderada'.`);
        }
      });
    }

    const survivalIndex = indicators.find(i => i.metricName === 'Survival Index')?.classification || '';

    // Condition 3: Loss Absorption < 2 anos OR Liquidez Real < 0.50 OR Survival Index = FRAGILE
    const isLossAbsorptionCritical = typeof lossAbsorption === 'number' && lossAbsorption < 2.0;
    const isLiquidityCritical = typeof liqReal === 'number' && liqReal < 0.50;
    const isSurvivalFragile = survivalIndex === 'FRAGILE' || survivalIndex === 'CRITICAL';

    if (isLossAbsorptionCritical || isLiquidityCritical || isSurvivalFragile) {
      const prohibitedPatrimonio = [
        'patrimônio resiliente', 
        'altamente resiliente', 
        'robusta margem de segurança', 
        'forte blindagem patrimonial', 
        'patrimônio sólido', 
        'forte capacidade de absorção',
        'sólido amortecedor'
      ];
      
      prohibitedPatrimonio.forEach(phrase => {
        const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
        if (regex.test(scrubbedText)) {
          scrubbedText = scrubbedText.replace(regex, 'vulnerável a choques');
          auditTrail.push(`Override Executado: Correção de falsa resiliência patrimonial devido a indicadores fiduciários críticos.`);
        }
      });

      // Special replacement rule required by the user
      const specificRegex = /o patrimônio líquido atua como um sólido amortecedor contra choques/gi;
      if (specificRegex.test(scrubbedText)) {
        scrubbedText = scrubbedText.replace(specificRegex, 'o patrimônio líquido ainda oferece capacidade de absorção patrimonial, porém essa proteção encontra-se parcialmente comprometida pela velocidade de consumo de capital observada.');
        auditTrail.push(`Override Executado: Substituição completa da narrativa de margem de segurança devido a indicadores fiduciários críticos.`);
      }
    }

    return {
      originalText: text,
      scrubbedText,
      auditTrail
    };
  }
}
