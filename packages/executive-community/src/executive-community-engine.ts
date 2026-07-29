export interface ExecutiveRoundtable {
  id: string;
  topic: string;
  targetRole: 'CEO' | 'CFO' | 'BOARD_MEMBER';
  scheduledDate: string;
  participantsCount: number;
}

export class ExecutiveCommunityEngine {
  public static listActiveRoundtables(): ExecutiveRoundtable[] {
    return [
      {
        id: 'rt-001',
        topic: 'Estratégias de Liquidez em Mercados de Alta Volatilidade',
        targetRole: 'CFO',
        scheduledDate: '2026-08-15',
        participantsCount: 18
      }
    ];
  }
}
