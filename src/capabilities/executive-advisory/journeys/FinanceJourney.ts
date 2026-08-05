import { TFunction } from 'i18next';
import { AdvisoryMessage, ConversationContext } from '../types/advisory.types';

export class FinanceJourney {
  constructor(private t: TFunction) {}

  start(context: ConversationContext): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    const messages: AdvisoryMessage[] = [
      {
        id: 'msg_finance_1',
        nodeId: 'finance_init',
        type: 'bot',
        role: 'advisor',
        content: this.t('journeys.finance.step1')
      },
      {
        id: 'msg_finance_2',
        nodeId: 'finance_cta',
        type: 'cta',
        role: 'advisor',
        content: this.t('journeys.finance.step2'),
        ctas: [
          { label: this.t('journeys.finance.cta_talk'), href: 'https://wa.me/554131514537', primary: true }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  }

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    return { nextMessages: [], newContext: context };
  }
}
