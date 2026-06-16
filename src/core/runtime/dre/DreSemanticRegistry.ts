/**
 * DRE Semantic Registry & Constitutional Enforcement
 * SSOT para governança de vocabulário e regras determinísticas da DRE.
 */

export const DRE_SEMANTIC_WHITELIST = [
  'receita operacional',
  'crescimento',
  'margem',
  'ebitda',
  'ebit',
  'resultado líquido',
  'produtividade',
  'eficiência',
  'escalabilidade',
  'ponto de equilíbrio',
  'alavancagem operacional',
  'geração de valor',
  'conversão econômica',
  'cobertura',
  'absorção'
];

export const DRE_SEMANTIC_BLACKLIST = [
  // Termos Patrimoniais e M&A não DRE
  'patrimônio líquido', 'patrimônio', 'proteção fiduciária', 'fiduciária',
  'liquidez patrimonial', 'estrutura patrimonial', 'autonomia financeira',
  'excesso estrutural de liquidez', 'capital improdutivo', 'preservação patrimonial',
  'solvência', 'dividendos', 'retenção de lucros', 
  'm&a', 'm & a', 'fusão', 'aquisição', 'equity', 'valuation', 'tese de equity',
  'liderança setorial', 'market share', 'market-share', 'dominação de mercado', 'excelência patrimonial',
  
  // Termos de Fluxo de Caixa (em contexto DRE)
  'caixa livre', 'free cash flow', 'queima de caixa estrutural', 'burn',
  
  // Termos Startupeiros, Promocionais e de Marketing
  'top-line', 'bottom-line', 'unit economics',
  'alta tração', 'crescimento acelerado', 'expansão acelerada', 'espetacular', 
  'excepcional', 'larga escala', 'disruptivo', 'game changer', 'product-market fit',
  'reinvestimento veloz', 'janela histórica', 'forçar velocidade',
  'capex agressivo', 'investimento arrojado', 'marketing agressivo', 'marketing arrojado', 'expansão arrojada',
  
  // Linguagem Bélica/Alarmista Inadequada
  'cisne negro', 'cisnes negros',
  'war room', 'combate ostensivo', 'sangria', 'insolvência iminente', 'insolvência', 'crise', 'medidas radicais',
  'decretar contingência', 'pivotagem profunda', 'downsizing imediato',
  'desligamento e liquidação tática', 'recomeçar limpa', 'desmontar o custo fixo',
  'fatalidade', 'colapso', 'asfixia', 'draconianas',
  
  // Termos Legados/Vazios
  'baseline inviolável', 'baseline', 'lucro final'
];

/**
 * REGRAS DE ADJETIVAÇÃO (Evidence Before Adjectives)
 * Define os gatilhos matemáticos obrigatórios para o uso de adjetivos.
 */
export const AdjectiveTriggers = {
  robusto: (ebitdaMargin: number, netMargin: number) => ebitdaMargin >= 0.25 && netMargin >= 0.10,
  elevado: (netMargin: number) => netMargin >= 0.20,
  resiliente: (breakEvenCoverage: number) => breakEvenCoverage >= 1.8,
  sustentavel: (ebitdaMargin: number, breakEvenCoverage: number) => ebitdaMargin >= 0.10 && breakEvenCoverage >= 1.2,
  consistente: (ebitdaMargin: number) => ebitdaMargin >= 0.25,
  critico: (netMargin: number, breakEvenCoverage: number) => netMargin < 0 || breakEvenCoverage < 1.0,
  saudavel: (netMargin: number, breakEvenCoverage: number) => netMargin >= 0.03 && breakEvenCoverage >= 1.2,
  eficiente: (ebitdaMargin: number) => ebitdaMargin >= 0.10
};

export type PanelIntent = 'VALUE_CREATION' | 'STRUCTURE_SUSTAINABILITY' | 'SURVIVAL_THRESHOLD' | 'GROWTH_CONSTRAINT' | 'SCALE_EFFICIENCY' | 'INACTION_RISK' | 'BOARD_MANDATE';

