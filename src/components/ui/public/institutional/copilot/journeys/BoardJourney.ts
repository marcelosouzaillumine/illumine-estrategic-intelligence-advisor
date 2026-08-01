import { CopilotMessage, ConversationContext } from '../types';

export const boardJourney = {
  start(context: ConversationContext): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    const messages: CopilotMessage[] = [
      {
        id: `msg_board_interp_${Date.now()}`,
        type: 'insight',
        sender: 'system',
        content: 'Como Conselheiro, seu foco principal é Fiduciary Oversight, governança corporativa e mitigação de riscos sistêmicos.',
        delay: 1200
      },
      {
        id: `msg_board_resp_${Date.now()}`,
        type: 'bot',
        sender: 'bot',
        content: 'Conselhos eficientes não podem depender apenas das narrativas da diretoria executiva. A Illumine fornece uma camada de inteligência e auditoria contínua, garantindo que o Conselho tenha visibilidade absoluta e rastreabilidade sobre a origem dos dados, premissas de decisões e riscos estruturais antes que impactem o balanço.',
        delay: 1500
      },
      {
        id: `msg_board_cta_${Date.now()}`,
        type: 'cta',
        sender: 'system',
        content: 'A arquitetura de confiança da Illumine foi desenhada para a mais alta governança.',
        delay: 600,
        ctas: [
          { label: 'Agendar Executive Advisory', href: 'https://wa.me/554131514537?text=Ol%C3%A1%2C%20atou%20como%20Conselheiro%20e%20gostaria%20de%20saber%20como%20a%20Illumine%20apoia%20a%20Governan%C3%A7a.', primary: true },
          { label: 'Conhecer Governança', href: '/governanca' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  },

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    return { nextMessages: [], newContext: context };
  }
};
