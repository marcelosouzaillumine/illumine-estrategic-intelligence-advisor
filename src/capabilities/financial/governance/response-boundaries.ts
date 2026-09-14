import { validateDisclosure, DisclosureLevel } from '../../../governance/disclosure-rules';

/**
 * Define as fronteiras seguras de resposta para cada agente ou concierge
 */
export class ResponseBoundaryGuard {
  
  /**
   * Avalia uma resposta ou intenção antes de emiti-la ao usuário
   */
  static evaluateResponseIntent(intentTopic: string): { safe: boolean; fallbackMessage?: string } {
    const level = validateDisclosure(intentTopic);
    
    if (level === DisclosureLevel.PROPRIETARY) {
      return {
        safe: false,
        fallbackMessage: "A Illumine combina inteligência artificial, modelos analíticos e conhecimento executivo para apoiar decisões estratégicas. Os detalhes da arquitetura fazem parte da infraestrutura proprietária da plataforma."
      };
    }

    return { safe: true };
  }
}
