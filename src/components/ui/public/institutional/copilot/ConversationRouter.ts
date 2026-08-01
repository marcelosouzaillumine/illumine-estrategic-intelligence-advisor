import { CopilotMessage, ConversationContext, JourneyType } from './types';
import { executiveJourney } from './journeys/ExecutiveJourney';
import { advisorJourney } from './journeys/AdvisorJourney';
import { boardJourney } from './journeys/BoardJourney';
import { financeJourney } from './journeys/FinanceJourney';
import { discoveryJourney } from './journeys/DiscoveryJourney';
import { organizationJourney } from './journeys/OrganizationJourney';

class ConversationRouter {
  
  getInitialMessages(): CopilotMessage[] {
    return [
      {
        id: 'msg_welcome_1',
        nodeId: 'welcome',
        type: 'bot',
        sender: 'bot',
        content: 'Bem-vindo à Illumine. Antes de iniciarmos, gostaria de compreender seu contexto para direcioná-lo à experiência mais adequada.',
        delay: 600,
        options: [
          { id: 'EXECUTIVE', label: 'Lidero uma organização' },
          { id: 'ADVISOR', label: 'Apoio organizações como consultor ou advisor' },
          { id: 'BOARD', label: 'Atuo em conselhos de administração' },
          { id: 'FINANCE', label: 'Lidero a área financeira' },
          { id: 'ORGANIZATION', label: 'Represento uma organização / instituição' },
          { id: 'DISCOVERY', label: 'Estou conhecendo a Illumine' }
        ]
      }
    ];
  }

  handleInteraction(
    context: ConversationContext, 
    nodeId: string, 
    optionId: string, 
    value?: any
  ): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    
    let newContext = { ...context };
    
    // 1. Initial Routing
    if (nodeId === 'welcome') {
      newContext.profile = optionId as JourneyType;
      // Boost initial confidence based on direct selection
      newContext.confidence += 0.5; 
      
      switch (optionId) {
        case 'EXECUTIVE':
          return executiveJourney.start(newContext);
        case 'ADVISOR':
          return advisorJourney.start(newContext);
        case 'BOARD':
          return boardJourney.start(newContext);
        case 'FINANCE':
          return financeJourney.start(newContext);
        case 'ORGANIZATION':
          return organizationJourney.start(newContext);
        case 'DISCOVERY':
        default:
          return discoveryJourney.start(newContext);
      }
    }

    // 2. Delegate to active journey
    if (!newContext.profile) {
      return { nextMessages: [], newContext };
    }

    switch (newContext.profile) {
      case 'EXECUTIVE':
        return executiveJourney.handle(newContext, nodeId, optionId, value);
      case 'ADVISOR':
        return advisorJourney.handle(newContext, nodeId, optionId, value);
      case 'BOARD':
        return boardJourney.handle(newContext, nodeId, optionId, value);
      case 'FINANCE':
        return financeJourney.handle(newContext, nodeId, optionId, value);
      case 'ORGANIZATION':
        return organizationJourney.handle(newContext, nodeId, optionId, value);
      case 'DISCOVERY':
      default:
        return discoveryJourney.handle(newContext, nodeId, optionId, value);
    }
  }
}

export const conversationRouter = new ConversationRouter();
