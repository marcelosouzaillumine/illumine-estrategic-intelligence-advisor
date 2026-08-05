import { TFunction } from 'i18next';
import { AdvisoryMessage, ConversationContext } from '../types/advisory.types';

export class AdvisorJourney {
  constructor(private t: TFunction) {}

  start(context: ConversationContext): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    const messages: AdvisoryMessage[] = [
      {
        id: `msg_adv_trans_rec_${Date.now()}`,
        type: 'insight',
        role: 'advisor',
        priority: 'reflection',
        content: 'Excelente. A expansão da inteligência corporativa frequentemente depende de conselheiros que compreendem profundamente o cenário do cliente.'
      },
      {
        id: `msg_adv_trans_ctx_${Date.now()}`,
        type: 'insight',
        role: 'advisor',
        priority: 'normal',
        content: 'Nossa metodologia foi desenhada exatamente para fornecer a base analítica que potencializa a atuação de advisors e consultorias na tomada de decisões complexas.'
      },
      {
        id: `msg_adv_q1_${Date.now()}`,
        nodeId: 'adv_step_intent',
        type: 'bot',
        role: 'advisor',
        priority: 'normal',
        content: 'Nesta etapa inicial de aproximação, como você prefere interagir com nosso ecossistema?',
        options: [
          { id: 'adv-model', label: 'Conhecer o modelo de parceria' },
          { id: 'adv-reqs', label: 'Entender requisitos de acesso' },
          { id: 'adv-talk', label: 'Explorar sinergias de imediato' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  }

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    if (nodeId === 'adv_step_intent') {
      
      const briefContent = optionId === 'adv-talk' 
        ? 'Identificamos uma intenção direta de alinhamento estratégico. Para advisors e consultores, estabelecer sinergias precoces acelera a validação de nossa metodologia no portfólio de clientes.'
        : 'A clareza sobre nosso modelo e requisitos é fundamental. O fortalecimento da sua atuação estratégica passa por compreender como metodologias consistentes podem elevar o nível das recomendações feitas aos boards.';

      const messages: AdvisoryMessage[] = [
        {
          id: `msg_adv_brief_${Date.now()}`,
          type: 'executive_brief',
          role: 'advisor',
          priority: 'executiveBrief',
          content: briefContent,
          ctas: [
            { label: 'Conhecer o Programa de Parcerias', href: '/advisor-network', primary: true },
            { label: 'Agendar Conversa com a Equipe', href: 'https://wa.me/554131514537', primary: false }
          ]
        },
        {
          id: `msg_adv_final_${Date.now()}`,
          type: 'cta',
          role: 'advisor',
          priority: 'normal',
          content: 'A partir deste alinhamento inicial, convido você a explorar nosso ecossistema de parcerias.\n\nVocê pode compreender nossa proposta de valor em detalhes ou, caso prefira agilizar nossa aproximação, solicitar diretamente uma conversa estratégica com nossa equipe de alianças.'
        }
      ];
      return { nextMessages: messages, newContext: context };
    }
    
    return { nextMessages: [], newContext: context };
  }
}
