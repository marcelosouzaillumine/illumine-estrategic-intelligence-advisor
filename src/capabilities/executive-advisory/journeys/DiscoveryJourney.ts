import { TFunction } from 'i18next';
import { AdvisoryMessage, ConversationContext } from '../types/advisory.types';

export class DiscoveryJourney {
  constructor(private t: TFunction) {}

  start(context: ConversationContext): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    const messages: AdvisoryMessage[] = [
      {
        id: `msg_disc_resp_${Date.now()}`,
        type: 'bot',
        role: 'advisor',
        content: this.t('journeys.discovery.welcome'),
        delay: 800
      },
      {
        id: `msg_disc_cta_${Date.now()}`,
        type: 'cta',
        role: 'advisor',
        content: this.t('journeys.discovery.cta_prompt'),
        delay: 600,
        ctas: [
          { label: this.t('actions.explore', 'Explorar Plataforma'), href: '/platform', primary: true },
          { label: this.t('actions.manifesto', 'Ler o Manifesto'), href: '/manifesto' },
          { label: this.t('actions.domains', 'Conhecer os Domínios'), href: '/domains' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  }

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    return { nextMessages: [], newContext: context };
  }
}
