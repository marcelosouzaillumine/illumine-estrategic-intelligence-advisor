import { BPSummary } from '../../../lib/bpEngine';
import { SupplierDependencyProfile, StructuralCapitalSignal } from './types';

export class SupplierDependencyEngine {
  /**
   * Avalia a dependência operacional estrutural sobre fornecedores.
   * Identifica fragilidade de financiamento e alavancagem passiva excessiva.
   */
  static evaluate(bpSummary: BPSummary): SupplierDependencyProfile {
    if (!bpSummary) {
      return {
        supplierToTotalLiabilities: 0,
        supplierToEquity: 0,
        supplierToInventory: null,
        supplierLiquidityFragility: false,
        supplierOperationalFundingLevel: 'LOW',
        supplierDependencyScore: 0,
        activeSignals: [],
        explanation: 'Dados insuficientes para avaliação de dependência de fornecedores.'
      };
    }

    const {
      fornecedores,
      passivoTotal,
      patrimonioLiquido,
      estoques,
      ativoCirculante
    } = bpSummary;

    if (!fornecedores || fornecedores <= 0) {
      return {
        supplierToTotalLiabilities: 0,
        supplierToEquity: 0,
        supplierToInventory: estoques > 0 ? 0 : null,
        supplierLiquidityFragility: false,
        supplierOperationalFundingLevel: 'LOW',
        supplierDependencyScore: 0,
        activeSignals: [],
        explanation: 'Operação não apresenta financiamento detectável por fornecedores.'
      };
    }

    // Cálculos
    const supplierToTotalLiabilities = passivoTotal > 0 ? fornecedores / passivoTotal : 0;
    const supplierToEquity = patrimonioLiquido > 0 ? fornecedores / patrimonioLiquido : fornecedores > 0 ? 999 : 0;
    const supplierToInventory = estoques > 0 ? fornecedores / estoques : null;
    const supplierToCurrentAssetsRatio = ativoCirculante > 0 ? fornecedores / ativoCirculante : 0;

    const activeSignals: StructuralCapitalSignal[] = [];
    const explanations: string[] = [];

    // Avaliação de Thresholds
    if (supplierToTotalLiabilities > 0.50) {
      activeSignals.push('HIGH_SUPPLIER_DEPENDENCY');
      explanations.push(`Forte dependência de financiamento da cadeia produtiva (${(supplierToTotalLiabilities * 100).toFixed(1)}% do passivo total).`);
    }

    const supplierLiquidityFragility = supplierToCurrentAssetsRatio > 0.40;
    if (supplierLiquidityFragility) {
      activeSignals.push('SUPPLIER_OPERATIONAL_FRAGILITY');
      explanations.push(`Obrigações com fornecedores pressionam significativamente a liquidez corrente (${(supplierToCurrentAssetsRatio * 100).toFixed(1)}% do ativo circulante).`);
    }

    // Nível de Funding Operacional
    let fundingLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (supplierToTotalLiabilities > 0.65 || supplierToEquity > 1.2) {
      fundingLevel = 'CRITICAL';
    } else if (supplierToTotalLiabilities > 0.50 || supplierToEquity > 0.80) {
      fundingLevel = 'HIGH';
    } else if (supplierToTotalLiabilities > 0.30 || supplierToEquity > 0.40) {
      fundingLevel = 'MODERATE';
    }

    // Score de Dependência (0 - 100)
    let score = Math.min((supplierToTotalLiabilities * 100), 100);
    // Adiciona peso se estiver altamente alavancado sobre o PL
    if (supplierToEquity > 1) {
       score = Math.min(score + 20, 100);
    }

    let explanation = '';
    if (activeSignals.length === 0) {
      explanation = 'O passivo não indica exposição estrutural excessiva ao risco de funding por fornecedores.';
    } else {
      explanation = explanations.join(' ');
    }

    return {
      supplierToTotalLiabilities,
      supplierToEquity,
      supplierToInventory,
      supplierLiquidityFragility,
      supplierOperationalFundingLevel: fundingLevel,
      supplierDependencyScore: score,
      activeSignals,
      explanation
    };
  }
}
