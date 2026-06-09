/**
 * Cadeia de rastreabilidade para dados institucionais,
 * ligando o fato extraído (target) à fonte original (source).
 */
export interface DataLineage {
  lineageId: string;
  tenantId: string;
  sourceArtifactId: string; // Ex: PDF do balanço
  targetArtifactId: string; // Ex: Registro de Liquidez Corrente
  transformationType: 'DIRECT_EXTRACTION' | 'AGGREGATION' | 'CALCULATION' | 'MANUAL_ENTRY';
  engineId?: string; // Se calculado por uma engine específica
  timestamp: string;
}
