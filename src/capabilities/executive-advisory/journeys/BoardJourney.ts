import { TFunction } from 'i18next';
import { AdvisoryMessage, ConversationContext } from '../types/advisory.types';

export class BoardJourney {
  constructor(private t: TFunction) {}

  start(context: ConversationContext): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    const messages: AdvisoryMessage[] = [
      {
        id: 'msg_board_1',
        nodeId: 'board_init',
        type: 'bot',
        role: 'advisor',
        content: this.t('journeys.board.step1'),
        options: [
          { id: 'board_risk', label: this.t('journeys.board.risk') },
          { id: 'board_strategy', label: this.t('journeys.board.strategy') },
          { id: 'board_succession', label: this.t('journeys.board.succession') }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  }

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    if (nodeId === 'board_init') {
      const messages: AdvisoryMessage[] = [
        {
          id: 'msg_board_2',
          type: 'bot',
          role: 'advisor',
          content: this.t('journeys.board.step2_risk')
        },
        {
          id: 'msg_board_3',
          type: 'cta',
          role: 'advisor',
          content: this.t('journeys.board.step3', 'Para entender como aplicamos inteligência a conselhos, sugerimos conhecer nossos domínios de atuação.'),
          ctas: [
            { label: this.t('actions.domains', 'Conhecer os Domínios'), href: '/domains', primary: true }
          ]
        }
      ];
      return { nextMessages: messages, newContext: context };
    }
    
    return { nextMessages: [], newContext: context };
  }
}
