import { CopilotMessage, ConversationContext } from '../types';

export const advisorJourney = {
  start(context: ConversationContext): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    const messages: CopilotMessage[] = [
      {
        id: `msg_adv_start_${Date.now()}`,
        nodeId: 'adv_q1',
        type: 'bot',
        sender: 'bot',
        content: 'A Illumine também foi desenvolvida para profissionais que apoiam decisões estratégicas em organizações complexas. Gostaria de entender melhor sua atuação.\n\nHoje você atende aproximadamente:',
        delay: 800,
        options: [
          { id: 'size_small', label: 'Até 5 clientes' },
          { id: 'size_medium', label: 'Entre 5 e 20' },
          { id: 'size_large', label: 'Acima de 20' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  },

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    let newContext = { ...context };
    
    if (nodeId === 'adv_q1') {
      newContext.companySize = optionId;
      newContext.leadScore += 10;
      
      const messages: CopilotMessage[] = [
        {
          id: `msg_adv_q2_${Date.now()}`,
          nodeId: 'adv_q2',
          type: 'bot',
          sender: 'bot',
          content: 'Perfeito. E sua atuação é predominantemente focada em:',
          delay: 800,
          options: [
            { id: 'spec_consulting', label: 'Consultoria Empresarial' },
            { id: 'spec_board', label: 'Conselhos' },
            { id: 'spec_gov', label: 'Governança' },
            { id: 'spec_strat', label: 'Estratégia' },
            { id: 'spec_finance', label: 'Finanças' },
            { id: 'spec_family', label: 'Empresas Familiares' },
            { id: 'spec_other', label: 'Outro' }
          ]
        }
      ];
      return { nextMessages: messages, newContext };
    }

    if (nodeId === 'adv_q2') {
      newContext.specialty = optionId;
      newContext.leadScore += 10;
      
      const messages: CopilotMessage[] = [
        {
          id: `msg_adv_q3_${Date.now()}`,
          nodeId: 'adv_q3',
          type: 'bot',
          sender: 'bot',
          content: 'Qual seu principal desafio hoje para expandir o impacto do seu aconselhamento?',
          delay: 800,
          options: [
            { id: 'chal_depth', label: 'Produzir diagnósticos mais profundos' },
            { id: 'chal_value', label: 'Gerar maior valor percebido' },
            { id: 'chal_continuous', label: 'Acompanhar clientes continuamente' },
            { id: 'chal_standard', label: 'Padronizar metodologia' },
            { id: 'chal_authority', label: 'Aumentar autoridade no mercado' }
          ]
        }
      ];
      return { nextMessages: messages, newContext };
    }

    if (nodeId === 'adv_q3') {
      newContext.challenge = optionId;
      newContext.leadScore += 20;

      // Synthesis Generation based on combination
      let interpretation = '';
      if (newContext.companySize === 'size_medium' || newContext.companySize === 'size_large') {
        interpretation += 'Isso normalmente indica uma operação consultiva onde escala e padronização metodológica tornam-se fatores críticos para preservar qualidade. ';
      } else {
        interpretation += 'Avaliando seu cenário, o acompanhamento de uma carteira enxuta demanda altíssima geração de valor e profundidade. ';
      }

      if (newContext.challenge === 'chal_standard' || newContext.challenge === 'chal_continuous') {
        interpretation += 'A dificuldade de escalar sem perder a personalização é o principal gargalo de advisors seniores.';
      } else {
        interpretation += 'A dificuldade em evidenciar impacto contínuo é o que separa um conselheiro operacional de um parceiro estratégico.';
      }

      const messages: CopilotMessage[] = [
        {
          id: `msg_adv_interp_${Date.now()}`,
          type: 'insight',
          sender: 'system',
          content: interpretation,
          delay: 1500
        },
        {
          id: `msg_adv_synth_${Date.now()}`,
          type: 'summary',
          sender: 'system',
          content: 'Pelo seu perfil, você acompanha organizações complexas e seu desafio central exige aumentar a profundidade analítica sem elevar proporcionalmente o tempo operacional dedicado a cada cliente.',
          delay: 1800
        },
        {
          id: `msg_adv_card_${Date.now()}`,
          type: 'advisor_card',
          sender: 'bot',
          content: 'Executive Advisor Program™', // The UI will render the specific card
          delay: 800
        },
        {
          id: `msg_adv_cta_${Date.now()}`,
          type: 'cta',
          sender: 'system',
          content: 'A Illumine foi criada exatamente para ampliar esse tipo de atuação estruturada.',
          delay: 600,
          ctas: [
            { label: 'Conhecer Programa', href: '/network', primary: true },
            { label: 'Agendar Conversa', href: 'https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Executive%20Advisor%20Program.' }
          ]
        }
      ];

      return { nextMessages: messages, newContext };
    }

    return { nextMessages: [], newContext };
  }
};
