import { TFunction } from 'i18next';
import { AdvisoryMessage, ConversationContext } from '../types/advisory.types';

export class OrganizationJourney {
  constructor(private t: TFunction) {}

  start(context: ConversationContext): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    const messages: AdvisoryMessage[] = [
      {
        id: 'msg_org_1',
        nodeId: 'org_init',
        type: 'bot',
        role: 'advisor',
        content: this.t('journeys.discovery.step1'),
        options: [
          { id: 'org_holding', label: this.t('journeys.discovery.holding') },
          { id: 'org_hospital', label: this.t('journeys.discovery.hospital') },
          { id: 'org_edu', label: this.t('journeys.discovery.edu') },
          { id: 'org_other', label: this.t('journeys.discovery.other') }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  }

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    if (nodeId === 'org_init') {
      const messages: AdvisoryMessage[] = [
        {
          id: 'msg_org_2',
          type: 'bot',
          role: 'advisor',
          content: this.t('journeys.discovery.step2_holding')
        },
        {
          id: 'msg_org_3',
          type: 'bot',
          role: 'advisor',
          content: this.t('journeys.discovery.step3')
        },
        {
          id: 'msg_org_4',
          type: 'cta',
          role: 'advisor',
          content: this.t('journeys.discovery.step4'),
          ctas: [
            { label: this.t('journeys.discovery.cta_diagnostic'), href: '/assessment', primary: true }
          ]
        }
      ];
      return { nextMessages: messages, newContext: context };
    }
    
    return { nextMessages: [], newContext: context };
  }
}
