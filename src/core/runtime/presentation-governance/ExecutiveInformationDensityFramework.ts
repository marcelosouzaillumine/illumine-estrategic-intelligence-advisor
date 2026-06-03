import { PresentationLayer } from './ExecutiveAudienceProfile';
import { PRESENTATION_POLICIES } from './ExecutivePresentationPolicyRegistry';

export class ExecutiveInformationDensityFramework {
  /**
   * Avalia o nível de visibilidade e retorna as seções visíveis e ocultas correspondentes.
   */
  public static evaluate(layer: PresentationLayer) {
    const visibleSections: string[] = [];
    const hiddenSections: string[] = [];

    PRESENTATION_POLICIES.forEach(policy => {
      if (policy.visibleIn.includes(layer)) {
        visibleSections.push(policy.section);
      } else {
        hiddenSections.push(policy.section);
      }
    });

    return {
      layer,
      visibleSections,
      hiddenSections
    };
  }

  /**
   * Verifica se uma seção específica deve ser visível na camada atual.
   */
  public static isSectionVisible(section: string, layer: PresentationLayer): boolean {
    const policy = PRESENTATION_POLICIES.find(p => p.section === section);
    if (!policy) return true; // Por padrão, exibe se não houver política explícita
    return policy.visibleIn.includes(layer);
  }
}
