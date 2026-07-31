export class ExecutiveConversationIsolationViolationError extends Error {
  constructor(message?: string) {
    // Governance Error Message standard (não expor detalhes técnicos)
    super(message || 'Este contexto executivo não está disponível para esta identidade.');
    this.name = 'ExecutiveConversationIsolationViolationError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExecutiveConversationIsolationViolationError);
    }
  }
}
