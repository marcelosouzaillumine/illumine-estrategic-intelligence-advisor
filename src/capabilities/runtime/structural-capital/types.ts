/**
 * STRUCTURAL CAPITAL INTELLIGENCE — TYPE CONTRACTS
 *
 * ============================================================================
 * PRINCÍPIO CENTRAL: Todos os contratos desta camada são consumidos
 * exclusivamente pelo StructuralCapitalOrchestrator e pelo
 * ExecutiveIntelligenceRuntime. Nenhum componente React pode importar
 * ou referenciar diretamente tipos desta camada para fins de cálculo.
 * ============================================================================
 *
 * Linguagem obrigatória nas narrativas:
 *   "indícios", "sinais", "pressão estrutural", "dependência operacional"
 *
 * Proibido em qualquer output desta camada:
 *   "colapso", "insolvência", "fraude", "má-fé", "irregularidade", "desvio"
 */

// ─────────────────────────────────────────────────────────────────────────────
// SINAIS ESTRUTURAIS
// Cada sinal é ativado por um threshold determinístico e explícito.
// ─────────────────────────────────────────────────────────────────────────────

export type StructuralCapitalSignal =
  | 'HIGH_INVENTORY_LIQUIDITY_PRESSURE'          // estoques > 55% do AC
  | 'INVENTORY_CAPITAL_IMMOBILIZATION'           // estoques > 120% do PC
  | 'HIGH_SUPPLIER_DEPENDENCY'                   // fornecedores > 50% do PT
  | 'SUPPLIER_OPERATIONAL_FRAGILITY'             // fornecedores > 40% do AC
  | 'HIGH_SHAREHOLDER_OPERATIONAL_INTERDEPENDENCE' // creditosSocios > 20% AT
  | 'SHAREHOLDER_PATRIMONIAL_CONCENTRATION'      // creditosSocios > 30% PL
  | 'LOW_REAL_LIQUIDITY'                         // realLiquidityStrength < 0.5
  | 'CASH_COVERAGE_DEFICIT'                      // caixa < 15% do PC
  | 'CAPITAL_COMPRESSION_ACTIVE';                // combinação de múltiplos sinais

// ─────────────────────────────────────────────────────────────────────────────
// SEVERIDADE ESTRUTURAL
// Escala ordinal determinística — nunca inferida subjetivamente.
// ─────────────────────────────────────────────────────────────────────────────

export type StructuralCapitalSeverity =
  | 'NONE'      // nenhum sinal ativo
  | 'LOW'       // 1 sinal de baixa intensidade
  | 'MODERATE'  // 2 sinais ou 1 sinal de alta intensidade
  | 'HIGH'      // 3+ sinais ou combinação crítica
  | 'CRITICAL'; // múltiplos sinais HIGH simultâneos + compressão de caixa

// ─────────────────────────────────────────────────────────────────────────────
// ESTÁGIO ESTRUTURAL DE CAPITAL
// Paralelo ao BusinessStage existente — não substitui, coexiste.
// ─────────────────────────────────────────────────────────────────────────────

export type StructuralCapitalStage =
  | 'STRUCTURALLY_FUNCTIONAL_OPERATION'           // nenhum sinal crítico
  | 'OPERATIONAL_STABILITY_WITH_CAPITAL_PRESSURE' // 1-2 sinais LOW/MODERATE
  | 'LIQUIDITY_TENSIONED_OPERATION'               // LOW_REAL_LIQUIDITY ou CASH_COVERAGE_DEFICIT
  | 'SUPPLIER_DEPENDENT_OPERATION'                // HIGH_SUPPLIER_DEPENDENCY dominante
  | 'CAPITAL_IMBALANCED_OPERATION';               // múltiplos sinais HIGH/CRITICAL

// ─────────────────────────────────────────────────────────────────────────────
// PERFIS POR TRILHA
// ─────────────────────────────────────────────────────────────────────────────

export interface InventoryLiquidityProfile {
  /** estoques / ativoCirculante */
  inventoryToCurrentAssetsRatio: number;
  /** estoques / passivoCirculante */
  inventoryOperationalDependency: number;
  /** estoques / (caixa + clientes) */
  inventoryCashConversionStress: number;
  /** estoques / ativoTotal */
  inventoryCapitalImmobilization: number;
  /** Sinais ativados por esta trilha */
  activeSignals: StructuralCapitalSignal[];
  /** Explicação determinística dos sinais ativados */
  explanation: string;
}

