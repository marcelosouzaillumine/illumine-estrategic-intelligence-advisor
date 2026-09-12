import { ExecutiveAdvisorRuntimeContext } from './ExecutiveAdvisorRuntimeContext';
import { ExecutiveResponseContract } from './ExecutiveResponseContract';

/**
 * Interface do Motor de Inteligência.
 * Qualquer agente (Financeiro, Governança, etc.) deve implementar
 * este motor e respeitar o contrato de resposta.
 */
export interface ExecutiveIntelligenceEngine {
  evaluate(context: ExecutiveAdvisorRuntimeContext, query: string): Promise<ExecutiveResponseContract>;
}

export class ExecutiveIntelligencePipeline {
  /**
   * Pipeline de Inteligência Executiva.
   * Proíbe explicitamente a passagem direta de texto bruto (LLM -> UI).
   * Obriga a orquestração via RuntimeContext -> Engine -> ResponseContract.
   */
  static async execute(
    context: ExecutiveAdvisorRuntimeContext,
    engine: ExecutiveIntelligenceEngine,
    query: string
  ): Promise<ExecutiveResponseContract> {
    
    // 1. Validação de Contexto (Tenant Isolation / Continuity)
    if (!context.identity.tenantId || !context.organization.tenantId) {
      throw new Error("Pipeline Execution Halted: Missing Tenant Context.");
    }
    
    if (context.identity.tenantId !== context.organization.tenantId) {
      throw new Error("AR-GFC-COP-001: Multi-Tenant Boundary Violation.");
    }

    // 2. Execução da Inteligência
    const contract = await engine.evaluate(context, query);

    // 3. Verificação do Contrato
    if (contract.schemaVersion !== "1.0") {
      throw new Error("Pipeline Execution Halted: Invalid Response Contract Version.");
    }

    // Retorna OBRIGATORIAMENTE um contrato (objeto), NUNCA uma string solta.
    return contract;
  }
}
