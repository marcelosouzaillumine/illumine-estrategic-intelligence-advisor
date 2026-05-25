import { CrossEntityCausality, SystemicRisk, HoldingRoleAnalysis } from './advisoryTypes';

export class ConsolidatedNarrativeEngine {
  static generate(
    causalities: CrossEntityCausality[],
    risks: SystemicRisk[],
    roles: HoldingRoleAnalysis[]
  ): string {
    const paragraphs: string[] = [];

    // 1. Diagnóstico Estrutural Base
    const holdingPatrimonial = roles.find(r => r.inferredRole === 'HOLDING_PATRIMONIAL');
    const holdingOperacional = roles.find(r => r.inferredRole === 'HOLDING_OPERACIONAL');
    const subsidiariasOperacionais = roles.filter(r => r.inferredRole === 'SUBSIDIARIA_OPERACIONAL');

    if (holdingPatrimonial) {
      paragraphs.push(`A estrutura do grupo repousa sobre uma matriz estritamente patrimonial (${holdingPatrimonial.entityId}), dependente da eficiência de suas ${subsidiariasOperacionais.length} controladas operacionais ativas para originar fluxo de caixa livre.`);
    } else if (holdingOperacional) {
      paragraphs.push(`O grupo opera mediante uma matriz centralizadora ativa (${holdingOperacional.entityId}), que consolida resultados operacionais diretos somados à performance das subsidiárias adjacentes.`);
    } else {
      paragraphs.push(`A topologia consolidada demonstra um agregado de entidades operacionais interagindo intragrupo sem uma holding puramente patrimonial destacada no ecossistema.`);
    }

    // 2. Tradução de Causalidades
    const parasitism = causalities.find(c => c.causalityType === 'OPERATIONAL_PARASITISM');
    const subsidization = causalities.find(c => c.causalityType === 'ARTIFICIAL_SUBSIDIZATION');
    const artificialGrowth = causalities.find(c => c.causalityType === 'ARTIFICIAL_GROWTH');

    if (parasitism) {
      paragraphs.push(`Identifica-se asfixia da liquidez na base de geração de valor: a entidade ${parasitism.secondaryEntityId} atua como financiadora primária não remunerada da matriz ${parasitism.primaryEntityId}, incorrendo em esvaziamento do próprio capital de giro.`);
    }
    
    if (subsidization) {
      paragraphs.push(`O resultado consolidado maquia o déficit da entidade ${subsidization.primaryEntityId}, cuja continuidade depende materialmente da injeção de capital (mútuos estruturais) oriundos de ${subsidization.secondaryEntityId}.`);
    }

    if (artificialGrowth) {
      paragraphs.push(`Verifica-se distorção material no faturamento agragado da entidade ${artificialGrowth.primaryEntityId}. Sua top-line é inflada artificialmente pela concentração de vendas intragrupo para ${artificialGrowth.secondaryEntityId}, o que anula a criação de valor externo neste perímetro.`);
    }

    // 3. Tradução de Riscos Sistêmicos
    const criticalRisks = risks.filter(r => r.severity === 'CRITICAL' || r.severity === 'SEVERE');
    if (criticalRisks.length > 0) {
      paragraphs.push(`O risco consolidado do grupo decorre da concentração estrutural e interdependência de caixa: falhas em ${criticalRisks[0].triggerEntityId} tendem a acionar colapso sistêmico na liquidez de ${criticalRisks[0].impactedEntities.join(', ')} através do efeito dominó financeiro evidenciado nas demonstrações combinadas.`);
    }

    // 4. Síntese Saudável (caso não haja causalidades severas)
    if (causalities.length === 0 && risks.length === 0) {
      paragraphs.push(`Não foram detectados indícios de parasitismo financeiro ou subsidiação artificial intercompany. O resultado consolidado reflete fielmente a geração de caixa limpa pelas operações controladas sem transferências predatórias de risco.`);
    }

    return paragraphs.join(' ');
  }
}
