import { TFunction } from 'i18next';
import { AdvisoryMessage, ConversationContext, JourneyType } from '../types/advisory.types';
import { ExecutiveJourney } from '../journeys/ExecutiveJourney';
import { AdvisorJourney } from '../journeys/AdvisorJourney';
import { BoardJourney } from '../journeys/BoardJourney';
import { FinanceJourney } from '../journeys/FinanceJourney';
import { DiscoveryJourney } from '../journeys/DiscoveryJourney';
import { OrganizationJourney } from '../journeys/OrganizationJourney';

export class ExecutiveAdvisoryRouter {
  private executiveJourney: ExecutiveJourney;
  private advisorJourney: AdvisorJourney;
  private boardJourney: BoardJourney;
  private financeJourney: FinanceJourney;
  private discoveryJourney: DiscoveryJourney;
  private organizationJourney: OrganizationJourney;

  constructor(private t: TFunction) {
    this.executiveJourney = new ExecutiveJourney(t);
    this.advisorJourney = new AdvisorJourney(t);
    this.boardJourney = new BoardJourney(t);
    this.financeJourney = new FinanceJourney(t);
    this.discoveryJourney = new DiscoveryJourney(t);
    this.organizationJourney = new OrganizationJourney(t);
  }

  getInitialMessages(): AdvisoryMessage[] {
    return [
      {
        id: 'msg_welcome_1',
        nodeId: 'welcome',
        type: 'bot',
        role: 'advisor',
        content: this.t('journeys.welcome.text', 'Bem-vindo ao Illumine Advisory. Como posso direcionar nossa análise hoje?'),
        delay: 600,
        thinkingStates: ['Iniciando sessão executiva...', 'Carregando contexto organizacional...'],
        options: [
          { id: 'EXECUTIVE', label: 'Sou Líder Executivo' },
          { id: 'ADVISOR', label: 'Sou Advisor / Consultor' },
          { id: 'CLIENT', label: 'Já sou Cliente' }
        ]
      }
    ];
  }

  handleInteraction(
    context: ConversationContext, 
    nodeId: string, 
    optionId: string, 
    value?: any
  ): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    
    let newContext = { ...context };
    
    if (nodeId === 'welcome') {
      newContext.profile = optionId as JourneyType;
      newContext.confidence += 0.5; 
      
      switch (optionId) {
        case 'EXECUTIVE': return this.executiveJourney.start(newContext);
        case 'ADVISOR': return this.advisorJourney.start(newContext);
        case 'CLIENT': 
          // Retorna CTA imediata ou redirecionamento
          return {
            nextMessages: [{
              id: 'msg_client_welcome',
              type: 'bot',
              role: 'advisor',
              content: 'Bem-vindo de volta. Por favor, selecione como podemos direcioná-lo de forma segura.',
              options: [
                { id: 'cli-login', label: 'Entrar na Plataforma' },
                { id: 'cli-advisor', label: 'Falar com meu Advisor' },
                { id: 'cli-support', label: 'Solicitar Suporte' }
              ]
            }],
            newContext
          };
        default: return this.discoveryJourney.start(newContext);
      }
    }

    if (!newContext.profile) {
      return { nextMessages: [], newContext };
    }

    const result = (() => {
      switch (newContext.profile) {
        case 'EXECUTIVE': return this.executiveJourney.handle(newContext, nodeId, optionId, value);
        case 'ADVISOR': return this.advisorJourney.handle(newContext, nodeId, optionId, value);
        case 'CLIENT':
          if (optionId === 'cli-login') window.location.href = '/login';
          if (optionId === 'cli-advisor') window.location.href = '/support/advisor';
          if (optionId === 'cli-support') window.location.href = 'https://wa.me/554131514537';
          return { nextMessages: [], newContext };
        default: return this.discoveryJourney.handle(newContext, nodeId, optionId, value);
      }
    })();

    if (result.nextMessages) {
      result.nextMessages = result.nextMessages.map(msg => {
        if (msg.type === 'cta' && msg.ctas && newContext.profile === 'EXECUTIVE') {
           const contextId = `${newContext.profile}_${Date.now()}`;
           
           // Inject to memory so it can be recovered post-login
           const memoryService = (global as any).window?.ExecutiveMemoryService || null;
           try {
              if (memoryService && typeof memoryService.getInstance === 'function') {
                 memoryService.getInstance().injectContext(`temp_${newContext.profile}`, {
                    id: contextId,
                    domain: (newContext.profile || 'discovery').toLowerCase(),
                    profile: { maturityLevel: 'established' },
                    generatedAt: new Date().toISOString(),
                    dataSource: 'concierge',
                    consumers: ['advisory']
                 });
              } else {
                 const contextData = {
                    id: contextId,
                    domain: (newContext.profile || 'discovery').toLowerCase(),
                    profile: { maturityLevel: 'established' },
                    generatedAt: new Date().toISOString(),
                    dataSource: 'concierge',
                    consumers: ['advisory']
                 };
                 localStorage.setItem(`illumine_temp_${newContext.profile}`, JSON.stringify(contextData));
              }
           } catch (e) {
              console.error('[Advisory Engine] Falha ao registrar contexto na memória.', e);
           }

           return {
              ...msg,
              content: this.t('journeys.executive.cta_prompt', 'Criamos sua primeira visão executiva. Acesse sua conta para continuar e analisar este cenário.'),
              ctas: msg.ctas.map(cta => {
                 if (cta.primary) {
                    return {
                       ...cta,
                       label: 'Acessar Workspace Executivo',
                       href: `/login?contextId=${contextId}`
                    };
                 }
                 return cta;
              })
           };
        }
        return msg;
      });
    }

    return result;
  }
}