export interface CausalDriverFragment {
  intent: PanelIntent;
  severity: 'UNSUSTAINABLE' | 'PRESSURIZED' | 'BORDERLINE' | 'ADEQUATE' | 'STRONG' | 'EXCELLENT';
  causalCore: string;
  executiveImplication: string;
  boardMandate: string;
  recommendedAction: string;
  forbiddenTerms?: string[];
}

export const CausalRegistry: CausalDriverFragment[] = [
  // P1 - VALUE_CREATION (Base: Net Margin)
  { 
    intent: 'VALUE_CREATION', severity: 'UNSUSTAINABLE', 
    causalCore: 'déficit estrutural consolidado e consumo primário',
    executiveImplication: 'A formação de resultado da companhia evidencia incapacidade de retenção de valor',
    boardMandate: 'Exige-se intervenção diretiva focada na contenção de despesas estruturais',
    recommendedAction: 'Restruturar linhas operacionais com déficit corrente' 
  },
  { 
    intent: 'VALUE_CREATION', severity: 'PRESSURIZED', 
    causalCore: 'formação de margem contraída',
    executiveImplication: 'A conversão primária de receita apresenta ineficiência perante a estrutura de custos',
    boardMandate: 'Pressiona a capacidade de sustentação do modelo a curto prazo',
    recommendedAction: 'Otimizar eficiência na conversão da receita primária' 
  },
  { 
    intent: 'VALUE_CREATION', severity: 'BORDERLINE', 
    causalCore: 'viabilidade em patamar crítico com baixa folga econômica',
    executiveImplication: 'A retenção de valor unitário opera em margens restritas',
    boardMandate: 'Margem de segurança reduzida para absorver desvios orçamentários',
    recommendedAction: 'Proteger rentabilidade prioritariamente ao volume' 
  },
  { 
    intent: 'VALUE_CREATION', severity: 'ADEQUATE', 
    causalCore: 'geração de resultado consistente com viabilidade atestada',
    executiveImplication: 'A operação converte receita primária de maneira equilibrada',
    boardMandate: 'Evidencia tração satisfatória no atual modelo de precificação',
    recommendedAction: 'Manter disciplina na proteção da margem corrente' 
  },
  { 
    intent: 'VALUE_CREATION', severity: 'STRONG', 
    causalCore: 'elevada retenção de margem líquida',
    executiveImplication: 'O modelo de negócios converte valor com alta previsibilidade',
    boardMandate: 'Confirma a estabilidade na arquitetura de custos',
    recommendedAction: 'Acelerar expansão comercial preservando as atuais margens unitárias' 
  },
  { 
    intent: 'VALUE_CREATION', severity: 'EXCELLENT', 
    causalCore: 'Eficiência singular na retenção do lucro líquido',
    executiveImplication: 'O modelo de precificação maximiza de forma substancial o valor gerado por contrato',
    boardMandate: 'Chancela a superioridade operativa do atual desenho estrutural',
    recommendedAction: 'Projetar expansão tática escalonada mantendo rigidez nos gastos' 
  },

  // P2 - STRUCTURE_SUSTAINABILITY (Base: Ebitda Margin)
  { 
    intent: 'STRUCTURE_SUSTAINABILITY', severity: 'UNSUSTAINABLE', 
    causalCore: 'déficit operacional primário',
    executiveImplication: 'A base de despesas está desalinhada da capacidade de geração comercial',
    boardMandate: 'Requer revisão sistêmica da folha de pagamentos e fornecedores',
    recommendedAction: 'Desidratar custos operacionais primários com urgência' 
  },
  { 
    intent: 'STRUCTURE_SUSTAINABILITY', severity: 'PRESSURIZED', 
    causalCore: 'estreitamento na geração operacional',
    executiveImplication: 'A sustentação do custo fixo encontra-se pressionada perante o resultado',
    boardMandate: 'Demanda ajuste na elasticidade de gastos e controle rigoroso de provisões',
    recommendedAction: 'Contingenciar despesas operacionais discricionárias' 
  },
  { 
    intent: 'STRUCTURE_SUSTAINABILITY', severity: 'BORDERLINE', 
    causalCore: 'equilíbrio estreito no suporte às despesas atuais',
    executiveImplication: 'O suporte às bases fixas carece de flexibilidade perante retrações',
    boardMandate: 'Requer blindagem contra reajustes inflacionários',
    recommendedAction: 'Bloquear novos compromissos de despesa fixa' 
  },
  { 
    intent: 'STRUCTURE_SUSTAINABILITY', severity: 'ADEQUATE', 
    causalCore: 'absorção funcional e aderente às despesas',
    executiveImplication: 'A alavancagem estrutural absorve os custos de modo equilibrado',
    boardMandate: 'Certifica o alinhamento da estrutura à realidade do faturamento',
    recommendedAction: 'Avaliar estabilidade das despesas fixas para proteger eficiência' 
  },
  { 
    intent: 'STRUCTURE_SUSTAINABILITY', severity: 'STRONG', 
    causalCore: 'ampla folga operacional pós-cobertura de custos',
    executiveImplication: 'A matriz de custos opera em regime maduro frente à receita',
    boardMandate: 'Aprova a execução do atual cronograma orçamentário',
    recommendedAction: 'Monitorar a arquitetura de custos para impedir inflação de despesas' 
  },
  { 
    intent: 'STRUCTURE_SUSTAINABILITY', severity: 'EXCELLENT', 
    causalCore: 'ótima diluição estrutural da matriz de custos',
    executiveImplication: 'A arquitetura de despesas demonstra alta imunidade a variações de escala',
    boardMandate: 'Garante ampla liberdade orçamentária para a gestão do exercício',
    recommendedAction: 'Estudar reinvestimentos controlados visando ampliação de eficiência marginal' 
  },

  // P3 - SURVIVAL_THRESHOLD (Base: Break-Even Coverage)
  { 
    intent: 'SURVIVAL_THRESHOLD', severity: 'UNSUSTAINABLE', 
    causalCore: 'incapacidade contínua de atingir o ponto de nivelamento',
    executiveImplication: 'O volume faturado é estruturalmente insuficiente para sanear a operação',
    boardMandate: 'Sinaliza elevado estresse sobre a posição de capital de giro futura',
    recommendedAction: 'Reprogramar o modelo de custos fixos à nova realidade de receita' 
  },
  { 
    intent: 'SURVIVAL_THRESHOLD', severity: 'PRESSURIZED', 
    causalCore: 'distância operacional arriscada frente ao break-even',
    executiveImplication: 'O faturamento atual cobre a estrutura com margem restrita de manobra',
    boardMandate: 'Pequenas retrações na demanda implicarão em necessidade imediata de capital',
    recommendedAction: 'Reduzir base de custos para aliviar o peso do nivelamento' 
  },
  { 
    intent: 'SURVIVAL_THRESHOLD', severity: 'BORDERLINE', 
    causalCore: 'distanciamento limite do break-even',
    executiveImplication: 'A segurança operacional restringe a flexibilidade no planejamento de curto prazo',
    boardMandate: 'Obriga a retenção severa de recursos para contingência orçamentária',
    recommendedAction: 'Monitorar tração comercial e congelar novas despesas atreladas' 
  },
  { 
    intent: 'SURVIVAL_THRESHOLD', severity: 'ADEQUATE', 
    causalCore: 'margem de segurança operacional confirmada perante as obrigações',
    executiveImplication: 'A tração comercial assegura proteção satisfatória contra riscos sistêmicos',
    boardMandate: 'Garante tranquilidade executiva para o andamento do exercício anual',
    recommendedAction: 'Acompanhar sistematicamente o raio de afastamento comercial' 
  },
  { 
    intent: 'SURVIVAL_THRESHOLD', severity: 'STRONG', 
    causalCore: 'ampla cobertura frente às bases de suporte fixas',
    executiveImplication: 'A operação detém um distanciamento muito seguro frente às obrigações básicas',
    boardMandate: 'Valida a capacidade de suportar variações abruptas de demanda comercial',
    recommendedAction: 'Empregar o fluxo excedente na modernização dos centros de custo' 
  },
  { 
    intent: 'SURVIVAL_THRESHOLD', severity: 'EXCELLENT', 
    causalCore: 'amplo múltiplo de cobertura do ponto de equilíbrio',
    executiveImplication: 'O nivelamento operacional atinge um patamar superior de blindagem comercial',
    boardMandate: 'Confirma resiliência estrutural de longo prazo na dinâmica de receitas',
    recommendedAction: 'Mapear eventuais otimizações operacionais em processos complementares' 
  },

  // P4 - GROWTH_CONSTRAINT (Base: Net Margin)
  { 
    intent: 'GROWTH_CONSTRAINT', severity: 'UNSUSTAINABLE', 
    causalCore: 'fricções primárias inviabilizando o escalonamento',
    executiveImplication: 'A expansão sob o modelo atual multiplica os déficits financeiros',
    boardMandate: 'Paralisar esforços de crescimento até comprovar aderência econômica unitária',
    recommendedAction: 'Revisar matriz de custos diretos e premissas de preço' 
  },
  { 
    intent: 'GROWTH_CONSTRAINT', severity: 'PRESSURIZED', 
    causalCore: 'capacidade de captura fragilizada na base comercial',
    executiveImplication: 'A eficiência unitária por contrato ou venda sofre compressão',
    boardMandate: 'O foco no volume compromete ativamente a rentabilidade residual do exercício',
    recommendedAction: 'Sanear contratos de margem estreita antes de prospectar novos canais' 
  },
  { 
    intent: 'GROWTH_CONSTRAINT', severity: 'BORDERLINE', 
    causalCore: 'sensibilidade alta a novos custos comerciais',
    executiveImplication: 'O perfil econômico apresenta volatilidade se novas despesas forem ativadas',
    boardMandate: 'Sugere extrema moderação na introdução de novas linhas de negócio',
    recommendedAction: 'Garantir rentabilidade positiva na origem em cada novo faturamento' 
  },
  { 
    intent: 'GROWTH_CONSTRAINT', severity: 'ADEQUATE', 
    causalCore: 'tração sustentada com controle de atritos operacionais',
    executiveImplication: 'O modelo comporta ampliação gradativa do faturamento',
    boardMandate: 'Permite autorização executiva de campanhas ou novos produtos controlados',
    recommendedAction: 'Mapear gargalos de entrega frente a eventuais ganhos de volume' 
  },
  { 
    intent: 'GROWTH_CONSTRAINT', severity: 'STRONG', 
    causalCore: 'elasticidade sólida para adição de receita com qualidade',
    executiveImplication: 'A estrutura de vendas escala assegurando acréscimo proporcional de margem',
    boardMandate: 'Aprova a intensificação das políticas comerciais mantendo as atuais premissas',
    recommendedAction: 'Maximizar captação de clientes sem corromper as políticas de preços' 
  },
  { 
    intent: 'GROWTH_CONSTRAINT', severity: 'EXCELLENT', 
    causalCore: 'alta responsividade no lucro por volume adicional capturado',
    executiveImplication: 'O escalonamento do negócio gera eficiência marginal crescente e atestada',
    boardMandate: 'Demonstra potencial diferenciado para liderar estratégias comerciais agressivas e saudáveis',
    recommendedAction: 'Acelerar ocupação das rotas comerciais atuais com as garantias vigentes' 
  },

  // P5 - SCALE_EFFICIENCY (Base: Net Margin)
  { 
    intent: 'SCALE_EFFICIENCY', severity: 'UNSUSTAINABLE', 
    causalCore: 'ganho em escala acompanhado de aumento não proporcional de custos diretos',
    executiveImplication: 'Esforços de maior magnitude têm gerado redução na margem intrínseca',
    boardMandate: 'Frear planos de aumento de capacidade até o saneamento da unidade econômica',
    recommendedAction: 'Congelar rotas de vendas até a normalização dos índices diretos' 
  },
  { 
    intent: 'SCALE_EFFICIENCY', severity: 'PRESSURIZED', 
    causalCore: 'margens limitadas que impedem alavancagem de escala sadia',
    executiveImplication: 'O faturamento eleva-se, mas o acréscimo real no resultado líquido é inexpressivo',
    boardMandate: 'Sinaliza possível esgotamento da eficiência operacional do atual formato',
    recommendedAction: 'Focar na rentabilidade da base instalada de contratos' 
  },
  { 
    intent: 'SCALE_EFFICIENCY', severity: 'BORDERLINE', 
    causalCore: 'acréscimo limítrofe no resultado final face a novos volumes',
    executiveImplication: 'A eficiência operacional é retida, porém em ritmo sensivelmente baixo',
    boardMandate: 'Impõe prudência na precificação de novos contratos de volume',
    recommendedAction: 'Estruturar processos de atendimento e onboarding que consumam menos custo variável' 
  },
  { 
    intent: 'SCALE_EFFICIENCY', severity: 'ADEQUATE', 
    causalCore: 'evolução balanceada do lucro face ao volume da carteira',
    executiveImplication: 'A proporção entre faturar mais e reter mais lucro mantém-se linear e satisfatória',
    boardMandate: 'Ratifica as projeções do planejamento anual com segurança estatística',
    recommendedAction: 'Destravar eventuais margens complementares otimizando as rotinas operacionais' 
  },
  { 
    intent: 'SCALE_EFFICIENCY', severity: 'STRONG', 
    causalCore: 'ganho proporcional robusto à medida que as faturas avançam',
    executiveImplication: 'A operação demonstra notável eficiência de escala no balanço de resultados',
    boardMandate: 'Autoriza aceleração orçamentária focada na expansão orgânica de clientes base',
    recommendedAction: 'Empregar geração excedente no ganho qualificado de penetração' 
  },
  { 
    intent: 'SCALE_EFFICIENCY', severity: 'EXCELLENT', 
    causalCore: 'diluição acelerada de atritos que reflete máxima retenção de caixa',
    executiveImplication: 'As barreiras ao crescimento econômico real foram contornadas através da otimização operacional',
    boardMandate: 'A diretoria evidencia execução orçamentária muito superior à média industrial',
    recommendedAction: 'Concentrar estratégias de curto prazo em replicação e padronização da eficiência alcançada' 
  },

  // P6 - INACTION_RISK (Base: Break-Even Coverage)
  { 
    intent: 'INACTION_RISK', severity: 'UNSUSTAINABLE', 
    causalCore: "Risco claro de ruptura econômica ou esgotamento na falta de medidas enérgicas",
    executiveImplication: 'A permanência nas bases atuais pode inviabilizar a manutenção da entidade',
    boardMandate: 'Exige ação contundente sobre a política de custos operacionais diretos',
    recommendedAction: 'Acionar protocolos de contingência operacional e de gestão de liquidez' 
  },
  { 
    intent: 'INACTION_RISK', severity: 'PRESSURIZED', 
    causalCore: 'alta sensibilidade ao desgaste inflacionário perante inércia comercial',
    executiveImplication: 'A paralisia estratégica expõe o negócio a perdas operacionais em curto prazo',
    boardMandate: 'Determina prontidão para repasse de preços e ajustes em contratos desfavoráveis',
    recommendedAction: 'Preparar ações e políticas de contenção de custos reativos' 
  },
  { 
    intent: 'INACTION_RISK', severity: 'BORDERLINE', 
    causalCore: 'exposição contínua a aumentos sistêmicos de insumos do mercado',
    executiveImplication: 'O distanciamento de segurança tende a sumir frente a qualquer choque externo',
    boardMandate: 'Requer blindagem explícita e foco estrito nas atividades primárias da organização',
    recommendedAction: 'Defender a fatia de mercado vigente por meio da melhoria de nível de serviço' 
  },
  { 
    intent: 'INACTION_RISK', severity: 'ADEQUATE', 
    causalCore: 'espaço operacional adequado para planejar ciclos',
    executiveImplication: 'Os indicadores protegem os horizontes analíticos, permitindo execução calculada',
    boardMandate: 'Autoriza debates amplos em comitê, reduzindo a pressão por cortes emergenciais',
    recommendedAction: 'Avaliar oportunidades de melhoria focando o médio prazo' 
  },
  { 
    intent: 'INACTION_RISK', severity: 'STRONG', 
    causalCore: 'base de cobertura com folga muito segura frente à volatilidade',
    executiveImplication: 'O passivo estratégico real não incide na falta de margem, mas na ausência de alocação',
    boardMandate: 'Sinaliza a existência de espaço ótimo de inovação operacional na estrutura em vigor',
    recommendedAction: 'Otimizar investimentos em capacidade produtiva alavancando a estabilidade e previsibilidade' 
  },
  { 
    intent: 'INACTION_RISK', severity: 'EXCELLENT', 
    causalCore: 'imunidade conjuntural consolidada pelos indicadores elásticos',
    executiveImplication: 'A posição corporativa provê vasta segurança direcional, eliminando focos reativos de mercado',
    boardMandate: 'Instrui a aceleração contínua de ganhos de participação, dada a posição vantajosa estabelecida',
    recommendedAction: 'Potencializar investimentos focados na maturidade comercial e expansão segura de linhas de produto' 
  },

  // P7 - BOARD_MANDATE (Base: Ebitda Margin)
  { 
    intent: 'BOARD_MANDATE', severity: 'UNSUSTAINABLE', 
    causalCore: 'exposição contínua a déficit grave nas margens de serviço e operações',
    executiveImplication: 'A gestão do negócio deve priorizar a recuperação e o enxugamento primário de ativos e operações',
    boardMandate: 'Determina instauração de pautas puramente focadas no turnaround e austeridade',
    recommendedAction: 'Aprovar políticas de readequação de matriz operativa e custos gerenciais' 
  },
  { 
    intent: 'BOARD_MANDATE', severity: 'PRESSURIZED', 
    causalCore: 'desempenho aquém do planejamento e forte retração nos resultados orgânicos',
    executiveImplication: 'A organização deve demandar eficiência técnica e comercial rigorosa neste trimestre',
    boardMandate: 'Impõe diretrizes corretivas severas no âmbito de gastos gerais e processos-chave',
    recommendedAction: 'Deliberar ajustes orçamentários corretivos nas verticais com menor geração comprovada' 
  },
  { 
    intent: 'BOARD_MANDATE', severity: 'BORDERLINE', 
    causalCore: 'limiar tolerável no fechamento das margens fundamentais',
    executiveImplication: 'O monitoramento deve se estreitar, focando a relação precisa entre esforço de vendas e custo gerencial',
    boardMandate: 'Inibe expansões discricionárias que aumentem a pressão na política fiscal interna',
    recommendedAction: 'Validar estritos limites táticos para as despesas nos próximos quadrimestres' 
  },
  { 
    intent: 'BOARD_MANDATE', severity: 'ADEQUATE', 
    causalCore: 'execução sólida que corrobora o cumprimento da pauta do período',
    executiveImplication: 'O corpo diretivo entrega margens sadias que viabilizam uma execução segura do plano diretor',
    boardMandate: 'Ratifica as deliberações em curso e endossa a eficiência demonstrada nas principais rotinas',
    recommendedAction: 'Focar na consolidação sistemática da capacidade produtiva vigente' 
  },
  { 
    intent: 'BOARD_MANDATE', severity: 'STRONG', 
    causalCore: 'desempenho contundente e superior no balanço da arquitetura econômica',
    executiveImplication: 'A liderança tem lastro comprovado para desenhar o avanço tático sob bases de crescimento previsíveis',
    boardMandate: 'Aprova novos planejamentos voltados a fortalecimento contínuo com suporte direto dos indicadores do semestre',
    recommendedAction: 'Estimular planos de capacitação interna e ampliação gradual com garantia de preservação do cerne de lucros' 
  },
  { 
    intent: 'BOARD_MANDATE', severity: 'EXCELLENT', 
    causalCore: 'performance impecável nos direcionadores primários da operação',
    executiveImplication: 'O cenário é perfeitamente adequado para orquestrar frentes avançadas de ganho contínuo de resultados',
    boardMandate: 'Reconhece o alinhamento maduro da entidade e foca diretrizes no planejamento a longo prazo sobre excelência consolidada',
    recommendedAction: 'Aprofundar discussões de visão corporativa futura com o colchão orçamentário solidamente assegurado' 
  }
];

