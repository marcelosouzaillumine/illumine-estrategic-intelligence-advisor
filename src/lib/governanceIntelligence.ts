import { EixoGestao } from '../types/modules';

export interface DilemmaOption {
  text: string;
  score: number;
}

export interface ManagerDilemma {
  scenario: string;
  options: [DilemmaOption, DilemmaOption, DilemmaOption];
}

export interface GovernancePrinciple {
  id: string;
  name: string;
  axis: EixoGestao;
  executiveDefinition: string;
  philosophicalFoundation: {
    text: string;
    reference: string;
  };
  strategicImpact: 1 | 2 | 3 | 4 | 5;
  systemicIntegration: string;
  executiveRecommendations: string[]; // exactly 12
  situationalScenario?: string;
  managerDilemma?: ManagerDilemma;
  maturityQuestion: string;
  weight: number;
  expectedEvidences: string[];
  risksWhenNeglected: string[];
  reference: string;
  description: string;
  crossAxisImpact: string;
  executiveSuggestions: string[];
}

export const GOVERNANCE_PRINCIPLES: GovernancePrinciple[] = [
  // ====================================================================
  // 1. GOVERNANÇA CORPORATIVA
  // ====================================================================
  {
    id: 'gov_1',
    name: 'Integridade',
    axis: 'Governança Corporativa',
    executiveDefinition: 'A integridade institucional assegura que a organização opere sob um código de ética inegociável, protegendo sua reputação e perenidade.',
    philosophicalFoundation: {
      text: 'A reputação leva 20 anos para ser construída e 5 minutos para ser arruinada.',
      reference: 'Warren Buffett'
    },
    strategicImpact: 5,
    systemicIntegration: 'Base fundamental para a confiança na cultura e a credibilidade no marketing.',
    situationalScenario: 'Um fornecedor estratégico oferece uma vantagem pessoal indevida a um comprador em troca de um contrato maior. A empresa possui mecanismos para detectar e punir essa conduta?',
    maturityQuestion: 'Existe um código de ética formal e canais de integridade ativos que são respeitados na prática?',
    weight: 5,
    expectedEvidences: ['Código de Ética', 'Canal de Denúncia', 'Treinamentos de Compliance'],
    risksWhenNeglected: ['Corrupção Interna', 'Dano Reputacional', 'Riscos Jurídicos'],
    reference: 'Ética Executiva',
    description: 'Fundamento da integridade em todas as esferas da organização.',
    crossAxisImpact: 'Cultura, Operações e Jurídico',
    executiveSuggestions: ['Instituir Comitê de Ética', 'Treinamento de Compliance'],
    executiveRecommendations: [
      'Instituir código de ética formalizado e assinado',
      'Implementar canal de denúncias anônimo e externo',
      'Realizar treinamentos de compliance semestrais',
      'Auditar processos de compras e contratações',
      'Estabelecer regime disciplinar claro e justo',
      'Promover a cultura do "exemplo vem de cima"',
      'Zelar pela transparência em conflitos de interesse',
      'Realizar due diligence de parceiros e fornecedores',
      'Instituir comitê de ética independente',
      'Monitorar indicadores de desvios de conduta',
      'Garantir proteção total ao denunciante de boa-fé',
      'Comunicar os valores éticos em todos os canais'
    ],
    managerDilemma: {
      scenario: 'A empresa pode bater a meta trimestral se antecipar o faturamento de um contrato que ainda não foi totalmente executado. O que você faz?',
      options: [
        { text: 'Não antecipa, priorizando a integridade contábil.', score: 2 },
        { text: 'Antecipa o faturamento para garantir o bônus da equipe.', score: -2 },
        { text: 'Consulta o jurídico para ver se há uma brecha legal.', score: 0 }
      ]
    }
  },
  {
    id: 'gov_2',
    name: 'Discernimento',
    axis: 'Governança Corporativa',
    executiveDefinition: 'O discernimento estratégico permite a análise crítica de cenários, mitigando riscos e identificando oportunidades de alto impacto.',
    philosophicalFoundation: {
      text: 'No meio da dificuldade encontra-se a oportunidade.',
      reference: 'Albert Einstein'
    },
    strategicImpact: 5,
    systemicIntegration: 'Essencial para a estratégia de inovação, gestão de riscos e alocação de capital.',
    situationalScenario: 'O mercado sinaliza uma mudança tecnológica que pode tornar seu produto principal obsoleto em 2 anos. Como o conselho valida essa premissa?',
    maturityQuestion: "Existem rituais estruturados de análise de riscos estratégicos e validação de premissas críticas antes de investimentos?",
    weight: 5,
    expectedEvidences: ["Matriz de Riscos", "Dashboards de BI", "Atas de Comitê"],
    risksWhenNeglected: ["Decisões Precipitadas", "Alocação Ineficiente", "Perda de Capital"],
    reference: "Sabedoria Estratégica",
    description: "Análise crítica de cenários e mitigação de riscos de alto impacto.",
    crossAxisImpact: "Inovação e Finanças",
    executiveSuggestions: ["Instituir comitê de riscos", "Implementar análise de cenários"],
    executiveRecommendations: [
      'Instituir rituais de análise de cenários',
      'Implementar dashboards de BI em tempo real',
      'Estruturar comitê de riscos estratégicos',
      'Adotar rituais de pausa decisória para alta gestão',
      'Implementar análise de impacto cross-eixos',
      'Criar biblioteca de lições aprendidas',
      'Instituir o papel de "advogado do diabo" em reuniões',
      'Realizar workshops de simulação de crise',
      'Implementar indicadores de precisão preditiva',
      'Estruturar processo de validação de premissas',
      'Adotar ferramentas de inteligência competitiva',
      'Estabelecer critérios de decisão baseados em dados'
    ],
    managerDilemma: {
      scenario: 'Um consultor externo sugere que seu modelo de negócio será obsoleto em 3 anos. Seus sócios acham que ele está exagerando para vender consultoria. O que você faz?',
      options: [
        { text: 'Cria um grupo de trabalho para validar as premissas do consultor com dados isentos.', score: 2 },
        { text: 'Ignora o consultor e foca na execução do plano atual que está dando lucro.', score: -2 },
        { text: 'Aguarda mais sinais do mercado antes de tomar qualquer atitude.', score: 0 }
      ]
    }
  },
  {
    id: 'gov_3',
    name: 'Prestação de Contas',
    axis: 'Governança Corporativa',
    executiveDefinition: 'O Accountability (Prestação de Contas) garante que cada nível da organização seja responsável por seus resultados e atos perante os stakeholders.',
    philosophicalFoundation: {
      text: 'O que não pode ser medido, não pode ser gerenciado.',
      reference: 'Peter Drucker'
    },
    strategicImpact: 5,
    systemicIntegration: 'Essencial para o planejamento financeiro e a eficiência operacional.',
    situationalScenario: 'Uma meta estratégica não foi atingida no trimestre. Há um ritual formal onde os responsáveis explicam os motivos e apresentam planos de correção, ou as falhas são ignoradas?',
    maturityQuestion: "A empresa possui rituais formais de reporte e prestação de contas (Accountability) em todos os níveis executivos?",
    weight: 5,
    expectedEvidences: ["Relatórios Mensais", "Rituais de QBR", "Matriz de Responsabilidade"],
    risksWhenNeglected: ["Omissão de Falhas", "Descontrole de Metas", "Falta de Responsabilidade"],
    reference: "Accountability",
    description: "Cultura de responsabilidade e transparência sobre os resultados.",
    crossAxisImpact: "Finanças e Cultura",
    executiveSuggestions: ["Instituir rituais de RPR", "Implementar Matriz RACI"],
    executiveRecommendations: [
      'Implementar rituais de QBR (Quarterly Business Review)',
      'Definir KPIs claros por área e colaborador',
      'Instituir reuniões mensais de prestação de contas',
      'Utilizar dashboards de gestão à vista',
      'Formalizar a matriz de responsabilidade (RACI)',
      'Garantir transparência nos resultados (bons ou ruins)',
      'Instituir plano de ação para metas não atingidas',
      'Promover a cultura da autorresponsabilidade',
      'Auditar o cumprimento das metas declaradas',
      'Realizar feedbacks estruturados baseados em dados',
      'Garantir que a liderança preste contas ao Board',
      'Documentar atas de reuniões de performance'
    ],
    managerDilemma: {
      scenario: 'Você cometeu um erro de projeção que resultará em um prejuízo moderado. Ninguém percebeu ainda e você pode tentar diluir esse valor nos próximos meses. O que você faz?',
      options: [
        { text: 'Assume o erro imediatamente para o conselho ou sócios.', score: 2 },
        { text: 'Tenta diluir o valor para evitar exposição negativa.', score: -2 },
        { text: 'Avisa apenas seu superior direto de forma informal.', score: 0 }
      ]
    }
  },
  {
    id: 'gov_4',
    name: 'Justiça',
    axis: 'Governança Corporativa',
    executiveDefinition: 'A justiça na governança manifesta-se através da meritocracia clara e do tratamento equânime de todos os sócios e colaboradores.',
    philosophicalFoundation: {
      text: 'A justiça é a primeira virtude das instituições sociais.',
      reference: 'John Rawls'
    },
    strategicImpact: 4,
    systemicIntegration: 'Pilar da retenção de talentos e da paz na sucessão societária.',
    situationalScenario: 'Um colaborador de alta performance e um "amigo da diretoria" disputam uma promoção. A decisão é baseada em métricas de mérito auditáveis ou em preferências pessoais?',
    maturityQuestion: "O sistema de reconhecimento e remuneração é baseado em critérios meritocráticos claros e auditáveis para todos?",
    weight: 4,
    expectedEvidences: ["Plano de Cargos e Salários", "Avaliação de Desempenho", "Acordo de Sócios"],
    risksWhenNeglected: ["Desmotivação de Talentos", "Injustiça Percebida", "Conflitos Societários"],
    reference: "Meritocracia",
    description: "Equidade organizacional e reconhecimento baseado em desempenho.",
    crossAxisImpact: "Cultura e Pessoas",
    executiveSuggestions: ["Revisar plano salarial", "Auditar critérios de PLR"],
    executiveRecommendations: [
      'Estruturar Plano de Cargos, Carreiras e Salários (PCCS)',
      'Definir critérios de PLR baseados em resultados reais',
      'Realizar pesquisas salariais de mercado anuais',
      'Instituir comitê de remuneração e mérito',
      'Garantir equidade salarial para funções idênticas',
      'Implementar avaliação de desempenho 360 graus',
      'Comunicar abertamente a lógica de promoções',
      'Eliminar subjetividades em processos de bônus',
      'Treinar gestores em feedback meritocrático',
      'Monitorar o clima organizacional via eNPS',
      'Instituir rituais de celebração de conquistas',
      'Zelar pela transparência em todas as concessões'
    ],
    managerDilemma: {
      scenario: 'Um colaborador de alta performance teve um comportamento que viola o código de ética. Demiti-lo afetaria o resultado do ano drasticamente. O que você faz?',
      options: [
        { text: 'Aplica a sanção prevista, mantendo a equidade da regra.', score: 2 },
        { text: 'Ignora o fato, priorizando a continuidade do resultado.', score: -2 },
        { text: 'Aplica apenas uma advertência verbal para não perder o talento.', score: -1 }
      ]
    }
  },
  {
    id: 'gov_5',
    name: 'Ordem',
    axis: 'Governança Corporativa',
    executiveDefinition: 'A ordem na governança manifesta-se através de alçadas decisórias claras, segregação de funções e processos mapeados.',
    philosophicalFoundation: {
      text: 'A simplicidade é o último grau da sofisticação e da ordem.',
      reference: 'Leonardo da Vinci'
    },
    strategicImpact: 4,
    systemicIntegration: 'Essencial para a padronização operacional e para a segurança jurídica da empresa.',
    situationalScenario: 'Um diretor financeiro pode aprovar um pagamento milionário sozinho sem qualquer dupla validação ou aprovação do Board? A empresa possui níveis de alçada definidos?',
    maturityQuestion: "Os processos operacionais e administrativos estão mapeados e possuem níveis de alçada e segregação de funções definidos?",
    weight: 4,
    expectedEvidences: ["Matriz de Alçadas", "Fluxogramas de Processo", "ERP Parametrizado"],
    risksWhenNeglected: ["Fraudes Financeiras", "Confusão Decisória", "Erros Operacionais Graves"],
    reference: "Ordem e Estrutura",
    description: "Estruturação de alçadas e segregação de funções.",
    crossAxisImpact: "Financeiro e Operacional",
    executiveSuggestions: ["Implementar política de alçadas", "Mapear processos críticos"],
    executiveRecommendations: [
      'Estabelecer matriz de alçadas decisórias clara',
      'Implementar segregação de funções em cargos críticos',
      'Mapear e documentar processos de aprovação',
      'Parametrizar o ERP com travas de segurança',
      'Realizar auditorias de acesso e permissões',
      'Instituir fluxogramas para processos administrativos',
      'Garantir a ordem documental (física e digital)',
      'Definir limites claros para gastos e investimentos',
      'Realizar revisão anual da estrutura organizacional',
      'Eliminar a sobreposição de responsabilidades',
      'Treinar lideranças no fluxo de aprovação correto',
      'Zelar pela disciplina operacional e conformidade'
    ],
    managerDilemma: {
      scenario: 'Um sócio majoritário solicita um pagamento urgente para um fornecedor sem passar pelo fluxo de aprovação padrão. O que você faz?',
      options: [
        { text: 'Nega o pagamento fora do fluxo e solicita a documentação padrão.', score: 2 },
        { text: 'Aprova o pagamento por ser uma ordem do sócio majoritário.', score: -2 },
        { text: 'Aprova mas pede que a documentação seja enviada depois.', score: -1 }
      ]
    }
  },
  {
    id: 'gov_6',
    name: 'Sucessão',
    axis: 'Governança Corporativa',
    executiveDefinition: 'A sucessão estratégica planeja a continuidade da liderança, protegendo o legado e a visão de longo prazo da organização.',
    philosophicalFoundation: {
      text: 'Líderes não criam seguidores, eles criam mais líderes.',
      reference: 'Tom Peters'
    },
    strategicImpact: 5,
    systemicIntegration: 'Garante a perenidade da cultura organizacional e a estabilidade estratégica.',
    situationalScenario: 'O CEO ou um fundador sofre um impedimento súbito. A empresa possui um herdeiro ou sucessor preparado e rituais de transição definidos para evitar o caos institucional?',
    maturityQuestion: "Existe um plano formal de sucessão para a liderança e cargos de alta relevância estratégica?",
    weight: 5,
    expectedEvidences: ["Mapa de Sucessão", "PDI de Sucessores", "Acordo de Quotistas"],
    risksWhenNeglected: ["Vacância de Liderança", "Crise Institucional", "Descontinuidade da Visão"],
    reference: "Sucessão e Legado",
    description: "Planejamento de continuidade de liderança e visão.",
    crossAxisImpact: "Cultura e Estratégia",
    executiveSuggestions: ["Mapear sucessores potenciais", "Implementar mentoria para líderes"],
    executiveRecommendations: [
      'Mapear sucessores internos para cargos chave',
      'Desenvolver PDIs específicos para sucessores',
      'Instituir programa de mentoria entre lideranças',
      'Formalizar o plano de sucessão societária',
      'Realizar avaliações de prontidão para sucessão',
      'Documentar o conhecimento tácito da alta gestão',
      'Promover a transição gradual de responsabilidades',
      'Estabelecer critérios técnicos para sucessão',
      'Zelar pela preservação dos valores na transição',
      'Implementar conselho de família (se aplicável)',
      'Realizar workshops de alinhamento geracional',
      'Garantir a autonomia do sucessor no tempo certo'
    ],
    managerDilemma: {
      scenario: 'Seu sucessor natural é competente tecnicamente, mas não demonstra aderência aos valores éticos da empresa. O conselho pressiona pela nomeação. O que você faz?',
      options: [
        { text: 'Veta a nomeação e propõe busca externa ou plano de valores.', score: 2 },
        { text: 'Aprova a nomeação, confiando que ele mudará com o tempo.', score: -2 },
        { text: 'Aprova com a condição de que ele tenha um monitor de compliance.', score: 0 }
      ]
    }
  },
  {
    id: 'gov_7',
    name: 'Conselho',
    axis: 'Governança Corporativa',
    executiveDefinition: 'A governança via conselho busca a sabedoria coletiva e o aconselhamento plural para decisões estratégicas de alto impacto.',
    philosophicalFoundation: {
      text: 'Nenhum de nós é tão inteligente quanto todos nós juntos.',
      reference: 'Warren Bennis'
    },
    strategicImpact: 5,
    systemicIntegration: 'Norteia a gestão de inovação, finanças e a conformidade global da empresa.',
    situationalScenario: 'A empresa decide investir metade do seu caixa em um novo mercado de alto risco. Esta decisão passa por um conselho de especialistas plurais ou é tomada solitariamente pelo CEO?',
    maturityQuestion: "A empresa conta com um conselho (consultivo ou administrativo) plural que apoia a tomada de decisão estratégica?",
    weight: 5,
    expectedEvidences: ["Ata de Reunião de Conselho", "Perfil dos Conselheiros", "Regimento Interno"],
    risksWhenNeglected: ["Decisões Solitárias", "Viés Executivo", "Erros Estratégicos Graves"],
    reference: "Conselho e Board",
    description: "Aconselhamento plural e estratégico para alta gestão.",
    crossAxisImpact: 'Estratégia e Inovação',
    executiveSuggestions: ['Instituir calendário de reuniões', 'Definir perfis de conselheiros'],
    executiveRecommendations: [
      'Estabelecer calendário anual de reuniões de board',
      'Definir competências e perfis do conselho',
      'Estruturar comitês técnicos de apoio (Gente/Finanças)',
      'Realizar avaliação anual de performance do board',
      'Garantir acesso do conselho a dados operacionais crus',
      'Instituir mandato para renovação de conselheiros',
      'Estabelecer regimento de conduta do conselho',
      'Realizar reuniões estratégicas (off-site)',
      'Incentivar a pluralidade de visões no board',
      'Documentar atas deliberativas formalmente',
      'Capacitar conselheiros em tendências de mercado',
      'Garantir a independência do conselho consultivo'
    ],
    managerDilemma: {
      scenario: 'O CEO propõe um investimento de alto risco. Todos os outros membros do conselho parecem empolgados. Você discorda tecnicamente. O que você faz?',
      options: [
        { text: 'Manifesta sua discordância técnica e solicita registro em ata.', score: 2 },
        { text: 'Vota a favor para não gerar conflito com o CEO dominante.', score: -2 },
        { text: 'Abstém-se do voto, mas não expõe os riscos abertamente.', score: 0 }
      ]
    }
  },

  // ====================================================================
  // 2. CULTURA ORGANIZACIONAL
  // ====================================================================
  {
    id: 'cult_1',
    name: 'Honra',
    axis: 'Cultura Organizacional',
    executiveDefinition: 'A cultura de honra valoriza e reconhece o capital humano como o ativo mais precioso, gerando lealdade e alta performance.',
    philosophicalFoundation: {
      text: 'Trate os funcionários como gostaria que eles tratassem os clientes.',
      reference: 'Stephen Covey'
    },
    strategicImpact: 5,
    systemicIntegration: 'Impacta diretamente a retenção de talentos (Sucessão) e a qualidade da entrega operacional.',
    situationalScenario: 'Um colaborador entrega um projeto excepcional que salva uma conta estratégica. A empresa possui rituais públicos e formais de reconhecimento ou a conquista passa despercebida?',
    maturityQuestion: "Existe um programa formal e genuíno de reconhecimento e valorização do capital humano baseado em desempenho e valores?",
    weight: 5,
    expectedEvidences: ["Programa de Premiação", "Rituais de Elogio Público", "Pesquisa de Clima"],
    risksWhenNeglected: ["Desmotivação", "Turnover Alto", "Falta de Engajamento"],
    reference: "Cultura de Honra",
    description: "Reconhecimento do valor individual para lealdade das equipes.",
    crossAxisImpact: "Retenção e Liderança",
    executiveSuggestions: ["Instituir rituais de gratidão", "Premiar alinhamento com valores"],
    executiveRecommendations: [
      'Instituir rituais de reconhecimento público mensais',
      'Implementar programa de premiação por desempenho',
      'Zelar pela valorização da história dos colaboradores',
      'Promover a cultura do feedback positivo e construtivo',
      'Realizar eventos de celebração de metas atingidas',
      'Instituir bônus ou benefícios por tempo de casa',
      'Garantir que a liderança honre os compromissos com o time',
      'Realizar pesquisas de clima e engajamento anuais',
      'Personalizar o reconhecimento para cada perfil',
      'Fomentar a gratidão mútua entre os departamentos',
      'Implementar mural de conquistas (físico ou digital)',
      'Capacitar gestores em inteligência emocional e honra'
    ],
    managerDilemma: {
      scenario: 'Um colaborador entrega um projeto excepcional que salva uma conta estratégica. Você teme que um elogio público gere inveja na equipe. O que você faz?',
      options: [
        { text: 'Realiza o reconhecimento público e detalha os méritos técnicos da entrega.', score: 2 },
        { text: 'Elogia apenas em particular para evitar conflitos internos.', score: -1 },
        { text: 'Ignora o elogio para não parecer que tem "favoritos".', score: -2 }
      ]
    }
  },
  {
    id: 'cult_2',
    name: 'Unidade',
    axis: 'Cultura Organizacional',
    executiveDefinition: 'A unidade organizacional elimina silos departamentais, promovendo a sinergia e o alinhamento em torno de um objetivo comum.',
    philosophicalFoundation: {
      text: 'Talento ganha jogos, mas trabalho em equipe e inteligência ganham campeonatos.',
      reference: 'Michael Jordan'
    },
    strategicImpact: 5,
    systemicIntegration: 'Crucial para a eficiência operacional e para a agilidade na inovação.',
    situationalScenario: 'O setor de Vendas e o de Operações entram em conflito por causa de um prazo agressivo. Existe um ritual de alinhamento que prioriza o objetivo da empresa ou cada área defende seus próprios indicadores?',
    maturityQuestion: "A organização possui rituais que eliminam silos departamentais e promovem a sinergia em prol do objetivo comum?",
    weight: 5,
    expectedEvidences: ["Reuniões Interdepartamentais", "OKRs Compartilhados", "Projetos Cross-funcionais"],
    risksWhenNeglected: ["Guerra de Departamentos", "Ineficiência", "Desalinhamento Estratégico"],
    reference: "Unidade",
    description: "Sinergia operacional e alinhamento com a visão única.",
    crossAxisImpact: "Eficiência e Execução",
    executiveSuggestions: ["Unificar metas entre eixos", "Promover team building funcional"],
    executiveRecommendations: [
      'Instituir OKRs compartilhados entre departamentos',
      'Realizar rituais de integração "Cross-team" mensais',
      'Promover projetos liderados por equipes multidisciplinares',
      'Garantir que as metas de vendas e operações estejam alinhadas',
      'Eliminar a linguagem de "nós contra eles" interna',
      'Implementar canais de comunicação unificados',
      'Realizar workshops de alinhamento de propósito',
      'Zelar pela unidade de discurso perante o mercado',
      'Fomentar a cultura do suporte mútuo entre áreas',
      'Implementar sistema de incentivos coletivos',
      'Realizar eventos de teambuilding focados em sinergia',
      'Garantir que a visão estratégica seja única e clara'
    ],
    managerDilemma: {
      scenario: 'Vendas e Operações estão em conflito. Vendas quer prazos curtos para bater meta e Operações exige prazos longos para garantir qualidade. O que você faz?',
      options: [
        { text: 'Unifica as metas de ambos em um OKR de "Sucesso do Cliente" com margem garantida.', score: 2 },
        { text: 'Dá razão a Vendas, pois sem faturamento a empresa quebra.', score: -1 },
        { text: 'Dá razão a Operações para evitar reclamações de clientes.', score: -1 }
      ]
    }
  },
  {
    id: 'cult_3',
    name: 'Serviço',
    axis: 'Cultura Organizacional',
    executiveDefinition: 'A liderança servidora inverte a pirâmide tradicional, focando em remover obstáculos para que a equipe atinja a excelência.',
    philosophicalFoundation: {
      text: 'O exemplo não é a principal coisa para influenciar os outros. É a única coisa.',
      reference: 'Albert Schweitzer'
    },
    strategicImpact: 4,
    systemicIntegration: 'Fortalece a diligência operacional e a agilidade na tomada de decisão.',
    situationalScenario: 'Um colaborador está com dificuldade técnica em uma tarefa crítica. O gestor atua cobrando resultados ou senta com ele para remover o obstáculo e ensinar o processo?',
    maturityQuestion: "A liderança é treinada e avaliada no modelo de liderança servidora, focada em remover obstáculos para o time?",
    weight: 4,
    expectedEvidences: ["Avaliação de Liderança", "Pesquisa de Clima", "Taxa de Resolução de Bloqueios"],
    risksWhenNeglected: ["Autoritarismo", "Lentidão Decisória", "Desconexão Líder-Liderado"],
    reference: "Liderança Servidora",
    description: "Foco na remoção de obstáculos e autonomia responsável.",
    crossAxisImpact: "Eficiência e Retenção",
    executiveSuggestions: ["Treinar líderes em suporte ativo", "Avaliar gestores pelo sucesso do time"],
    executiveRecommendations: [
      'Implementar treinamento de liderança servidora',
      'Avaliar gestores pelo sucesso e crescimento de seus times',
      'Criar rituais de "o que posso remover do seu caminho?"',
      'Dar autonomia real para decisões operacionais rápidas',
      'Fomentar o suporte mútuo entre gestores de áreas distintas',
      'Instituir programas de mentorias internas frequentes',
      'Eliminar a cultura de comando e controle autoritário',
      'Priorizar o desenvolvimento de competências das pessoas',
      'Medir o clima da equipe via pesquisas de pulso semanais',
      'Instituir política de "portas abertas" real na liderança',
      'Capacitar gestores em escuta ativa e suporte empático',
      'Celebrar publicamente o crescimento dos liderados'
    ],
    managerDilemma: {
      scenario: 'Um projeto crítico está atrasado por uma barreira burocrática em outro setor. Sua equipe está frustrada. O que você faz?',
      options: [
        { text: 'Intervém pessoalmente para remover o obstáculo e agilizar o fluxo para o time.', score: 2 },
        { text: 'Cobra a equipe por não ter previsto o atraso e exige hora extra.', score: -2 },
        { text: 'Avisa que o problema não é seu e que o time deve resolver sozinho.', score: -2 }
      ]
    }
  },
  {
    id: 'cult_4',
    name: 'Transparência',
    axis: 'Cultura Organizacional',
    executiveDefinition: 'A transparência radical gera confiança e segurança psicológica, permitindo que falhas sejam corrigidas com agilidade e ética.',
    philosophicalFoundation: {
      text: 'A transparência gera confiança e a confiança é o lubrificante da execução.',
      reference: 'Joel Peterson'
    },
    strategicImpact: 5,
    systemicIntegration: 'Essencial para a governança corporativa e para a gestão de riscos reputacionais no marketing.',
    situationalScenario: 'Os resultados financeiros do mês foram abaixo do esperado. A alta gestão comunica os desafios abertamente para a equipe ou esconde os dados gerando insegurança?',
    maturityQuestion: "Existe transparência radical na comunicação de metas, resultados financeiros e desafios estratégicos para toda a equipe?",
    weight: 5,
    expectedEvidences: ["Dashboards Públicos", "Atas de Decisão", "Pesquisas de Confiança"],
    risksWhenNeglected: ["Rádio Corredor", "Insegurança Psicológica", "Falta de Alinhamento"],
    reference: "Transparência",
    description: "Comunicação honesta que gera confiança e agilidade.",
    crossAxisImpact: "Governança e Riscos",
    executiveSuggestions: ["Abrir KPIs para o time", "Instituir canal direto com CEO"],
    executiveRecommendations: [
      'Comunicar abertamente os desafios do negócio',
      'Publicar KPIs globais para todo o time',
      'Instituir canal direto de perguntas ao CEO',
      'Admitir falhas publicamente como aprendizado',
      'Manter atas de decisão acessíveis',
      'Eliminar a cultura de segredos desnecessários',
      'Treinar lideranças em comunicação franca',
      'Garantir visibilidade nos resultados financeiros',
      'Combater a cultura do "rádio corredor"',
      'Fomentar o feedback radical e construtivo',
      'Documentar a lógica de decisões estratégicas',
      'Criar fórum de perguntas e respostas abertas'
    ],
    managerDilemma: {
      scenario: 'Os resultados financeiros do trimestre foram ruins. Você teme que comunicar isso gere pânico e debandada de talentos. O que você faz?',
      options: [
        { text: 'Expõe os números reais, explica as causas e apresenta o plano de correção.', score: 2 },
        { text: 'Maquia os resultados para manter o clima positivo.', score: -2 },
        { text: 'Diz apenas que "os desafios continuam" sem abrir dados reais.', score: -1 }
      ]
    }
  },
  {
    id: 'cult_5',
    name: 'Cuidado Humano',
    axis: 'Cultura Organizacional',
    executiveDefinition: 'O cuidado humano foca no bem-estar integral do colaborador, reconhecendo que pessoas saudáveis geram resultados extraordinários.',
    philosophicalFoundation: {
      text: 'Se você cuidar das pessoas, elas cuidarão do seu negócio.',
      reference: 'Richard Branson'
    },
    strategicImpact: 4,
    systemicIntegration: 'Impacta a produtividade (Diligência) e reduz o custo com absenteísmo e turnover.',
    situationalScenario: 'Um colaborador de confiança começa a apresentar queda de performance por problemas pessoais graves. A liderança oferece suporte e acolhimento ou foca apenas na cobrança de metas?',
    maturityQuestion: "A organização possui políticas ativas de cuidado com o bem-estar físico e a saúde mental dos colaboradores?",
    weight: 4,
    expectedEvidences: ["Programa de Saúde Mental", "Benefícios de Bem-Estar", "Pesquisas de Burnout"],
    risksWhenNeglected: ["Burnout", "Absenteísmo Elevado", "Perda de Talentos"],
    reference: 'Cuidado Integral',
    description: 'Foco no bem-estar físico e mental das pessoas.',
    crossAxisImpact: 'Produtividade e Retenção',
    executiveSuggestions: ['Programa de saúde mental', 'Flexibilidade de jornada'],
    executiveRecommendations: [
      'Implementar programa de suporte à saúde mental',
      'Oferecer benefícios focados em bem-estar integral',
      'Instituir política de equilíbrio vida-trabalho',
      'Realizar workshops sobre saúde e ergonomia',
      'Treinar lideranças para detectar sinais de burnout',
      'Garantir suporte emocional em momentos de crise pessoal',
      'Fomentar um ambiente de segurança psicológica real',
      'Promover atividades de descompressão na jornada',
      'Zelar pelo respeito ao tempo de descanso do time',
      'Realizar check-ins individuais focados no humano',
      'Implementar ouvidoria interna acolhedora',
      'Celebrar marcos pessoais (aniversários, casamentos)'
    ],
    managerDilemma: {
      scenario: 'Um colaborador de confiança está com queda de performance por problemas pessoais graves (doença na família). O que você faz?',
      options: [
        { text: 'Oferece suporte, flexibilidade de jornada e acolhimento humano.', score: 2 },
        { text: 'Cobra as metas normalmente, alegando que "negócios são negócios".', score: -2 },
        { text: 'Dá um ultimato para que ele resolva seus problemas e volte a produzir.', score: -2 }
      ]
    }
  },
  {
    id: 'cult_6',
    name: 'Propósito',
    axis: 'Cultura Organizacional',
    executiveDefinition: 'O propósito organizacional conecta o trabalho diário a um significado maior, inspirando a equipe e atraindo clientes fiéis.',
    philosophicalFoundation: {
      text: 'Uma visão sem ação não passa de um sonho.',
      reference: 'Joel Barker'
    },
    strategicImpact: 5,
    systemicIntegration: 'Norteia o posicionamento de marketing e a narrativa institucional.',
    situationalScenario: 'Um colaborador executa uma tarefa repetitiva e cansativa. Ele entende como aquela ação contribui para a missão da empresa ou vê apenas como um "trabalho por salário"?',
    maturityQuestion: "Os colaboradores percebem o significado maior do seu trabalho e estão genuinamente alinhados ao propósito da organização?",
    weight: 5,
    expectedEvidences: ["Manifesto de Cultura", "Integração (Onboarding)", "Discurso da Liderança"],
    risksWhenNeglected: ["Desengajamento", "Trabalho Mecânico", "Perda de Talentos com Valores"],
    reference: 'Propósito e Missão',
    description: 'Conexão do trabalho com um significado maior.',
    crossAxisImpact: 'Engajamento e Marca',
    executiveSuggestions: ['Manifesto de cultura', 'Rituais de histórias de impacto'],
    executiveRecommendations: [
      'Definir e comunicar o propósito "Massivo e Transformador"',
      'Integrar o propósito no processo de Onboarding',
      'Vincular cada tarefa operacional ao impacto final',
      'Realizar workshops de alinhamento de valores anuais',
      'Instituir o ritual de compartilhar "histórias de impacto"',
      'Zelar pela coerência entre propósito e decisões',
      'Promover a cultura do legado acima do lucro',
      'Comunicar visualmente o propósito em toda a sede',
      'Garantir que a liderança personifique o propósito',
      'Selecionar talentos baseando-se no fit cultural',
      'Publicar o manifesto de cultura e propósito',
      'Celebrar conquistas que reforçam a missão'
    ],
    managerDilemma: {
      scenario: 'Surge uma oportunidade de lucro rápido que fere levemente o propósito central e os valores declarados da empresa. O que você faz?',
      options: [
        { text: 'Recusa a oportunidade, mantendo a coerência com o propósito.', score: 2 },
        { text: 'Aceita, pois o lucro justifica o desvio temporário.', score: -2 },
        { text: 'Aceita mas tenta esconder o fato da base da empresa.', score: -2 }
      ]
    }
  },
  {
    id: 'cult_7',
    name: 'Confiança',
    axis: 'Cultura Organizacional',
    executiveDefinition: 'A confiança sistêmica é o lubrificante que acelera processos decisórios e reduz o custo da burocracia excessiva.',
    philosophicalFoundation: {
      text: 'Confiança se ganha em gotas e se perde em litros.',
      reference: 'Jean-Paul Sartre'
    },
    strategicImpact: 5,
    systemicIntegration: 'Base para a inovação colaborativa e para a descentralização da gestão operacional.',
    maturityQuestion: "A cultura organizacional permite a descentralização decisória baseada na confiança mútua?",
    weight: 5,
    expectedEvidences: ["Delegação Formal", "Feedback 360", "Índice de Confiança"],
    risksWhenNeglected: ["Lentidão Decisória", "Microgestão", "Custo de Controle"],
    reference: "Confiança Sistêmica",
    description: "Aceleração de processos através da segurança psicológica.",
    crossAxisImpact: "Inovação e Operações",
    executiveSuggestions: ["Delegar autoridade com clareza", "Eliminar controles excessivos"],
    executiveRecommendations: [
      'Delegar autoridade com clareza de escopo',
      'Eliminar controles e aprovações desnecessários',
      'Promover o feedback 360 como rito contínuo',
      'Fomentar a cultura de "assumir a responsabilidade"',
      'Combater a microgestão entre líderes',
      'Instituir políticas de confiança remota',
      'Dar liberdade criativa para resolução de problemas',
      'Treinar líderes em delegação e acompanhamento',
      'Zelar pela segurança psicológica em reuniões',
      'Estabelecer marcos de resultados, não métodos',
      'Monitorar a percepção de autonomia e confiança',
      'Premiar a tomada de decisão responsável'
    ],
    managerDilemma: {
      scenario: 'Um colaborador de confiança comete um erro grave por ter tido autonomia total. Você sofre pressão para centralizar as decisões. O que você faz?',
      options: [
        { text: 'Mantém a confiança e a autonomia, tratando o erro como lição aprendida.', score: 2 },
        { text: 'Centraliza tudo imediatamente para evitar novos prejuízos.', score: -2 },
        { text: 'Mantém a autonomia, mas impõe um monitoramento excessivo.', score: -1 }
      ]
    }
  },

  // ====================================================================
  // 3. GESTÃO ADMINISTRATIVA E FINANCEIRA
  // ====================================================================
  {
    id: 'fin_1',
    name: 'Prudência',
    axis: 'Gestão Administrativa e Financeira',
    executiveDefinition: 'A prudência financeira garante a manutenção de reservas de liquidez e a gestão conservadora de riscos para a perenidade do negócio.',
    philosophicalFoundation: {
      text: 'Risco vem de não saber o que você está fazendo.',
      reference: 'Warren Buffett'
    },
    strategicImpact: 5,
    systemicIntegration: 'Protege a governança corporativa e garante recursos para investimentos em inovação.',
    situationalScenario: 'Uma crise setorial inesperada reduz o faturamento em 30%. A empresa possui fôlego financeiro para manter a operação sem recorrer a empréstimos bancários imediatos?',
    maturityQuestion: "A empresa mantém reservas de liquidez e uma gestão conservadora de riscos para garantir a perenidade?",
    weight: 5,
    expectedEvidences: ["Reserva de Emergência", "Análise de Sensibilidade", "Políticas de Crédito"],
    risksWhenNeglected: ["Insolvência", "Dependência Bancária", "Quebra de Fluxo"],
    reference: "Prudência Financeira",
    description: "Gestão de reservas e riscos conservadores.",
    crossAxisImpact: "Governança e Estratégia",
    executiveSuggestions: ["Constituir reserva de 6 meses", "Simular estresse de caixa"],
    executiveRecommendations: [
      'Constituir reserva de liquidez (mínimo 6 meses)',
      'Realizar simulações de estresse de caixa trimestrais',
      'Implementar política conservadora de alavancagem',
      'Revisar custos fixos e variáveis periodicamente',
      'Adotar auditoria externa de riscos financeiros',
      'Instituir comitê de investimentos e Capex',
      'Manter linhas de crédito preventivas abertas',
      'Diversificar ativos e custódias financeiras',
      'Estabelecer política de dividendos sustentável',
      'Monitorar índices de liquidez corrente e seca',
      'Implementar seguros patrimoniais e D&O',
      'Zelar pela saúde financeira dos sócios'
    ],
    managerDilemma: {
      scenario: 'Você identifica que um benefício concedido à diretoria é legal, mas moralmente questionável diante de um momento de corte de custos na base. O que você faz?',
      options: [
        { text: 'Propõe a suspensão do benefício em solidariedade à equipe.', score: 2 },
        { text: 'Mantém o benefício, alegando direito legal adquirido.', score: -1 },
        { text: 'Usa o benefício mas tenta mantê-lo em sigilo absoluta.', score: -2 }
      ]
    }
  },
  {
    id: 'fin_2',
    name: 'Sustentabilidade',
    axis: 'Gestão Administrativa e Financeira',
    executiveDefinition: 'A sustentabilidade financeira foca no crescimento orgânico, lucratividade real e geração de caixa livre recorrente para perenidade.',
    philosophicalFoundation: {
      text: 'O lucro é o oxigênio, mas não é a razão de viver de uma empresa.',
      reference: 'Jim Collins'
    },
    strategicImpact: 5,
    systemicIntegration: 'Impacta diretamente o valor de mercado (Valuation) e a capacidade de investimento comercial.',
    situationalScenario: 'A empresa apresenta faturamento recorde, mas o caixa está sempre no limite. Existe um monitoramento da margem líquida e do EBITDA para garantir que o crescimento seja lucrativo?',
    maturityQuestion: "O crescimento da empresa é sustentado por lucro real, margens saudáveis e geração de caixa livre recorrente?",
    weight: 5,
    expectedEvidences: ["DRE Gerencial", "Análise de EBITDA", "DFC Direto"],
    risksWhenNeglected: ["Quebra de Caixa", "Crescimento não Lucrativo", "Dependência de Capital Externo"],
    reference: 'Sustentabilidade',
    description: 'Crescimento orgânico e lucratividade real.',
    crossAxisImpact: 'Valuation e Investimento',
    executiveSuggestions: ['Monitorar Margem EBITDA', 'Auditoria de custos'],
    executiveRecommendations: [
      'Crescer baseado na capacidade real de entrega',
      'Evitar expansão subsidiada por dívida cara',
      'Manter fluxo de caixa operacional positivo',
      'Diversificar fontes de receita recorrente',
      'Realizar precificação baseada em valor e margem',
      'Auditar custos variáveis e fixos mensalmente',
      'Investir em tecnologia que reduza custo',
      'Zelar pela liquidez no curto e longo prazo',
      'Implementar análise de payback para novos projetos',
      'Monitorar o CAC vs LTV mensalmente',
      'Reduzir o ciclo financeiro para otimizar caixa',
      'Estabelecer metas de lucro líquido por unidade'
    ],
    managerDilemma: {
      scenario: 'Um grande cliente solicita um volume altíssimo de pedidos, mas exige um desconto que deixa a margem líquida negativa. O que você faz?',
      options: [
        { text: 'Recusa a venda, priorizando a sustentabilidade financeira do negócio.', score: 2 },
        { text: 'Aceita para garantir o faturamento e o market share.', score: -2 },
        { text: 'Aceita na esperança de renegociar o preço no futuro.', score: -1 }
      ]
    }
  },
  {
    id: 'fin_3',
    name: 'Planejamento',
    axis: 'Gestão Administrativa e Financeira',
    executiveDefinition: 'O planejamento financeiro rigoroso (Budget) evita o improviso e alinha recursos às prioridades estratégicas de longo prazo.',
    philosophicalFoundation: {
      text: 'Planejamento não é sobre decisões futuras, mas sobre o futuro das decisões presentes.',
      reference: 'Peter Drucker'
    },
    strategicImpact: 5,
    systemicIntegration: 'Orienta a execução operacional e as campanhas de marketing de alto investimento via alocação de recursos.',
    situationalScenario: 'O setor de marketing solicita um investimento extra para uma campanha relâmpago. A empresa possui um orçamento (Budget) prévio e rituais de revisão para aprovar ou negar com base no caixa?',
    maturityQuestion: "Existe um planejamento financeiro rigoroso (Budget) com rituais de revisão que alinha os recursos às prioridades estratégicas?",
    weight: 5,
    expectedEvidences: ["Orçamento Anual (Budget)", "Revisões Trimestrais", "Atas de Planejamento"],
    risksWhenNeglected: ["Improviso Financeiro", "Desperdício de Recursos", "Desalinhamento Estratégico"],
    reference: 'Planejamento Orçamentário',
    description: 'Alocação de recursos via Budget e Forecast.',
    crossAxisImpact: 'Execução e Controle',
    executiveSuggestions: ['Implementar rituais de Budget', 'Revisar Forecast trimestral'],
    executiveRecommendations: [
      'Elaborar orçamento anual detalhado (Budget) por centro de custo',
      'Realizar revisões orçamentárias trimestrais (Forecast)',
      'Vincular metas de KPIs ao orçamento financeiro aprovado',
      'Instituir rituais de análise de desvios (Realizado vs Orçado)',
      'Implementar fluxos de aprovação automatizados no ERP',
      'Realizar planejamento tributário preventivo anualmente',
      'Projetar fluxo de caixa para os próximos 12 meses (Rôler)',
      'Definir premissas macroeconômicas claras para o plano',
      'Alocar recursos baseados em ROI esperado e prioridade',
      'Estruturar plano de Capex para modernização de ativos',
      'Documentar a lógica de alocação de recursos estratégicos',
      'Realizar workshops de planejamento com toda a liderança'
    ],
    managerDilemma: {
      scenario: 'O setor de marketing solicita um investimento extra não planejado no Budget para uma oportunidade "única". O que você faz?',
      options: [
        { text: 'Exige uma revisão do Budget e corte em outra área para acomodar o gasto.', score: 2 },
        { text: 'Libera o dinheiro sem questionar, pois "oportunidades não esperam".', score: -2 },
        { text: 'Usa a reserva de emergência para cobrir o gasto de marketing.', score: -1 }
      ]
    }
  },
  {
    id: 'fin_4',
    name: 'Multiplicação',
    axis: 'Gestão Administrativa e Financeira',
    executiveDefinition: 'A multiplicação foca na otimização do uso do capital para gerar novos ativos, escalar a operação e criar fontes de receita diversificadas.',
    philosophicalFoundation: {
      text: 'O melhor investimento que você pode fazer é em você mesmo.',
      reference: 'Warren Buffett'
    },
    strategicImpact: 4,
    systemicIntegration: 'Alimenta o eixo de inovação e fortalece a expansão comercial via novos investimentos.',
    situationalScenario: 'A empresa possui excesso de caixa em um mês excepcional. O recurso é utilizado para gastos supérfluos ou reinvestido em ativos produtivos e unidades de negócio com retorno mensurável?',
    maturityQuestion: "A organização reinveste capital de forma sistemática em novos ativos ou unidades de negócio com retorno mensurável (ROI)?",
    weight: 3,
    expectedEvidences: ["Mapa de Investimentos", "ROI de Projetos", "Relatório de Expansão"],
    risksWhenNeglected: ["Estagnação", "Falta de Escala", "Oportunidades de Mercado Perdidas"],
    reference: 'Escala e Ativos',
    description: 'Otimização do capital para novos ativos e escala.',
    crossAxisImpact: 'Inovação e Expansão',
    executiveSuggestions: ['Avaliar M&A', 'Reinvestir em tecnologia core'],
    executiveRecommendations: [
      'Investir em novas unidades de negócio (BU) de alto potencial',
      'Implementar programa de intraempreendedorismo para inovação',
      'Avaliar fusões e aquisições estratégicas (M&A) para escala',
      'Otimizar a alocação de ativos produtivos existentes',
      'Modernizar tecnologia core para ganho de escala operacional',
      'Desenvolver novos produtos ou serviços de alta margem',
      'Expandir para novos mercados geográficos ou nichos',
      'Implementar parcerias de canais de venda para multiplicar alcance',
      'Incentivar a inovação incremental focada em lucratividade',
      'Otimizar processos operacionais para reduzir o custo unitário',
      'Investir em treinamento técnico que multiplique o output',
      'Monitorar rigorosamente a produtividade do capital investido'
    ],
    managerDilemma: {
      scenario: 'A empresa obteve um lucro recorde no semestre. Os sócios querem distribuir 100% dos dividendos. O que você faz?',
      options: [
        { text: 'Propõe reter 50% para investimento em tecnologia e expansão.', score: 2 },
        { text: 'Aprova a distribuição total para manter a harmonia societária.', score: -2 },
        { text: 'Propõe distribuir tudo mas pegar um empréstimo para os investimentos.', score: -2 }
      ]
    }
  },
  {
    id: 'fin_5',
    name: 'Responsabilidade',
    axis: 'Gestão Administrativa e Financeira',
    executiveDefinition: 'A responsabilidade financeira exige integridade absoluta nos registros, conformidade fiscal e separação patrimonial rígida.',
    philosophicalFoundation: {
      text: 'Ser honesto pode não te dar muitos amigos, mas sempre te dará os amigos certos.',
      reference: 'John Lennon'
    },
    strategicImpact: 5,
    systemicIntegration: 'Pilar fundamental da governança corporativa e da transparência institucional perante terceiros.',
    situationalScenario: 'Um sócio deseja realizar uma retirada pessoal direta do caixa da empresa para uma despesa privada. Existe uma política clara que impede a confusão patrimonial e exige prestação de contas?',
    maturityQuestion: "A contabilidade é auditável, ética e cumpre rigorosamente os compromissos fiscais e a separação patrimonial?",
    weight: 3,
    expectedEvidences: ["Certidões Negativas (CND)", "Relatórios de Auditoria", "Política de Reembolso"],
    risksWhenNeglected: ["Passivo Fiscal Elevado", "Dano Reputacional Grave", "Confusão Patrimonial"],
    reference: 'Compliance Financeiro',
    description: 'Integridade nos registros e separação patrimonial.',
    crossAxisImpact: 'Governança e Jurídico',
    executiveSuggestions: ['Auditoria contábil externa', 'Política de reembolso rígida'],
    executiveRecommendations: [
      'Manter contabilidade 100% auditável, ética e transparente',
      'Cumprir rigorosamente prazos fiscais, tributários e sociais',
      'Instituir separação clara e rígida entre sócio e empresa',
      'Realizar auditorias preventivas de conformidade contábil',
      'Implementar sistemas de controle interno e alçadas robustos',
      'Garantir transparência total em retiradas de lucro e dividendos',
      'Instituir política de reembolso e gastos corporativos clara',
      'Manter certidões negativas de débitos (CND) sempre em dia',
      'Formalizar contratos e notas fiscais com todos os fornecedores',
      'Treinar equipe administrativa em ética e compliance fiscal',
      'Utilizar ERP integrado para evitar erros e manipulações manuais',
      'Publicar balanços gerenciais periódicos para os stakeholders'
    ],
    managerDilemma: {
      scenario: 'Você precisa realizar um gasto pessoal urgente e seu cartão pessoal está bloqueado. Você pensa em usar o cartão da empresa e repor depois. O que você faz?',
      options: [
        { text: 'Não utiliza o cartão da empresa, mantendo a separação patrimonial rígida.', score: 2 },
        { text: 'Usa o cartão da empresa e solicita o desconto no próximo pro-labore.', score: 0 },
        { text: 'Usa o cartão e pede ao financeiro para classificar como "despesa de viagem".', score: -2 }
      ]
    }
  },
  {
    id: 'fin_6',
    name: 'Generosidade',
    axis: 'Gestão Administrativa e Financeira',
    executiveDefinition: 'A generosidade estratégica destina parte dos lucros para impacto social, reforçando o propósito institucional e o valor da marca.',
    philosophicalFoundation: {
      text: 'Nós ganhamos a vida pelo que recebemos, mas fazemos a vida pelo que damos.',
      reference: 'Winston Churchill'
    },
    strategicImpact: 3,
    systemicIntegration: 'Fortalece imensamente a cultura organizacional e o marketing institucional (ESG).',
    situationalScenario: 'A empresa obteve um lucro acima da meta. Existe uma política formal de destinação de parte desse resultado para projetos de impacto social ou apoio à comunidade?',
    maturityQuestion: "A empresa possui uma política clara, transparente e sistemática de investimento social e doação?",
    weight: 3,
    expectedEvidences: ["Relatório de Impacto Social", "Política de Doação", "Projetos Apoiados"],
    risksWhenNeglected: ['Perda de Propósito', 'Baixo Engajamento', 'Isolamento Comunitário'],
    reference: 'Impacto Social',
    description: 'Destinação de lucros para causas sociais e impacto.',
    crossAxisImpact: 'Cultura e Marketing',
    executiveSuggestions: ['Criar comitê de doações', 'Parcerias com ONGs'],
    executiveRecommendations: [
      'Criar fundo de emergência para colaboradores',
      'Instituir premiações por impacto social gerado',
      'Publicar relatório anual de impacto social',
      'Apoiar instituições de ensino e capacitação',
      'Implementar práticas de ESG (Ambiental/Social/Gov)',
      'Envolver a equipe na escolha das causas sociais',
      'Garantir transparência no destino dos recursos',
      'Medir o retorno social do investimento (SROI)',
      'Destinar percentual fixo do lucro para doações',
      'Instituir programa de voluntariado corporativo',
      'Priorizar fornecedores locais e pequenos negócios',
      'Zelar pela ética em todas as parcerias sociais'
    ],
    managerDilemma: {
      scenario: 'A empresa atingiu as metas. Há uma pressão para aumentar o bônus dos sócios, mas você sugeriu destinar uma parte para uma causa social da comunidade. O que você faz?',
      options: [
        { text: 'Mantém a proposta social, vinculando-a aos valores de legado da empresa.', score: 2 },
        { text: 'Cede à pressão e converte tudo em bônus para os sócios.', score: -1 },
        { text: 'Reduz a doação para um valor simbólico para não "incomodar" ninguém.', score: 0 }
      ]
    }
  },
  {
    id: 'fin_7',
    name: 'Eficiência',
    axis: 'Gestão Administrativa e Financeira',
    executiveDefinition: 'A eficiência administrativa foca na otimização de fluxos e redução de burocracias para suportar o crescimento.',
    philosophicalFoundation: {
      text: 'Eficiência é fazer certo as coisas; eficácia é fazer as coisas certas.',
      reference: 'Peter Drucker'
    },
    strategicImpact: 4,
    systemicIntegration: 'Otimiza a gestão operacional e libera recursos para inovação e marketing.',
    maturityQuestion: "A operação administrativa utiliza tecnologia e processos para reduzir custos e tempos?",
    weight: 3,
    expectedEvidences: ["Indicadores de Produtividade Adm", "Fluxogramas", "Relatórios de Desperdício"],
    risksWhenNeglected: ["Inchaço Administrativo", "Lentidão", "Custo Oculto"],
    reference: "Eficiência",
    description: "Otimização de fluxos e redução de burocracias.",
    crossAxisImpact: "Operações e Resultados",
    executiveSuggestions: ["Automatizar o financeiro", "Reduzir custos não core"],
    executiveRecommendations: [
      'Automatizar processos financeiros repetitivos',
      'Reduzir prazos de fechamento contábil mensal',
      'Implementar dashboards de indicadores administrativos',
      'Otimizar o fluxo de aprovação de pagamentos',
      'Centralizar compras para ganho de escala',
      'Reduzir custos fixos não core trimestralmente',
      'Implementar metodologias ágeis no administrativo',
      'Digitalizar 100% da documentação financeira',
      'Otimizar a logística e gestão de suprimentos',
      'Revisar contratos de terceiros anualmente',
      'Instituir metas de produtividade administrativa',
      'Implementar rituais de melhoria de processos'
    ],
    managerDilemma: {
      scenario: 'O setor administrativo insiste em manter processos manuais lentos por medo de que a automação gere demissões. O que você faz?',
      options: [
        { text: 'Implementa a automação e requalifica a equipe para funções de maior valor.', score: 2 },
        { text: 'Mantém o processo manual para evitar conflitos com a equipe.', score: -2 },
        { text: 'Automatiza e demite todos os que faziam a tarefa manual imediatamente.', score: -1 }
      ]
    }
  },

  // ====================================================================
  // 4. GESTÃO DE INOVAÇÃO
  // ====================================================================
  {
    id: 'inov_1',
    name: 'Criatividade',
    axis: 'Gestão de Inovação',
    executiveDefinition: 'A criatividade institucional é a capacidade de gerar soluções originais e valiosas que antecipam as necessidades do mercado.',
    philosophicalFoundation: {
      text: 'A criatividade é a inteligência se divertindo.',
      reference: 'Albert Einstein'
    },
    strategicImpact: 4,
    systemicIntegration: 'Motor do posicionamento de marketing e da diferenciação competitiva no eixo comercial.',
    situationalScenario: 'Um concorrente lança um produto similar ao seu com preço menor. A equipe se reúne para baixar o preço ou para criar uma solução criativa que gere valor percebido superior?',
    maturityQuestion: "A organização possui rituais ativos de estímulo à criatividade e geração de soluções originais para problemas de mercado?",
    weight: 4,
    expectedEvidences: ["Brainstorms Estruturados", "Portfólio de Ideias", "Projetos de Design Thinking"],
    risksWhenNeglected: ["Comoditização", "Falta de Diferenciação", "Obsolescência de Soluções"],
    reference: "Criatividade",
    description: "Ambiente que estimula a geração e teste de novas ideias.",
    crossAxisImpact: "Marketing e Pessoas",
    executiveSuggestions: ["Instituir rituais de ideação", "Recompensar melhorias incrementais"],
    executiveRecommendations: [
      'Instituir rituais de brainstorming mensais sobre dores do cliente',
      'Implementar caixa de ideias digital com premiação por inovação',
      'Treinar a equipe em metodologias de Design Thinking',
      'Realizar visitas a mercados correlatos para buscar inspiração',
      'Zelar pela diversidade de perfis em times de projeto',
      'Garantir tempo livre na jornada para pesquisa e criação',
      'Promover a cultura do "por que não?" em processos antigos',
      'Realizar workshops de co-criação com os clientes reais',
      'Monitorar o número de novas ideias testadas mensalmente',
      'Instituir o dia da inovação (Innovation Day) trimestral',
      'Capacitar gestores em facilitação de processos criativos',
      'Documentar e proteger a propriedade intelectual gerada'
    ],
    managerDilemma: {
      scenario: 'Um concorrente lança um produto similar ao seu com 30% de desconto. Sua equipe comercial pressiona para baixar o preço. O que você faz?',
      options: [
        { text: 'Lança uma nova versão com diferenciais criativos que justificam o preço atual.', score: 2 },
        { text: 'Baixa o preço imediatamente para não perder o volume de vendas.', score: -2 },
        { text: 'Mantém o preço e gasta mais em anúncios de performance.', score: -1 }
      ]
    }
  },
  {
    id: 'inov_2',
    name: 'Aprendizado',
    axis: 'Gestão de Inovação',
    executiveDefinition: 'O aprendizado contínuo transforma o erro em ativo intelectual, garantindo que a organização evolua com cada ciclo de execução.',
    philosophicalFoundation: {
      text: 'O aprendizado é o único investimento que nunca se esgota.',
      reference: 'Peter Drucker'
    },
    strategicImpact: 5,
    systemicIntegration: 'Essencial para a melhoria operacional e para a sucessão de lideranças.',
    situationalScenario: 'Um projeto piloto de um novo serviço falha e gera prejuízo. A liderança realiza uma análise de aprendizado (Post-mortem) ou foca apenas em encontrar culpados?',
    maturityQuestion: "Existe uma cultura sistemática de aprendizado com os erros e compartilhamento de conhecimento técnico entre as áreas?",
    weight: 5,
    expectedEvidences: ["Wiki de Conhecimento", "Relatórios de Lições Aprendidas", "Trilhas de T&D"],
    risksWhenNeglected: ["Repetição de Erros", "Erosão de Conhecimento", "Estatismo Intelectual"],
    reference: "Aprendizado",
    description: "Cultura de lifelong learning e atualização contínua.",
    crossAxisImpact: "Operações e Cultura",
    executiveSuggestions: ["Subsidiar cursos", "Instituir mentorias"],
    executiveRecommendations: [
      'Implementar rituais de "Post-mortem" após cada projeto crítico',
      'Criar base de conhecimento (Wiki) acessível a todos',
      'Instituir bônus ou incentivo para quem compartilha saber',
      'Realizar palestras internas semanais (Brown Bag Lunch)',
      'Financiar cursos e certificações estratégicas para o time',
      'Zelar pela documentação de erros e as soluções adotadas',
      'Realizar auditoria de aprendizado trimestralmente',
      'Fomentar a rotação de funções para diversificar o saber',
      'Implementar trilhas de desenvolvimento individual (PDI)',
      'Garantir que a liderança dedique tempo ao ensino técnico',
      'Realizar benchmarks externos sistemáticos com o mercado',
      'Manter biblioteca corporativa (física ou digital) atualizada'
    ],
    managerDilemma: {
      scenario: 'Um projeto de inovação piloto falhou, gerando um prejuízo de R$ 50k. O que você faz?',
      options: [
        { text: 'Realiza um Post-mortem detalhado para extrair aprendizados e documentar na Wiki.', score: 2 },
        { text: 'Demite o responsável pelo projeto para dar um exemplo à equipe.', score: -2 },
        { text: 'Abafa o caso para que os sócios não descubram o prejuízo.', score: -2 }
      ]
    }
  },
  {
    id: 'inov_3',
    name: 'Adaptabilidade',
    axis: 'Gestão de Inovação',
    executiveDefinition: 'A adaptabilidade permite que a organização responda com agilidade a mudanças bruscas no mercado ou na tecnologia.',
    philosophicalFoundation: {
      text: 'Não é o mais forte que sobrevive, nem o mais inteligente, mas o que melhor se adapta às mudanças.',
      reference: 'Charles Darwin'
    },
    strategicImpact: 5,
    systemicIntegration: 'Garante a sobrevivência financeira em crises e a relevância comercial contínua.',
    situationalScenario: 'Uma nova regulamentação impacta drasticamente seu modelo de negócio principal. A empresa possui rituais de re-planejamento ágil ou fica paralisada pela burocracia interna?',
    maturityQuestion: "A empresa possui rituais de re-planejamento ágil e flexibilidade para mudar o modelo de negócio quando necessário?",
    weight: 5,
    expectedEvidences: ["Revisões de Planejamento Ágil", "Análise de Tendências", "Pivotações Documentadas"],
    risksWhenNeglected: ["Irrelevância de Mercado", "Falência Estrutural", "Lentidão de Resposta"],
    reference: "Agilidade",
    description: "Velocidade de adaptação e execução de novos projetos.",
    crossAxisImpact: "Comercial e Operações",
    executiveSuggestions: ["Adotar metodologias ágeis", "Reduzir burocracia decisória"],
    executiveRecommendations: [
      'Instituir rituais de revisão de cenário mensalmente',
      'Adotar metodologias ágeis (Scrum/Kanban) na gestão',
      'Reduzir a hierarquia para acelerar tomadas de decisão',
      'Monitorar sinais fracos de mudança tecnológica no nicho',
      'Manter estrutura de custos flexível para ajustes rápidos',
      'Capacitar a equipe em multitarefa e visão generalista',
      'Realizar testes rápidos de novos modelos de receita',
      'Eliminar a cultura do "sempre foi feito assim" internamente',
      'Instituir comitê de tendências e inovação de ruptura',
      'Garantir que os contratos permitam flexibilidade de escopo',
      'Fomentar a resiliência emocional do time perante mudanças',
      'Documentar os aprendizados de cada pivotação realizada'
    ],
    managerDilemma: {
      scenario: 'Uma nova tecnologia ameaça seu serviço principal. A equipe está paralisada pelo medo. O que você faz?',
      options: [
        { text: 'Cria uma célula ágil para prototipar o uso dessa nova tecnologia no negócio.', score: 2 },
        { text: 'Ignora a tecnologia, confiando que seus clientes são leais ao modelo antigo.', score: -2 },
        { text: 'Proíbe o uso da nova tecnologia na empresa para não "contaminar" o time.', score: -2 }
      ]
    }
  },
  {
    id: 'inov_4',
    name: 'Coragem',
    axis: 'Gestão de Inovação',
    executiveDefinition: 'A coragem executiva é necessária para tomar riscos calculados e desbravar novos territórios e mercados.',
    philosophicalFoundation: {
      text: 'A coragem é a resistência ao medo, o domínio do medo, e não a ausência do medo.',
      reference: 'Mark Twain'
    },
    strategicImpact: 4,
    systemicIntegration: 'Motor da expansão comercial e da diferenciação no posicionamento de marketing.',
    situationalScenario: 'Um mercado novo e promissor surge, mas exige um investimento que pode comprometer o caixa de curto prazo. A gestão avalia com coragem o risco/retorno ou recua por conservadorismo?',
    maturityQuestion: "A alta gestão assume riscos calculados para explorar inovações que rompem o modelo de negócio atual?",
    weight: 4,
    expectedEvidences: ["Orçamento de Inovação", "Projetos de P&D", "Teses de Futuro"],
    risksWhenNeglected: ["Conservadorismo", "Desvantagem Competitiva", "Falta de Inovação"],
    reference: "Coragem",
    description: "Coragem para tomar riscos calculados e inovar.",
    crossAxisImpact: "Finanças e Estratégia",
    executiveSuggestions: ["Definir verba para projetos de risco", "Criar conselho de futuro"],
    executiveRecommendations: [
      'Instituir orçamento para projetos de alto risco',
      'Premiar o "protagonismo ousado" na liderança',
      'Implementar cultura de erro seguro (fail fast)',
      'Lançar produtos disruptivos que desafiam o core',
      'Enfrentar concorrentes maiores com estratégia',
      'Investir em tecnologias de fronteira',
      'Tomar decisões de pivô baseadas em convicção',
      'Encorajar a discordância construtiva em reuniões',
      'Desafiar o status quo da indústria periodicamente',
      'Ousar em modelos de precificação inovadores',
      'Implementar "moonshots" (metas impossíveis)',
      'Realizar investimentos estratégicos em crises'
    ],
    managerDilemma: {
      scenario: 'Um novo mercado geográfico promissor exige um investimento que reduzirá sua reserva de emergência pela metade. O que você faz?',
      options: [
        { text: 'Realiza o investimento após uma análise rigorosa de risco/retorno e tese de futuro.', score: 2 },
        { text: 'Recua, preferindo a segurança absoluta do caixa atual.', score: -1 },
        { text: 'Investe sem analisar, confiando apenas no "feeling".', score: -2 }
      ]
    }
  },
  {
    id: 'inov_5',
    name: 'Visão',
    axis: 'Gestão de Inovação',
    executiveDefinition: 'A visão estratégica projeta o futuro da organização, orientando os investimentos em inovação de longo prazo.',
    philosophicalFoundation: {
      text: 'A melhor maneira de prever o futuro é criá-lo.',
      reference: 'Peter Drucker'
    },
    strategicImpact: 5,
    systemicIntegration: 'Norteia o planejamento financeiro e o alinhamento da cultura organizacional.',
    maturityQuestion: "A alta gestão dedica tempo para estudar tendências que podem impactar o setor no longo prazo?",
    weight: 5,
    expectedEvidences: ["Roadmap Estratégico", "Relatórios de Tendências", "Agenda de Board"],
    risksWhenNeglected: ["Desatualização Fatal", "Perda de Mercado", "Visão de Curto Prazo"],
    reference: "Foresight",
    description: "Antecipação de mudanças e tendências de mercado.",
    crossAxisImpact: "Marketing e Estratégia",
    executiveSuggestions: ["Realizar rituais trimestrais de tendências", "Participar de fóruns de inovação"],
    executiveRecommendations: [
      'Criação do Roadmap Estratégico de 10 anos',
      'Comunicar a visão visualmente em toda a sede',
      'Alinhar projetos de inovação com a meta futura',
      'Instituir conselho de tendências e futuro',
      'Realizar rituais de visualização com lideranças',
      'Documentar a tese de inovação da empresa',
      'Publicar manifesto de futuro para o mercado',
      'Manter a visão legível e simples para todos',
      'Revisar o roadmap semestralmente',
      'Inspirar a equipe com o impacto futuro esperado',
      'Vincular o sucesso individual à visão coletiva',
      'Identificar megatendências globais de longo prazo'
    ],
    managerDilemma: {
      scenario: 'O mercado está focado em resultados de curtíssimo prazo, mas você vê uma tendência para 10 anos que exige investimento agora. O que você faz?',
      options: [
        { text: 'Mantém o roadmap de longo prazo, equilibrando com ganhos rápidos de sustentação.', score: 2 },
        { text: 'Abandona o longo prazo para maximizar o lucro do próximo mês.', score: -2 },
        { text: 'Investe 100% no futuro e deixa a operação atual desassistida.', score: -2 }
      ]
    }
  },
  {
    id: 'inov_6',
    name: 'Experimentação',
    axis: 'Gestão de Inovação',
    executiveDefinition: 'A experimentação sistemática utiliza protótipos e testes para validar hipóteses antes de grandes aportes de capital.',
    philosophicalFoundation: {
      text: 'Não falhei. Apenas encontrei 10.000 maneiras que não funcionam.',
      reference: 'Thomas Edison'
    },
    strategicImpact: 4,
    systemicIntegration: 'Protege a saúde financeira e otimiza a gestão de marketing.',
    maturityQuestion: "Existe tolerância ao erro controlado e rituais de aprendizado em processos de novos testes?",
    weight: 4,
    expectedEvidences: ["Relatórios de Post-Mortem", "Diário de Experimentos", "Testes A/B"],
    risksWhenNeglected: ["Paralisia por Medo", "Falta de Aprendizado", "Repetição de Erros"],
    reference: "Experimentação",
    description: "Cultura de aprendizado rápido através de testes controlados.",
    crossAxisImpact: "Cultura e Produto",
    executiveSuggestions: ["Instituir 'fail fast' rituais", "Documentar lições aprendidas"],
    executiveRecommendations: [
      'Implementar metodologia de MVPs estruturada',
      'Realizar testes A/B em todos os canais digitais',
      'Adotar ciclos de feedback rápido com clientes',
      'Definir critérios de parada para experimentos',
      'Documentar hipóteses e resultados de testes',
      'Utilizar orçamentos de experimentação limitados',
      'Fomentar a cultura do protótipo antes do produto',
      'Instituir rituais de validação de hipóteses',
      'Realizar provas de conceito (PoC) com parceiros',
      'Incentivar o erro controlado e produtivo',
      'Medir a velocidade de experimentação (Velo)',
      'Escalar apenas o que foi validado com dados'
    ],
    managerDilemma: {
      scenario: 'Você quer testar uma inovação radical, mas a diretoria só quer investir em algo com retorno garantido. O que você faz?',
      options: [
        { text: 'Propõe um experimento de baixo custo e baixo risco para validar a hipótese.', score: 2 },
        { text: 'Desiste da inovação e foca apenas no que é garantido.', score: -1 },
        { text: 'Faz o experimento escondido sem avisar a diretoria.', score: -2 }
      ]
    }
  },
  {
    id: 'inov_7',
    name: 'Simplicidade',
    axis: 'Gestão de Inovação',
    executiveDefinition: 'A simplicidade na inovação foca em reduzir a complexidade de produtos e processos para aumentar a agilidade e o valor percebido.',
    philosophicalFoundation: {
      text: 'A simplicidade é o auge da sofisticação.',
      reference: 'Steve Jobs'
    },
    strategicImpact: 4,
    systemicIntegration: 'Essencial para a eficiência operacional e para a clareza na comunicação de marketing.',
    situationalScenario: 'Um novo produto está sendo desenhado. A equipe foca em adicionar dezenas de funcionalidades ou em resolver o problema central do cliente com a menor fricção possível?',
    maturityQuestion: "A empresa foca em reduzir a complexidade e a burocracia para entregar valor com mais agilidade?",
    weight: 4,
    expectedEvidences: ["Mapa de Fluxo de Valor", "Análise de Atrito", "Feedback de Usabilidade"],
    risksWhenNeglected: ["Inchaço de Processos", "Confusão do Cliente", "Lentidão Operacional"],
    reference: "Simplicidade Estratégica",
    description: "Redução de complexidade para agilidade e clareza.",
    crossAxisImpact: "Operações e Marketing",
    executiveSuggestions: ["Eliminar passos burocráticos", "Adotar o design minimalista"],
    executiveRecommendations: [
      'Eliminar rituais e aprovações desnecessários',
      'Focagem no Core Feature de cada novo produto',
      'Adotar o design minimalista em interfaces e processos',
      'Simplificar o contrato e a linguagem jurídica',
      'Reduzir a hierarquia decisória para projetos',
      'Instituir o ritual de "descarte" de processos antigos',
      'Garantir que a comunicação seja compreensível para todos',
      'Fomentar a mentalidade Lean em todas as áreas',
      'Monitorar o tempo de conclusão de tarefas adm',
      'Simplificar a estrutura de cargos e funções',
      'Investir em UX para reduzir o esforço do cliente',
      'Manter a visão focada no que é essencial'
    ],
    managerDilemma: {
      scenario: 'Um produto está ficando pesado e confuso devido ao excesso de funcionalidades pedidas pelos clientes. O que você faz?',
      options: [
        { text: 'Realiza um "limpa", focando nas funcionalidades que resolvem 80% do problema.', score: 2 },
        { text: 'Continua adicionando tudo o que pedem para não desagradar ninguém.', score: -2 },
        { text: 'Cria um segundo produto ainda mais complexo para os clientes avançados.', score: -1 }
      ]
    }
  },

  // ====================================================================
  // 5. GESTÃO DE MARKETING
  // ====================================================================
  {
    id: 'mkt_1',
    name: 'Reputação',
    axis: 'Gestão de Marketing',
    executiveDefinition: 'A reputação institucional é o ativo intangível mais valioso, construída sobre integridade e valor real entregue ao mercado.',
    philosophicalFoundation: {
      text: 'Sua marca é o que as pessoas dizem sobre você quando você não está na sala.',
      reference: 'Jeff Bezos'
    },
    strategicImpact: 5,
    systemicIntegration: 'Pilar central da governança e motor primário da atração comercial de alto nível.',
    situationalScenario: 'Surge um boato negativo sobre a qualidade de um lote de produtos nas redes sociais. A empresa possui rituais de resposta rápida que preservam o "bom nome" ou age de forma reativa e defensiva?',
    maturityQuestion: "A marca é percebida como íntegra e confiável, possuindo rituais ativos de proteção e monitoramento da reputação?",
    weight: 5,
    expectedEvidences: ["Pesquisa de Imagem", "Plano de Gestão de Crise", "Monitoramento de Redes"],
    risksWhenNeglected: ["Perda de Valor de Mercado", "Custo de Confiança Alto", "Crise de Imagem Irreversível"],
    reference: "Reputação Institucional",
    description: "Construção e proteção do ativo intangível da marca.",
    crossAxisImpact: "Governança e Comercial",
    executiveSuggestions: ['Monitorar marca em tempo real', 'Auditar percepção externa'],
    executiveRecommendations: [
      'Implementar monitoramento constante da marca',
      'Estruturar plano de gestão de crises éticas',
      'Instituir auditoria de percepção externa anualmente',
      'Zelar pela coerência entre discurso e prática',
      'Proteger o "bom nome" em todas as negociações',
      'Vincular o marketing à entrega real do produto',
      'Estabelecer política de relações públicas ética',
      'Medir o Brand Equity (valor da marca) regularmente',
      'Cuidar da reputação digital e redes sociais',
      'Instituir comitê de proteção à marca institucional',
      'Garantir transparência em caso de erros públicos',
      'Promover o legado institucional acima do lucro'
    ],
    managerDilemma: {
      scenario: 'Surge um boato negativo (e falso) sobre sua marca nas redes sociais. O que você faz?',
      options: [
        { text: 'Comunica a verdade de forma transparente e rápida, com provas.', score: 2 },
        { text: 'Ignora, esperando que o assunto "morra" sozinho.', score: -1 },
        { text: 'Ataca quem espalhou o boato de forma agressiva.', score: -2 }
      ]
    }
  },
  {
    id: 'mkt_2',
    name: 'Comunicação',
    axis: 'Gestão de Marketing',
    executiveDefinition: 'A comunicação estratégica assegura que a mensagem da marca seja clara, verdadeira e impactante em todos os pontos de contato.',
    philosophicalFoundation: {
      text: 'A comunicação eficaz é 20% o que você sabe e 80% como você se sente sobre o que sabe.',
      reference: 'Jim Rohn'
    },
    strategicImpact: 4,
    systemicIntegration: 'Vetor da cultura interna e pilar da conversão no eixo comercial.',
    situationalScenario: 'Um novo posicionamento de marca é definido. A empresa comunica isso de forma clara para o mercado e para o time interno ou a mensagem é confusa e gera interpretações variadas?',
    maturityQuestion: "A comunicação institucional é clara, verdadeira e consistente em todos os canais (interno e externo)?",
    weight: 4,
    expectedEvidences: ["Manual de Redação", "Plano de Comunicação", "Social Media Guidelines"],
    risksWhenNeglected: ["Confusão de Marca", "Ruído Interno", "Baixa Conversão Comercial"],
    reference: "Mensagem e Clareza",
    description: "Clareza e verdade na comunicação institucional.",
    crossAxisImpact: "Comercial e Cultura",
    executiveSuggestions: ["Auditar canais de comunicação", "Padronizar tom de voz"],
    executiveRecommendations: [
      'Definir o manual de tom de voz e redação da marca',
      'Padronizar a identidade visual em todos os pontos de contato',
      'Implementar rituais de comunicação interna semanal',
      'Zelar pela verdade absoluta em todas as peças publicitárias',
      'Treinar porta-vozes da empresa em oratória e mídia',
      'Monitorar a clareza da mensagem via pesquisas de percepção',
      'Instituir canal direto de comunicação com o cliente',
      'Garantir que a equipe interna conheça a mensagem primeiro',
      'Eliminar jargões técnicos excessivos que afastam o cliente',
      'Implementar estratégia de conteúdo educativo de alto valor',
      'Auditar periodicamente o site e redes sociais da marca',
      'Fomentar a comunicação empática e assertiva no time'
    ],
    managerDilemma: {
      scenario: 'Seu marketing está usando um tom de voz agressivo que gera leads, mas não condiz com seus valores reais. O que você faz?',
      options: [
        { text: 'Alinha o tom de voz aos valores, mesmo que a conversão caia temporariamente.', score: 2 },
        { text: 'Mantém a agressividade, pois o importante é o resultado em vendas.', score: -2 },
        { text: 'Diz para o marketing mudar, mas não monitora a execução.', score: 0 }
      ]
    }
  },
  {
    id: 'mkt_3',
    name: 'Influência',
    axis: 'Gestão de Marketing',
    executiveDefinition: 'A influência estratégica utiliza o testemunho e a autoridade para inspirar e educar o mercado de forma ética e sustentável.',
    philosophicalFoundation: {
      text: 'Liderança é influência, nada mais, nada menos.',
      reference: 'John Maxwell'
    },
    strategicImpact: 4,
    systemicIntegration: 'Apoia a expansão comercial e a atração de talentos de alto nível via autoridade percebida.',
    situationalScenario: 'A empresa precisa entrar em um novo mercado geográfico. Ela utiliza parcerias de autoridade e conteúdo educativo para reduzir a barreira de entrada ou foca apenas em anúncios de performance?',
    maturityQuestion: "A organização utiliza sua autoridade e parcerias estratégicas para influenciar e educar o mercado de forma ética?",
    weight: 4,
    expectedEvidences: ["Contratos de Aliança", "Índice de Autoridade", "Depoimentos de Parceiros"],
    risksWhenNeglected: ["Isolamento Comercial", "Dependência de Anúncios Pagos", "Crescimento Lento"],
    reference: "Alianças e Autoridade",
    description: "Alavancagem de mercado através de influência ética.",
    crossAxisImpact: "Marketing e Estratégia",
    executiveSuggestions: ["Criar programa de embaixadores", "Participar de fóruns setoriais"],
    executiveRecommendations: [
      'Identificar e engajar embaixadores da marca reais',
      'Implementar estratégia de PR (Relações Públicas) ativa',
      'Criar conselho de clientes e parceiros influentes',
      'Participar de fóruns e eventos de liderança do setor',
      'Desenvolver autoridade técnica via conteúdo de vanguarda',
      'Implementar marketing de influência baseado em princípios',
      'Promover o pensamento de liderança (Thought Leadership)',
      'Utilizar depoimentos reais de transformação (Cases)',
      'Gerar impacto social visível e inspirador para o nicho',
      'Monitorar o índice de autoridade no nicho de atuação',
      'Fomentar a indicação orgânica entre líderes do setor',
      'Ser uma referência ética para toda a concorrência'
    ],
    managerDilemma: {
      scenario: 'Você tem a chance de contratar um influenciador famoso, mas que não tem fit com seus valores éticos. O que você faz?',
      options: [
        { text: 'Recusa a parceria e foca em influenciadores menores com alinhamento real.', score: 2 },
        { text: 'Contrata pelo alcance massivo, ignorando o comportamento dele.', score: -2 },
        { text: 'Contrata mas pede para ele não postar nada polêmico por 1 mês.', score: -1 }
      ]
    }
  },
  {
    id: 'mkt_4',
    name: 'Posicionamento',
    axis: 'Gestão de Marketing',
    executiveDefinition: 'O posicionamento estratégico define o lugar único que a marca ocupa na mente do cliente, diferenciando-a pela proposta de valor.',
    philosophicalFoundation: {
      text: 'Diferencie-se ou morra.',
      reference: 'Jack Trout'
    },
    strategicImpact: 5,
    systemicIntegration: 'Base da estratégia comercial e da precificação (Justiça) de alto valor.',
    situationalScenario: 'O mercado está saturado de soluções baratas e de baixa qualidade. A empresa se posiciona como a opção de maior confiança e valor ou tenta competir por preço?',
    maturityQuestion: "A empresa possui um posicionamento de mercado claro, diferenciado e percebido como de alto valor pelo cliente?",
    weight: 5,
    expectedEvidences: ["Declaração de Posicionamento", "Análise de Concorrência", "Pesquisa de Preço"],
    risksWhenNeglected: ["Guerra de Preços", "Invisibilidade de Mercado", "Margens Baixas"],
    reference: "Diferenciação e Valor",
    description: "Lugar único da marca na mente do consumidor.",
    crossAxisImpact: "Estratégia e Comercial",
    executiveSuggestions: ["Definir proposta única de valor (UVP)", "Mapear diferenciais competitivos"],
    executiveRecommendations: [
      'Definir claramente a Proposta Única de Valor (UVP)',
      'Realizar análise periódica da concorrência (Benchmarking)',
      'Escolher o "território" de marca que deseja dominar',
      'Zelar pela consistência do posicionamento em todas as áreas',
      'Comunicar os diferenciais competitivos de forma simples',
      'Evitar a "vala comum" da competição baseada apenas em preço',
      'Monitorar a percepção de valor do cliente regularmente',
      'Construir autoridade técnica no nicho escolhido',
      'Adequar o preço ao posicionamento de valor entregue',
      'Garantir que a experiência do cliente reforce o posicionamento',
      'Revisar o posicionamento perante novos entrantes no mercado',
      'Fomentar a cultura da exclusividade e valor superior'
    ],
    managerDilemma: {
      scenario: 'Seu mercado está virando um "oceano vermelho" de briga por preço. O que você faz?',
      options: [
        { text: 'Eleva seu posicionamento para Premium, focando em nichos que valorizam qualidade.', score: 2 },
        { text: 'Entra na briga de preço e tenta reduzir custos demitindo pessoas.', score: -2 },
        { text: 'Mantém o meio termo e vê as margens serem esmagadas.', score: -1 }
      ]
    }
  },
  {
    id: 'mkt_5',
    name: 'Credibilidade Institucional',
    axis: 'Gestão de Marketing',
    executiveDefinition: 'A credibilidade é a confiança depositada pelo mercado na marca, fruto da coerência histórica e das evidências de sucesso.',
    philosophicalFoundation: {
      text: 'Sem dados, você é apenas mais uma pessoa com uma opinião.',
      reference: 'W. Edwards Deming'
    },
    strategicImpact: 5,
    systemicIntegration: 'Fundamental para a conversão comercial em vendas complexas e para a integridade da governança.',
    situationalScenario: 'Um possível cliente solicita provas de que sua empresa já resolveu problemas similares aos dele. Você possui cases de sucesso documentados e referências auditáveis?',
    maturityQuestion: "A empresa possui e utiliza sistematicamente evidências de sucesso (cases, depoimentos, dados) para gerar confiança no mercado?",
    weight: 5,
    expectedEvidences: ["Cases de Sucesso", "Depoimentos de Clientes", "Certificações Técnicas"],
    risksWhenNeglected: ["Custo de Venda Alto", "Desconfiança do Mercado", "Perda de Autoridade"],
    reference: "Autoridade e Confiança",
    description: "Geração de confiança através de evidências e coerência.",
    crossAxisImpact: "Comercial e Governança",
    executiveSuggestions: ["Documentar cases de sucesso", "Coletar depoimentos sistematicamente"],
    executiveRecommendations: [
      'Documentar e publicar cases de sucesso reais e auditáveis',
      'Implementar processo sistemático de coleta de depoimentos',
      'Utilizar dados e métricas reais para comprovar resultados',
      'Zelar pela coerência absoluta entre promessa e entrega',
      'Buscar certificações e selos de qualidade reconhecidos',
      'Instituir rituais de transparência sobre falhas e correções',
      'Promover a autoridade técnica da liderança no mercado',
      'Utilizar a prova social em todos os pontos de contato',
      'Manter histórico de clientes de alta reputação visível',
      'Garantir que o marketing não exagere os benefícios reais',
      'Realizar visitas técnicas de referência para prospects',
      'Fomentar a cultura da verdade técnica acima do hype'
    ],
    managerDilemma: {
      scenario: 'Você precisa de um depoimento de cliente, mas os atuais ainda não têm resultados expressivos. O marketing sugere "exagerar" um pouco os dados. O que você faz?',
      options: [
        { text: 'Publica apenas o que é real e auditável, mesmo que pareça menos impactante.', score: 2 },
        { text: 'Aceita o exagero para não perder a venda do próximo lead.', score: -2 },
        { text: 'Inventa um case fictício baseado em "potencial futuro".', score: -2 }
      ]
    }
  },
  {
    id: 'mkt_6',
    name: 'Valor de Marca',
    axis: 'Gestão de Marketing',
    executiveDefinition: 'O valor de marca (Equity) é a percepção de benefício superior que permite precificações premium e fidelização extrema.',
    philosophicalFoundation: {
      text: 'As marcas de valor são construídas com consistência e alma.',
      reference: 'Howard Schultz'
    },
    strategicImpact: 5,
    systemicIntegration: 'Aumenta o valor de mercado (Valuation) e a saúde das finanças corporativas.',
    situationalScenario: 'O cliente precisa escolher entre sua marca e uma opção genérica mais barata. Ele escolhe você porque reconhece o valor intangível e a segurança que sua marca proporciona?',
    maturityQuestion: "A marca é percebida como portadora de valor superior, permitindo margens acima da média do mercado?",
    weight: 5,
    expectedEvidences: ["Prêmio de Preço (Price Premium)", "Pesquisa de Equity", "Valor de Ativo Intangível"],
    risksWhenNeglected: ["Baixa Lucratividade", "Substituibilidade Fácil", "Erosão de Margem"],
    reference: "Brand Equity",
    description: "Percepção de benefício superior e valor intangível.",
    crossAxisImpact: "Finanças e Comercial",
    executiveSuggestions: ["Medir o Brand Equity", "Aumentar a percepção de exclusividade"],
    executiveRecommendations: [
      'Medir sistematicamente o "Price Premium" (sobrepreço) da marca',
      'Investir em design e experiência de marca de alto nível',
      'Associar a marca a causas e valores de grande impacto',
      'Zelar pela exclusividade e escassez em ofertas premium',
      'Garantir que a promessa de valor seja sempre superada pela entrega',
      'Criar rituais de experiência "uau" para o cliente',
      'Monitorar a lembrança de marca (Top of Mind) no nicho',
      'Instituir política de proteção de marca e identidade',
      'Fomentar o senso de comunidade entre os clientes',
      'Utilizar embalagens, linguagem e rituais que comuniquem valor',
      'Evitar promoções que depreciem a percepção de marca',
      'Investir em parcerias que agreguem prestígio institucional'
    ],
    managerDilemma: {
      scenario: 'Uma grande marca propõe uma parceria, mas ela tem uma reputação duvidosa com o meio ambiente. O que você faz?',
      options: [
        { text: 'Recusa a parceria, protegendo a integridade e o Equity da sua marca.', score: 2 },
        { text: 'Aceita para ganhar visibilidade, esperando que o mercado não note.', score: -2 },
        { text: 'Aceita, mas cria uma nota de rodapé sobre o compromisso ambiental da sua marca.', score: -1 }
      ]
    }
  },
  {
    id: 'mkt_7',
    name: 'Narrativa Estratégica',
    axis: 'Gestão de Marketing',
    executiveDefinition: 'A narrativa (Storytelling) comunica a missão e os valores da empresa de forma inspiradora, conectando emocionalmente a marca ao cliente.',
    philosophicalFoundation: {
      text: 'Storytelling é a ferramenta de marketing mais poderosa.',
      reference: 'Seth Godin'
    },
    strategicImpact: 4,
    systemicIntegration: 'Motor da cultura organizacional e da diferenciação no eixo comercial.',
    situationalScenario: 'O cliente ouve sobre sua empresa. Ele entende apenas "o que você faz" ou ele se conecta com "por que você faz" e qual transformação você entrega?',
    maturityQuestion: "A organização possui uma narrativa clara, inspiradora e baseada em princípios que é comunicada em todos os pontos de contato?",
    weight: 4,
    expectedEvidences: ["Brandbook", "Manifesto de Marca", "Vídeos de Cultura"],
    risksWhenNeglected: ["Falta de Conexão", "Discurso Puramente Técnico", "Mensagem Esquecível"],
    reference: "Storytelling Institucional",
    description: "Comunicação da missão e valores via narrativa inspiradora.",
    crossAxisImpact: "Cultura e Comercial",
    executiveSuggestions: ["Criar manifesto de marca", "Treinar o time na narrativa"],
    executiveRecommendations: [
      'Definir a "Jornada do Herói" onde o cliente é o protagonista',
      'Documentar e difundir o manifesto de marca inspirador',
      'Utilizar histórias reais de clientes e colaboradores',
      'Zelar pela coerência da narrativa em todos os canais',
      'Treinar a equipe comercial para vender a transformação',
      'Utilizar elements visuais que reforcem a história',
      'Implementar rituais de contação de histórias internos',
      'Garantir que a liderança seja a guardiã da narrativa',
      'Eliminar discursos puramente frios e técnicos no marketing',
      'Conectar a história da empresa com valores éticos inegociáveis',
      'Monitorar a memorabilidade da marca no mercado',
      'Celebrar os marcos da história da empresa com o público'
    ],
    managerDilemma: {
      scenario: 'Sua narrativa de marketing foca em "vencer a qualquer custo", mas sua cultura interna é de serviço e cuidado. O que você faz?',
      options: [
        { text: 'Unifica a narrativa, focando na transformação ética e humana que a marca gera.', score: 2 },
        { text: 'Mantém a dualidade, pois cada discurso serve a um público diferente.', score: -2 },
        { text: 'Muda a cultura interna para "agressiva" para bater com o marketing.', score: -2 }
      ]
    }
  },

  // ====================================================================
  // 6. GESTÃO COMERCIAL
  // ====================================================================
  {
    id: 'com_1',
    name: 'Fidelidade Comercial',
    axis: 'Gestão Comercial',
    executiveDefinition: 'A fidelidade comercial foca na retenção e no aumento do valor de vida do cliente (LTV) através da satisfação extrema.',
    philosophicalFoundation: {
      text: 'Mantenha seus clientes por perto, mas mantenha seus melhores clientes mais perto ainda.',
      reference: 'Philip Kotler'
    },
    strategicImpact: 5,
    systemicIntegration: 'Garante a sustentabilidade financeira e reduz o custo de aquisição (CAC) via indicações.',
    situationalScenario: 'Um cliente antigo solicita uma renovação de contrato. A empresa oferece condições especiais de lealdade ou o trata como um novo prospecto sem histórico?',
    maturityQuestion: "A organização possui rituais ativos de retenção, satisfação e fidelização da base de clientes atual?",
    weight: 5,
    expectedEvidences: ["Indicador de Churn", "Net Promoter Score (NPS)", "LTV do Cliente"],
    risksWhenNeglected: ["Churn Elevado", "Dependência de Novos Leads", "Baixo LTV"],
    reference: "Fidelização e LTV",
    description: "Foco na retenção e satisfação contínua da base.",
    crossAxisImpact: "Financeiro e Marketing",
    executiveSuggestions: ["Monitorar NPS trimestral", "Criar programa de fidelidade"],
    executiveRecommendations: [
      'Monitorar rigorosamente a taxa de Churn mensal',
      'Implementar rituais de pesquisa NPS trimestrais',
      'Criar programa de benefícios exclusivo para clientes antigos',
      'Zelar pelo cumprimento total das promessas de venda',
      'Realizar visitas de relacionamento e sucesso do cliente',
      'Instituir bônus comercial focado em retenção',
      'Garantir suporte técnico de altíssima velocidade',
      'Customizar ofertas baseadas no histórico do cliente',
      'Fomentar a indicação orgânica via satisfação real',
      'Monitorar o Life Time Value (LTV) por segmento',
      'Realizar eventos de agradecimento e networking para base',
      'Implementar política de recuperação de clientes inativos'
    ],
    managerDilemma: {
      scenario: 'Um cliente muito antigo e fiel solicita um desconto que fere sua política de margem mínima. O que você faz?',
      options: [
        { text: 'Concede um benefício em serviço ou valor agregado em vez de desconto no preço.', score: 2 },
        { text: 'Dá o desconto para não perder o cliente, ignorando a margem.', score: -2 },
        { text: 'Nega o desconto friamente, arriscando a perda do cliente.', score: 0 }
      ]
    }
  },
  {
    id: 'com_2',
    name: 'Relacionamento',
    axis: 'Gestão Comercial',
    executiveDefinition: 'O relacionamento consultivo foca em parcerias de longo prazo, transformando clientes em parceiros estratégicos através da confiança.',
    philosophicalFoundation: {
      text: 'As pessoas não compram o que você faz, elas compram o porquê de você fazer.',
      reference: 'Simon Sinek'
    },
    strategicImpact: 4,
    systemicIntegration: 'Aumenta o Lifetime Value (LTV) e atrai indicações orgânicas de alto nível.',
    situationalScenario: 'Um cliente estratégico demonstra sinais de insatisfação com um detalhe técnico. O time comercial atua apenas na renovação ou constrói uma relação de suporte contínuo?',
    maturityQuestion: "A equipe comercial constrói parcerias de longo prazo baseadas em confiança e suporte consultivo?",
    weight: 4,
    expectedEvidences: ["Mapa de Stakeholders", "Pesquisa de LTV", "Agenda de Relacionamento"],
    risksWhenNeglected: ["Relação Transacional", "Vulnerabilidade à Concorrência", "Baixo LTV"],
    reference: "Parceria Estratégica",
    description: "Foco na construção de vínculos duradouros e confiança.",
    crossAxisImpact: "Cultura e Marketing",
    executiveSuggestions: ["Instituir rituais de conselho de clientes", "Personalizar atendimento VIP"],
    executiveRecommendations: [
      'Implementar modelo de vendas consultivas',
      'Instituir rituais de aconselhamento para clientes',
      'Realizar eventos de networking para parceiros',
      'Treinar equipe em escuta ativa e empatia',
      'Promover a cultura de "ser um braço direito"',
      'Construir confiança antes de oferecer produtos',
      'Realizar visitas técnicas e relacionais regulares',
      'Investir em CRM para gerir conexões humanas',
      'Fomentar comunidades de clientes (Tribos)',
      'Criar canais de feedback direto com o cliente',
      'Instituir bônus por retenção e relacionamento',
      'Celebrar o sucesso e marcos do negócio do cliente'
    ],
    managerDilemma: {
      scenario: 'Um vendedor sugere focar apenas em "vendas frias" transacionais para bater a meta rápida, deixando de lado o relacionamento de longo prazo. O que você faz?',
      options: [
        { text: 'Mantém o foco no relacionamento consultivo, priorizando o LTV sobre a venda única.', score: 2 },
        { text: 'Autoriza o foco transacional para garantir o caixa imediato.', score: -2 },
        { text: 'Diz para fazer os dois, mas não dá ferramentas para relacionamento.', score: 0 }
      ]
    }
  },
  {
    id: 'com_3',
    name: 'Justiça Comercial',
    axis: 'Gestão Comercial',
    executiveDefinition: 'A justiça comercial reflete-se em precificações éticas e negociações baseadas em transparência, equidade e valor real.',
    philosophicalFoundation: {
      text: 'O preço é o que você paga. O valor é o que você recebe.',
      reference: 'Warren Buffett'
    },
    strategicImpact: 5,
    systemicIntegration: 'Protege a integridade da governança e garante a saúde financeira mútua (empresa/cliente).',
    situationalScenario: 'Um cliente está disposto a pagar um valor 5x acima do mercado por desconhecimento técnico. A empresa pratica o preço justo ou aproveita a oportunidade para lucro imediato?',
    maturityQuestion: "As práticas de precificação e comissionamento são baseadas em critérios de justiça, margem e valor real?",
    weight: 5,
    expectedEvidences: ["Tabela de Preços Ética", "Política de Descontos", "Simulador de Margem"],
    risksWhenNeglected: ["Vendas Sem Lucro", "Desequilíbrio de Valor", "Exploração Comercial"],
    reference: "Justiça de Mercado",
    description: "Equidade na precificação e transparência nas margens.",
    crossAxisImpact: "Finanças e Governança",
    executiveSuggestions: ["Auditar política de preços", "Treinar ética em vendas"],
    executiveRecommendations: [
      'Instituir política de preços transparente e justa',
      'Eliminar taxas ocultas e gatilhos de urgência falsos',
      'Garantir margens éticas que permitam o reinvestimento',
      'Negociar baseando-se em valor gerado, não em pressão',
      'Corrigir desequilíbrios comerciais proativamente',
      'Auditar scripts de vendas contra manipulações psicológicas',
      'Garantir transparência na formação de custos e margens',
      'Respeitar a vulnerabilidade do comprador em momentos de crise',
      'Publicar tabelas de preços e condições claras para o time',
      'Implementar contratos de fácil entendimento e boa fé',
      'Zelar pela equidade entre clientes de mesmo perfil',
      'Evitar a "balança enganosa" entre o prometido e o entregue'
    ],
    managerDilemma: {
      scenario: 'Você percebe que pode cobrar o dobro de um cliente que está desesperado por uma solução urgente, mesmo que o custo seja o mesmo. O que você faz?',
      options: [
        { text: 'Mantém o preço justo da tabela, cobrando apenas um adicional de urgência ético.', score: 2 },
        { text: 'Cobra o dobro, aproveitando a oportunidade de lucro máximo.', score: -2 },
        { text: 'Cobra o dobro mas oferece um "desconto" para parecer bonzinho.', score: -2 }
      ]
    }
  },
  {
    id: 'com_4',
    name: 'Negociação Ética',
    axis: 'Gestão Comercial',
    executiveDefinition: 'A negociação ética busca o equilíbrio de interesses (ganha-ganha), garantindo a longevidade das parcerias comerciais.',
    philosophicalFoundation: {
      text: 'Nas negociações, o equilíbrio é a chave para a longevidade.',
      reference: 'Chris Voss'
    },
    strategicImpact: 4,
    systemicIntegration: 'Protege a reputação de marketing e garante a rentabilidade financeira sustentável.',
    situationalScenario: 'A empresa precisa fechar um contrato vital para o mês. O vendedor omite uma limitação técnica do produto para garantir a assinatura ou joga limpo com o cliente?',
    maturityQuestion: "As negociações comerciais são baseadas em transparência, equilíbrio de interesses e ausência de manipulação?",
    weight: 4,
    expectedEvidences: ["Scripts de Venda Éticos", "Termos de Ajuste", "Taxa de Distrato"],
    risksWhenNeglected: ["Cancelamentos Rápidos", "Judicialização", "Quebra de Confiança"],
    reference: "Ganha-Ganha",
    description: "Equilíbrio e ética nas negociações comerciais.",
    crossAxisImpact: "Governança e Operações",
    executiveSuggestions: ["Auditar scripts de vendas", "Treinar negociação win-win"],
    executiveRecommendations: [
      'Eliminar scripts de venda baseados em manipulação psicológica',
      'Treinar a equipe em negociação baseada em interesses (Harvard)',
      'Garantir transparência total sobre limitações do produto',
      'Focar na construção de acordos de longo prazo',
      'Zelar pela margem justa para ambas as partes',
      'Implementar política de "não vender por vender"',
      'Monitorar a taxa de distratos (Cancelamentos) pós-venda',
      'Garantir que os termos contratuais sejam de fácil leitura',
      'Incentivar a honestidade radical no processo comercial',
      'Corrigir expectativas erradas do prospecto proativamente',
      'Respeitar o "não" do cliente quando a solução não serve',
      'Fomentar a cultura do respeito mútuo na mesa de negociação'
    ],
    managerDilemma: {
      scenario: 'Para fechar um contrato vital para a empresa, você nota que o cliente acredita que seu produto tem uma função que na verdade ele não tem. O que você faz?',
      options: [
        { text: 'Esclarece a limitação imediatamente, priorizando a verdade e a confiança.', score: 2 },
        { text: 'Deixa ele acreditar e fecha o contrato, pensando em "resolver depois".', score: -2 },
        { text: 'Fecha o contrato e reza para que ele nunca use essa função.', score: -2 }
      ]
    }
  },
  {
    id: 'com_5',
    name: 'Compromisso Comercial',
    axis: 'Gestão Comercial',
    executiveDefinition: 'O compromisso comercial é a palavra empenhada que se cumpre rigorosamente, transformando promessas de venda em entregas reais.',
    philosophicalFoundation: {
      text: 'Sua palavra é seu contrato mais valioso.',
      reference: 'Harvey Mackay'
    },
    strategicImpact: 5,
    systemicIntegration: 'Impacta a credibilidade de marketing e a eficiência da entrega operacional.',
    situationalScenario: 'O time de vendas promete um prazo de entrega 50% menor que a capacidade da fábrica para bater a meta. Existe uma trava que garante que o prometido será cumprido?',
    maturityQuestion: "Existe alinhamento absoluto entre as promessas feitas pelo comercial e a capacidade real de entrega da operação?",
    weight: 5,
    expectedEvidences: ["SLA de Entrega", "Relatório de Atrasos", "NPS de Produto"],
    risksWhenNeglected: ["Quebra de Expectativa", "Crise de Imagem", "Sobrecarga Operacional"],
    reference: "Palavra Empenhada",
    description: "Integridade entre promessa comercial e entrega técnica.",
    crossAxisImpact: "Operações e Marketing",
    executiveSuggestions: ["Definir SLAs comerciais", "Realizar rituais de alinhamento Vendas/Op"],
    executiveRecommendations: [
      'Definir SLAs (Acordos de Nível de Serviço) claros e reais',
      'Implementar rituais de alinhamento diário entre Vendas e Op',
      'Zelar pela clareza total nos prazos informados ao cliente',
      'Penalizar promessas comerciais deliberadamente falsas',
      'Garantir que o vendedor conheça profundamente a operação',
      'Documentar todas as promessas em CRM e contratos',
      'Monitorar o índice de reclamações por quebra de SLA',
      'Instituir política de compensação em caso de falha na entrega',
      'Fomentar a cultura do "prometer menos e entregar mais"',
      'Utilizar automação para garantir visibilidade de prazos',
      'Realizar auditorias de conformidade comercial trimestrais',
      'Zelar pela integridade da "palavra do vendedor" no mercado'
    ],
    managerDilemma: {
      scenario: 'Faltam 2 dias para o fim do mês e você precisa de uma venda para bater a meta. Um cliente exige um prazo de entrega que a operação diz ser impossível. O que você faz?',
      options: [
        { text: 'Diz a verdade ao cliente sobre o prazo real, mesmo perdendo a meta.', score: 2 },
        { text: 'Promete o prazo impossível para garantir a venda e depois dá uma desculpa.', score: -2 },
        { text: 'Promete e pressiona a operação a fazer hora extra forçada.', score: -1 }
      ]
    }
  },
  {
    id: 'com_6',
    name: 'Valor ao Cliente',
    axis: 'Gestão Comercial',
    executiveDefinition: 'A centralidade no sucesso do cliente garante que a venda seja uma ferramenta de serviço e transformação real para o comprador.',
    philosophicalFoundation: {
      text: 'Não é sobre você, é sobre o impacto que você gera no outro.',
      reference: 'Simon Sinek'
    },
    strategicImpact: 5,
    systemicIntegration: 'Motor do crescimento sustentável e da fidelização máxima (LTV).',
    situationalScenario: 'O cliente comprou a solução, mas não está utilizando-a corretamente. O time comercial intervém para garantir o sucesso dele ou foca apenas na próxima venda?',
    maturityQuestion: "A equipe comercial garante que o cliente extraia o valor máximo da solução adquirida (Sucesso do Cliente)?",
    weight: 5,
    expectedEvidences: ["Indicadores de Uso (Adoption)", "Health Score", "Cases de Sucesso"],
    risksWhenNeglected: ["Falsa Venda", "Cancelamentos Precoces", "Baixa Autoridade"],
    reference: "Customer Success",
    description: "Foco na entrega de valor e transformação real.",
    crossAxisImpact: "Operações e Marketing",
    executiveSuggestions: ["Monitorar Health Score", "Implementar rituais de QBR"],
    executiveRecommendations: [
      'Implementar o framework "Jobs to be Done"',
      'Instituir conselho de clientes para melhoria contínua',
      'Medir o ROI (Retorno) gerado para o cliente',
      'Personalizar a jornada de sucesso pós-venda',
      'Eliminar burocracias que atrapalham o cliente',
      'Focar na solução da dor real do comprador',
      'Gerar valor antes de capturar valor financeiro',
      'Mapear a experiência do cliente em todos os pontos',
      'Instituir indicadores de esforço do cliente (CES)',
      'Premiar a equipe pelo sucesso real do cliente',
      'Garantir suporte técnica de alta resolutividade',
      'Fomentar a cultura de "servir ao próximo" via venda'
    ],
    managerDilemma: {
      scenario: 'Um prospect quer comprar seu produto mais caro, mas você sabe que a versão mais barata (ou até de um concorrente) atenderia melhor a necessidade dele. O que você faz?',
      options: [
        { text: 'Indica a solução mais adequada ao interesse dele, ganhando confiança eterna.', score: 2 },
        { text: 'Empurra o produto mais caro para maximizar o ticket médio da venda.', score: -2 },
        { text: 'Vende o mais caro mas dá um brinde inútil para compensar.', score: -1 }
      ]
    }
  },
  {
    id: 'com_7',
    name: 'Credibilidade Comercial',
    axis: 'Gestão Comercial',
    executiveDefinition: 'A credibilidade comercial atrai clientes de alto valor que buscam segurança, ética e previsibilidade na entrega.',
    philosophicalFoundation: {
      text: 'A credibilidade se constrói com consistência técnica e ética.',
      reference: 'Tom Peters'
    },
    strategicImpact: 5,
    systemicIntegration: 'Fortalece o posicionamento de marketing e reduz o CAC.',
    maturityQuestion: "A reputação da empresa no mercado é utilizada como fator chave de conversão comercial?",
    weight: 5,
    expectedEvidences: ["Cases de Sucesso", "Indicações Orgânicas", "Market Share"],
    risksWhenNeglected: ["Atraso Comercial", "Dificuldade de Venda", "Desconfiança"],
    reference: "Autoridade",
    description: "Conversão através da confiança e histórico.",
    crossAxisImpact: "Marketing e Estratégia",
    executiveSuggestions: ["Instituir programa de indicação", "Publicar cases com auditoria"],
    executiveRecommendations: [
      'Publicar cases de sucesso com dados auditáveis',
      'Implementar selos de transparência e ética',
      'Participar de certificações de qualidade do setor',
      'Manter histórico de entregas impecável',
      'Zelar pela ética de todos os parceiros comerciais',
      'Evitar associações com marcas de baixa moral',
      'Garantir transparência em processos de disputa',
      'Monitorar a reputação comercial em fóruns públicos',
      'Instituir política de conformidade comercial',
      'Manter consistência de valores ao longo dos anos',
      'Atrair clientes por alinhamento de princípios',
      'Ser um farol de integridade no mercado'
    ],
    managerDilemma: {
      scenario: 'Um concorrente está usando táticas de "marketing sujo" para roubar seus leads. Sua equipe quer revidar no mesmo tom. O que você faz?',
      options: [
        { text: 'Mantém a elegância e a integridade, focando em provar seu valor com dados.', score: 2 },
        { text: 'Autoriza o "contra-ataque" agressivo para não parecer fraco.', score: -2 },
        { text: 'Fica em silêncio e deixa a marca ser manchada sem reagir.', score: -1 }
      ]
    }
  },

  // ====================================================================
  // 7. GESTÃO OPERACIONAL
  // ====================================================================
  {
    id: 'op_1',
    name: 'Diligência',
    axis: 'Gestão Operacional',
    executiveDefinition: 'A diligência operacional foca na execução incansável, no monitoramento diário da produtividade e na eliminação de gargalos.',
    philosophicalFoundation: {
      text: 'A diligência é a mãe da boa sorte.',
      reference: 'Benjamin Franklin'
    },
    strategicImpact: 5,
    systemicIntegration: 'Motor da entrega de valor ao cliente e pilar da sustentabilidade financeira.',
    situationalScenario: 'O final do mês se aproxima e há um atraso na linha de produção. A equipe possui rituais de diligência para identificar o gargalo em tempo real e agir, ou apenas espera o relatório mensal?',
    maturityQuestion: "Existem rituais de medição diária de produtividade e eliminação de gargalos operacionais?",
    weight: 5,
    expectedEvidences: ["DASH de Produtividade Diária", "Rituais de Daily", "Gráfico de Gargalos"],
    risksWhenNeglected: ["Lentidão Operacional", "Entregas Fora do Prazo", "Baixa Produtividade"],
    reference: "Diligência Executiva",
    description: "Execução focada e medição constante de resultados.",
    crossAxisImpact: "Comercial e Resultados",
    executiveSuggestions: ["Instituir reuniões diárias (Dailies)", "Automatizar KPIs de produção"],
    executiveRecommendations: [
      'Instituir rituais de medição de produtividade diária',
      'Identificar e eliminar gargalos operacionais em 24h',
      'Implementar gestão visual de indicadores na operação',
      'Treinar equipe em foco e eliminação de distrações',
      'Premiar a constância e a diligência na entrega',
      'Automatizar a coleta de dados de performance operacional',
      'Realizar rituais de alinhamento matinal (Stand-ups)',
      'Manter ferramentas de trabalho em estado impecável',
      'Instituir metas individuais de output diário',
      'Otimizar o fluxo de trabalho (Workflow) mensalmente',
      'Zelar pelo cumprimento rigoroso de horários e prazos',
      'Fomentar a cultura do "feito é melhor que perfeito" com qualidade'
    ],
    managerDilemma: {
      scenario: 'Uma falha operacional crítica ocorre no final do expediente de uma sexta-feira. Resolver agora exige hora extra e cansaço da equipe, mas garante o prazo do cliente. O que você faz?',
      options: [
        { text: 'Lidera a resolução imediata, garantindo a entrega e a satisfação do cliente.', score: 2 },
        { text: 'Deixa para resolver na segunda-feira, priorizando o descanso da equipe.', score: -1 },
        { text: 'Tenta uma solução paliativa "rápida" que pode falhar depois.', score: -2 }
      ]
    }
  },
  {
    id: 'op_2',
    name: 'Padronização',
    axis: 'Gestão Operacional',
    executiveDefinition: 'A padronização garante a repetibilidade da qualidade e a escalabilidade do negócio através de processos documentados.',
    philosophicalFoundation: {
      text: 'Sem padrão não há melhoria.',
      reference: 'Taiichi Ohno'
    },
    strategicImpact: 4,
    systemicIntegration: 'Base para a sucessão na governança e para a segurança operacional.',
    situationalScenario: 'Um colaborador-chave sai de férias ou pede demissão. A operação continua funcionando sem perda de qualidade porque os processos estão documentados em POPs acessíveis?',
    maturityQuestion: "Todos os processos críticos da empresa estão documentados em POPs e seguidos rigorosamente?",
    weight: 4,
    expectedEvidences: ["Manual de POPs", "Certificações de Processo", "Software de BPM"],
    risksWhenNeglected: ["Dependência de Pessoas", "Oscilação de Qualidade", "Caos Operacional"],
    reference: "Padronização Operacional",
    description: "Documentação e conformidade de processos críticos.",
    crossAxisImpact: "Cultura e Sucessão",
    executiveSuggestions: ["Documentar POPs em vídeo/texto", "Realizar auditoria de processos"],
    executiveRecommendations: [
      'Documentar 100% dos processos críticos em POPs',
      'Utilizar vídeos curtos para facilitar o treinamento',
      'Implementar software de gestão de processos (BPM)',
      'Realizar auditorias de conformidade de processos mensal',
      'Manter a base de conhecimento sempre atualizada',
      'Treinar novos colaboradores via trilhas de padronização',
      'Simplificar fluxogramas para evitar burocracia excessiva',
      'Instituir o "dono do processo" para cada área',
      'Utilizar checklists digitais para tarefas críticas',
      'Promover a cultura da "ordem absoluta" no digital/físico',
      'Garantir que os padrões sejam co-criados com o time',
      'Revisar padrões anualmente para melhoria contínua'
    ],
    managerDilemma: {
      scenario: 'Um colaborador "estrela" recusa-se a seguir um novo padrão operacional, alegando que seu jeito é mais rápido, embora menos seguro/auditável. O que você faz?',
      options: [
        { text: 'Exige a adesão ao padrão, priorizando a escalabilidade e segurança do negócio.', score: 2 },
        { text: 'Permite que ele siga seu próprio jeito para não desmotivá-lo.', score: -2 },
        { text: 'Tenta adaptar o padrão apenas para ele, criando uma exceção.', score: -1 }
      ]
    }
  },
  {
    id: 'op_3',
    name: 'Manutenção e Cuidado',
    axis: 'Gestão Operacional',
    executiveDefinition: 'A manutenção preventiva e o cuidado com os ativos asseguram a continuidade operacional e protegem o capital investido.',
    philosophicalFoundation: {
      text: 'Cuidar das ferramentas é o primeiro passo para a excelência na obra.',
      reference: 'Miyamoto Musashi'
    },
    strategicImpact: 4,
    systemicIntegration: 'Protege a saúde financeira (evitando gastos emergenciais) e garante a eficiência operacional.',
    situationalScenario: 'Uma máquina essencial ou um servidor crítico para a operação está operando há 12 meses sem revisão. A empresa possui um cronograma de manutenção preventiva ou espera o equipamento quebrar para agir?',
    maturityQuestion: "Existe um cronograma rigoroso de manutenção preventiva (física e digital) para todos os ativos críticos da empresa?",
    weight: 4,
    expectedEvidences: ["Plano de Manutenção Preventiva", "Logs de Backup", "Inventário de Ativos"],
    risksWhenNeglected: ["Parada Operacional", "Depreciação Acelerada", "Custo Emergencial Alto"],
    reference: "Zelo e Manutenção",
    description: "Cuidado preventivo com ativos físicos e digitais.",
    crossAxisImpact: "Financeiro e Operacional",
    executiveSuggestions: ["Instituir software de manutenção", "Realizar auditoria de infraestrutura"],
    executiveRecommendations: [
      'Implementar cronograma de manutenção preventiva de ativos',
      'Instituir política de backup e segurança digital rigorosa',
      'Realizar revisão anual de infraestrutura e tecnologia',
      'Treinar equipe no uso correto e zelo pelas ferramentas',
      'Manter inventário de ativos atualizado e auditado',
      'Projetar a renovação tecnológica de ativos (Capex)',
      'Garantir limpeza e organização constante do parque operacional',
      'Implementar monitoramento em tempo real de servidores/máquinas',
      'Instituir o "responsável pelo ativo" para cada setor',
      'Zelar pela conservação de móveis, utensílios e sede',
      'Reduzir o desperdício de insumos operacionais mensalmente',
      'Fomentar a cultura do "zelo pelo patrimônio comum"'
    ],
    managerDilemma: {
      scenario: 'Você nota que a equipe está desperdiçando insumos caros por pura falta de cuidado e organização. O que você faz?',
      options: [
        { text: 'Implementa controle de estoque rígido e treina sobre o custo do zelo.', score: 2 },
        { text: 'Ignora, achando que o custo do controle é maior que o desperdício.', score: -1 },
        { text: 'Grita com a equipe mas não muda o processo de entrega de insumos.', score: -2 }
      ]
    }
  },
  {
    id: 'op_4',
    name: 'Qualidade Excepcional',
    axis: 'Gestão Operacional',
    executiveDefinition: 'A qualidade excepcional é a entrega superior que supera as expectativas do cliente e elimina o retrabalho.',
    philosophicalFoundation: {
      text: 'A qualidade não é um ato, é um hábito.',
      reference: 'Aristóteles'
    },
    strategicImpact: 5,
    systemicIntegration: 'Base para a credibilidade de marketing e para a fidelidade comercial.',
    situationalScenario: 'Um lote de produtos ou uma entrega de serviço apresenta uma falha pequena, mas perceptível. A operação libera a entrega para bater o prazo ou retém para correção garantindo o padrão de excelência?',
    maturityQuestion: "Existem rituais rigorosos de controle de qualidade e tolerância zero para falhas na entrega final ao cliente?",
    weight: 5,
    expectedEvidences: ["Checklist de Qualidade", "Relatório de Retrabalho", "Auditoria de Entrega"],
    risksWhenNeglected: ["Retrabalho Caro", "Insatisfação do Cliente", "Dano Reputacional"],
    reference: "Excelência na Entrega",
    description: "Padrão superior de qualidade e controle de falhas.",
    crossAxisImpact: "Marketing e Comercial",
    executiveSuggestions: ["Implementar rituais de Double Check", "Medir taxa de retrabalho"],
    executiveRecommendations: [
      'Instituir rituais de conferência final (Double Check)',
      'Monitorar rigorosamente a taxa de retrabalho e perdas',
      'Implementar indicadores de qualidade por departamento',
      'Capacitar a equipe em técnicas de melhoria contínua',
      'Realizar auditorias de qualidade aleatórias na operação',
      'Utilizar feedback de clientes para ajustar padrões técnicos',
      'Premiar a equipe pelo índice de "falha zero" na entrega',
      'Documentar os padrões de "O que é aceitável" visualmente',
      'Reduzir a variabilidade de entrega via padronização',
      'Zelar pela acabamento e detalhes finais do produto/serviço',
      'Eliminar as causas raízes de erros recorrentes em 48h',
      'Fomentar a cultura da excelência em todo o time',
    ],
    managerDilemma: {
      scenario: 'Um lote de produtos apresenta uma falha estética mínima que quase ninguém notará. Liberar agora garante o bônus de prazo. O que você faz?',
      options: [
        { text: 'Retém o lote, corrige a falha e prioriza o padrão de excelência.', score: 2 },
        { text: 'Libera o lote, pois "o cliente nem vai ver" e a meta é sagrada.', score: -2 },
        { text: 'Dá um desconto para o cliente aceitar o produto com defeito.', score: 0 }
      ]
    }
  },
  {
    id: 'op_5',
    name: 'Agilidade Operacional',
    axis: 'Gestão Operacional',
    executiveDefinition: 'A agilidade operacional é a velocidade de resposta às demandas sem perda de qualidade, otimizando o Lead Time.',
    philosophicalFoundation: {
      text: 'Velocidade é a forma definitiva de vantagem competitiva.',
      reference: 'Jack Welch'
    },
    strategicImpact: 4,
    systemicIntegration: 'Vantagem competitiva comercial e pilar da eficiência financeira (Giro).',
    situationalScenario: 'Um pedido urgente chega do principal cliente. A operação consegue se adaptar e entregar em tempo recorde ou o processo é rígido demais para responder com velocidade?',
    maturityQuestion: "A operação possui agilidade para responder a demandas urgentes e otimizar o tempo de entrega (Lead Time)?",
    weight: 4,
    expectedEvidences: ["Lead Time de Entrega", "Tempo de Resposta de Suporte", "Giro de Processos"],
    risksWhenNeglected: ["Lentidão Competitiva", "Perda de Oportunidades", "Acúmulo de Processos"],
    reference: "Agilidade e Fluxo",
    description: "Velocidade de resposta e otimização de fluxos operacionais.",
    crossAxisImpact: "Comercial e Inovação",
    executiveSuggestions: ["Mapear e reduzir o Lead Time", "Automatizar fluxos de aprovação"],
    executiveRecommendations: [
      'Mapear e reduzir o Lead Time total (do pedido à entrega)',
      'Eliminar esperas e burocracias desnecessárias no fluxo',
      'Implementar rituais ágeis (Kanban) para visibilidade de fluxo',
      'Automatizar etapas repetitivas do processo operacional',
      'Capacitar o time para multitarefa e resposta rápida',
      'Utilizar tecnologia para acelerar a comunicação interna',
      'Garantir que a tomada de decisão operacional seja descentralizada',
      'Monitorar o tempo médio de atendimento (TMA) ou produção',
      'Realizar revisões de fluxo mensais para eliminar inércia',
      'Zelar pela fluidez da informação entre departamentos',
      'Implementar canais de urgência com alçadas rápidas',
      'Fomentar a mentalidade de "velocidade com direção"'
    ],
    managerDilemma: {
      scenario: 'Um pedido urgente chega do seu maior cliente. O processo padrão levaria 5 dias, mas ele precisa para amanhã. O que você faz?',
      options: [
        { text: 'Cria uma "via expressa" excepcional, mobiliza o time e entrega com qualidade.', score: 2 },
        { text: 'Nega o pedido, dizendo que "processo é processo" e não pode ser quebrado.', score: -1 },
        { text: 'Aceita mas entrega depois de amanhã sem avisar nada.', score: -2 }
      ]
    }
  },
  {
    id: 'op_6',
    name: 'Organização',
    axis: 'Gestão Operacional',
    executiveDefinition: 'A organização do ambiente físico e digital elimina o desperdício de tempo e foca a energia na fluidez da execução.',
    philosophicalFoundation: {
      text: 'Uma hora de planejamento economiza três horas de execução.',
      reference: 'Peter Drucker'
    },
    strategicImpact: 3,
    systemicIntegration: 'Aumenta a produtividade (Diligência) e reduz o estresse na cultura organizacional.',
    situationalScenario: 'Um colaborador precisa de um documento crítico ou uma ferramenta para concluir uma tarefa urgente. Ele gasta mais de 5 minutos procurando ou o ambiente está organizado para o fluxo de trabalho?',
    maturityQuestion: "O ambiente físico e digital é organizado de forma a eliminar distrações e acelerar a fluidez da execução?",
    weight: 3,
    expectedEvidences: ["Metodologia 5S", "Organização de Arquivos Cloud", "Layout Operacional"],
    risksWhenNeglected: ["Desperdício de Tempo", "Poluição Visual", "Lentidão Decisória"],
    reference: "Organização e Fluxo",
    description: "Ambiente físico e digital otimizado para o trabalho.",
    crossAxisImpact: "Cultura e Operações",
    executiveSuggestions: ["Implementar 5S", "Padronizar nomenclatura de arquivos"],
    executiveRecommendations: [
      'Implementar a metodologia 5S no ambiente físico',
      'Padronizar a nomenclatura de arquivos digitais',
      'Utilizar ferramentas de gestão de tarefas (ex: ClickUp)',
      'Eliminar a poluição visual nos postos de trabalho',
      'Instituir o ritual de "mesa limpa" ao final do dia',
      'Otimizar o layout operacional para reduzir deslocamentos',
      'Garantir que ferramentas críticas estejam sempre à mão',
      'Digitalizar 100% dos documentos físicos necessários',
      'Implementar política de "zero distração" em horários core',
      'Realizar auditorias periódicas de organização (5S)',
      'Treinar equipe em gestão de tempo e priorização',
      'Zelar pela estética e ordem das áreas comuns'
    ],
    managerDilemma: {
      scenario: 'Seu estoque está uma bagunça e ninguém encontra nada rápido. A equipe diz que não tem tempo de organizar porque tem muito pedido. O que você faz?',
      options: [
        { text: 'Para a operação por meio período para organizar e instituir o 5S.', score: 2 },
        { text: 'Contrata um estagiário apenas para organizar enquanto o time continua vendendo.', score: 0 },
        { text: 'Deixa como está até que a demanda baixe naturalmente.', score: -2 }
      ]
    }
  },
  {
    id: 'op_7',
    name: 'Segurança Operacional',
    axis: 'Gestão Operacional',
    executiveDefinition: 'A segurança operacional protege os ativos, os dados e a integridade física das pessoas, garantindo a continuidade do negócio.',
    philosophicalFoundation: {
      text: 'A segurança não acontece por acidente.',
      reference: 'Anônimo'
    },
    strategicImpact: 4,
    systemicIntegration: 'Pilar da governança (Gestão de Riscos) e da segurança jurídica corporativa.',
    situationalScenario: 'Ocorre um vazamento de dados de clientes ou um acidente físico na operação. A empresa possui rituais de prevenção e planos de contenção de danos testados?',
    maturityQuestion: "Existem rituais de segurança (digital e física) ativos para proteger dados, pessoas e o patrimônio da empresa?",
    weight: 4,
    expectedEvidences: ["Plano de Contingência", "Logs de Segurança", "Treinamentos de Segurança"],
    risksWhenNeglected: ["Vazamento de Dados (LGPD)", "Acidentes Graves", "Interrupção de Negócio"],
    reference: "Segurança e Risco",
    description: "Proteção de dados, pessoas e ativos corporativos.",
    crossAxisImpact: "Governança e TI",
    executiveSuggestions: ["Auditar segurança digital", "Implementar plano de contingência"],
    executiveRecommendations: [
      'Implementar política de segurança digital (LGPD) rigorosa',
      'Realizar treinamentos de segurança do trabalho e física',
      'Instituir plano de contingência para crises operacionais',
      'Auditar acessos e senhas a sistemas críticos mensalmente',
      'Garantir manutenção de equipamentos de segurança (extintores, etc)',
      'Monitorar a conformidade com normas regulatórias (NRs)',
      'Realizar simulados de crise e restauração de backups',
      'Zelar pela integridade física dos colaboradores e visitantes',
      'Implementar seguros para ativos e responsabilidade civil',
      'Manter rituais de proteção de dados sensíveis da empresa',
      'Contratar consultoria especializada em cibersegurança',
      'Fomentar a cultura da "prevenção é melhor que correção"'
    ],
    managerDilemma: {
      scenario: 'Você precisa terminar uma obra/entrega urgente e nota que um colaborador está sem o equipamento de segurança (EPI) necessário. O que você faz?',
      options: [
        { text: 'Para a obra imediatamente até que ele coloque o EPI, priorizando a vida.', score: 2 },
        { text: 'Deixa ele continuar só dessa vez para não atrasar a entrega.', score: -2 },
        { text: 'Grita com ele mas deixa ele terminar o que está fazendo sem o EPI.', score: -2 }
      ]
    }
  }
];

