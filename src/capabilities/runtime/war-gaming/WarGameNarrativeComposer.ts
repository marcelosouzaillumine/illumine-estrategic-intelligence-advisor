// src/core/runtime/war-gaming/WarGameNarrativeComposer.ts

import { InstitutionalCollapseConstraintEngine } from './InstitutionalCollapseConstraintEngine';
import { CrisisPropagationNode, InstitutionalSurvivalThesis, TreasurySurvivalProfile } from './war-gaming-types';

export class WarGameNarrativeComposer {
  public static composePropagationNarrative(nodes: CrisisPropagationNode[]): string {
    if (nodes.length === 0) return 'Nenhuma cadeia de propagação ativada.';

    const criticalNodes = nodes.filter(n => n.severity === 'CRÍTICA' || n.severity === 'RUPTURA');
    
    let narrative = `Observou-se propagação estrutural abrangendo ${nodes.length} vetores interconectados. `;
    if (criticalNodes.length > 0) {
      narrative += `Deterioração severa propagou-se primariamente através de: ${criticalNodes.map(n => n.variable).join(', ')}. `;
    }

    return InstitutionalCollapseConstraintEngine.sanitizeNarrative(narrative.trim());
  }

  public static composeTreasuryNarrative(profile: TreasurySurvivalProfile): string {
    let narrative = '';

    if (profile.exhaustionPointReached) {
      narrative = `Exaustão de liquidez mapeada em ${profile.availableRunwayMonths} meses sob as premissas da crise simulada. O dreno de caixa atinge aceleração insustentável sem intervenção estrutural externa.`;
    } else {
      narrative = `Liquidez preservada dentro do horizonte de simulação. Runway operacional testado e resiliente até ${profile.availableRunwayMonths} meses sob estresse.`;
    }

    if (profile.criticalCovenantBreached) {
      narrative += ' Rompimento de covenants projetado devido à deterioração das margens e redução de EBITDA.';
    }

    return InstitutionalCollapseConstraintEngine.sanitizeNarrative(narrative.trim());
  }

  public static composeThesisNarrative(thesis: InstitutionalSurvivalThesis): string {
    let narrative = `A resiliência institucional marcou um score de ${thesis.resilienceScore}/100 sob estresse máximo simulado. `;
    
    if (thesis.sustainabilityStatus === 'INSUSTENTÁVEL' || thesis.sustainabilityStatus === 'DETERIORADA') {
      narrative += `O modelo operacional apresentou incapacidade estrutural de absorver os choques, resultando em pressão fiduciária ${thesis.fiduciaryPressureLevel}.`;
    } else {
      narrative += `O modelo operacional evidenciou capacidade de retenção de caixa suficiente para mitigar os choques primários, com pressão fiduciária ${thesis.fiduciaryPressureLevel}.`;
    }

    return InstitutionalCollapseConstraintEngine.sanitizeNarrative(narrative);
  }
}
