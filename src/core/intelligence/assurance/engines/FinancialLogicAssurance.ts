import { ExecutiveIntelligenceOutput } from '../../contracts/ExecutiveIntelligenceOutput';
import { ValidationIssue } from '../contracts/IntelligenceAssuranceResult';
import { NormalizedBalanceSheet } from '../../../../capabilities/financial/domain/models/NormalizedBalanceSheet';

export class FinancialLogicAssurance {
  public static validate(output: ExecutiveIntelligenceOutput, data: NormalizedBalanceSheet): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Retrieve metrics calculated by financial engines
    const indicators = output.indicators;
    
    const currentLiquidityInd = indicators.find(i => i.id === 'current_liquidity');
    const cashRatioInd = indicators.find(i => i.id === 'cash_ratio');
    const inventoryRatioInd = indicators.find(i => i.id === 'inventory_ratio');
    const debtRatioInd = indicators.find(i => i.id === 'third_party_dependency');

    // 1. Liquidity Rule (Strategic Evaluation for High Liquidity)
    if (currentLiquidityInd && currentLiquidityInd.value > 5) {
      issues.push({
        id: 'CAPITAL_EFFICIENCY_REVIEW',
        category: 'Financial Logic',
        severity: 'INFO',
        message: 'A liquidez corrente superior a 5x requer avaliação estratégica da eficiência de alocação de capital.'
      });
    }

    // 2. Cash Allocation Rule
    if (cashRatioInd && cashRatioInd.value > 0.5) {
      issues.push({
        id: 'CASH_ALLOCATION_ATTENTION',
        category: 'Financial Logic',
        severity: 'WARNING',
        message: 'Alta concentração de recursos líquidos (>50% do ativo). Requer avaliação da eficiência de utilização do capital.'
      });
    }

    // 3. Inventory Rule
    if (inventoryRatioInd && inventoryRatioInd.value > 0.25) {
      issues.push({
        id: 'INVENTORY_MONITORING',
        category: 'Financial Logic',
        severity: 'WARNING',
        message: 'Concentração relevante em estoques (>25% do ativo). Avaliar giro, obsolescência e necessidade operacional.'
      });
    }

    // 4. Debt Ratio Rule (False Absence of Risk)
    if (debtRatioInd && debtRatioInd.value < 0.1) {
      issues.push({
        id: 'LOW_DEBT_CAUTION',
        category: 'Financial Logic',
        severity: 'INFO',
        message: 'Endividamento menor que 10%. Não interpretar automaticamente como ausência de risco; monitorar alavancagem para crescimento.'
      });
    }

    return issues;
  }
}