export interface AssessmentAxis {
  axis: EixoGestao;
  questions: GovernancePrinciple[];
}

export const GOVERNANCE_ALIGNMENT_ASSESSMENT: AssessmentAxis[] = [
  {
    axis: 'Governança Corporativa',
    questions: GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Governança Corporativa')
  },
  {
    axis: 'Cultura Organizacional',
    questions: GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Cultura Organizacional')
  },
  {
    axis: 'Gestão Administrativa e Financeira',
    questions: GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Gestão Administrativa e Financeira')
  },
  {
    axis: 'Gestão de Inovação',
    questions: GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Gestão de Inovação')
  },
  {
    axis: 'Gestão de Marketing',
    questions: GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Gestão de Marketing')
  },
  {
    axis: 'Gestão Comercial',
    questions: GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Gestão Comercial')
  },
  {
    axis: 'Gestão Operacional',
    questions: GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Gestão Operacional')
  }
];

export function getPrincipleById(id: string): GovernancePrinciple | undefined {
  return GOVERNANCE_PRINCIPLES.find(p => p.id === id);
}

export interface GovernanceRule {
  id: string;
  condition: (data: any) => boolean;
  principleId: string;
  misalignment: string;
  impact: string;
  recommendation: string;
  orientation: string;
}

export const GOVERNANCE_FINANCIAL_RULES: GovernanceRule[] = [
  {
    id: 'rule_fin_liquidez',
    condition: (metrics: any) => (metrics.liquidezCorrente && metrics.liquidezCorrente < 1.0),
    principleId: 'fin_1', // Prudência
    misalignment: 'Liquidez crítica indica ausência de reservas estratégicas e planejamento para imprevistos.',
    impact: 'Vulnerabilidade operacional e alta dependência de crédito emergencial.',
    recommendation: 'Constituir reserva mínima de caixa para cobrir despesas de curto prazo.',
    orientation: 'Nível Básico → Intermediário'
  },
  {
    id: 'rule_fin_alavancagem',
    condition: (metrics: any) => (metrics.alavancagem && metrics.alavancagem > 3.0),
    principleId: 'fin_2', // Sustentabilidade
    misalignment: 'Nível de alavancagem acima de limites saudáveis para o segmento.',
    impact: 'Comprometimento excessivo do fluxo de caixa com serviço da dívida.',
    recommendation: 'Reestruturar dívidas ou reduzir alavancagem com geração de caixa orgânico.',
    orientation: 'Atenção Crítica → Estabilização'
  },
  {
    id: 'rule_fin_ebitda',
    condition: (metrics: any) => (metrics.ebitdaMargin && metrics.ebitdaMargin < 10.0),
    principleId: 'fin_7', // Eficiência
    misalignment: 'Baixa geração de caixa operacional indica ineficiência na gestão de custos.',
    impact: 'Incapacidade de sustentar a operação e gerar valor a longo prazo.',
    recommendation: 'Revisar estrutura de custos e política de precificação.',
    orientation: 'Sobrevivência → Sustentabilidade'
  }
];