export interface SupplierDependencyProfile {
  /** fornecedores / passivoTotal */
  supplierToTotalLiabilities: number;
  /** fornecedores / patrimonioLiquido */
  supplierToEquity: number;
  /** fornecedores / estoques (se estoques > 0, senão N/A) */
  supplierToInventory: number | null;
  /** fornecedores > 40% do AC */
  supplierLiquidityFragility: boolean;
  /** Nível de funding operacional via fornecedores */
  supplierOperationalFundingLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  /** Score de dependência 0–100 (maior = mais dependente) */
  supplierDependencyScore: number;
  /** Sinais ativados por esta trilha */
  activeSignals: StructuralCapitalSignal[];
  /** Explicação determinística */
  explanation: string;
}

export interface ShareholderExposureProfile {
  /** creditosSocios / ativoTotal */
  shareholderCurrentAccountRatio: number;
  /** creditosSocios / patrimonioLiquido */
  shareholderConcentration: number;
  /** true quando ambos thresholds (>20% AT e >30% PL) são atingidos */
  impliedGovernanceFrailty: boolean;
  /** Nível de tensão fiduciária */
  fiduciaryTensionLevel: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH';
  /** Sinais ativados por esta trilha */
  activeSignals: StructuralCapitalSignal[];
  /** Explicação determinística — linguagem fiduciária obrigatória */
  explanation: string;
}

export interface OperationalLiquidityProfile {
  /** (caixa + clientes * 0.7) / passivoCirculante */
  realLiquidityStrength: number;
  /** caixa / passivoCirculante */
  operationalCashPressure: number;
  /** (AC - estoques * penaltyFactor) / PC */
  workingCapitalRealityIndex: number;
  /**
   * Capacidade imediata de cobertura: quantos meses de PC o caixa atual cobre.
   * Calculado como: (caixa / passivoCirculante) * 12
   */
  immediateCoverageCapacityMonths: number;
  /** Sinais ativados por esta trilha */
  activeSignals: StructuralCapitalSignal[];
  /** Explicação determinística */
  explanation: string;
}

export interface CapitalCompressionProfile {
  /** true se CAPITAL_COMPRESSION_ACTIVE foi ativado */
  isActive: boolean;
  /** Número de sinais HIGH ou CRITICAL simultâneos */
  concurrentHighSignalCount: number;
  /** Descrição da compressão detectada */
  compressionDescription: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTIVE ATTENTION MAP
// ─────────────────────────────────────────────────────────────────────────────

export interface ExecutiveAttentionMap {
  /** Riscos que exigem ação imediata */
  critical: string[];
  /** Riscos de otimização — diferidos quando há sinais críticos ativos */
  secondary: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PERFIL CONSOLIDADO — STRUCTURAL CAPITAL PROFILE
// Output final do StructuralCapitalOrchestrator
// ─────────────────────────────────────────────────────────────────────────────

export interface StructuralCapitalProfile {
  /** Lista de sinais estruturais ativos */
  signals: StructuralCapitalSignal[];
  /** Severidade estrutural consolidada */
  severity: StructuralCapitalSeverity;
  /** Estágio estrutural de capital (paralelo ao BusinessStage) */
  structuralStage: StructuralCapitalStage;
  /** Perfil de qualidade de estoques */
  inventory: InventoryLiquidityProfile;
  /** Perfil de dependência de fornecedores */
  supplier: SupplierDependencyProfile;
  /** Perfil de exposição societária */
  shareholder: ShareholderExposureProfile;
  /** Perfil de liquidez operacional real */
  liquidity: OperationalLiquidityProfile;
  /** Perfil de compressão de capital */
  compression: CapitalCompressionProfile;
  /**
   * Delta de ajuste do composite score.
   * Negativo = penalização. Positivo = bonificação.
   * Intervalo: [-20, +5]
   * Aplicado exclusivamente pelo StructuralCapitalOrchestrator.
   */
  scoreAdjustment: number;
  /**
   * Prioridades executivas reordenadas conforme severidade estrutural.
   * Substitui (injeta no início) o advisory.actionMatrix quando severity >= HIGH.
   */
  advisoryPriorities: string[];
  /**
   * Narrativa fiduciária institucional.
   * Gerada determinísticamente a partir dos sinais ativos.
   * Nunca contém: "colapso", "insolvente", "fraude", "má-fé", "irregularidade".
   */
  fiduciaryNarrative: string;
  /** Hierarquização de riscos executivos */
  executiveAttentionMap: ExecutiveAttentionMap;
  /**
   * Trilha de auditoria: mapeamento de campo → valor observado → threshold disparado.
   * Obrigatório quando severity = CRITICAL.
   */
  auditTrail: Record<string, string>;
}