export const getCausalFragment = (intent: PanelIntent, severity: 'UNSUSTAINABLE' | 'PRESSURIZED' | 'BORDERLINE' | 'ADEQUATE' | 'STRONG' | 'EXCELLENT'): CausalDriverFragment => {
  return CausalRegistry.find(c => c.intent === intent && c.severity === severity) || CausalRegistry.find(c => c.intent === intent && c.severity === 'BORDERLINE')!;
};

/**
 * PLANO EXECUTIVO (Causal Planning)
 * Os prazos do plano são determinados pelo grau de estresse.
 */
export const ExecutivePlanTriggers = {
  getPlan: (severity: 'UNSUSTAINABLE' | 'PRESSURIZED' | 'BORDERLINE' | 'ADEQUATE' | 'STRONG' | 'EXCELLENT', hasBurn: boolean) => {
    if (severity === 'UNSUSTAINABLE' || hasBurn) {
      return {
        shortTerm: 'Interromper fontes de déficit operacional e reduzir despesas fixas imediatamente.',
        mediumTerm: 'Reestruturar modelo de precificação e custos diretos.',
        longTerm: 'Atingir sustentabilidade no ponto de equilíbrio antes de buscar expansão.'
      };
    }
    if (severity === 'PRESSURIZED' || severity === 'BORDERLINE') {
      return {
        shortTerm: 'Revisar margens de contribuição unitárias e segurar contratações.',
        mediumTerm: 'Otimizar conversão de EBITDA em Lucro Líquido.',
        longTerm: 'Consolidar estabilidade econômica para permitir crescimento seguro.'
      };
    }
    if (severity === 'ADEQUATE') {
      return {
        shortTerm: 'Otimizar mix de vendas com foco em proteção de margem.',
        mediumTerm: 'Acompanhar absorção de custos fixos durante o crescimento.',
        longTerm: 'Escalabilidade segura e expansão disciplinada do modelo de negócio.'
      };
    }
    // STRONG ou EXCELLENT
    return {
      shortTerm: 'Acelerar canais de captação alavancando a estabilidade de margem.',
      mediumTerm: 'Investir em automação e blindar a arquitetura de custo atual.',
      longTerm: 'Consolidar a organização através de crescimento contínuo e estritamente rentável.'
    };
  }
};

export class DreSemanticValidator {
  /**
   * Garante que uma string não contém palavras proibidas
   */
  public static assertDomainIsolation(text: string): boolean {
    if (!text) return true;
    const normalized = text.toLowerCase();
    
    for (const term of DRE_SEMANTIC_BLACKLIST) {
      if (normalized.includes(term.toLowerCase())) {
        return false;
      }
    }
    return true;
  }
}
