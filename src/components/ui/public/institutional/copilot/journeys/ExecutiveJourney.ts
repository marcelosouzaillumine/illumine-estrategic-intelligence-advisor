import { CopilotMessage, ConversationContext } from '../types';

export const executiveJourney = {
  start(context: ConversationContext): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    const messages: CopilotMessage[] = [
      {
        id: `msg_exec_${Date.now()}`,
        nodeId: 'exec_pain',
        type: 'bot',
        sender: 'bot',
        content: 'Perfeito. Como líder da organização, qual é o maior gargalo estratégico que você enfrenta hoje na operação?',
        delay: 600,
        options: [
          { id: 'fragmentada', label: 'Visão fragmentada: Números divergem entre áreas' },
          { id: 'dependencia', label: 'Dependência extrema de pessoas-chave' },
          { id: 'lentidao', label: 'Lentidão e risco nas tomadas de decisão' },
          { id: 'rentabilidade', label: 'Perda invisível de rentabilidade e margens' },
          { id: 'cenarios', label: 'Dificuldade em simular cenários futuros' },
          { id: 'dashboards', label: 'Sobrecarga de dados sem interpretação estratégica' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  },

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    let newContext = { ...context };
    
    if (nodeId === 'exec_pain') {
      newContext.challenge = optionId;
      newContext.leadScore += 20;

      let insightText = '';
      let interpretation = '';

      switch (optionId) {
        case 'fragmentada':
          interpretation = 'Isso normalmente indica uma ausência de consolidação sistêmica, forçando o Board a gastar tempo validando números em vez de discutir estratégia.';
          insightText = 'Divergência de dados corrói a confiança da liderança. A Illumine neutraliza esse risco atuando como uma camada cognitiva central, auditando e consolidando informações financeiras e operacionais em uma única fonte de verdade corporativa.';
          break;
        case 'dependencia':
          interpretation = 'A ausência de processos documentados gera uma vulnerabilidade crítica, onde a organização depende de heróis em vez de sistemas.';
          insightText = 'O conhecimento tácito é o maior risco oculto de uma operação. Nossa plataforma extrai e mapeia a lógica de decisão dos executivos, transformando a dependência individual no capital intelectual perpétuo da organização.';
          break;
        case 'lentidao':
          interpretation = 'A lentidão decisória frequentemente decorre da falta de visibilidade sobre as interdependências entre diferentes áreas do negócio.';
          insightText = 'Ciclos decisórios lentos custam vantagem competitiva. A Illumine converte o ruído de sistemas complexos em diretrizes narrativas claras, provendo segurança matemática absoluta para sustentar as decisões da liderança.';
          break;
        case 'rentabilidade':
          interpretation = 'Isso sinaliza que as alavancas de valor não estão sendo monitoradas em tempo real, permitindo vazamentos silenciosos no DFC.';
          insightText = 'A erosão de margens é o sintoma mais letal da falta de controle. Implementamos uma arquitetura de Controladoria Avançada que mapeia e audita suas alavancas de valor em tempo real, blindando a rentabilidade da operação.';
          break;
        case 'cenarios':
          interpretation = 'Organizações presas em planilhas estáticas perdem a capacidade de antecipar riscos sistêmicos.';
          insightText = 'Modelos estáticos não sobrevivem à volatilidade do mercado. Nossa infraestrutura viabiliza simulações avançadas de P&L e Valuation, permitindo que você teste o impacto de múltiplos cenários estratégicos instantaneamente.';
          break;
        case 'dashboards':
          interpretation = 'Muitas ferramentas focam apenas na camada visual, exigindo que o executivo faça todo o esforço de síntese causal.';
          insightText = 'Dashboards mostram o que aconteceu, mas não dizem o porquê. A Illumine transcende a visualização entregando interpretação direta: convertemos métricas áridas em relatórios narrativos acionáveis para a Alta Gestão.';
          break;
      }

      const messages: CopilotMessage[] = [
        {
          id: `msg_exec_interp_${Date.now()}`,
          type: 'insight',
          sender: 'system',
          content: interpretation,
          delay: 1200
        },
        {
          id: `msg_exec_resp_${Date.now()}`,
          type: 'bot',
          sender: 'bot',
          content: insightText,
          delay: 1500
        },
        {
          id: `msg_exec_cta_${Date.now()}`,
          type: 'cta',
          sender: 'system',
          content: 'Para entender como podemos implementar essa governança cognitiva na sua estrutura de forma segura, o próximo passo ideal é um alinhamento executivo.',
          delay: 800,
          ctas: [
            { label: 'Iniciar Executive Assessment', href: '/assessment', primary: true },
            { label: 'Conversar com Executive Advisor', href: 'https://wa.me/554131514537?text=Ol%C3%A1%2C%20utilizei%20o%20Copilot%20e%20gostaria%20de%20falar%20sobre%20a%20Illumine.' }
          ]
        }
      ];
      
      return { nextMessages: messages, newContext };
    }

    return { nextMessages: [], newContext };
  }
};
