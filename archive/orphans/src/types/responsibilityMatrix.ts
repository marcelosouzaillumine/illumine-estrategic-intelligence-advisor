/**
 * Estrutura Base da Matriz de Responsabilidade
 * 
 * Define o fluxo de dados, processamento e interpretação estratégica dentro da plataforma.
 * Conforme Arquitetura Mestra Illumine.
 */

// 1. Domínios Oficiais da Plataforma
export type OfficialDomain =
  | 'Governança Corporativa'
  | 'Cultura Organizacional'
  | 'Gestão Administrativa e Financeira'
  | 'Gestão de Inovação'
  | 'Gestão de Marketing'
  | 'Gestão Comercial'
  | 'Gestão Operacional';

// 2. Inteligências Estruturantes (Camadas Interpretativas)
export type StructuringIntelligence =
  | 'Inteligência de Governança'
  | 'Inteligência Sistêmica'
  | 'Inteligência Institucional'
  | 'Inteligência Econômica'
  | 'Inteligência Antropológica';

// 3. Engines de Cálculo (Motores)
export type CalculationEngine = 
  | 'Motor DRE'
  | 'Motor Balanço Patrimonial'
  | 'Motor Fluxo de Caixa'
  | 'Motor DLPA'
  | 'Outros'; // Pode ser expandido futuramente

// 4. Camada Geradora de Advisory
export type AdvisoryLayer = 
  | 'Advisory Core IA'
  | 'Advisory de Governança'
  | 'Advisory de Operações';

// 5. Interface principal para a Matriz de Responsabilidade
export interface ResponsibilityMatrixEntry {
  /**
   * Nome da métrica, dado ou informação bruta (ex: "Receita Bruta", "Indicadores de Turn-over")
   */
  information: string;
  
  /**
   * Qual domínio oficial é dono dessa informação
   */
  ownerDomain: OfficialDomain;
  
  /**
   * Qual engine/motor de cálculo processa esses dados
   */
  calculationEngine: CalculationEngine;
  
  /**
   * Qual inteligência estruturante interpreta esses dados
   */
  interpretativeIntelligence: StructuringIntelligence;
  
  /**
   * Qual dashboard exibe as visualizações dessa informação (ex: "Dashboard Comercial")
   */
  displayDashboard: string;
  
  /**
   * Qual camada gera os pareceres (advisory) finais
   */
  advisoryLayer: AdvisoryLayer;
}
