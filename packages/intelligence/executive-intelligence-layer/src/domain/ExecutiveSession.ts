import { ExecutiveQuestion } from './ExecutiveQuestion';
import { BoardPackage } from '../contracts/BoardPackage';

export interface ExecutiveSession {
  id: string;
  companyId: string;
  title: string;
  startedAt: Date;
  status: 'OPEN' | 'IN_DELIBERATION' | 'CLOSED' | 'ARCHIVED';
  
  // A sessão é dirigida por UMA questão executiva principal
  primaryQuestion: ExecutiveQuestion;
  
  // Ao longo da sessão, o Comitê avalia a questão, 
  // gerando versões do BoardPackage à medida que novos cenários são simulados
  deliberations: BoardPackage[];
  
  // Qual o BoardPackage final assinado/aceito?
  finalDecisionId?: string;
}