export const GOVERNANCE_AXIS_RULES: GovernanceRule[] = [
  ...GOVERNANCE_FINANCIAL_RULES,
  {
    id: 'rule_cult_turnover',
    condition: (metrics: any) => (metrics['Turnover'] !== undefined && metrics['Turnover'] > 5.0),
    principleId: 'cult_1', // Honra
    misalignment: 'Turnover elevado sugere falha na valorização e retenção de talentos.',
    impact: 'Perda de capital intelectual e alto custo de reposição.',
    recommendation: 'Revisar políticas de reconhecimento e cultura de honra.',
    orientation: 'Atenção'
  },
  {
    id: 'rule_cult_enps',
    condition: (metrics: any) => (metrics['eNPS (Clima)'] !== undefined && metrics['eNPS (Clima)'] < 50),
    principleId: 'cult_5', // Cuidado Humano
    misalignment: 'Baixo eNPS aponta para insatisfação e falta de cuidado com as equipes.',
    impact: 'Desengajamento e potencial risco de talentos saindo.',
    recommendation: 'Implementar ações de bem-estar e escuta ativa.',
    orientation: 'Alerta Crítico'
  },
  {
    id: 'rule_com_churn',
    condition: (metrics: any) => (metrics['Churn Rate'] !== undefined && metrics['Churn Rate'] > 5.0),
    principleId: 'com_2', // Fidelidade
    misalignment: 'Taxa de Churn acima do limite tolerável para retenção saudável.',
    impact: 'Erosão da base de clientes e necessidade constante de novos leads caros.',
    recommendation: 'Implementar rituais de CS (Customer Success) e pesquisa de satisfação.',
    orientation: 'Atenção Estratégica'
  },
  {
    id: 'rule_mkt_roi',
    condition: (metrics: any) => (metrics['ROI de Marketing'] !== undefined && metrics['ROI de Marketing'] < 3.0),
    principleId: 'mkt_1', // Posicionamento
    misalignment: 'Baixo retorno sobre investimento em marketing indica ineficiência na comunicação.',
    impact: 'Queima de caixa sem tração correspondente no mercado.',
    recommendation: 'Revisar canais de aquisição e narrativa de marca.',
    orientation: 'Otimização Necessária'
  },
  {
    id: 'rule_op_qualidade',
    condition: (metrics: any) => (metrics['Índice de Qualidade'] !== undefined && metrics['Índice de Qualidade'] < 95.0),
    principleId: 'op_4', // Excelência
    misalignment: 'Índice de qualidade abaixo do padrão de excelência institucional.',
    impact: 'Aumento de retrabalho e risco de danos à reputação da marca.',
    recommendation: 'Reforçar rituais de double-check e treinamento operacional.',
    orientation: 'Foco em Qualidade'
  },
  {
    id: 'rule_gov_transparencia',
    condition: (metrics: any) => (metrics['Índice de Transparência'] !== undefined && metrics['Índice de Transparência'] < 80.0),
    principleId: 'gov_3', // Prestação de Contas
    misalignment: 'Baixa transparência corporativa dificulta o accountability.',
    impact: 'Insegurança dos stakeholders e falta de clareza nos resultados.',
    recommendation: 'Instituir rituais de reporte mensal abertos e dashboards compartilhados.',
    orientation: 'Maturidade de Governança'
  }
];

