import { EvidenceMetric } from '../../../components/ui/executive-evidence-grid';
import { EvidenceHeuristicsRegistry } from './EvidenceHeuristicsRegistry';
import { ExecutiveBusinessTerminologyTranslator } from './ExecutiveBusinessTerminologyRegistry';

export type Dimension = 'PRESERVATION' | 'LIQUIDITY' | 'WORKING_CAPITAL' | 'STRUCTURE' | 'QUALITY' | 'EFFICIENCY';

// Pilar 2 - Curadoria Constitucional de KPIs (Listas restritas)
const DIMENSION_METRICS: Record<Dimension, string[]> = {
  PRESERVATION: [
    'Margem de Segurança Patrimonial',
    'Índice de Sobrevivência',
    'Capacidade de Absorção de Perdas',
    'Autonomia Patrimonial',
    // Fallbacks that will be translated:
    'Equity Buffer', 'Survival Index', 'Loss Absorption Capacity'
  ],
  LIQUIDITY: [
    'Liquidez Corrente', 'Liquidez Seca', 'Liquidez Imediata', 'Saldo de Tesouraria',
    'Current Ratio', 'Quick Ratio', 'Cash Ratio'
  ],
  WORKING_CAPITAL: [
    'Capital de Giro Líquido', 'Necessidade de Capital de Giro', 'Ciclo Financeiro', 'Saldo de Tesouraria',
    'NCG', 'CGL', 'Working Capital'
  ],
  STRUCTURE: [
    'Endividamento Geral', 'Dependência de Capital de Terceiros', 'Autonomia Financeira', 'Capacidade de Financiamento',
    'Debt-to-Equity', 'Funding Capacity Ratio'
  ],
  QUALITY: [
    // Seção qualidade não explicitada no pilar 2 para ser modificada, mas mantida com mínimo necessário
    'Risco de Concentração dos Ativos', 'Ativo - Estoques %', 'Asset Concentration Risk'
  ],
  EFFICIENCY: [
    'Caixa Excedente', 'Capital Ocioso', 'Índice de Produtividade', 'Potencial de Reinvestimento',
    'Caixa Excedente Estimado'
  ]
};

export class EvidenceSelector {
  public static selectForDimension(dimension: Dimension, indicators: any[]): EvidenceMetric[] {
    if (!indicators || !Array.isArray(indicators)) return [];

    const allowedNames = DIMENSION_METRICS[dimension].map(n => n.toLowerCase());

    let selected = indicators.filter(ind => {
      const originalName = ind.label || ind.metricName || '';
      const translated = ExecutiveBusinessTerminologyTranslator.translate(originalName).toLowerCase();
      const rawLower = originalName.toLowerCase();
      
      // Bloqueio explícito dos banidos
      if (translated.includes('velocidade de erosão') || translated.includes('qualidade do patrimônio') ||
          rawLower.includes('capital erosion') || rawLower.includes('equity quality')) {
        return false;
      }
      
      return allowedNames.some(allowed => rawLower.includes(allowed) || allowed.includes(rawLower) || translated.includes(allowed));
    });

    // Pilar 3 - Relevância Contextual do Saldo de Tesouraria no Capital de Giro
    if (dimension === 'WORKING_CAPITAL') {
      const saldoInd = selected.find(i => ExecutiveBusinessTerminologyTranslator.translate(i.label || i.metricName || '').toLowerCase().includes('tesouraria'));
      const ncgInd = selected.find(i => ExecutiveBusinessTerminologyTranslator.translate(i.label || i.metricName || '').toLowerCase().includes('necessidade'));
      
      if (saldoInd && ncgInd) {
        const saldoVal = Number(saldoInd.value) || 0;
        const ncgVal = Number(ncgInd.value) || 0;
        
        // Regra heurística simples: materialidade ou tensão.
        // Se Saldo > NCG (excesso) ou NCG > Saldo * 2 (tensão grave) ou NCG negativo (oportunidade).
        const hasTensionOrExcess = saldoVal > ncgVal || ncgVal > (saldoVal * 2) || ncgVal < 0;
        
        if (!hasTensionOrExcess) {
          // Remover saldo de tesouraria se não for material para o contexto
          selected = selected.filter(i => i !== saldoInd);
        }
      } else if (saldoInd && !ncgInd) {
        // Se não tem NCG para comparar, ocultar tesouraria no contexto do giro (já aparece na Liquidez).
        selected = selected.filter(i => i !== saldoInd);
      }
    }

    // Pilar 2 - Limite rígido de 4 KPIs por dimensão
    const limited = selected.slice(0, 4);

    return limited.map(ind => {
      const originalName = ind.label || ind.metricName || 'Métrica';
      const translatedName = ExecutiveBusinessTerminologyTranslator.translate(originalName);

      let stringValue = String(ind.value);
      if (
        stringValue === 'NaN' || 
        stringValue === 'INSUFFICIENT_DATA' || 
        stringValue === 'null' || 
        stringValue === 'undefined' || 
        stringValue === 'N/A' || 
        ind.value === null || 
        ind.value === undefined
      ) {
        stringValue = 'Informação indisponível';
      }

      let numericValue = Number(ind.value);
      if (isNaN(numericValue)) numericValue = 0;

      const heuristics = EvidenceHeuristicsRegistry.getHeuristics(translatedName, numericValue, ind.format as any);

      let formattedValue = stringValue;
      if (stringValue !== 'Informação indisponível') {
        if (ind.format === 'percentage') {
          formattedValue = (numericValue * 100).toFixed(1) + '%';
        } else if (ind.format === 'multiplier') {
          formattedValue = numericValue.toFixed(2) + 'x';
        } else if (ind.format === 'decimal') {
          formattedValue = numericValue.toFixed(2);
        } else if (ind.format === 'currency') {
          formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(numericValue);
        }
      }

      return {
        name: translatedName,
        value: formattedValue,
        trend: heuristics.trend,
        healthyRange: heuristics.healthyRange,
        interpretation: heuristics.interpretation,
        confidence: heuristics.confidence
      };
    });
  }
}
