import { EnterpriseAgentOrchestrator } from '../../advisory-agents/src/advisory-agents';

export interface BoardMeetingTranscript {
  topic: string;
  contributions: { agentName: string; statement: string }[];
  synthesisPriorities: string[];
  requiresHumanApproval: true;
}

export class BoardMeetingSimulator {
  public static simulateMeeting(topic: string): BoardMeetingTranscript {
    const orch = EnterpriseAgentOrchestrator.orchestrateAll();

    const contributions = orch.analyses.map((a) => ({
      agentName: a.agentName,
      statement: a.recommendation
    }));

    return {
      topic,
      contributions,
      synthesisPriorities: [
        '1. Preservação de Caixa e Liquidez (Prioridade CFO)',
        '2. Otimização Operacional e Eliminação de Gargalos (Prioridade Ops)',
        '3. Plano de Sucessão e Retenção de Talentos C-Level (Prioridade People)'
      ],
      requiresHumanApproval: true
    };
  }
}