export function evaluateFinancialRules(metrics: any): (GovernanceRule & { principle: GovernancePrinciple })[] {
  return GOVERNANCE_FINANCIAL_RULES
    .filter(rule => { try { return rule.condition(metrics); } catch (e) { return false; } })
    .map(rule => ({ ...rule, principle: getPrincipleById(rule.principleId)! }))
    .filter(r => r.principle !== undefined);
}

export function evaluateAxisRules(metrics: any, axis: string): (GovernanceRule & { principle: GovernancePrinciple })[] {
  const axisRules = GOVERNANCE_AXIS_RULES.filter(r => {
    const p = getPrincipleById(r.principleId);
    return p && p.axis === axis;
  });

  return axisRules
    .filter(rule => { try { return rule.condition(metrics); } catch (e) { return false; } })
    .map(rule => ({ ...rule, principle: getPrincipleById(rule.principleId)! }));
}

export function calculateGovernanceMaturityScore(responses: Record<string, number>): number {
  let totalScore = 0;
  let totalWeight = 0;

  GOVERNANCE_PRINCIPLES.forEach(principle => {
    const value = responses[principle.id];
    if (value !== undefined) {
      totalScore += (value * principle.strategicImpact);
      totalWeight += (5 * principle.strategicImpact);
    }
  });

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
}

