import { ExecutiveFinancialState } from '../contracts/ExecutiveFinancialState';
import { LearningEvent } from './LearningEvent';

export class InstitutionalMemoryAdvisor {
  /**
   * Consulta o histórico de aprendizado da empresa e pode emitir
   * sinais (warnings) que afetam a criação da política.
   */
  public static consult(
    state: ExecutiveFinancialState,
    learningHistory: LearningEvent[]
  ): string[] {
    const memoryAlerts: string[] = [];

    // Lógica simplificada: Se a empresa já esteve em STRESSED e tentou expandir (se deu mal)
    if (state.status === 'STRESSED' && learningHistory.some(l => l.confidence > 0.7 && l.lesson.includes('Expansão'))) {
      memoryAlerts.push('Memória Institucional alerta: Tentativas passadas de expansão sob estresse financeiro resultaram em queima acelerada de liquidez.');
    }

    return memoryAlerts;
  }
}


