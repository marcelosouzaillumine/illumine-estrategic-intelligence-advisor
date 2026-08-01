import { CopilotMessage, ConversationContext } from '../types';

export const discoveryJourney = {
  start(context: ConversationContext): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    const messages: CopilotMessage[] = [
      {
        id: `msg_disc_resp_${Date.now()}`,
        type: 'bot',
        sender: 'bot',
        content: 'Ficamos felizes com o seu interesse. A Illumine é uma Executive Intelligence Platform desenhada para conectar dados corporativos, contexto decisório e raciocínio executivo. Nosso objetivo é reduzir a distância entre a informação e a tomada de decisão.',
        delay: 800
      },
      {
        id: `msg_disc_cta_${Date.now()}`,
        type: 'cta',
        sender: 'system',
        content: 'Selecione a área que deseja explorar primeiro:',
        delay: 600,
        ctas: [
          { label: 'Explorar Plataforma', href: '/plataforma', primary: true },
          { label: 'Ler o Manifesto', href: '/manifesto' },
          { label: 'Conhecer os Domínios', href: '/dominios' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  },

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    return { nextMessages: [], newContext: context };
  }
};
