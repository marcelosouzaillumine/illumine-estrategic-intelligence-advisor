export class ExecutiveClosingQuestionEngine {
  public static generateClosingQuestion(role: 'CLIENT' | 'ADVISOR' | 'BOARD' | 'PARTNER' | 'MASTER_ADMIN'): string {
    switch (role) {
      case 'CLIENT':
        return 'Qual dessas prioridades você deseja resolver primeiro hoje?';
      case 'ADVISOR':
        return 'Qual cliente você deseja atender primeiro para estabilizar a carteira?';
      case 'BOARD':
        return 'Qual resolução o Conselho deliberará em primeiro lugar?';
      case 'PARTNER':
        return 'Qual oportunidade de pipeline você deseja desenvolver hoje?';
      case 'MASTER_ADMIN':
        return 'Qual verificação de observabilidade você deseja executar agora?';
    }
  }
}
