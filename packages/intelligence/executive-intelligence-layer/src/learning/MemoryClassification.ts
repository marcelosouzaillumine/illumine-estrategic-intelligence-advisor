/**
 * Governança de acessibilidade da Memória Institucional.
 * Define quem pode ler e como a plataforma trata o histórico.
 */
export enum MemoryClassification {
  /**
   * Registro privado da sessão do usuário. Não compõe a memória coletiva.
   */
  PRIVATE = 'PRIVATE',
  
  /**
   * Histórico técnico interno (Ex: falhas de integração).
   */
  INTERNAL = 'INTERNAL',
  
  /**
   * Decisão executiva padrão, visível para a diretoria.
   */
  EXECUTIVE = 'EXECUTIVE',
  
  /**
   * Decisão estrutural grave, restrita a conselheiros.
   */
  BOARD_LEVEL = 'BOARD_LEVEL',
  
  /**
   * Registro bloqueado. Inalterável. Usado para auditoria de compliance (Ex: bloqueio de dividendos ilegais).
   */
  FIDUCIARY_RECORD = 'FIDUCIARY_RECORD'
}
