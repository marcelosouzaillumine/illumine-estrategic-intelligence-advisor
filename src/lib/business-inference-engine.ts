import { BPSummary } from './bpEngine';

export interface InferenceRuleContext {
  bpSummary: BPSummary;
  dreCascade: any[]; // Array from dreCascade.ts containing computedValue
}

export interface InferenceData {
  confidenceScore: number;
  adherenceLevel: 'Alto' | 'Médio' | 'Baixo';
  explainability: string[];
  isHumanOverridden?: boolean;
}

export interface OperationalInference {
  modeloDeNegocio: string;
  setor: string;
  intensidadeCapital: 'Asset Light' | 'Asset Moderate' | 'Asset Heavy' | 'Indefinida';
  intensidadeEstoque: 'Baixa' | 'Moderada' | 'Alta' | 'Indefinida';
  previsibilidadeReceita: 'Alta' | 'Sazonal/Sensível à Demanda' | 'Volátil' | 'Indefinida';
  inferenceData: InferenceData;
}

function getDreValue(dreCascade: any[], id: string): number {
  if (!dreCascade || dreCascade.length === 0) return 0;
  const row = dreCascade.find(r => r.id === id);
  return row ? Math.abs(row.computedValue || row.value || 0) : 0;
}

export function inferOperationalModel(
  bpSummary: BPSummary,
  dreCascade: any[]
): OperationalInference {
  const {
    ativoTotal,
    ativoCirculante,
    restritaConversibilidade, // proxy for Imobilizado/Intangível
    estoques,
    fornecedores,
    passivoTotal
  } = bpSummary || {};

  const rol = getDreValue(dreCascade, 'ROL');
  const custos = getDreValue(dreCascade, 'CUSTOS');
  const lucroBruto = getDreValue(dreCascade, 'LUCRO_BRUTO');
  
  const hasData = ativoTotal > 0;
  
  if (!hasData) {
    return {
      modeloDeNegocio: 'Indefinido',
      setor: 'Indefinido',
      intensidadeCapital: 'Indefinida',
      intensidadeEstoque: 'Indefinida',
      previsibilidadeReceita: 'Indefinida',
      inferenceData: {
        confidenceScore: 0,
        adherenceLevel: 'Baixo',
        explainability: ['Dados insuficientes para inferência financeira.']
      }
    };
  }

  const imobilizadoPerc = ativoTotal > 0 ? restritaConversibilidade / ativoTotal : 0;
  const estoqueAC = ativoCirculante > 0 ? estoques / ativoCirculante : 0;
  const estoqueAT = ativoTotal > 0 ? estoques / ativoTotal : 0;
  const fornecedoresPerc = passivoTotal > 0 ? fornecedores / passivoTotal : 0;
  const margemBruta = rol > 0 ? lucroBruto / rol : 0;

  let bestMatch: OperationalInference | null = null;
  let highestScore = 0;

  // Rule 1: Indústria / Comércio / Distribuição
  let indScore = 0;
  const indExplains: string[] = [];
  if (estoqueAC > 0.30 || estoqueAT > 0.15) {
    indScore += 40;
    indExplains.push('Estoque elevado (sinaliza comercialização ou manufatura).');
  }
  if (fornecedoresPerc > 0.10) {
    indScore += 20;
    indExplains.push('Concentração relevante em fornecedores comerciais.');
  }
  if (custos > 0 && rol > 0) {
    indScore += 30;
    indExplains.push('Presença estrutural de CMV/CPV (Custos Diretos).');
  }
  if (imobilizadoPerc > 0.20) {
    indScore += 10;
    indExplains.push('Ativo fixo material suporta tese industrial.');
  } else if (indScore > 50) {
    indExplains.push('Baixo imobilizado sugere mais Comércio/Distribuição do que Indústria pesada.');
  }

  if (indScore > highestScore) {
    highestScore = indScore;
    bestMatch = {
      modeloDeNegocio: imobilizadoPerc > 0.20 ? 'Indústria / Manufatura' : 'Comércio / Distribuição',
      setor: imobilizadoPerc > 0.20 ? 'Indústria' : 'Comércio',
      intensidadeCapital: imobilizadoPerc > 0.20 ? 'Asset Heavy' : 'Asset Moderate',
      intensidadeEstoque: 'Alta',
      previsibilidadeReceita: 'Sazonal/Sensível à Demanda',
      inferenceData: {
        confidenceScore: indScore,
        adherenceLevel: indScore > 80 ? 'Alto' : indScore > 60 ? 'Médio' : 'Baixo',
        explainability: indExplains
      }
    };
  }

  // Rule 2: SaaS / Tech / Serviços (Asset Light)
  let saasScore = 0;
  const saasExplains: string[] = [];
  if (imobilizadoPerc < 0.15) {
    saasScore += 40;
    saasExplains.push('Baixa retenção de capital fixo (Asset-light).');
  }
  if (estoqueAT < 0.05) {
    saasScore += 30;
    saasExplains.push('Ausência quase total de estoques.');
  }
  if (margemBruta > 0.50) {
    saasScore += 20;
    saasExplains.push('Margem bruta elevada típica de serviços/software.');
  }
  if (custos === 0 && rol > 0) {
    saasScore += 10;
    saasExplains.push('Operação sem custos diretos declarados (foco em Opex).');
  }

  if (saasScore > highestScore) {
    highestScore = saasScore;
    bestMatch = {
      modeloDeNegocio: 'Serviços / Asset Light',
      setor: margemBruta > 0.6 ? 'Tecnologia / SaaS' : 'Serviços',
      intensidadeCapital: 'Asset Light',
      intensidadeEstoque: 'Baixa',
      previsibilidadeReceita: margemBruta > 0.6 ? 'Alta' : 'Sazonal/Sensível à Demanda',
      inferenceData: {
        confidenceScore: saasScore,
        adherenceLevel: saasScore > 80 ? 'Alto' : saasScore > 60 ? 'Médio' : 'Baixo',
        explainability: saasExplains
      }
    };
  }

  // Rule 3: Hospital / Infraestrutura (Asset Heavy s/ Estoque excessivo)
  let infraScore = 0;
  const infraExplains: string[] = [];
  if (imobilizadoPerc > 0.40) {
    infraScore += 50;
    infraExplains.push('Concentração maciça em ativos imobilizados (Asset Heavy).');
  }
  if (estoqueAT < 0.15 && estoqueAT > 0) {
    infraScore += 20;
    infraExplains.push('Estoque operacional moderado (ex: insumos hospitalares/manutenção).');
  }
  if (margemBruta > 0.20 && margemBruta < 0.60) {
    infraScore += 10;
    infraExplains.push('Margem bruta intermediária, típica de operação intensiva em infraestrutura.');
  }

  if (infraScore > highestScore) {
    highestScore = infraScore;
    bestMatch = {
      modeloDeNegocio: 'Infraestrutura / Saúde',
      setor: 'Infraestrutura',
      intensidadeCapital: 'Asset Heavy',
      intensidadeEstoque: 'Moderada',
      previsibilidadeReceita: 'Alta',
      inferenceData: {
        confidenceScore: infraScore,
        adherenceLevel: infraScore > 80 ? 'Alto' : infraScore > 60 ? 'Médio' : 'Baixo',
        explainability: infraExplains
      }
    };
  }

  if (!bestMatch) {
    return {
      modeloDeNegocio: 'Indefinido',
      setor: 'Indefinido',
      intensidadeCapital: 'Indefinida',
      intensidadeEstoque: 'Indefinida',
      previsibilidadeReceita: 'Indefinida',
      inferenceData: {
        confidenceScore: 0,
        adherenceLevel: 'Baixo',
        explainability: ['Não foi possível inferir o modelo com confiança estatística.']
      }
    };
  }

  return bestMatch;
}
