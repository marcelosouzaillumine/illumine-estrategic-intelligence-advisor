import { BPSummary } from '../../../lib/bpEngine';

type HealthStatus = 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'INSUFFICIENT_DATA';
type EngineModule = 'LIQUIDITY' | 'CAPITAL_STRUCTURE' | 'ASSET_QUALITY' | 'WORKING_CAPITAL' | 'PRESERVATION';

interface VariationSet {
  primaryDriver: string;
  executiveNarrative: string;
  justification?: string;
  managerialImplication?: string;
  priorityAction: string;
}

const NARRATIVES: Record<EngineModule, Record<HealthStatus, VariationSet[]>> = {
  LIQUIDITY: {
    EXCELLENT: [
      { primaryDriver: 'Liquidez elevada', executiveNarrative: 'A liquidez supera significativamente o patamar necessário para suportar as operações correntes, sugerindo oportunidade de otimização da estrutura de capital e melhoria da eficiência na alocação dos recursos.', managerialImplication: 'Geração de caixa e ativos líquidos superam significativamente as obrigações imediatas.', priorityAction: 'Manter estratégia atual e avaliar alocação de excedentes de caixa em operações de maior rentabilidade.' },
      { primaryDriver: 'Folga financeira robusta', executiveNarrative: 'A liquidez supera significativamente o patamar necessário para suportar as operações correntes, sugerindo oportunidade de otimização da estrutura de capital e melhoria da eficiência na alocação dos recursos.', managerialImplication: 'A disponibilidade de ativos de alta conversibilidade está em patamares excelentes.', priorityAction: 'Manter estratégia atual e avaliar alocação de excedentes de caixa em operações de maior rentabilidade.' },
      { primaryDriver: 'Blindagem de curto prazo', executiveNarrative: 'A liquidez supera significativamente o patamar necessário para suportar as operações correntes, sugerindo oportunidade de otimização da estrutura de capital e melhoria da eficiência na alocação dos recursos.', managerialImplication: 'A relação de liquidez comprova solidez absoluta frente a obrigações vincendas.', priorityAction: 'Manter estratégia atual e avaliar alocação de excedentes de caixa em operações de maior rentabilidade.' }
    ],
    HEALTHY: [
      { primaryDriver: 'Cobertura de caixa adequada', executiveNarrative: 'O perfil de liquidez é saudável e suficiente para o giro normal dos negócios, sem sinais de pressão iminente.', managerialImplication: 'Os ativos circulantes suportam as dívidas de curto prazo de maneira orgânica.', priorityAction: 'Monitorar ciclo financeiro para garantir a estabilidade da cobertura de curto prazo.' },
      { primaryDriver: 'Liquidez orgânica preservada', executiveNarrative: 'A companhia demonstra capacidade adequada de cobertura das suas obrigações táticas.', managerialImplication: 'O fluxo de conversão permite a quitação de passivos dentro dos ciclos estipulados.', priorityAction: 'Monitorar ciclo financeiro para garantir a estabilidade da cobertura de curto prazo.' },
      { primaryDriver: 'Estabilidade de curto prazo', executiveNarrative: 'As obrigações imediatas estão bem equalizadas com a capacidade de geração de liquidez.', managerialImplication: 'Existe equilíbrio entre direitos de curto prazo e exigibilidades.', priorityAction: 'Monitorar ciclo financeiro para garantir a estabilidade da cobertura de curto prazo.' }
    ],
    WARNING: [
      { primaryDriver: 'Liquidez sob pressão', executiveNarrative: 'A capacidade de pagamento de curto prazo apresenta desgaste, exigindo monitoramento ativo do fluxo de caixa.', managerialImplication: 'O volume de exigibilidades está pressionando a margem de segurança disponível.', priorityAction: 'Otimizar gestão do capital de giro e revisar prazos de pagamentos e recebimentos.' },
      { primaryDriver: 'Aperto tático no caixa', executiveNarrative: 'Observa-se um descasamento tático entre a velocidade de conversão dos ativos e as obrigações imediatas.', managerialImplication: 'Redução na folga financeira demanda ações de otimização de tesouraria.', priorityAction: 'Otimizar gestão do capital de giro e revisar prazos de pagamentos e recebimentos.' },
      { primaryDriver: 'Cobertura imediata frágil', executiveNarrative: 'A margem de liquidez está comprimida, indicando potencial necessidade de reperfilamento ou injeção de capital.', managerialImplication: 'Os ativos líquidos atuais atendem parcialmente as obrigações sem esforço adicional.', priorityAction: 'Otimizar gestão do capital de giro e revisar prazos de pagamentos e recebimentos.' }
    ],
    CRITICAL: [
      { primaryDriver: 'Insuficiência de caixa severa', executiveNarrative: 'A liquidez está severamente comprometida, configurando risco estrutural para a continuidade das operações.', managerialImplication: 'Incapacidade latente de honrar exigibilidades sem rolagem de dívida ou aporte.', priorityAction: 'Acionar plano de contingência para injeção de liquidez imediata ou renegociação de exigibilidades.' },
      { primaryDriver: 'Risco sistêmico de curto prazo', executiveNarrative: 'A empresa enfrenta uma asfixia financeira, não havendo ativos líquidos suficientes para as obrigações correntes.', managerialImplication: 'O déficit de liquidez compromete diretamente o fluxo operacional básico.', priorityAction: 'Acionar plano de contingência para injeção de liquidez imediata ou renegociação de exigibilidades.' },
      { primaryDriver: 'Falta de cobertura tática', executiveNarrative: 'O passivo circulante supera criticamente as vias de geração de caixa de curto prazo.', managerialImplication: 'Cenário de insolvência tática exigindo intervenção imediata da gestão.', priorityAction: 'Acionar plano de contingência para injeção de liquidez imediata ou renegociação de exigibilidades.' }
    ],
    INSUFFICIENT_DATA: [
      { primaryDriver: 'Dados Indisponíveis', executiveNarrative: 'Informações de liquidez estão incompletas ou ausentes para uma análise determinística.', managerialImplication: 'Cálculo suspenso por falta de detalhamento no circulante.', priorityAction: 'Levantar dados detalhados do circulante para viabilizar análise de caixa.' }
    ]
  },
  CAPITAL_STRUCTURE: {
    EXCELLENT: [
      { primaryDriver: 'Autonomia financeira absoluta', executiveNarrative: 'A reduzida dependência de terceiros amplia a flexibilidade financeira e cria espaço para financiar crescimento futuro sem comprometer a estabilidade patrimonial.', managerialImplication: 'Financiamento concentrado em capital próprio de alta qualidade.', priorityAction: 'Manter estrutura otimizada e avaliar oportunidades de alavancagem estratégica para crescimento.' },
      { primaryDriver: 'Desalavancagem estrutural', executiveNarrative: 'A reduzida dependência de terceiros amplia a flexibilidade financeira e cria espaço para financiar crescimento futuro sem comprometer a estabilidade patrimonial.', managerialImplication: 'Risco de crédito mínimo face à proporção do patrimônio líquido.', priorityAction: 'Manter estrutura otimizada e avaliar oportunidades de alavancagem estratégica para crescimento.' },
      { primaryDriver: 'Base de capital otimizada', executiveNarrative: 'A reduzida dependência de terceiros amplia a flexibilidade financeira e cria espaço para financiar crescimento futuro sem comprometer a estabilidade patrimonial.', managerialImplication: 'A empresa financia suas operações majoritariamente com recursos próprios.', priorityAction: 'Manter estrutura otimizada e avaliar oportunidades de alavancagem estratégica para crescimento.' }
    ],
    HEALTHY: [
      { primaryDriver: 'Endividamento controlado', executiveNarrative: 'A composição do passivo apresenta grau de dependência equilibrado, condizente com a operação do negócio.', managerialImplication: 'O uso de capital de terceiros está dentro das margens de segurança.', priorityAction: 'Preservar mix de financiamento e monitorar custo de captação de dívidas vincendas.' },
      { primaryDriver: 'Alavancagem saudável', executiveNarrative: 'O balanço reflete uma política de captação proporcional e prudente.', managerialImplication: 'O nível de dívida frente ao capital próprio é compatível e estável.', priorityAction: 'Preservar mix de financiamento e monitorar custo de captação de dívidas vincendas.' },
      { primaryDriver: 'Equilíbrio na estrutura', executiveNarrative: 'Existe proporção adequada entre fundos próprios e obrigações externas.', managerialImplication: 'A estrutura de capital permite flexibilidade sem comprometer o patrimônio.', priorityAction: 'Preservar mix de financiamento e monitorar custo de captação de dívidas vincendas.' }
    ],
    WARNING: [
      { primaryDriver: 'Alavancagem em elevação', executiveNarrative: 'A dependência de recursos de terceiros atingiu limites de atenção, reduzindo a capacidade de nova alavancagem.', managerialImplication: 'O passivo exigível começa a pressionar a base patrimonial estrutural.', priorityAction: 'Interromper novas captações onerosas e iniciar plano de desalavancagem progressiva.' },
      { primaryDriver: 'Exposição financeira moderada', executiveNarrative: 'O volume de dívidas frente ao PL sinaliza risco caso haja oscilações no custo de captação.', managerialImplication: 'Maior sensibilidade a choques externos devido ao aumento do passivo.', priorityAction: 'Interromper novas captações onerosas e iniciar plano de desalavancagem progressiva.' },
      { primaryDriver: 'Aumento do risco estrutural', executiveNarrative: 'O endividamento cresce em ritmo superior à consolidação do capital próprio.', managerialImplication: 'Margem de segurança patrimonial reduzida.', priorityAction: 'Interromper novas captações onerosas e iniciar plano de desalavancagem progressiva.' }
    ],
    CRITICAL: [
      { primaryDriver: 'Estrutura altamente alavancada', executiveNarrative: 'O grau de dependência de capital externo é crítico, corroendo a geração de valor pela alta despesa financeira.', managerialImplication: 'Risco de insolvência estrutural pelo excesso de passivo exigível.', priorityAction: 'Iniciar imediata reestruturação de passivos e buscar aporte de capital primário.' },
      { primaryDriver: 'Sufocamento patrimonial', executiveNarrative: 'A estrutura de financiamento está insustentável, baseada primordialmente em recursos de credores.', managerialImplication: 'O Patrimônio Líquido não suporta as atuais obrigações de longo prazo.', priorityAction: 'Iniciar imediata reestruturação de passivos e buscar aporte de capital primário.' },
      { primaryDriver: 'Insolvência técnica latente', executiveNarrative: 'O volume de dívidas supera amplamente a estrutura orgânica da empresa, indicando necessidade de reestruturação.', managerialImplication: 'Alavancagem extrema e dependência nociva de capital de terceiros.', priorityAction: 'Iniciar imediata reestruturação de passivos e buscar aporte de capital primário.' }
    ],
    INSUFFICIENT_DATA: [
      { primaryDriver: 'Dados Indisponíveis', executiveNarrative: 'Informações de endividamento e patrimônio estão incompletas.', managerialImplication: 'Não é possível afirmar a dependência estrutural sem a abertura do passivo.', priorityAction: 'Mapear estrutura completa do passivo e patrimônio líquido.' }
    ]
  },
  ASSET_QUALITY: {
    EXCELLENT: [
      { primaryDriver: 'Qualidade do ativo superior', executiveNarrative: 'A base de ativos é altamente convertível, sem amarras imobilizadas não performáticas.', managerialImplication: 'Alta conversibilidade de ativos para suportar a estrutura do negócio.', priorityAction: 'Preservar política atual de investimentos e manter o foco em ativos de rápida conversibilidade.' },
      { primaryDriver: 'Lastro patrimonial premium', executiveNarrative: 'Composição de ativos focada em liquidez e giro, mitigando riscos de depreciação acentuada.', managerialImplication: 'Exposição mínima a ativos de lenta maturação.', priorityAction: 'Preservar política atual de investimentos e manter o foco em ativos de rápida conversibilidade.' },
      { primaryDriver: 'Composição de alta liquidez', executiveNarrative: 'Os ativos da companhia encontram-se predominantemente em contas de rápido giro e baixo risco.', managerialImplication: 'A qualidade dos recursos garante resiliência estrutural.', priorityAction: 'Preservar política atual de investimentos e manter o foco em ativos de rápida conversibilidade.' }
    ],
    HEALTHY: [
      { primaryDriver: 'Giro de ativos equilibrado', executiveNarrative: 'Os ativos estão adequadamente balanceados entre giro operacional e estrutura imobilizada produtiva.', managerialImplication: 'Nível normalizado de imobilização sem engessar a empresa.', priorityAction: 'Manter governança sobre novos imobilizados, avaliando sempre o retorno sobre o capital empregado.' },
      { primaryDriver: 'Alocação de recursos saudável', executiveNarrative: 'O balanço patrimonial reflete uma imobilização compatível com a natureza da indústria.', managerialImplication: 'Ativos imobilizados encontram-se dentro da média esperada.', priorityAction: 'Manter governança sobre novos imobilizados, avaliando sempre o retorno sobre o capital empregado.' },
      { primaryDriver: 'Flexibilidade de ativos', executiveNarrative: 'A proporção de ativos conversíveis versus permanentes está equilibrada.', managerialImplication: 'A estrutura de aplicação de recursos não apresenta desvios sistêmicos.', priorityAction: 'Manter governança sobre novos imobilizados, avaliando sempre o retorno sobre o capital empregado.' }
    ],
    WARNING: [
      { primaryDriver: 'Imobilização crescente', executiveNarrative: 'Há indícios de aprisionamento de recursos em ativos de baixa liquidez, o que pode engessar as operações futuras.', managerialImplication: 'Ativos permanentes começam a representar parcela substancial do patrimônio.', priorityAction: 'Suspender novos investimentos imobilizados e estruturar plano de desmobilização de ativos ociosos.' },
      { primaryDriver: 'Qualidade do ativo em alerta', executiveNarrative: 'O crescimento dos ativos de difícil realização requer análise crítica do seu real retorno.', managerialImplication: 'Risco de obsolescência e menor flexibilidade de caixa.', priorityAction: 'Suspender novos investimentos imobilizados e estruturar plano de desmobilização de ativos ociosos.' },
      { primaryDriver: 'Redução da flexibilidade', executiveNarrative: 'A estrutura patrimonial está gradativamente mais pesada e menos flexível a realocações.', managerialImplication: 'Maior dependência do imobilizado afeta a qualidade geral do balanço.', priorityAction: 'Suspender novos investimentos imobilizados e estruturar plano de desmobilização de ativos ociosos.' }
    ],
    CRITICAL: [
      { primaryDriver: 'Engessamento patrimonial', executiveNarrative: 'O balanço demonstra um excesso crítico de ativos imobilizados ou de longo prazo, anulando a capacidade de resposta.', managerialImplication: 'Baixíssima qualidade no giro e recursos severamente aprisionados.', priorityAction: 'Executar desinvestimento imediato de ativos não essenciais para recompor liquidez.' },
      { primaryDriver: 'Asfixia por imobilização', executiveNarrative: 'Os recursos aplicados em contas fixas geram um custo de oportunidade nocivo e reduzem a liquidez estrutural.', managerialImplication: 'Forte descompasso na alocação, concentrada em ativos não-conversíveis.', priorityAction: 'Executar desinvestimento imediato de ativos não essenciais para recompor liquidez.' },
      { primaryDriver: 'Estrutura obsoleto-dependente', executiveNarrative: 'A empresa sustenta grande parte do seu valor em ativos com risco de impairment elevado.', managerialImplication: 'A qualidade dos ativos é insuficiente para suportar contingências de caixa.', priorityAction: 'Executar desinvestimento imediato de ativos não essenciais para recompor liquidez.' }
    ],
    INSUFFICIENT_DATA: [
      { primaryDriver: 'Dados Indisponíveis', executiveNarrative: 'A distribuição de ativos entre realizáveis e permanentes não pôde ser aferida.', managerialImplication: 'Cálculo suspenso pela falta de contas do ativo permanente.', priorityAction: 'Consolidar base de dados do ativo permanente para análise.' }
    ]
  },
  WORKING_CAPITAL: {
    EXCELLENT: [
      { primaryDriver: 'Eficiência de giro superior', executiveNarrative: 'O ciclo financeiro deve ser acompanhado continuamente para assegurar que o crescimento operacional não resulte em consumo estrutural excessivo de caixa.', managerialImplication: 'Capital de giro perfeitamente alinhado com o volume de operações.', priorityAction: 'Preservar inteligência de giro e avaliar redução de prêmios de risco com fornecedores.' },
      { primaryDriver: 'Alinhamento operacional ótimo', executiveNarrative: 'O ciclo financeiro deve ser acompanhado continuamente para assegurar que o crescimento operacional não resulte em consumo estrutural excessivo de caixa.', managerialImplication: 'Necessidade de capital de giro (NCG) amplamente coberta.', priorityAction: 'Preservar inteligência de giro e avaliar redução de prêmios de risco com fornecedores.' },
      { primaryDriver: 'Inteligência de capital apurada', executiveNarrative: 'O ciclo financeiro deve ser acompanhado continuamente para assegurar que o crescimento operacional não resulte em consumo estrutural excessivo de caixa.', managerialImplication: 'Folga de capital de giro é substancial frente às operações.', priorityAction: 'Preservar inteligência de giro e avaliar redução de prêmios de risco com fornecedores.' }
    ],
    HEALTHY: [
      { primaryDriver: 'Capital de giro estável', executiveNarrative: 'O ciclo financeiro deve ser acompanhado continuamente para assegurar que o crescimento operacional não resulte em consumo estrutural excessivo de caixa.', managerialImplication: 'A necessidade operacional está coberta pelos recursos de curto prazo.', priorityAction: 'Manter monitoramento de prazos médios de estocagem, recebimento e pagamento.' },
      { primaryDriver: 'Ciclo financeiro controlado', executiveNarrative: 'O ciclo financeiro deve ser acompanhado continuamente para assegurar que o crescimento operacional não resulte em consumo estrutural excessivo de caixa.', managerialImplication: 'Giro da operação não impõe pressão indevida no caixa.', priorityAction: 'Manter monitoramento de prazos médios de estocagem, recebimento e pagamento.' },
      { primaryDriver: 'Conformidade de curto prazo', executiveNarrative: 'O ciclo financeiro deve ser acompanhado continuamente para assegurar que o crescimento operacional não resulte em consumo estrutural excessivo de caixa.', managerialImplication: 'A gestão de estoques e recebíveis suporta o ciclo de pagamento.', priorityAction: 'Manter monitoramento de prazos médios de estocagem, recebimento e pagamento.' }
    ],
    WARNING: [
      { primaryDriver: 'Desalinhamento no ciclo de caixa', executiveNarrative: 'Nota-se uma pressão incipiente sobre o capital de giro, possivelmente devido ao alongamento de clientes ou estoques.', managerialImplication: 'A Necessidade de Capital de Giro (NCG) aproxima-se dos limites críticos de cobertura.', priorityAction: 'Acelerar recebíveis, renegociar prazos com fornecedores e otimizar níveis de estoque.' },
      { primaryDriver: 'Tensão no giro operacional', executiveNarrative: 'O ciclo de conversão de caixa está gerando atritos, exigindo captação para suportar o período de defasagem.', managerialImplication: 'Redução do Saldo de Tesouraria impõe alertas de gestão.', priorityAction: 'Acelerar recebíveis, renegociar prazos com fornecedores e otimizar níveis de estoque.' },
      { primaryDriver: 'Incompatibilidade tática', executiveNarrative: 'Os recursos destinados a suportar o curto prazo não são inteiramente suficientes para cobrir os ciclos de estoque.', managerialImplication: 'Risco moderado de ruptura no giro diário da empresa.', priorityAction: 'Acelerar recebíveis, renegociar prazos com fornecedores e otimizar níveis de estoque.' }
    ],
    CRITICAL: [
      { primaryDriver: 'Colapso de capital de giro', executiveNarrative: 'A operação consome caixa de forma agressiva, demonstrando descontrole nos prazos médios e forte dependência de rolagem.', managerialImplication: 'Necessidade de Capital de Giro estruturalmente descoberta.', priorityAction: 'Geração emergencial de caixa via antecipação de recebíveis e liquidação de estoques.' },
      { primaryDriver: 'Asfixia operacional', executiveNarrative: 'A incapacidade de financiar o próprio ciclo está erodindo rapidamente a tesouraria.', managerialImplication: 'Déficit agudo no capital de giro requer injeção financeira urgente.', priorityAction: 'Geração emergencial de caixa via antecipação de recebíveis e liquidação de estoques.' },
      { primaryDriver: 'Ruptura no ciclo financeiro', executiveNarrative: 'O descasamento entre a velocidade de pagamentos e recebimentos tornou-se insustentável.', managerialImplication: 'Capital Circulante Líquido (CCL) amplamente negativo frente a NCG.', priorityAction: 'Geração emergencial de caixa via antecipação de recebíveis e liquidação de estoques.' }
    ],
    INSUFFICIENT_DATA: [
      { primaryDriver: 'Dados Indisponíveis', executiveNarrative: 'As informações circulantes (estoques/clientes/fornecedores) não permitem o cálculo de giro.', managerialImplication: 'Cálculo de capital de giro impossibilitado por lacunas de dados.', priorityAction: 'Regularizar apuração dos ciclos de estoques, clientes e fornecedores.' }
    ]
  },
  PRESERVATION: {
    EXCELLENT: [
      { primaryDriver: 'Alta preservação de capital', executiveNarrative: 'A base de capital está plenamente preservada, garantindo altíssima resiliência a cenários adversos e sustentabilidade estrutural.', managerialImplication: 'Ampla margem de segurança e robusto patrimônio líquido.', priorityAction: 'Manter política de retenção de lucros equilibrada e avaliar oportunidades de expansão orgânica.' },
      { primaryDriver: 'Absorção de choque premium', executiveNarrative: 'A empresa possui um sólido buffer patrimonial, sendo altamente imune a prejuízos ou oscilações agudas no mercado.', managerialImplication: 'O capital se mantém blindado contra consumo interno.', priorityAction: 'Manter política de retenção de lucros equilibrada e avaliar oportunidades de expansão orgânica.' },
      { primaryDriver: 'Fortaleza patrimonial', executiveNarrative: 'O patrimônio líquido suporta folgadamente contingências severas.', managerialImplication: 'A qualidade dos fundos próprios preserva fortemente o valor do negócio.', priorityAction: 'Manter política de retenção de lucros equilibrada e avaliar oportunidades de expansão orgânica.' }
    ],
    HEALTHY: [
      { primaryDriver: 'Capacidade de absorção adequada', executiveNarrative: 'A estrutura patrimonial apresenta preservação adequada, conferindo resiliência satisfatória às operações e proteção ao capital investido.', managerialImplication: 'O patrimônio suporta os riscos atuais do negócio.', priorityAction: 'Garantir consistência na geração de lucros para fortalecer continuamente a base de capital.' },
      { primaryDriver: 'Buffer de capital resiliente', executiveNarrative: 'Os resultados auferidos não causam danos estruturais ou consumo nocivo de recursos próprios.', managerialImplication: 'Existe proteção para as oscilações cotidianas da operação.', priorityAction: 'Garantir consistência na geração de lucros para fortalecer continuamente a base de capital.' },
      { primaryDriver: 'Integridade dos fundos', executiveNarrative: 'A posição de capital retido demonstra conformidade com as regras de preservação.', managerialImplication: 'A base não sofre desgastes acelerados que fujam da norma.', priorityAction: 'Garantir consistência na geração de lucros para fortalecer continuamente a base de capital.' }
    ],
    WARNING: [
      { primaryDriver: 'Erosão patrimonial em curso', executiveNarrative: 'O capital apresenta sinais de desgaste e redução nas margens de absorção de perdas, demandando ações de controle.', managerialImplication: 'Baixo buffer de segurança para enfrentar oscilações táticas.', priorityAction: 'Revisar política de distribuição de dividendos e conter despesas operacionais não essenciais.' },
      { primaryDriver: 'Fragilidade de absorção', executiveNarrative: 'Há indícios de que as perdas recentes estejam erodindo o patrimônio, reduzindo sua eficiência defensiva.', managerialImplication: 'A velocidade de erosão do capital está acelerada.', priorityAction: 'Revisar política de distribuição de dividendos e conter despesas operacionais não essenciais.' },
      { primaryDriver: 'Consumo persistente', executiveNarrative: 'A preservação dos fundos iniciais corre risco com a drenagem apontada pelos indicadores.', managerialImplication: 'O buffer líquido foi consumido parcialmente, elevando a vulnerabilidade.', priorityAction: 'Revisar política de distribuição de dividendos e conter despesas operacionais não essenciais.' }
    ],
    CRITICAL: [
      { primaryDriver: 'Capital severamente comprometido', executiveNarrative: 'O patrimônio líquido está em processo acentuado de erosão ou já exposto a negativo (passivo a descoberto).', managerialImplication: 'Fator mitigador inexistente; o negócio não consegue absorver perdas.', priorityAction: 'Estancar imediatamente fontes de prejuízo e elaborar plano de readequação patrimonial urgente.' },
      { primaryDriver: 'Destruição de valor iminente', executiveNarrative: 'A empresa queima recursos estruturais de maneira contínua, configurando um alerta vitalício para a continuidade.', managerialImplication: 'Incapacidade extrema de suportar choques ou proteger o capital investido.', priorityAction: 'Estancar imediatamente fontes de prejuízo e elaborar plano de readequação patrimonial urgente.' },
      { primaryDriver: 'Passivo a descoberto (ou próximo)', executiveNarrative: 'A proteção patrimonial falhou sistemicamente. Todo o capital investido encontra-se praticamente consumido.', managerialImplication: 'As reservas secaram de forma a inviabilizar a proteção dos acionistas.', priorityAction: 'Estancar imediatamente fontes de prejuízo e elaborar plano de readequação patrimonial urgente.' }
    ],
    INSUFFICIENT_DATA: [
      { primaryDriver: 'Dados Indisponíveis', executiveNarrative: 'Não há histórico ou informações para aferir a preservação patrimonial e a velocidade de queima de capital.', managerialImplication: 'O PL ou o Lucro Líquido estão indisponíveis.', priorityAction: 'Auditar histórico de resultados e posição patrimonial recente.' }
    ]
  }
};

export class ExecutiveNarrativeVariations {
  /**
   * Deterministicamente escolhe 1 entre as 3 variações baseado em atributos imutáveis do report.
   */
  public static get(
    module: EngineModule, 
    status: HealthStatus, 
    summary: BPSummary
  ): VariationSet {
    if (status === 'INSUFFICIENT_DATA') {
      return NARRATIVES[module][status][0];
    }

    const options = NARRATIVES[module][status];
    if (options.length === 1) return options[0];

    // Cria um seed determinístico usando o total do ativo e o PL (ignora cents)
    const ativo = summary?.ativoTotal || 1;
    const pl = summary?.patrimonioLiquido || 1;
    const seed = Math.floor((ativo + pl) / 100) || 0;
    const index = Math.abs(seed) % options.length;

    return options[index];
  }
}
