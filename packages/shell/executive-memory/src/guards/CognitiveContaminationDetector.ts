import { TenantIsolationContext } from '../../../../packages/security/tenant-isolation-kernel/src';

export class CognitiveContaminationDetector {
  static detect(context: TenantIsolationContext, generation: string, promptContexts: any[]): boolean {
    // Em produção, isso faria uma inferência com um modelo leve (LLM cross-check)
    // para verificar se a saída contém dados (ex: CPNJ, Nomes) que não pertencem ao contexto fornecido.
    
    // Simulação simples
    const forbiddenKeywords = ['TENANT-X-INTERNAL', 'CONFIDENTIAL-OTHER-TENANT'];
    
    for (const kw of forbiddenKeywords) {
      if (generation.includes(kw)) {
        console.error(`[COGNITIVE_CONTAMINATION_DETECTED] Trace: ${context.traceId}. Conteúdo gerado contém informações alienígenas.`);
        return true;
      }
    }
    
    return false;
  }
}
