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
  hasMinimumInference: false
};

export function inferBusinessIdentity(
  segmentoAtuacao?: string, 
  anosHistorico: number = 0
): Readonly<BusinessIdentity> {
  
  if (!segmentoAtuacao || segmentoAtuacao.trim() === '') {
    return Object.freeze({ ...INDEFINIDO_IDENTITY });
  }

  const normSegmento = segmentoAtuacao.toLowerCase().trim();
  
  // Base configuration
  const identity: BusinessIdentity = {
    modeloDeNegocio: 'Modelo Não Classificado',
    setor: segmentoAtuacao, // Keep original casing where possible
    subsetor: 'Geral',
    intensidadeCapital: 'Asset Moderate',
    intensidadeEstoque: 'Moderada',
    perfilOperacional: 'Operação de escopo geral',
    estagioMaturidade: inferMaturity(anosHistorico),
    previsibilidadeReceita: 'Volátil',
    perfilLiquidez: 'Exigência Moderada',
    perfilCrescimento: 'Orgânico/Convencional',
    hasMinimumInference: true
  };

  // 1. Industry / Indústria Mapping
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
      identity.intensidadeCapital = 'Asset Moderate'; // Cosméticos geralmente terceirizam ou não têm maquinário tão pesado quanto base
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
    identity.perfilLiquidez = 'Exigência Moderada'; // Devido à previsibilidade, mas há glosas
    identity.perfilCrescimento = 'Expansão de Capacidade / Ticket';
    identity.perfilOperacional = 'Capital intensivo (equipamentos/plantas), fluxo de recebimento complexo (planos de saúde/glosas) e alta resiliência.';
  }

  return Object.freeze(identity);
}

function inferMaturity(anosHistorico: number): string {
  if (anosHistorico === 0) return 'Indefinido (Histórico Ausente)';
  if (anosHistorico === 1) return 'Primeiro Ciclo Operacional';
  if (anosHistorico <= 3) return 'Estágio Inicial / Consolidação';
  if (anosHistorico <= 7) return 'Estágio de Tração / Crescimento';
  return 'Maturidade Corporativa';
}
