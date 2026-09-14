import { MemoryType, ExecutiveMemoryArtifact, MemoryLifecycleStatus } from './contracts/ExecutiveMemoryArtifact';
import { MemoryConfidenceLevel } from './contracts/MemoryConfidenceLevel';

export class ExecutiveMemoryClassifier {
  public classify(content: string, sourceUser: string): ExecutiveMemoryArtifact | null {
    const text = content.toLowerCase();

    // Filtro de ruído: descartar interjeições ou comandos puros sem valor executivo
    if (text.includes('ok') || text.includes('entendido') || text.includes('mostre novamente') || text.includes('obrigado')) {
      return null;
    }

    let type = MemoryType.INSIGHT;
    let confidence = MemoryConfidenceLevel.WORKING_HYPOTHESIS;

    if (text.includes('decisão') || text.includes('aprovado') || text.includes('investir')) {
      type = MemoryType.DECISION_CONTEXT;
    } else if (text.includes('risco') || text.includes('caiu') || text.includes('pressão')) {
      type = MemoryType.RISK;
    } else if (text.includes('oportunidade') || text.includes('crescer')) {
      type = MemoryType.OPPORTUNITY;
    } else if (text.includes('?')) {
      type = MemoryType.QUESTION;
    }

    // Se a origem for a plataforma, é fato ou insight validado. Se for o usuário discutindo, é hipótese exploratória
    if (sourceUser === 'Financial Governance Engine') {
      confidence = MemoryConfidenceLevel.FACT;
    } else if (sourceUser === 'ExecutiveFinancialAgent') {
      confidence = MemoryConfidenceLevel.VALIDATED_INSIGHT;
    } else {
      confidence = text.includes('talvez') || text.includes('pode ser') 
        ? MemoryConfidenceLevel.EXPLORATORY 
        : MemoryConfidenceLevel.WORKING_HYPOTHESIS;
    }

    return {
      id: `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      tenantId: 'tenant_1', // mocked for foundation
      type,
      content,
      source: {
        conversationId: 'conv_1',
        user: sourceUser,
        timestamp: new Date().toISOString()
      },
      confidence,
      lifecycle: {
        status: MemoryLifecycleStatus.ACTIVE
      },
      governance: {
        humanValidated: sourceUser !== 'ExecutiveFinancialAgent' && sourceUser !== 'Financial Governance Engine',
        createdBy: sourceUser
      }
    };
  }
}
