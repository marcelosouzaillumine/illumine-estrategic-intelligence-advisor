import { ExecutiveProfilePortfolio } from '../executive-profile/portfolio-types';
import { OrganizationalStage } from '../executive-profile/portfolio-summary.service';
import { DomainRegistry } from '../diagnostics/core/domain-registry';

export class ExecutiveNarrativeService {
  /**
   * Transforms raw portfolio into an executive narrative dynamically,
   * relying on the OrganizationalStage (derived from the Index) rather than hardcoded domains.
   */
  public generateExecutiveReality(
    portfolio: ExecutiveProfilePortfolio,
    stage: OrganizationalStage
  ): string {
    const activeDomains = Object.values(portfolio.domains).filter(d => d && d.status === 'completed');
    const hasCore = activeDomains.length > 0;

    if (!hasCore) {
      return 'A organização encontra-se em estágio de mapeamento de capacidades fundamentais.';
    }

    if (stage === 'Strategic Scale') {
      return 'A organização alcançou maturidade sistêmica. A fundação de inteligência executiva está consolidada e operando em alta capacidade de alinhamento e precisão.';
    }

    if (stage === 'Enterprise Development') {
      return 'A organização demonstra evolução consistente com bases maduras, permitindo que a liderança foque na expansão e eficiência de novos domínios estratégicos.';
    }

    if (stage === 'Growth Transition') {
      return 'A organização passa por uma transição de crescimento, exigindo fortalecimento das capacidades adjacentes para suportar a expansão sem gargalos institucionais.';
    }

    if (stage === 'Foundation Building') {
      return 'A organização está estruturando sua base de inteligência. A prioridade é consolidar os domínios essenciais de governança e disciplina financeira para destravar escala sustentável.';
    }

    return 'A organização inicia sua jornada de diagnóstico executivo e consolidação de portfólio.';
  }

  /**
   * Suggests the topic for the strategic conversation based on the next recommended step.
   */
  public generateStrategicConversation(
    stage: OrganizationalStage,
    nextJourneyId: string
  ): string {
    const domainPrefix = nextJourneyId.replace('-intelligence', '');
    const registry = DomainRegistry.getInstance();
    const domainMeta = registry.getDomain(domainPrefix as any);
    const domainName = domainMeta ? domainMeta.name : domainPrefix;

    if (domainMeta?.isCoreFoundation) {
      return `O próximo passo crítico é consolidar a estrutura fundacional de ${domainName}, mitigando riscos organizacionais e estruturando a base da governança e previsibilidade.`;
    }

    return `O próximo desafio é escalar as capacidades de ${domainName} para alinhar a execução tática à visão estratégica global e potencializar os resultados de negócio.`;
  }
}
