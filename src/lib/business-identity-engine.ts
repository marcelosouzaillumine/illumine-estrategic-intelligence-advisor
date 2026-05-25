import { InferenceData } from './business-inference-engine';

export interface BusinessIdentity {
  modeloDeNegocio: string;
  setor: string;
  subsetor: string;
  intensidadeCapital: 'Asset Light' | 'Asset Moderate' | 'Asset Heavy' | 'Indefinida';
  intensidadeEstoque: 'Baixa' | 'Moderada' | 'Alta' | 'Indefinida';
  perfilOperacional: string;
  estagioMaturidade: string;
  previsibilidadeReceita: 'Alta' | 'Sazonal/Sensível à Demanda' | 'Volátil' | 'Indefinida';
  perfilLiquidez: 'Exigência Alta' | 'Exigência Moderada' | 'Flexível' | 'Indefinido';
  perfilCrescimento: string;
  hasMinimumInference: boolean;
  archetypeInference?: string;
  maturityStage?: string;
  inventoryBehavior?: string;
  sectorBehaviorProfile?: string;
  inferenceData?: InferenceData;
}

export const INDEFINIDO_IDENTITY: BusinessIdentity = {
  modeloDeNegocio: 'Indefinido',
  setor: 'Indefinido',
  subsetor: 'Indefinido',
  intensidadeCapital: 'Indefinida',
  intensidadeEstoque: 'Indefinida',
  perfilOperacional: 'Ausência de parâmetros operacionais base',
  estagioMaturidade: 'Indefinido',
  previsibilidadeReceita: 'Indefinida',
  perfilLiquidez: 'Indefinido',
  perfilCrescimento: 'Indefinido',
  hasMinimumInference: false,
  archetypeInference: 'Indefinido',
  maturityStage: 'Indefinido',
  inventoryBehavior: 'Indefinido',
  sectorBehaviorProfile: 'Indefinido'
};

import { BPSummary } from './bpEngine';
import { inferOperationalModel, OperationalInference } from './business-inference-engine';

