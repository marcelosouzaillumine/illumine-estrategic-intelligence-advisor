export class DLPARecoveryHorizonResolver {
  public static resolve(patrimonialRecoveryHorizon: any, capitalRecoverability: any): {
    classification: string;
    formatted: string;
    narrative: string;
    badgeColorClass: string;
  } {
    const available = patrimonialRecoveryHorizon && patrimonialRecoveryHorizon.available !== false;
    const horizonClassification = patrimonialRecoveryHorizon?.classification;
    const recClassification = capitalRecoverability?.classification;

    if (!available || horizonClassification === 'Não Estimável' || recClassification === 'Não Estimável') {
      return {
        classification: 'Não Estimável',
        formatted: 'Sem histórico recorrente elegível',
        narrative: 'Não existe lucro recorrente elegível suficiente até o exercício analisado para estimar um horizonte confiável de recomposição patrimonial.',
        badgeColorClass: 'bg-destructive/10 text-destructive border-destructive/20'
      };
    }

    const classification = recClassification || 'Não Estimável';
    const formatted = patrimonialRecoveryHorizon?.formatted || 'Não Estimável';
    const narrative = capitalRecoverability?.narrative || '';

    const badgeColorClass = classification === 'Alta'
      ? 'bg-success/10 text-success border-success/20'
      : classification === 'Moderada'
        ? 'bg-primary/10 text-primary border-primary/20'
        : classification === 'Baixa'
          ? 'bg-warning/10 text-warning border-warning/20'
          : 'bg-destructive/10 text-destructive border-destructive/20';

    return {
      classification,
      formatted,
      narrative,
      badgeColorClass
    };
  }
}
