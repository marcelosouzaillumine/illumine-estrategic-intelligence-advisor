import { BalanceSheetInstitutionalContextInput } from '../../../../components/pages/balance-sheet/types';
import { BalanceSheetInstitutionalContextViewModel } from '../../../../components/pages/balance-sheet/view-models';

export class InstitutionalContextBuilder {
  public static build(
    context: BalanceSheetInstitutionalContextInput | undefined,
    maturidadeOverride: string | undefined
  ): BalanceSheetInstitutionalContextViewModel {
    if (!context) {
      return {
        segment: 'Geral',
        businessModel: 'Não Identificado',
        capitalIntensity: 'Não Identificada',
        stage: maturidadeOverride || 'Pendente'
      };
    }
    return {
      segment: context.segment || 'Geral',
      businessModel: context.businessModel || 'Não Identificado',
      capitalIntensity: context.capitalIntensity || 'Não Identificada',
      stage: maturidadeOverride || context.stage || 'Pendente'
    };
  }
}