export function inferBusinessIdentity(
  segmentoAtuacao?: string, 
  anosHistorico: number = 0,
  bpSummary?: BPSummary,
  dreCascade?: any[],
  clientValidation?: any // Object containing human override
): Readonly<BusinessIdentity> {
  
  const normSegmento = (segmentoAtuacao || '').toLowerCase().trim();
  
  // Base configuration
  let identity: BusinessIdentity = {
    modeloDeNegocio: 'Modelo Não Classificado',
    setor: segmentoAtuacao || 'Indefinido',
    subsetor: 'Geral',
    intensidadeCapital: 'Asset Moderate',
    intensidadeEstoque: 'Moderada',
    perfilOperacional: 'Operação de escopo geral',
    estagioMaturidade: inferMaturity(anosHistorico),
    previsibilidadeReceita: 'Volátil',
    perfilLiquidez: 'Exigência Moderada',
    perfilCrescimento: 'Orgânico/Convencional',
    hasMinimumInference: !!segmentoAtuacao,
    sectorBehaviorProfile: normSegmento,
    archetypeInference: 'Pendente de Inferência Causal',
    inventoryBehavior: 'Pendente de Inferência Causal',
    maturityStage: inferMaturity(anosHistorico)
  };

  // Se houver validação humana (override), ela tem prioridade máxima.
  if (clientValidation && clientValidation.modeloDeNegocio) {
    return Object.freeze({
      ...identity,
      ...clientValidation,
      inferenceData: {
        confidenceScore: 100,
        adherenceLevel: 'Alto',
        explainability: ['Modelo de negócio validado e fixado manualmente pelo usuário.'],
        isHumanOverridden: true
      }
    });
  }

  // 1. Industry / Indústria Mapping (Fallback if no data)
  if (normSegmento.includes('indústria') || normSegmento.includes('industria') || normSegmento.includes('manufatura')) {
    identity.modeloDeNegocio = 'Asset Heavy / Industrial';
    identity.intensidadeCapital = 'Asset Heavy';
    identity.intensidadeEstoque = 'Alta';
    identity.previsibilidadeReceita = 'Sazonal/Sensível à Demanda';
    identity.perfilLiquidez = 'Flexível';
    identity.perfilCrescimento = 'Capital Intensivo';

    if (normSegmento.includes('cosmético')) {
      identity.subsetor = 'Cosméticos / Cuidados Pessoais';
      identity.perfilOperacional = 'Produção + Distribuição com forte dependência de tendências e giro moderado.';
      identity.intensidadeCapital = 'Asset Moderate';
    } else {
      identity.perfilOperacional = 'Planta produtiva com alto custo fixo, ciclo de conversão longo e dependência de escala.';
    }
  }
  // 2. Comércio / Varejo
  else if (normSegmento.includes('varejo') || normSegmento.includes('comércio') || normSegmento.includes('distribuição')) {
    identity.modeloDeNegocio = 'Comércio / Distribuição';
    identity.intensidadeCapital = 'Asset Moderate';
    identity.intensidadeEstoque = 'Alta';
    identity.previsibilidadeReceita = 'Volátil';
    identity.perfilLiquidez = 'Exigência Alta';
    identity.perfilCrescimento = 'Giro de Estoque / Abertura de PDV';
    identity.perfilOperacional = 'Forte dependência de fluxo de caixa diário, sensibilidade a ruptura de estoque e necessidade contínua de giro.';
  }
  // 3. SaaS / Tech / Asset Light
  else if (normSegmento.includes('tecnologia') || normSegmento.includes('software') || normSegmento.includes('saas')) {
    identity.modeloDeNegocio = 'Asset Light / SaaS';
    identity.intensidadeCapital = 'Asset Light';
    identity.intensidadeEstoque = 'Baixa';
    identity.previsibilidadeReceita = 'Alta';
    identity.perfilLiquidez = 'Exigência Moderada';
    identity.perfilCrescimento = 'Escalabilidade Exponencial (CAC/LTV)';
    identity.perfilOperacional = 'Margens brutas elevadas, crescimento guiado por OPEX (Vendas/Marketing) em vez de CAPEX.';
  }
  // 4. Serviços Operacionais
  else if (normSegmento.includes('serviço') || normSegmento.includes('servico')) {
    identity.modeloDeNegocio = 'Serviços Operacionais';
    identity.intensidadeCapital = 'Asset Light';
    identity.intensidadeEstoque = 'Baixa';
    identity.previsibilidadeReceita = 'Sazonal/Sensível à Demanda';
    identity.perfilLiquidez = 'Exigência Alta';
    identity.perfilCrescimento = 'Alocação de Mão de Obra';
    identity.perfilOperacional = 'Forte dependência de folha de pagamento, pouca barreira patrimonial, caixa altamente atrelado aos recebíveis.';
  }
  // 5. Agronegócio
  else if (normSegmento.includes('agro') || normSegmento.includes('rural')) {
    identity.modeloDeNegocio = 'Agronegócio';
    identity.intensidadeCapital = 'Asset Heavy';
    identity.intensidadeEstoque = 'Alta';
    identity.previsibilidadeReceita = 'Volátil';
    identity.perfilLiquidez = 'Flexível';
    identity.perfilCrescimento = 'Expansão de Área / Produtividade';
    identity.perfilOperacional = 'Extremamente sazonal, alto investimento imobilizado e dependência de fatores exógenos (clima, câmbio).';
  }
  // 6. Saúde / Hospital
  else if (normSegmento.includes('saúde') || normSegmento.includes('hospital') || normSegmento.includes('clínica')) {
    identity.modeloDeNegocio = 'Asset Heavy / Saúde';
    identity.intensidadeCapital = 'Asset Heavy';
    identity.intensidadeEstoque = 'Moderada';
    identity.previsibilidadeReceita = 'Alta';
    identity.perfilLiquidez = 'Exigência Moderada';
    identity.perfilCrescimento = 'Expansão de Capacidade / Ticket';
    identity.perfilOperacional = 'Capital intensivo (equipamentos/plantas), fluxo de recebimento complexo (planos de saúde/glosas) e alta resiliência.';
  }

  // Tenta realizar a inferência financeira
  if (bpSummary && dreCascade && dreCascade.length > 0) {
    const finInference = inferOperationalModel(bpSummary, dreCascade);
    
    // Se a confiança for maior que 70%, sobrescreve a base textual
    if (finInference && finInference.inferenceData.confidenceScore > 70) {
      identity.modeloDeNegocio = finInference.modeloDeNegocio;
      identity.setor = finInference.setor;
      identity.intensidadeCapital = finInference.intensidadeCapital;
      identity.intensidadeEstoque = finInference.intensidadeEstoque;
      identity.previsibilidadeReceita = finInference.previsibilidadeReceita;
      identity.inferenceData = finInference.inferenceData;
      identity.hasMinimumInference = true;
      
      // Ajuste de perfil operacional baseado na inferência financeira
      if (finInference.modeloDeNegocio.includes('Asset Light')) {
         identity.perfilOperacional = 'Estrutura inferida financeiramente como Asset Light, com alta margem bruta e baixo imobilizado.';
         identity.perfilCrescimento = 'Expansão de Receita (Opex)';
      } else if (finInference.modeloDeNegocio.includes('Indústria')) {
         identity.perfilOperacional = 'Operação industrial intensa, inferida via presença robusta de estoque, fornecedores e custo da mercadoria/produto.';
         identity.perfilCrescimento = 'Alavancagem Produtiva e de Estoque';
      } else if (finInference.modeloDeNegocio.includes('Infraestrutura')) {
         identity.perfilOperacional = 'Volume relevante de ativos imobilizados suporta a tese de operação voltada a infraestrutura ou saúde (Asset Heavy).';
         identity.perfilCrescimento = 'Aumento de Capacidade Operacional';
      } else if (finInference.modeloDeNegocio.includes('Comércio')) {
         identity.perfilOperacional = 'Forte dinâmica de estoque e giro, inferida como comércio ou distribuição.';
         identity.perfilCrescimento = 'Giro e Abertura de Mercado';
      }
    } else {
      // Guarda a inferência mesmo que baixa para fins de explainability (se ainda não houver)
      identity.inferenceData = finInference.inferenceData;
    }
  }

  if (!identity.inferenceData) {
    identity.inferenceData = {
      confidenceScore: 0,
      adherenceLevel: 'Baixo',
      explainability: ['Inferência baseada apenas no segmento cadastrado.']
    };
  }

  return Object.freeze(identity);
}

function inferMaturity(anosHistorico: number): string {
  if (anosHistorico === 0) return 'Indefinido (Histórico Ausente)';
  if (anosHistorico < 3) return 'Maturidade não atestável (Histórico < 3 ciclos)';
  if (anosHistorico <= 5) return 'Maturidade Pendente de Validação Causal';
  return 'Maturidade Corporativa (Sujeito a Validação)';
}
