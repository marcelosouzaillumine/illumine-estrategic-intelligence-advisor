import { SemanticLineageReference } from './KnowledgeGraphTypes';
import { createHash } from 'crypto';

export class SemanticLineageEngine {
  static generateLineageReference(
    originExecutionId: string,
    originWorkflowId?: string,
    originScenarioId?: string,
    originReportId?: string
  ): SemanticLineageReference {
    const raw = `\${originExecutionId}|\${originWorkflowId || ''}|\${originScenarioId || ''}|\${originReportId || ''}|\${Date.now()}`;
    
    // Na web real poderíamos usar subtleCrypto, aqui no node usamos createHash,
    // mas como a UI pode interagir indiretamente, podemos mockar o hash para o MVP In-Memory
    // Usaremos um hash simples no MVP para não introduzir dependências crypto no cliente
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const lineageHash = `SEM-LIN-\${Math.abs(hash).toString(16)}`;

    return {
      originExecutionId,
      originWorkflowId,
      originScenarioId,
      originReportId,
      lineageHash
    };
  }
}
