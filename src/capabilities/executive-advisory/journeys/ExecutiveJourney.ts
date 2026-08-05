import { TFunction } from 'i18next';
import { AdvisoryMessage, ConversationContext } from '../types/advisory.types';

export class ExecutiveJourney {
  constructor(private t: TFunction) {}

  start(context: ConversationContext): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    const messages: AdvisoryMessage[] = [
      {
        id: `msg_exec_trans_rec_${Date.now()}`,
        type: 'insight',
        role: 'advisor',
        priority: 'reflection',
        content: 'Essa perspectiva nos ajuda a compreender melhor o contexto executivo em que você atua.'
      },
      {
        id: `msg_exec_trans_ctx_${Date.now()}`,
        type: 'insight',
        role: 'advisor',
        priority: 'normal',
        content: 'Nossa metodologia foi construída justamente para transformar cenários complexos em decisões executivas mais claras.',
      },
      {
        id: `msg_exec_q1_${Date.now()}`,
        nodeId: 'exec_step_context',
        type: 'bot',
        role: 'advisor',
        priority: 'normal',
        content: 'Para direcionarmos a melhor experiência, qual cenário representa melhor sua realidade atual?',
        options: [
          { id: 'ctx-growth', label: 'Crescimento e expansão' },
          { id: 'ctx-finance', label: 'Baixa previsibilidade financeira' },
          { id: 'ctx-ops', label: 'Desafios operacionais' },
          { id: 'ctx-gov', label: 'Fortalecimento da governança' },
          { id: 'ctx-transformation', label: 'Preparação para transformação estratégica' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  }

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: AdvisoryMessage[], newContext: ConversationContext } {
    let newContext = { ...context };

    if (nodeId === 'exec_step_context') {
      newContext.cenario = optionId;
      
      const scenarioMap: Record<string, string> = {
        'ctx-growth': 'Empresas em crescimento normalmente enfrentam um desafio curioso: quanto mais crescem, mais difícil se torna manter previsibilidade, governança e velocidade ao mesmo tempo.',
        'ctx-finance': 'A maioria das organizações procura soluções apenas quando o caixa apresenta sinais de pressão. Na prática, problemas financeiros normalmente são consequência de fatores estruturais anteriores.',
        'ctx-ops': 'Desafios operacionais crônicos muitas vezes são o sintoma visível de gargalos mais profundos no modelo de gestão ou na arquitetura de processos da companhia.',
        'ctx-gov': 'Organizações que buscam fortalecer a governança estão, na verdade, preparando a base estrutural para garantir perpetuidade e proteger o valor do negócio.',
        'ctx-transformation': 'Transformações estratégicas exigem um alinhamento rigoroso entre a visão de futuro e a capacidade real de execução da companhia para não se tornarem apenas intenções.'
      };
      
      const ack = scenarioMap[optionId] || 'Entender a maturidade desse desafio nos ajudará a personalizar a jornada a seguir.';

      const messages: AdvisoryMessage[] = [
        {
          id: `msg_exec_ack1_${Date.now()}`,
          type: 'insight',
          role: 'advisor',
          priority: 'reflection',
          content: ack
        },
        {
          id: `msg_exec_q2_${Date.now()}`,
          nodeId: 'exec_step_priority',
          type: 'bot',
          role: 'advisor',
          priority: 'normal',
          content: 'Neste cenário específico, qual pilar estrutural tem exigido maior foco da sua liderança?',
          options: [
            { id: 'prio-cash', label: 'Caixa e Estrutura de Capital' },
            { id: 'prio-people', label: 'Pessoas e Liderança' },
            { id: 'prio-process', label: 'Processos e Eficiência' },
            { id: 'prio-strategy', label: 'Estratégia e Posicionamento' },
            { id: 'prio-tech', label: 'Tecnologia e Dados' }
          ]
        }
      ];

      return { nextMessages: messages, newContext };
    }

    if (nodeId === 'exec_step_priority') {
      newContext.prioridade = optionId;
      
      const priorityInsightMap: Record<string, string> = {
        'prio-cash': 'A estrutura de capital dita a velocidade e os limites da operação. Sem resolver a pressão de liquidez, as demais iniciativas estratégicas não ganham tração.',
        'prio-people': 'Liderança e cultura determinam o limite da capacidade de execução. A melhor estratégia perde eficácia se a estrutura humana não estiver alinhada.',
        'prio-process': 'Eficiência não é apenas redução de custo, mas capacidade de escalar. Gargalos processuais drenam a energia executiva que deveria estar focada no futuro.',
        'prio-strategy': 'O posicionamento estratégico dita as regras do jogo. Quando a estratégia não está clara, a organização costuma operar de forma reativa e ineficiente.',
        'prio-tech': 'Dados deveriam reduzir incertezas. Quando a tecnologia não suporta a governança, as decisões continuam baseadas em intuição, aumentando o risco corporativo.'
      };
      
      const insight = priorityInsightMap[optionId] || 'O foco na prioridade correta é o primeiro passo para desbloquear o valor da organização.';

      const messages: AdvisoryMessage[] = [
        {
          id: `msg_exec_ack2_${Date.now()}`,
          type: 'insight',
          role: 'advisor',
          priority: 'reflection',
          content: insight
        },
        {
          id: `msg_exec_q3_${Date.now()}`,
          nodeId: 'exec_step_urgency',
          type: 'bot',
          role: 'advisor',
          priority: 'normal',
          content: 'Diante desse cenário, qual é o grau de urgência da organização para agir?',
          options: [
            { id: 'urg-explore', label: 'Ainda mapeando oportunidades' },
            { id: 'urg-clarity', label: 'Buscando clareza e diagnóstico' },
            { id: 'urg-resolve', label: 'Necessidade imediata de resolução' },
            { id: 'urg-decision', label: 'Preparando decisão de alto impacto' },
            { id: 'urg-transform', label: 'Prontos para transformação estrutural' }
          ]
        }
      ];

      return { nextMessages: messages, newContext };
    }

    if (nodeId === 'exec_step_urgency') {
      newContext.urgencia = optionId;
      
      // Dynamic Brief Generation
      let dynamicBrief = '';
      
      if (newContext.cenario === 'ctx-growth') {
         dynamicBrief = 'A análise preliminar indica uma organização em fase de crescimento que busca preservar velocidade sem comprometer a estrutura de gestão. Nesse cenário, focar em estabilizar a frente de ' + (this.getPriorityName(newContext.prioridade)) + ' tende a produzir impactos relevantes antes da expansão das demais iniciativas.';
      } else if (newContext.cenario === 'ctx-finance') {
         dynamicBrief = 'O contexto apresentado sugere pressão sobre a previsibilidade financeira da companhia. Antes de acelerar novos investimentos ou mudanças operacionais, será importante compreender como os gargalos em ' + (this.getPriorityName(newContext.prioridade)) + ' estão influenciando diretamente a liquidez e a governança.';
      } else if (newContext.cenario === 'ctx-gov') {
         dynamicBrief = 'O cenário indica uma organização preocupada com sustentabilidade institucional e perpetuidade. Em empresas nesta fase, resolver a frente de ' + (this.getPriorityName(newContext.prioridade)) + ' costuma ser o alicerce necessário para fortalecer a capacidade de crescimento de longo prazo.';
      } else if (newContext.cenario === 'ctx-ops') {
         dynamicBrief = 'Identificamos um cenário de complexidade operacional crescente. A resolução dos desafios de ' + (this.getPriorityName(newContext.prioridade)) + ' será fundamental para destravar a eficiência e recuperar a capacidade produtiva da operação.';
      } else {
         dynamicBrief = 'O contexto indica um momento de inflexão estratégica. Para garantir uma transição estruturada, o alinhamento profundo das lideranças em relação à frente de ' + (this.getPriorityName(newContext.prioridade)) + ' será o principal fator crítico de sucesso.';
      }

      const endMessage = 'A partir do contexto compartilhado, preparamos uma visão executiva inicial que poderá servir como ponto de partida para uma análise mais aprofundada.\n\nAo acessar seu Workspace Executivo, você poderá visualizar seu diagnóstico inicial, registrar novas avaliações e acompanhar recomendações estratégicas personalizadas.\n\nCaso prefira conversar com um especialista da Illumine, também podemos agendar uma reunião estratégica para analisar seu cenário em maior profundidade.';

      const messages: AdvisoryMessage[] = [
        {
          id: `msg_exec_brief_${Date.now()}`,
          type: 'executive_brief',
          role: 'advisor',
          priority: 'executiveBrief',
          content: dynamicBrief,
          ctas: [
            { label: 'Acessar Workspace Executivo', href: `/login?contextId=${context.profile}_${Date.now()}`, primary: true },
            { label: 'Agendar Conversa Estratégica', href: 'https://wa.me/554131514537', primary: false }
          ]
        },
        {
          id: `msg_exec_final_${Date.now()}`,
          type: 'cta',
          role: 'advisor',
          priority: 'normal',
          content: endMessage
        }
      ];
      
      const memoryService = (window as any).ExecutiveMemoryService || null;
      if (!memoryService) {
         try {
            const contextId = `temp_${Date.now()}`;
            const contextData = {
               id: contextId,
               domain: context.profile as string,
               profile: { maturityLevel: 'established' },
               generatedAt: new Date().toISOString(),
               contextData: {
                 cenario: newContext.cenario,
                 prioridade: newContext.prioridade,
                 urgencia: newContext.urgencia,
                 brief: dynamicBrief
               }
            };
            localStorage.setItem(`illumine_temp_${context.profile}`, JSON.stringify(contextData));
         } catch (e) {
            console.error('[Advisory Engine] Falha ao registrar contexto na memória local.', e);
         }
      }

      return { nextMessages: messages, newContext };
    }
    
    return { nextMessages: [], newContext: context };
  }

  private getPriorityName(prioId: string): string {
    const names: Record<string, string> = {
      'prio-cash': 'Caixa e Estrutura de Capital',
      'prio-people': 'Pessoas e Liderança',
      'prio-process': 'Processos e Eficiência',
      'prio-strategy': 'Estratégia e Posicionamento',
      'prio-tech': 'Tecnologia e Dados'
    };
    return names[prioId] || 'Gestão e Estrutura';
  }
}