export function calculateAxisMaturity(responses: Record<string, number>, axis: EixoGestao): number {
  const axisPrinciples = GOVERNANCE_PRINCIPLES.filter(p => p.axis === axis);
  let totalScore = 0;
  let totalWeight = 0;

  axisPrinciples.forEach(principle => {
    const value = responses[principle.id];
    if (value !== undefined) {
      totalScore += (value * principle.strategicImpact);
      totalWeight += (5 * principle.strategicImpact);
    }
  });

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
}

export function calculateGovernanceAlignmentScore(indicators: any[]): number {
  if (!indicators || indicators.length === 0) return 0;

  let score = 0;
  const metricsCount = 7;
  const weightPerMetric = 100 / metricsCount;

  const getMetric = (name: string) => indicators.find(i => i.ind.toLowerCase().trim() === name.toLowerCase().trim())?.val || 0;

  // 1. Liquidez (Prudência)
  const liq = getMetric('Liquidez Corrente');
  if (liq >= 1.5) score += weightPerMetric;
  else if (liq >= 1.0) score += weightPerMetric * 0.6;
  else if (liq >= 0.8) score += weightPerMetric * 0.3;

  // 2. Margem EBITDA (Eficiência)
  const ebitda = getMetric('Margem EBITDA');
  if (ebitda >= 25) score += weightPerMetric;
  else if (ebitda >= 15) score += weightPerMetric * 0.7;
  else if (ebitda >= 8) score += weightPerMetric * 0.4;

  // 3. Turnover (Honra/Cultura)
  const turnover = getMetric('Turnover');
  if (turnover > 0 && turnover <= 3) score += weightPerMetric;
  else if (turnover <= 7) score += weightPerMetric * 0.6;
  else if (turnover <= 12) score += weightPerMetric * 0.2;

  // 4. ROI de Marketing (Posicionamento)
  const mktRoi = getMetric('ROI de Marketing');
  if (mktRoi >= 5) score += weightPerMetric;
  else if (mktRoi >= 3) score += weightPerMetric * 0.6;

  // 5. Churn Rate (Fidelidade Comercial)
  const churn = getMetric('Churn Rate');
  if (churn > 0 && churn <= 2) score += weightPerMetric;
  else if (churn <= 5) score += weightPerMetric * 0.5;

  // 6. Índice de Qualidade (Excelência Operacional)
  const qualidade = getMetric('Índice de Qualidade');
  if (qualidade >= 98) score += weightPerMetric;
  else if (qualidade >= 95) score += weightPerMetric * 0.5;

  // 7. Transparência (Accountability)
  const transp = getMetric('Índice de Transparência');
  if (transp >= 90) score += weightPerMetric;
  else if (transp >= 70) score += weightPerMetric * 0.5;

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function crossValidateWithIndicators(responses: Record<string, number>, indicators: any[]): Record<string, number> {
  const adjustedResponses = { ...responses };
  
  const incoherenceRules = [
    {
      principleId: 'fin_1', // Prudência
      metric: 'Liquidez Corrente',
      condition: (val: number) => val < 1.0,
      maxMaturity: 1,
      reason: 'Falta de liquidez imediata contradiz a prudência financeira.'
    },
    {
      principleId: 'cult_1', // Honra
      metric: 'Turnover',
      condition: (val: number) => val > 15,
      maxMaturity: 1,
      reason: 'Turnover alto é incompatível com uma cultura de honra e retenção.'
    }
  ];

  incoherenceRules.forEach(rule => {
    const metricVal = indicators.find(i => i.ind.toLowerCase().includes(rule.metric.toLowerCase()))?.val;
    if (metricVal !== undefined && rule.condition(metricVal)) {
      if (adjustedResponses[rule.principleId] > rule.maxMaturity) {
        adjustedResponses[rule.principleId] = rule.maxMaturity;
      }
    }
  });

  return adjustedResponses;
}

export function getMaturityClassification(score: number) {
  if (score >= 90) return { label: 'Excelência de Governança', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
  if (score >= 75) return { label: 'Maturidade Consolidada', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 60) return { label: 'Maturidade em Desenvolvimento', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
  if (score >= 40) return { label: 'Estruturação Básica', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
  return { label: 'Risco Estrutural', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
}
