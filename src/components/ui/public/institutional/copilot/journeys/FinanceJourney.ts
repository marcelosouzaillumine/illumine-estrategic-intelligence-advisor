import { CopilotMessage, ConversationContext } from '../types';

export const financeJourney = {
  start(context: ConversationContext): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    const messages: CopilotMessage[] = [
      {
        id: `msg_fin_interp_${Date.now()}`,
        type: 'insight',
        sender: 'system',
        content: 'Como líder financeiro, a integridade do DFC, a liquidez e a preservação do EBITDA são os alicerces da sua atuação.',
        delay: 1200
      },
      {
        id: `msg_fin_resp_${Date.now()}`,
        type: 'bot',
        sender: 'bot',
        content: 'O maior desafio da área financeira moderna não é fechar o balanço, mas conectá-lo à operação em tempo real. A Illumine atua como uma Controladoria Avançada Inteligente, mapeando vazamentos invisíveis de rentabilidade e viabilizando simulações de capital de giro e estrutura de capital com precisão matemática.',
        delay: 1500
      },
      {
        id: `msg_fin_cta_${Date.now()}`,
        type: 'cta',
        sender: 'system',
        content: 'Nossa plataforma foi construída para dar segurança absoluta à Diretoria Financeira.',
        delay: 600,
        ctas: [
          { label: 'Iniciar Executive Assessment', href: '/assessment', primary: true },
          { label: 'Falar com Consultor', href: 'https://wa.me/554131514537?text=Ol%C3%A1%2C%20sou%20líder%20financeiro%20e%20gostaria%20de%20saber%20como%20a%20Illumine%20apoia%20a%20Controladoria.' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  },

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    return { nextMessages: [], newContext: context };
  }
};
