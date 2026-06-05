// src/core/runtime/board-meeting/BoardMeetingEngine.ts

import { 
  BoardMeeting, 
  BoardResolution, 
  MeetingAgendaItem, 
  MeetingMinutes, 
  ESGIMScenario, 
  ESGIMMode,
  GovernanceDecision
} from '../esgim/esgimTypes';
import { boardPackGeneratorEngine } from '../board-pack/BoardPackGeneratorEngine';
import { decisionRegistryEngine } from '../execution/DecisionRegistryEngine';
import { meetingMinutesEngine } from './MeetingMinutesEngine';

export class BoardMeetingEngine {
  private static instance: BoardMeetingEngine;
  private activeMeetings: Map<string, BoardMeeting> = new Map();

  public static getInstance(): BoardMeetingEngine {
    if (!BoardMeetingEngine.instance) {
      BoardMeetingEngine.instance = new BoardMeetingEngine();
    }
    return BoardMeetingEngine.instance;
  }

  private getActiveMeetingKey(clientId: string, scenario: ESGIMScenario): string {
    return `bmm_active_meeting_${clientId || 'GLOBAL'}_${scenario}`;
  }

  private getMinutesKey(meetingId: string): string {
    return `bmm_minutes_${meetingId}`;
  }

  /**
   * Retrieves the currently active meeting for the client and scenario.
   */
  public getActiveMeeting(clientId: string, scenario: ESGIMScenario): BoardMeeting | null {
    const cacheKey = this.getActiveMeetingKey(clientId, scenario);
    if (this.activeMeetings.has(cacheKey)) {
      return this.activeMeetings.get(cacheKey) || null;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(cacheKey);
      if (stored) {
        try {
          const meeting = JSON.parse(stored);
          this.activeMeetings.set(cacheKey, meeting);
          return meeting;
        } catch (e) {
          console.error('[BMM] Error loading active meeting from localStorage:', e);
        }
      }
    }
    return null;
  }

