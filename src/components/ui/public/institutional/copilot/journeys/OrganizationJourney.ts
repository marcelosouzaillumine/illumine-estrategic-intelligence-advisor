import { CopilotMessage, ConversationContext } from '../types';

export const organizationJourney = {
  start(context: ConversationContext): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    const messages: CopilotMessage[] = [
      {
        id: `msg_org_q1_${Date.now()}`,
        nodeId: 'org_type',
        type: 'bot',
        sender: 'bot',
        content: 'Para que possamos adequar a apresentação da plataforma, qual destas opções melhor descreve o perfil da sua instituição?',
        delay: 600,
        options: [
          { id: 'org_company', label: 'Empresa Privada' },
          { id: 'org_holding', label: 'Holding / Grupo Econômico' },
          { id: 'org_hospital', label: 'Hospital / Saúde' },
          { id: 'org_edu', label: 'Instituição de Ensino' },
          { id: 'org_terceiro_setor', label: 'Organizações do terceiro setor' },
          { id: 'org_ong', label: 'Terceiro Setor / ONG' },
          { id: 'org_other', label: 'Outro' }
        ]
      }
    ];
    return { nextMessages: messages, newContext: context };
  },

  handle(context: ConversationContext, nodeId: string, optionId: string, value?: any): { nextMessages: CopilotMessage[], newContext: ConversationContext } {
    let newContext = { ...context };
    
    if (nodeId === 'org_type') {
      newContext.companyType = optionId;
      newContext.leadScore += 10;
      
      const messages: CopilotMessage[] = [
        {
          id: `msg_org_interp_${Date.now()}`,
          type: 'insight',
          sender: 'system',
          content: 'Estruturas complexas exigem governança e memória institucional adequadas ao seu setor de atuação.',
          delay: 1200
        },
        {
          id: `msg_org_resp_${Date.now()}`,
          type: 'bot',
          sender: 'bot',
          content: 'A Illumine possui módulos de inteligência e compliance desenhados para capturar as nuances operacionais e fiduciárias específicas do seu segmento, conectando a gestão diária aos objetivos macro-estratégicos.',
          delay: 1500
        },
        {
          id: `msg_org_cta_${Date.now()}`,
          type: 'cta',
          sender: 'system',
          content: 'Para mapearmos a melhor aplicação da nossa tecnologia ao seu caso, recomendamos um diagnóstico inicial.',
          delay: 600,
          ctas: [
            { label: 'Iniciar Assessment', href: '/assessment', primary: true },
            { label: 'Falar com Consultor', href: 'https://wa.me/554131514537?text=Ol%C3%A1%2C%20represento%20uma%20organiza%C3%A7%C3%A3o%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20Illumine.' }
          ]
        }
      ];
      return { nextMessages: messages, newContext };
    }

    return { nextMessages: [], newContext };
  }
};
