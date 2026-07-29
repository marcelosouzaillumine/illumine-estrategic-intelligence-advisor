import { Identifier } from '@illumine/core-primitives';
import { ExecutiveDecision } from '@illumine/executive-decision-workspace';

export interface BoardMeeting {
  readonly meetingId: Identifier;
  readonly date: Date;
  readonly agendaDecisions: ExecutiveDecision[];
  readonly votingRecords: Record<string, 'APPROVED' | 'REJECTED' | 'ABSTAINED'>;
  readonly automaticMinutesText: string;
  readonly status: 'SCHEDULED' | 'IN_SESSION' | 'ADJOURNED';
}

export class ExecutiveBoardExperience {
  public static generateBoardPack(meetingId: Identifier, decisions: ExecutiveDecision[]): BoardMeeting {
    return {
      meetingId,
      date: new Date(),
      agendaDecisions: decisions,
      votingRecords: {},
      automaticMinutesText: `Ata gerada automaticamente para o Conselho de Administração contendo ${decisions.length} matérias pautadas.`,
      status: 'SCHEDULED'
    };
  }
}
