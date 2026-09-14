/**
 * Evento de Auditoria e Aprendizado Contínuo.
 * Gerado quando a plataforma confronta uma decisão antiga com o resultado real alcançado,
 * criando uma nova regra empírica para o "cérebro" da empresa.
 */
export interface LearningEvent {
  /**
   * ID da Decisão original que gerou este evento
   */
  sourceDecisionId: string;
  
  /**
   * Evidência contábil real que refutou ou confirmou a premissa da decisão passada
   */
  evidence: string;
  
  /**
   * Causa confirmada matematicamente/factualmente pelos dados.
   * Ex: "Houve queda cambial de 15% impactando as margens."
   */
  confirmedCause: string;

  /**
   * Causa presumida que requer investigação adicional.
   * Ex: "Possível ineficiência na conversão de novos leads operacionais."
   */
  presumedCause: string;

  /**
   * A responsabilidade real da decisão sobre o resultado (Erro de premissa interna vs Mudança externa).
   * Ex: "Mudança Externa de Cenário" ou "Erro de Premissa Estratégica"
   */
  decisionResponsibility: string;
  
  /**
   * O aprendizado institucional extraído (Ex: "Expansão sem validação de demanda destrói margem")
   */
  lesson: string;
  
  /**
   * Nível de confiança na lição aprendida (correlação entre a decisão e o resultado)
   */
  confidence: number;
  
  /**
   * Qual conselheiro/CFO validou que este aprendizado é real e deve integrar o algoritmo da empresa
   */
  approvedBy: string;
  
  timestamp: string; // ISO String
}
