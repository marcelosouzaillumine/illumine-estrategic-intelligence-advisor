// src/core/runtime/board-meeting/MeetingMinutesEngine.ts

import { BoardMeeting, MeetingMinutes, BoardResolution } from '../esgim/esgimTypes';

export class MeetingMinutesEngine {
  private static instance: MeetingMinutesEngine;

  public static getInstance(): MeetingMinutesEngine {
    if (!MeetingMinutesEngine.instance) {
      MeetingMinutesEngine.instance = new MeetingMinutesEngine();
    }
    return MeetingMinutesEngine.instance;
  }

  /**
   * Compiles the formal minutes of a completed Board Meeting.
   */
  public generateMinutes(
    meeting: BoardMeeting,
    participants: string[],
    status: "DRAFT" | "APPROVED" = "DRAFT"
  ): MeetingMinutes {
    const generatedAt = new Date().toISOString();
    
    const discussedTopics = meeting.agendaItems.map(item => `${item.title} (${item.category})`);
    
    const approved: string[] = [];
    const rejected: string[] = [];
    const postponed: string[] = [];
    
    meeting.resolutions.forEach(res => {
      const detail = `${res.title}${res.decisionReason ? ` (Justificativa: ${res.decisionReason})` : ''}${res.decidedBy ? ` [Decidido por: ${res.decidedBy}]` : ''}`;
      if (res.decision === 'APPROVED') {
        approved.push(detail);
      } else if (res.decision === 'REJECTED') {
        rejected.push(detail);
      } else {
        postponed.push(detail);
      }
    });

    // Generate action items description for approved resolutions
    const actionItems = meeting.resolutions
      .filter(res => res.decision === 'APPROVED')
      .map(res => {
        return `AÇÃO: Executar homologação de "${res.title}". Risco de Execução: ALTO (Aguardando designação de responsável).`;
      });

    // Construct a premium executive summary narrative
    const approvedCount = approved.length;
    const totalCount = meeting.resolutions.length;
    const scenarioLabel = meeting.scenario.replace('_', ' ');
    const companyName = meeting.title.split(' - ')[1] || 'Holding Illumine S/A';
    
    const executiveSummary = 
      `Aos ${new Date(meeting.createdAt).toLocaleDateString('pt-BR')}, reuniu-se o Conselho de Administração da ${companyName} em caráter extraordinário sob o contexto Operacional de ${scenarioLabel}. ` +
      `Com um Score de Prontidão Decisória inicial avaliado em ${meeting.readinessScore}/100, foram percorridos todos os tópicos constitucionais da pauta. ` +
      `Durante a sessão, deliberou-se sobre ${totalCount} propostas de resolução recomendadas pela plataforma Illumine Governance™. ` +
      `Desse total, foram aprovadas ${approvedCount} resoluções, rejeitadas ${rejected.length} e postergadas ${postponed.length} para deliberações futuras. ` +
      `As deliberações aprovadas foram integradas imediatamente ao Governance Decision Tracking Layer (GDTL™) para garantir rastreabilidade, monitoramento de ciclos e accountability fiduciária integral.`;

    return {
      meetingId: meeting.meetingId,
      generatedAt,
      participants,
      discussedTopics,
      approvedResolutions: approved,
      rejectedResolutions: rejected,
      postponedResolutions: postponed,
      actionItems,
      executiveSummary,
      status
    };
  }
}

export const meetingMinutesEngine = MeetingMinutesEngine.getInstance();
