export interface BoardDiagnosisContext {
  dreSummary: string; // O que foi concluído na DRE (eficiência)
  bpSummary: string;  // O que foi concluído no BP (patrimônio)
  dfcSummary: string; // O que foi concluído no DFC (caixa)
}

export interface BoardDiagnosisInsight {
  institutionalRisk: string;
  structuralBottleneck: string;
  survivalVector: string;
  executionRisk: string;
  requiredBoardDecision: string;
}

export class BoardDiagnosisEngine {
  /**
   * Sintetiza o diagnóstico do conselho, evitando repetições cruas de DRE, BP ou DFC.
   * O Board não repete KPIs, ele aponta tensões entre eles e decisões.
   */
  public static diagnose(context: BoardDiagnosisContext): BoardDiagnosisInsight {
    // Stub de diagnóstico com linguagem sintética de Board (Tensionamento)

    // Avalia as tensões de forma simulada baseada nos resumos para não copiar as strings.
    const isBurningCash = context.dfcSummary.toLowerCase().includes('consumo');
    const hasMarginButNoScale = context.dreSummary.toLowerCase().includes('margem') && context.dreSummary.toLowerCase().includes('escala');
    
    return {
      institutionalRisk: isBurningCash 
        ? 'Dissonância entre capacidade de geração econômica e sustentabilidade de caixa no ciclo imediato.' 
        : 'Risco moderado de estagnação caso o ciclo de capital não seja acelerado.',
      
      structuralBottleneck: hasMarginButNoScale
        ? 'A empresa demonstra capacidade de geração de margem bruta, porém insuficiente escala operacional para absorção da estrutura administrativa instalada.'
        : 'Inflexibilidade na estrutura de custos diante das flutuações de demanda.',
      
      survivalVector: 'Preservação imediata de liquidez primária enquanto se traciona a escala comercial.',
      
      executionRisk: 'Desalinhamento de incentivos entre as áreas comercial e operacional durante a escalada de volume.',
      
      requiredBoardDecision: 'O Conselho deve aprovar a reestruturação da política de overhead ou autorizar a injeção de capital para financiar a travessia de break-even de escala.'
    };
  }
}