  /**
   * Starts a new board meeting by pre-populating agenda items and resolutions.
   */
  public startMeeting(
    clientId: string,
    scenario: ESGIMScenario,
    companyName: string = 'Holding Illumine S/A'
  ): BoardMeeting {
    const active = this.getActiveMeeting(clientId, scenario);
    if (active && active.status === 'ACTIVE') {
      return active;
    }

    const meetingId = `MEET-${scenario}-${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // 1. Generate Board Pack for context
    const boardPack = boardPackGeneratorEngine.generateBoardPack(clientId, 'DEMO_SCENARIO', scenario, companyName);

    // 2. Generate sorted agenda based on constitutional priority
    const agendaItems: MeetingAgendaItem[] = [
      {
        id: 'AGENDA-SUMMARY',
        title: '1. Parecer Executivo e Manchete Principal',
        category: 'MISSION',
        criticality: 'HIGH',
        recommendedDiscussion: boardPack.executiveHeadline
      },
      {
        id: 'AGENDA-RISKS',
        title: '2. Mapeamento de Riscos e Exposições Ativas',
        category: 'RISK',
        criticality: (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') ? 'CRITICAL' : 'HIGH',
        recommendedDiscussion: 'Deliberação e mitigação sobre os riscos identificados no painel de governança.'
      },
      {
        id: 'AGENDA-PRIORITIES',
        title: '3. Prioridades Fiduciárias e Institucionais (BPE™)',
        category: 'PRIORITY',
        criticality: 'HIGH',
        recommendedDiscussion: 'Revisão das prioridades estratégicas de governança recomendadas pelo motor de decisão.'
      },
      {
        id: 'AGENDA-ROADMAP',
        title: '4. Cronograma de Evolução (GRE™)',
        category: 'ROADMAP',
        criticality: 'MODERATE',
        recommendedDiscussion: 'Análise de fases, milestones críticos e quick wins do cronograma estratégico.'
      },
      {
        id: 'AGENDA-GDTL',
        title: '5. Desempenho de Execução Governamental (GDTL™)',
        category: 'EXECUTION',
        criticality: 'HIGH',
        recommendedDiscussion: 'Verificação do Governance Execution Index (GEI™) e aging de pendências.'
      },
      {
        id: 'AGENDA-RESOLUTIONS',
        title: '6. Deliberações e Resoluções Recomendadas',
        category: 'PRIORITY',
        criticality: 'CRITICAL',
        recommendedDiscussion: 'Votação formal das resoluções recomendadas para inclusão no tracking de execução.'
      }
    ];

    // 3. Create BoardResolutions from board pack decisions
    const resolutions: BoardResolution[] = boardPack.recommendedDecisionRegister.map((entry, index) => {
      return {
        id: `RES-${index}-${Date.now()}`,
        title: entry.decision,
        description: entry.expectedBenefit,
        decision: 'POSTPONED', // start as postponed/pending
        linkedDecisionIds: []
      };
    });

    const newMeeting: BoardMeeting = {
      meetingId,
      title: `Reunião Extraordinária do Conselho - ${companyName}`,
      createdAt: generatedAt,
      scenario,
      readinessScore: boardPack.decisionReadinessScore,
      agendaItems,
      resolutions,
      status: 'ACTIVE'
    };

    this.saveMeeting(clientId, scenario, newMeeting);
    return newMeeting;
  }

  /**
   * Updates a specific resolution's decision.
   * If APPROVED, registers a GovernanceDecision in GDTL immediately.
   */
  public updateResolution(
    clientId: string,
    scenario: ESGIMScenario,
    resolutionId: string,
    decision: 'APPROVED' | 'REJECTED' | 'POSTPONED',
    decidedBy?: string,
    decisionReason?: string
  ): BoardMeeting {
    const meeting = this.getActiveMeeting(clientId, scenario);
    if (!meeting) {
      throw new Error(`Nenhuma reunião ativa encontrada para o cenário: ${scenario}`);
    }

    const resolution = meeting.resolutions.find(r => r.id === resolutionId);
    if (!resolution) {
      throw new Error(`Resolução com ID ${resolutionId} não encontrada na reunião.`);
    }

    // Capture the state changes
    resolution.decision = decision;
    resolution.decidedBy = decidedBy;
    resolution.decisionReason = decisionReason;

    if (decision === 'APPROVED') {
      resolution.approvedAt = new Date().toISOString();

      // Connect to GDTL Layer
      const decisionId = `DEC-BMM-${meeting.meetingId}-${resolution.id}`;
      const existingDecisions = decisionRegistryEngine.getDecisions(clientId, scenario);
      const alreadyExists = existingDecisions.some(d => d.meetingId === meeting.meetingId && d.title === resolution.title);

      if (!alreadyExists) {
        const newDecision: GovernanceDecision = {
          id: decisionId,
          title: resolution.title,
          description: resolution.description,
          source: 'BOARD',
          category: 'GOVERNANCE',
          decisionType: 'BOARD_RESOLUTION',
          originEngine: 'BOARD',
          executionRisk: 'HIGH', // Fallback: High risk if owner undefined
          assignedTo: 'UNASSIGNED', // Fallback: Unassigned if owner undefined
          createdAt: new Date().toISOString(),
          status: 'OPEN',
          expectedBenefit: decisionReason || 'Homologação formal em reunião do Conselho',
          evidence: [`Aprovado pelo Board em sessão regulamentar. Meeting ID: ${meeting.meetingId}`],
          lineageHash: `LIN-GDTL-BMM-${meeting.meetingId}-${resolution.id}`,
          approvedByBoard: true,
          approvedAt: resolution.approvedAt,
          meetingId: meeting.meetingId,
          relatedDecisionIds: []
        };

        decisionRegistryEngine.addDecision(newDecision);
        resolution.linkedDecisionIds.push(newDecision.id);
      }
    }

    this.saveMeeting(clientId, scenario, meeting);
    return meeting;
  }

  /**
   * Completes a meeting and compiles the minutes.
   */
  public completeMeeting(
    clientId: string,
    scenario: ESGIMScenario,
    participants: string[]
  ): { meeting: BoardMeeting; minutes: MeetingMinutes } {
    const meeting = this.getActiveMeeting(clientId, scenario);
    if (!meeting) {
      throw new Error(`Nenhuma reunião ativa encontrada para o cenário: ${scenario}`);
    }

    meeting.status = 'COMPLETED';

    const minutes = meetingMinutesEngine.generateMinutes(meeting, participants, 'APPROVED');

    // Save completed meeting status & minutes
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.getMinutesKey(meeting.meetingId), JSON.stringify(minutes));
      // Save meeting under its specific key for archive
      window.localStorage.setItem(`bmm_completed_meeting_${meeting.meetingId}`, JSON.stringify(meeting));
    }

    const cacheKey = this.getActiveMeetingKey(clientId, scenario);
    this.activeMeetings.delete(cacheKey);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(cacheKey);
    }

    return { meeting, minutes };
  }

  /**
   * Retrieves minutes of a meeting.
   */
  public getMinutes(meetingId: string): MeetingMinutes | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(this.getMinutesKey(meetingId));
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('[BMM] Error loading minutes from localStorage:', e);
        }
      }
    }
    return null;
  }

  private saveMeeting(clientId: string, scenario: ESGIMScenario, meeting: BoardMeeting): void {
    const cacheKey = this.getActiveMeetingKey(clientId, scenario);
    this.activeMeetings.set(cacheKey, meeting);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(cacheKey, JSON.stringify(meeting));
    }
  }
}

export const boardMeetingEngine = BoardMeetingEngine.getInstance();
