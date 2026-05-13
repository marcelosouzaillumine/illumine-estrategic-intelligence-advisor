import { EixoGestao } from '../types/modules';

export interface SacerdotalPrinciple {
  id: string;
  name: string;
  description: string;
  axis: EixoGestao;
  category?: string;
  reference: string;
  businessApplication: string;
  risksWhenNeglected: string[];
  practicalRecommendations: string[];
}

export const SACERDOTAL_PRINCIPLES: SacerdotalPrinciple[] = [
  // Eixo: Governança
  {
    id: 'gov_1',
    name: 'Integridade',
    description: 'Agir com retidão e transparência em todas as decisões e processos.',
    axis: 'Governança',
    reference: 'Provérbios 11:3',
    businessApplication: 'Rastreabilidade e transparência decisória.',
    risksWhenNeglected: ['Corrupção', 'Perda de confiança de stakeholders', 'Riscos legais e de compliance'],
    practicalRecommendations: [
      'Implementar canal de denúncias anônimo',
      'Realizar auditorias externas trimestrais',
      'Documentar todas as decisões de alto nível em atas públicas para sócios',
      'Estabelecer um código de conduta ética claro e acessível',
      'Treinar lideranças e colaboradores em compliance anualmente',
      'Realizar background check para cargos de confiança e sensíveis',
      'Implementar política rigorosa de conflito de interesses',
      'Revisar regularmente contratos com fornecedores sob ótica ética',
      'Transparência total em processos de licitação e compras internas',
      'Instituir feedback de 360 graus com foco em valores e integridade',
      'Criar um comitê de ética independente com poder de veto',
      'Publicar relatórios anuais de transparência corporativa'
    ]
  },
  {
    id: 'gov_2',
    name: 'Conselho Plural',
    description: 'Buscar conselho na multidão de conselheiros.',
    axis: 'Governança',
    reference: 'Provérbios 11:14',
    businessApplication: 'Diversidade no board e processos decisórios não concentrados.',
    risksWhenNeglected: ['Decisões enviesadas', 'Concentração de poder', 'Pontos cegos estratégicos'],
    practicalRecommendations: [
      'Criar conselho consultivo with membros externos à operação',
      'Estabelecer comitês temáticos (financeiro, gente, inovação)',
      'Incentivar o debate construtivo e a divergência saudável em reuniões',
      'Garantir diversidade de perfis e experiências no board',
      'Formalizar atas de todas as reuniões deliberativas',
      'Contratar consultorias externas para validação de grandes projetos',
      'Implementar plano de sucessão planejado e discutido em conselho',
      'Realizar avaliação anual de desempenho do próprio board',
      'Instituir rodízio de lideranças em comitês estratégicos',
      'Promover sessões de mentoria reversa entre jovens e seniores',
      'Realizar workshops de visão estratégica com stakeholders chave',
      'Manter canais abertos com especialistas setoriais externos'
    ]
  },
  {
    id: 'gov_3',
    name: 'Accountability',
    description: 'Prestar contas das ações e resultados.',
    axis: 'Governança',
    reference: 'Romanos 14:12',
    businessApplication: 'Prestação de contas estruturada e clara.',
    risksWhenNeglected: ['Falta de responsabilização', 'Ineficiência', 'Ocultação de resultados negativos'],
    practicalRecommendations: [
      'Realizar reuniões mensais de prestação de contas (RPR)',
      'Manter dashboard de KPIs atualizado e visível para os responsáveis',
      'Instituir avaliações de desempenho individuais e por área',
      'Garantir transparência total de dados financeiros para o board',
      'Definir donos claros para cada indicador estratégico',
      'Implementar gestão à vista em todas as unidades operacionais',
      'Auditar regularmente os processos de reporte de dados',
      'Utilizar sistema de ERP integrado para garantir unicidade da verdade',
      'Estabelecer política de bônus atrelada a metas verificáveis',
      'Fornecer feedback estruturado após cada ciclo de entrega',
      'Revisar metas trimestralmente com base em dados reais',
      'Publicar balanço social e financeiro com clareza para interessados'
    ]
  },
  {
    id: 'gov_4',
    name: 'Justiça',
    description: 'Praticar a equidade e o que é reto.',
    axis: 'Governança',
    reference: 'Miquéias 6:8',
    businessApplication: 'Equidade em processos e distribuição de valor.',
    risksWhenNeglected: ['Desmotivação', 'Ações trabalhistas', 'Clima organizacional tóxico'],
    practicalRecommendations: [
      'Implementar política salarial baseada em mérito e mercado',
      'Definir critérios objetivos para promoções e aumentos',
      'Avaliar fornecedores por critérios técnicos e éticos iguais',
      'Garantir equidade de oportunidades independente de gênero ou raça',
      'Manter canal de ouvidoria para questões de injustiça percebida',
      'Revisar regularmente o pacote de benefícios para garantir justiça',
      'Promover feedback transparente sobre decisões de carreira',
      'Utilizar processos seletivos cegos para reduzir vieses',
      'Oferecer mediação profissional para conflitos interpessoais',
      'Garantir compliance rigoroso com a legislação trabalhista',
      'Distribuir lucros de forma proporcional ao impacto e esforço',
      'Investir em programas de inclusão e diversidade genuínos'
    ]
  },
  {
    id: 'gov_5',
    name: 'Sabedoria',
    description: 'Tomar decisões fundamentadas e discernimento.',
    axis: 'Governança',
    reference: 'Tiago 1:5',
    businessApplication: 'Decisão com dados e discernimento.',
    risksWhenNeglected: ['Decisões impulsivas', 'Falta de visão de longo prazo', 'Desperdício de recursos'],
    practicalRecommendations: [
      'Utilizar Business Intelligence (BI) para embasar decisões',
      'Consultar especialistas antes de entrar em novos mercados',
      'Realizar análise de riscos detalhada para grandes investimentos',
      'Praticar o planejamento de cenários (otimista, pessimista, provável)',
      'Investir em educação executiva contínua para a liderança',
      'Manter uma biblioteca corporativa ou base de conhecimento',
      'Promover programas de mentoria com executivos experientes',
      'Realizar "post-mortem" de projetos que falharam para aprender',
      'Fazer benchmarking regular com as melhores práticas do setor',
      'Instituir momentos de silêncio e reflexão antes de decisões vitais',
      'Testar hipóteses em pequena escala antes do roll-out total',
      'Buscar decisões por consenso fundamentado no board'
    ]
  },
  {
    id: 'gov_6',
    name: 'Ordem',
    description: 'Fazer tudo com decência e ordem.',
    axis: 'Governança',
    reference: '1 Coríntios 14:40',
    businessApplication: 'Processos claros e governança documentada.',
    risksWhenNeglected: ['Caos operacional', 'Ineficiência', 'Perda de conhecimento com turnover'],
    practicalRecommendations: [
      'Mapear e documentar todos os processos críticos da empresa',
      'Criar manuais de integração e POPs (Procedimentos Operacionais)',
      'Definir estrutura hierárquica e matriz de responsabilidades (RACI)',
      'Organizar repositórios digitais com nomenclatura padronizada',
      'Estabelecer rituais de reuniões com pautas e horários fixos',
      'Utilizar checklists para tarefas repetitivas e sensíveis',
      'Manter cronograma anual de atividades institucionais',
      'Implementar sistema de gestão de documentos (GED)',
      'Garantir que a arquitetura de dados seja lógica e acessível',
      'Expor fluxogramas de processos em locais visíveis/digitais',
      'Adotar metodologia 5S para organização física e digital',
      'Realizar limpeza periódica de backlogs e processos obsoletos'
    ]
  },
  {
    id: 'gov_7',
    name: 'Escuta Ativa',
    category: 'Oração e Conselho Divino',
    description: 'Discernimento através da escuta a Deus e aos conselheiros.',
    axis: 'Governança',
    reference: 'Tiago 1:19',
    businessApplication: 'Decisões baseadas em discernimento e não apenas em urgência.',
    risksWhenNeglected: ['Decisões precipitadas', 'Falta de paz nas escolhas', 'Erros estratégicos graves'],
    practicalRecommendations: [
      'Estabelecer momentos de silêncio antes de decisões críticas',
      'Criar um conselho de intercessão ou apoio espiritual para a empresa',
      'Ouvir todos os níveis da hierarquia antes de mudanças estruturais',
      'Praticar o "jejum" de decisões rápidas em momentos de alta pressão',
      'Consultar mentores espirituais para validação de valores bíblicos',
      'Realizar retiros estratégicos focados em escuta e planejamento',
      'Registrar "insights" recebidos em momentos de reflexão e oração',
      'Promover cultura de feedback aberto onde o erro é ouvido',
      'Incluir pausa reflexiva em reuniões de diretoria antes da votação',
      'Validar decisões with a paz interior da liderança sênior',
      'Buscar confirmação em múltiplas fontes de conselho sábio',
      'Documentar o processo de discernimento utilizado em casos complexos'
    ]
  },
  {
    id: 'gov_8',
    name: 'Acompanhamento Pastoral',
    description: 'Cuidado contínuo com a saúde espiritual e emocional dos líderes.',
    axis: 'Governança',
    reference: 'Hebreus 13:17',
    businessApplication: 'Mentoria e suporte para prevenir quedas éticas e emocionais.',
    risksWhenNeglected: ['Solidão da liderança', 'Quedas morais', 'Burnout de diretores'],
    practicalRecommendations: [
      'Contratar capelania corporativa ou mentoria espiritual externa',
      'Estabelecer grupos de prestação de contas (accountability groups)',
      'Realizar check-ins emocionais regulares com todos os executivos',
      'Oferecer suporte psicológico e pastoral de forma confidencial',
      'Promover o desenvolvimento do caráter acima das competências técnicas',
      'Criar ambiente de vulnerabilidade segura para líderes compartilharem dores',
      'Treinar gestores em escuta empática e acolhimento humano',
      'Instituir períodos de licença remunerada para renovação (sático)',
      'Monitorar sinais de estresse e isolamento na alta liderança',
      'Celebrar o crescimento pessoal dos colaboradores, não só os números',
      'Integrar famílias em eventos de integração da liderança',
      'Avaliar regularmente o clima espiritual e emocional da organização'
    ]
  },
  {
    id: 'gov_9',
    name: 'Serviço à Cidade',
    description: 'A empresa como agente de transformação no território.',
    axis: 'Governança',
    reference: 'Jeremias 29:7',
    businessApplication: 'Responsabilidade social que visa o bem comum da região.',
    risksWhenNeglected: ['Isolamento social', 'Má reputação local', 'Falta de propósito transcendente'],
    practicalRecommendations: [
      'Mapear necessidades sociais do entorno geográfico da empresa',
      'Criar programas estruturados de voluntariado corporativo',
      'Apoiar ONGs locais com recursos financeiros e expertise técnica',
      'Adotar espaços públicos (praças, jardins) para revitalização',
      'Priorizar o comércio e fornecedores locais em compras menores',
      'Participar ativamente de associações de bairro ou setoriais locais',
      'Oferecer cursos e treinamentos gratuitos para a comunidade externa',
      'Implementar metas de redução de impacto ambiental na vizinhança',
      'Patrocinar eventos culturais e esportivos da cidade onde atua',
      'Destinar uma porcentagem fixa do lucro para projetos sociais locais',
      'Abrir espaço físico da empresa para uso comunitário em horários alternativos',
      'Medir o impacto social gerado através de indicadores de bem-estar'
    ]
  },

  // Eixo: Cultura
  {
    id: 'cult_1',
    name: 'Honra',
    description: 'Reconhecer e valorizar as pessoas.',
    axis: 'Cultura',
    reference: 'Romanos 12:10',
    businessApplication: 'Reconhecimento e valorização de pessoas.',
    risksWhenNeglected: ['Baixo engajamento', 'Turnover elevado', 'Clima de desrespeito'],
    practicalRecommendations: [
      'Implementar programas de reconhecimento por anos de casa',
      'Estimular o feedback positivo público e correção privada',
      'Celebrar conquistas individuais e coletivas de forma ritualística',
      'Criar "mural da honra" para destacar comportamentos exemplares',
      'Garantir que a liderança conheça o nome e história dos liderados',
      'Realizar eventos de apreciação para as famílias dos colaboradores',
      'Instituir prêmios de inovação e dedicação extraordinária',
      'Promover a cultura de agradecimento formal em reuniões',
      'Respeitar a autoridade e o conhecimento técnico em todos os níveis',
      'Valorizar a diversidade de talentos e temperamentos na equipe',
      'Criar rituais de despedida honrosos para quem sai da empresa',
      'Garantir que o reconhecimento seja tempestivo e específico'
    ]
  },
  {
    id: 'cult_2',
    name: 'Unidade',
    description: 'Trabalhar em harmonia e colaboração.',
    axis: 'Cultura',
    reference: 'Salmos 133:1',
    businessApplication: 'Coesão de equipe e ausência de silos.',
    risksWhenNeglected: ['Conflitos internos', 'Falta de sinergia', 'Desalinhamento estratégico'],
    practicalRecommendations: [
      'Realizar atividades de team building com foco em propósito comum',
      'Estabelecer metas compartilhadas entre departamentos diferentes',
      'Promover comunicação interdepartamental fluida e sem barreiras',
      'Resolver conflitos de forma rápida e mediada pela liderança',
      'Utilizar ferramentas de colaboração em tempo real',
      'Criar projetos transversais que envolvam múltiplas áreas',
      'Garantir que todos conheçam e compartilhem a mesma visão (MVV)',
      'Desestimular a cultura de "culpabilização" entre áreas',
      'Promover almoços ou cafés de integração aleatórios',
      'Padronizar a linguagem e termos técnicos em toda a empresa',
      'Celebrar metas globais, reforçando que todos ganham juntos',
      'Treinar equipes em inteligência emocional e colaborativa'
    ]
  },
  {
    id: 'cult_3',
    name: 'Serviço',
    description: 'Liderar servindo aos outros.',
    axis: 'Cultura',
    reference: 'Marcos 10:43-45',
    businessApplication: 'Liderança servidora.',
    risksWhenNeglected: ['Liderança autoritária', 'Falta de empatia', 'Desconexão entre líderes e liderados'],
    practicalRecommendations: [
      'Implementar treinamento de liderança servidora para todos os níveis',
      'Estimular líderes a passarem tempo no "chão de fábrica" ou operação',
      'Avaliar líderes pelo crescimento e bem-estar de seus liderados',
      'Promover a cultura de "como posso te ajudar hoje?"',
      'Remover obstáculos operacionais que impedem a equipe de brilhar',
      'Liderar pelo exemplo, assumindo tarefas simples quando necessário',
      'Praticar a escuta ativa em reuniões de um para um (1:1)',
      'Desenvolver planos de sucessão focados em serviço, não poder',
      'Oferecer recursos e ferramentas adequadas para a execução do trabalho',
      'Celebrar o sucesso da equipe como sendo mérito total dela',
      'Manter as portas da liderança sempre abertas para diálogo',
      'Fomentar a mentoria interna como forma de doação de conhecimento'
    ]
  },
  {
    id: 'cult_4',
    name: 'Verdade',
    description: 'Falar a verdade e ser autêntico.',
    axis: 'Cultura',
    reference: 'João 8:32',
    businessApplication: 'Comunicação transparente e feedback real.',
    risksWhenNeglected: ['Fofocas', 'Desconfiança', 'Ambiente político e dissimulado'],
    practicalRecommendations: [
      'Instituir cultura de feedback honesto, direto e amoroso',
      'Garantir transparência total em comunicados internos importantes',
      'Desestimular fofocas e conversas de corredor com tolerância zero',
      'Incentivar a franqueza radical em reuniões estratégicas',
      'Admitir erros publicamente pela liderança, gerando segurança psicológica',
      'Manter canais oficiais de comunicação sempre atualizados',
      'Realizar reuniões de "Town Hall" para perguntas e respostas livres',
      'Garantir que as promessas feitas aos colaboradores sejam cumpridas',
      'Utilizar dados reais para fundamentar críticas e elogios',
      'Promover a autenticidade, permitindo que as pessoas sejam quem são',
      'Documentar acordos e decisões para evitar interpretações dúbias',
      'Tratar assuntos difíceis com clareza, sem rodeios desnecessários'
    ]
  },
  {
    id: 'cult_5',
    name: 'Cuidado',
    description: 'Atentar para o bem-estar do próximo.',
    axis: 'Cultura',
    reference: 'Filipenses 2:4',
    businessApplication: 'Atenção genuína ao desenvolvimento humano.',
    risksWhenNeglected: ['Burnout', 'Falta de desenvolvimento profissional', 'Baixa retenção de talentos'],
    practicalRecommendations: [
      'Oferecer programas estruturados de bem-estar mental e físico',
      'Implementar Planos de Desenvolvimento Individual (PDI) para todos',
      'Garantir equilíbrio real entre vida pessoal e profissional',
      'Apoiar colaboradores em momentos de crise pessoal ou familiar',
      'Investir em ergonomia e conforto do ambiente de trabalho',
      'Oferecer subsídios para educação e cursos de aperfeiçoamento',
      'Monitorar indicadores de estresse e carga horária excessiva',
      'Criar espaços de descompressão e descanso na empresa',
      'Promover conversas sobre carreira e propósito de vida',
      'Realizar pesquisas de clima organizacional frequentes',
      'Garantir benefícios que atendam às necessidades reais das famílias',
      'Promover a saúde preventiva através de campanhas internas'
    ]
  },
  {
    id: 'cult_6',
    name: 'Descanso',
    description: 'Ritmo sustentável que honra os limites humanos.',
    axis: 'Cultura',
    reference: 'Êxodo 20:8',
    businessApplication: 'Produtividade baseada na renovação, não no esgotamento.',
    risksWhenNeglected: ['Baixa produtividade crônica', 'Alta rotatividade', 'Doenças ocupacionais'],
    practicalRecommendations: [
      'Respeitar rigorosamente os períodos de folga, fins de semana e férias',
      'Desestimular o envio de mensagens de trabalho fora do horário comercial',
      'Instituir "Day Off" em datas especiais ou após grandes entregas',
      'Garantir pausas obrigatórias para descanso durante a jornada',
      'Promover a mentalidade de que o descanso é combustível para o foco',
      'Criar áreas de silêncio e repouso no ambiente corporativo',
      'Oferecer flexibilidade de horários para conciliação com a família',
      'Evitar marcar reuniões em horários de transição (almoço/fim de expediente)',
      'Treinar líderes para planejar melhor a carga de trabalho das equipes',
      'Celebrar o encerramento de grandes ciclos with períodos de alívio',
      'Monitorar e atuar sobre o excesso de horas extras acumuladas',
      'Incentivar hobbies e atividades extra-profissionais dos colaboradores'
    ]
  },

  // Eixo: Gestão
  {
    id: 'fin_1',
    name: 'Mordomia Financeira',
    description: 'Ser fiel nas riquezas injustas.',
    axis: 'Gestão',
    reference: 'Lucas 16:11',
    businessApplication: 'Gestão fiel de recursos financeiros e caixa.',
    risksWhenNeglected: ['Descontrole financeiro', 'Mistura de contas PJ e PF', 'Falta de liquidez'],
    practicalRecommendations: [
      'Realizar conciliação bancária diária e rigorosa',
      'Manter separação absoluta entre contas pessoais e da empresa',
      'Fazer planejamento de fluxo de caixa projetado para 12 meses',
      'Utilizar sistemas de gestão financeira profissionais',
      'Revisar despesas fixas mensalmente em busca de economias',
      'Manter controle rigoroso de contas a pagar e a receber',
      'Evitar retiradas de sócios acima da capacidade real de lucro',
      'Implementar processos de aprovação de gastos por alçada',
      'Auditar regularmente as movimentações de caixa',
      'Garantir que todos os impostos sejam pagos rigorosamente em dia',
      'Utilizar indicadores financeiros (margem, ROI) para decisões',
      'Educar a equipe sobre a importância da saúde financeira'
    ]
  },
  {
    id: 'fin_2',
    name: 'Prudência Financeira',
    description: 'Ter tesouro e azeite (reservas).',
    axis: 'Gestão',
    reference: 'Provérbios 21:20',
    businessApplication: 'Reservas e planejamento financeiro para imprevistos.',
    risksWhenNeglected: ['Vulnerabilidade a crises', 'Falta de capital de giro', 'Dependência de crédito caro'],
    practicalRecommendations: [
      'Constituir reserva de emergência para cobrir 6 meses de custos',
      'Realizar planejamento financeiro de longo prazo (3 a 5 anos)',
      'Diversificar fontes de receita para reduzir riscos',
      'Manter baixo nível de endividamento operacional',
      'Avaliar riscos financeiros de novos projetos exaustivamente',
      'Ter planos de contingência para quedas bruscas de faturamento',
      'Não comprometer todo o caixa em investimentos de risco',
      'Monitorar indicadores de liquidez corrente e seca',
      'Manter relacionamento saudável com múltiplas instituições financeiras',
      'Investir excedentes de caixa em ativos de baixo risco e liquidez',
      'Evitar gastos supérfluos mesmo em períodos de abundância',
      'Revisar periodicamente o nível de exposição a riscos de mercado'
    ]
  },
  {
    id: 'fin_3',
    name: 'Sustentabilidade Financeira',
    description: 'Acumular com o próprio trabalho (gradativamente).',
    axis: 'Gestão',
    reference: 'Provérbios 13:11',
    businessApplication: 'Riqueza acumulada com sabedoria, sem atalhos.',
    risksWhenNeglected: ['Crescimento insustentável', 'Alavancagem excessiva para crescimento rápido', 'Problemas de fluxo de caixa por crescimento desordenado'],
    practicalRecommendations: [
      'Focar em crescimento orgânico e sustentável',
      'Reinvestir parte significativa dos lucros no próprio negócio',
      'Evitar esquemas de ganho rápido ou alto risco especulativo',
      'Planejar a expansão com base na geração de caixa própria',
      'Manter estrutura de custos leve e escalável',
      'Monitorar a margem de contribuição por produto/serviço',
      'Garantir que cada nova venda seja lucrativa',
      'Evitar a "vaidade" de faturamento sem lucro real',
      'Construir valor de marca sólido e duradouro',
      'Ser paciente nos ciclos de maturação de investimentos',
      'Priorizar a estabilidade sobre o crescimento explosivo desordenado',
      'Manter o foco no core business antes de diversificar'
    ]
  },
  {
    id: 'fin_4',
    name: 'Dívida Consciente',
    description: 'A ninguém dever nada, senão o amor.',
    axis: 'Gestão',
    reference: 'Romanos 13:8',
    businessApplication: 'Endividamento responsável e evitação de juros abusivos.',
    risksWhenNeglected: ['Endividamento insustentável', 'Pagamento elevado de juros', 'Risco de falência'],
    practicalRecommendations: [
      'Utilizar crédito apenas para investimentos com retorno (ROI) claro',
      'Renegociar dívidas caras por opções com menores taxas e prazos longos',
      'Evitar usar alavancagem financeira para cobrir despesas operacionais',
      'Ter clareza total sobre o custo efetivo total (CET) de cada empréstimo',
      'Garantir que o serviço da dívida não comprometa o fluxo de caixa essencial',
      'Priorizar o pagamento de dívidas com juros mais altos',
      'Evitar garantias pessoais dos sócios sempre que possível',
      'Manter um rating de crédito positivo no mercado',
      'Utilizar financiamentos específicos para aquisição de ativos (BNDES, etc)',
      'Não contrair dívidas por impulso ou status corporativo',
      'Ter um plano de liquidação de dívidas acelerado',
      'Consultar especialistas financeiros antes de grandes captações'
    ]
  },
  {
    id: 'fin_5',
    name: 'Dízimo e Retorno',
    description: 'Trazer os dízimos e primícias.',
    axis: 'Gestão',
    reference: 'Malaquias 3:10',
    businessApplication: 'Dar do primeiro fruto e generosidade corporativa.',
    risksWhenNeglected: ['Falta de responsabilidade social', 'Mentalidade de escassez', 'Apego excessivo ao dinheiro'],
    practicalRecommendations: [
      'Instituir doações corporativas sistemáticas (ex: 10% do lucro)',
      'Apoiar projetos sociais e missionários de forma recorrente',
      'Cultivar uma cultura de generosidade entre os colaboradores',
      'Realizar "primícias" dedicando o primeiro resultado de novos projetos',
      'Promover campanhas internas de arrecadação para necessidades urgentes',
      'Utilizar recursos da empresa para abençoar a comunidade local',
      'Oferecer bolsas de estudo ou apoio a talentos carentes',
      'Praticar o "dar" sem esperar nada em troca como princípio',
      'Manter transparência sobre os destinos das doações da empresa',
      'Envolver os colaboradores na escolha dos projetos apoiados',
      'Celebrar os resultados sociais alcançados pela empresa',
      'Integrar a generosidade ao modelo de negócio (compre um, doe um)'
    ]
  },
  {
    id: 'fin_6',
    name: 'Frutificação',
    description: 'Multiplicar os talentos recebidos.',
    axis: 'Gestão',
    reference: 'Mateus 25:14-30',
    businessApplication: 'Talentos investidos com multiplicação e retorno.',
    risksWhenNeglected: ['Capital ocioso', 'Falta de investimento em inovação', 'Estagnação do patrimônio'],
    practicalRecommendations: [
      'Investir lucros retidos em ativos produtivos ou inovação',
      'Buscar constantemente aumentar o Retorno sobre o Capital (ROIC)',
      'Otimizar a alocação de recursos entre diferentes áreas da empresa',
      'Não deixar capital parado perdendo valor para a inflação',
      'Identificar e potencializar "talentos" (ativos) subutilizados',
      'Promover a cultura de intraempreendedorismo para novos lucros',
      'Avaliar o desempenho de cada unidade de negócio individualmente',
      'Descontinuar ativos ou áreas que não frutificam após tentativas',
      'Investir na modernização tecnológica para ganho de escala',
      'Buscar novas frentes de mercado baseadas nas competências core',
      'Treinar a equipe para ter mentalidade de dono e foco em resultado',
      'Celebrar o crescimento do patrimônio e da capacidade de impacto'
    ]
  },
  {
    id: 'fin_7',
    name: 'Transparência Financeira',
    description: 'Procurar o que é honesto perante os homens.',
    axis: 'Gestão',
    reference: '2 Coríntios 8:21',
    businessApplication: 'Contabilidade honesta e relatórios financeiros transparentes.',
    risksWhenNeglected: ['Fraudes', 'Maquiagem contábil', 'Sonegação fiscal'],
    practicalRecommendations: [
      'Contratar auditoria contábil independente periodicamente',
      'Manter relatórios financeiros claros e acessíveis aos sócios',
      'Praticar compliance fiscal rigoroso, sem "jeitinhos"',
      'Evitar o uso de caixa 2 ou qualquer movimentação não oficial',
      'Publicar demonstrações financeiras seguindo normas internacionais',
      'Treinar a equipe financeira em ética e padrões contábeis',
      'Utilizar softwares que garantam a imutabilidade dos registros',
      'Realizar prestação de contas detalhada em reuniões de sócios',
      'Garantir clareza sobre remuneração e bônus da diretoria',
      'Manter documentação suporte para cada transação financeira',
      'Ser transparente with bancos e investidores sobre a real situação',
      'Adotar práticas de governança financeira reconhecidas no mercado'
    ]
  },
  {
    id: 'fin_8',
    name: 'Justiça Distributiva',
    description: 'Aquele que distribui mais se lhe acrescenta.',
    axis: 'Gestão',
    reference: 'Provérbios 11:24',
    businessApplication: 'Distribuição justa dos resultados (PLR, dividendos).',
    risksWhenNeglected: ['Concentração de riqueza apenas no topo', 'Desmotivação da equipe', 'Sentimento de injustiça'],
    practicalRecommendations: [
      'Implementar Programa de Participação nos Lucros e Resultados (PLR)',
      'Definir metas claras e justas para a remuneração variável',
      'Distribuir dividendos de forma equilibrada entre os sócios',
      'Garantir que a base da pirâmide também participe do sucesso',
      'Revisar periodicamente a equidade salarial interna',
      'Evitar disparidades extremas entre o maior e o menor salário',
      'Promover o sentimento de "todos no mesmo barco"',
      'Utilizar parte do lucro para melhorias no ambiente de trabalho',
      'Oferecer benefícios que agreguem valor real à vida do colaborador',
      'Ser generoso em momentos de resultados extraordinários',
      'Comunicar claramente como os lucros são distribuídos e reinvestidos',
      'Promover a meritocracia baseada em resultados e valores'
    ]
  },

  // Eixo: Inovação
  {
    id: 'inov_1',
    name: 'Criatividade',
    description: 'Refletir a natureza criadora.',
    axis: 'Inovação',
    reference: 'Gênesis 1:1',
    businessApplication: 'Deus criador como modelo de inovação.',
    risksWhenNeglected: ['Estagnação', 'Perda de competitividade', 'Obsolescência de produtos/serviços'],
    practicalRecommendations: [
      'Incentivar sessões regulares de brainstorming sem julgamento',
      'Criar laboratórios de experimentação para novos produtos',
      'Investir porcentagem fixa do faturamento em Pesquisa e Desenvolvimento',
      'Promover concursos internos de ideias com premiação',
      'Permitir tempo livre para projetos de interesse pessoal (ex: 20% time)',
      'Expor a equipe a estímulos externos (museus, feiras, artes)',
      'Diversificar as equipes para gerar diferentes pontos de vista',
      'Desafiar o status quo constantemente através de perguntas "e se?"',
      'Utilizar metodologias de Design Thinking para solução de problemas',
      'Celebrar a originalidade e o pensamento fora da caixa',
      'Criar um repositório de ideias para futura implementação',
      'Remover o medo do erro no processo criativo inicial'
    ]
  },
  {
    id: 'inov_2',
    name: 'Prudência na Inovação',
    description: 'Avaliar os custos antes de iniciar um projeto.',
    axis: 'Inovação',
    reference: 'Lucas 14:28',
    businessApplication: 'Análise de viabilidade antes de construir.',
    risksWhenNeglected: ['Projetos fracassados', 'Desperdício de recursos', 'Falta de foco estratégico'],
    practicalRecommendations: [
      'Realizar prototipagem rápida e barata antes da escala',
      'Elaborar estudos de viabilidade técnica e financeira detalhados',
      'Utilizar testes A/B para validar hipóteses com usuários reais',
      'Definir critérios de parada (kill switch) para projetos ineficazes',
      'Analisar o impacto da inovação nos processos existentes',
      'Garantir alinhamento da inovação com a estratégia central',
      'Calcular o ROI estimado para cada iniciativa de inovação',
      'Consultar clientes fiéis durante o processo de desenvolvimento',
      'Realizar análise competitiva antes de lançar novas funcionalidades',
      'Documentar lições aprendidas em cada ciclo de inovação',
      'Instituir aprovação por etapas (gates) para liberação de verbas',
      'Avaliar riscos de segurança e privacidade em novas tecnologias'
    ]
  },
  {
    id: 'inov_3',
    name: 'Semear e Colher',
    description: 'O resultado vem após o investimento e esforço.',
    axis: 'Inovação',
    reference: 'Gálatas 6:7',
    businessApplication: 'Investimento consistente produz fruto.',
    risksWhenNeglected: ['Inovação pontual', 'Expectativas irrealistas de curto prazo', 'Falta de persistência'],
    practicalRecommendations: [
      'Manter orçamento dedicado à inovação mesmo em tempos de crise',
      'Estabelecer métricas de inovação focadas no longo prazo',
      'Promover a tolerância ao erro como parte do aprendizado necessário',
      'Garantir paciência estratégica para o amadurecimento de ideias',
      'Recompensar o esforço de tentativa, não apenas o resultado final',
      'Cultivar uma "pipeline" de projetos em diferentes estágios',
      'Investir na capacitação contínua da equipe em novas tecnologias',
      'Garantir que a alta gestão apoie publicamente a inovação',
      'Celebrar as pequenas vitórias ao longo da jornada de desenvolvimento',
      'Manter a consistência nos investimentos em infraestrutura tecnológica',
      'Promover a troca de conhecimentos entre projetos de sucesso e falha',
      'Focar na qualidade da semente (ideia e execução) para garantir o fruto'
    ]
  },
  {
    id: 'inov_4',
    name: 'Ousadia',
    description: 'Ter coragem para enfrentar novos desafios.',
    axis: 'Inovação',
    reference: 'Josué 1:9',
    businessApplication: 'Coragem para inovar com fé.',
    risksWhenNeglected: ['Aversão ao risco', 'Ficar para trás no mercado', 'Medo de errar'],
    practicalRecommendations: [
      'Celebrar publicamente tentativas audaciosas, mesmo as que falham',
      'Incentivar projetos de alto impacto (moonshots) periodicamente',
      'Criar um ambiente seguro onde arriscar não gera punição',
      'Estimular a liderança a tomar decisões corajosas e disruptivas',
      'Desafiar limites impostos por crenças limitantes do mercado',
      'Investir em tecnologias emergentes antes da adoção em massa',
      'Promover hackathons with desafios complexos e inusitados',
      'Garantir autonomia para as equipes decidirem caminhos inovadores',
      'Buscar soluções radicalmente diferentes para problemas antigos',
      'Treinar a resiliência para lidar with as incertezas da inovação',
      'Incentivar o protagonismo e a proatividade em todos os níveis',
      'Manter uma postura otimista e visionária frente às mudanças'
    ]
  },

  // Eixo: Marketing
  {
    id: 'mkt_1',
    name: 'Testemunho',
    description: 'Que as boas obras sejam vistas.',
    axis: 'Marketing',
    reference: 'Mateus 5:16',
    businessApplication: 'Reputação que reflete valores internos.',
    risksWhenNeglected: ['Incoerência entre discurso e prática', 'Danos à marca', 'Crise de imagem'],
    practicalRecommendations: [
      'Praticar marketing autêntico, baseado em fatos e valores reais',
      'Destacar casos de sucesso de clientes com integridade',
      'Garantir alinhamento total entre a cultura interna e a marca externa',
      'Comunicar ações sociais e de impacto de forma humilde e inspiradora',
      'Utilizar depoimentos reais de colaboradores sobre o ambiente de trabalho',
      'Manter coerência visual e de tom de voz em todos os canais',
      'Responder a críticas com transparência, humildade e rapidez',
      'Promover a empresa através da excelência do serviço prestado',
      'Garantir que o marketing não prometa o que a operação não entrega',
      'Utilizar a marca para promover valores positivos na sociedade',
      'Treinar porta-vozes para refletirem os princípios da organização',
      'Monitorar a reputação da marca constantemente em fóruns e redes'
    ]
  },
  {
    id: 'mkt_2',
    name: 'Excelência',
    description: 'Fazer com dedicação e máxima qualidade.',
    axis: 'Marketing',
    reference: 'Colossenses 3:23',
    businessApplication: 'Fazer tudo como para o Senhor na comunicação e design.',
    risksWhenNeglected: ['Comunicação amadora', 'Perda de valor percebido', 'Mensagens ineficazes'],
    practicalRecommendations: [
      'Manter um alto padrão de qualidade visual em todas as peças',
      'Realizar revisão ortográfica e gramatical rigorosa em textos',
      'Investir em branding profissional para fortalecer a identidade',
      'Utilizar tecnologias modernas de marketing e automação',
      'Garantir que a experiência do usuário (UX) seja impecável',
      'Produzir conteúdo educativo de altíssima relevância para o público',
      'Personalizar a comunicação para cada segmento de cliente',
      'Manter consistência de marca em todos os pontos de contato',
      'Utilizar imagens e vídeos de alta produção e bom gosto',
      'Monitorar métricas de desempenho para melhoria contínua',
      'Contratar os melhores talentos e agências para execução',
      'Buscar a perfeição nos detalhes que o cliente nem sempre nota'
    ]
  },
  {
    id: 'mkt_3',
    name: 'Verdade no Comunicar',
    description: 'Falar a verdade uns aos outros.',
    axis: 'Marketing',
    reference: 'Efésios 4:15',
    businessApplication: 'Marketing ético, sem engano.',
    risksWhenNeglected: ['Propaganda enganosa', 'Perda de credibilidade', 'Insatisfação de clientes'],
    practicalRecommendations: [
      'Praticar total transparência em ofertas, preços e condições',
      'Evitar promessas irrealistas ou exageradas em anúncios',
      'Ser claro sobre limitações de produtos ou serviços',
      'Corrigir imediatamente qualquer erro de comunicação pública',
      'Utilizar dados verificáveis para fundamentar alegações de marketing',
      'Garantir que letras miúdas não escondam termos abusivos',
      'Evitar táticas de marketing de escassez ou urgência falsas',
      'Respeitar a privacidade e os dados do consumidor (LGPD)',
      'Promover uma comunicação inclusiva e respeitosa com todos',
      'Ser honesto sobre a origem e processos de fabricação',
      'Não falar mal da concorrência, mas focar em suas próprias virtudes',
      'Manter um canal aberto para dúvidas sobre as comunicações'
    ]
  },
  {
    id: 'mkt_4',
    name: 'Influência Positiva',
    description: 'Ser sal e luz no mercado.',
    axis: 'Marketing',
    reference: 'Mateus 5:13',
    businessApplication: 'Ser uma influência positiva e transformadora.',
    risksWhenNeglected: ['Falta de impacto social', 'Comunicação vazia de propósito', 'Irrelevância'],
    practicalRecommendations: [
      'Implementar estratégias de marketing de causa genuínas',
      'Produzir conteúdo que inspire e eleve o nível moral do mercado',
      'Posicionar a marca claramente em relação a valores éticos',
      'Utilizar os canais da empresa para educar e informar a sociedade',
      'Promover campanhas de conscientização sobre temas relevantes',
      'Apoiar influenciadores que compartilham dos mesmos princípios',
      'Evitar associar a marca a conteúdos degradantes ou polêmicos',
      'Ser um exemplo de ética publicitária para o setor',
      'Criar comunidades de aprendizado e troca entre clientes',
      'Utilizar o lucro para financiar comunicações de bem social',
      'Incentivar o consumo consciente através das mensagens',
      'Ser reconhecido como uma marca que "faz o bem"'
    ]
  },

  // Eixo: Comercial
  {
    id: 'com_1',
    name: 'Fidelidade',
    description: 'Ser fiel nas pequenas e grandes coisas.',
    axis: 'Comercial',
    reference: 'Lucas 16:10',
    businessApplication: 'Fiel no pouco, fiel no muito no relacionamento com clientes.',
    risksWhenNeglected: ['Perda de clientes', 'Falta de recompra', 'Foco apenas no fechamento, não na entrega'],
    practicalRecommendations: [
      'Cumprir rigorosamente todos os prazos e acordos firmados',
      'Dar atenção máxima aos pequenos clientes, não apenas aos grandes',
      'Garantir consistência na qualidade do atendimento pós-venda',
      'Resolver problemas e reclamações com agilidade e presteza',
      'Manter histórico detalhado e atualizado de cada interação (CRM)',
      'Ser proativo em avisar sobre possíveis atrasos ou imprevistos',
      'Garantir que o vendedor acompanhe a entrega final do que vendeu',
      'Treinar a equipe de vendas para priorizar a verdade sobre a comissão',
      'Oferecer garantias reais e honrá-las sem burocracia excessiva',
      'Recompensar a lealdade dos clientes de longa data',
      'Manter a mesma qualidade de atendimento em todos os canais',
      'Ser honesto quando o seu produto não for a melhor solução'
    ]
  },
  {
    id: 'com_2',
    name: 'Abundância',
    description: 'Trazer vida em abundância.',
    axis: 'Comercial',
    reference: 'João 10:10',
    businessApplication: 'Prosperidade sustentável com propósito.',
    risksWhenNeglected: ['Foco excessivo no lucro de curto prazo', 'Exploração de clientes', 'Relações ganha-perde'],
    practicalRecommendations: [
      'Focar em gerar valor real e transformador para o cliente',
      'Estruturar modelos de negócios baseados em ganha-ganha',
      'Manter uma visão de longo prazo nas parcerias comerciais',
      'Evitar a mentalidade de escassez e focar na expansão de mercado',
      'Compartilhar conhecimentos que ajudem o cliente a crescer',
      'Oferecer soluções que realmente resolvam as dores do cliente',
      'Promover a abundância na rede de fornecedores e parceiros',
      'Não explorar a vulnerabilidade de um cliente em crise',
      'Garantir que o sucesso do cliente seja o seu sucesso',
      'Incentivar a generosidade comercial (bônus, descontos reais)',
      'Buscar a sustentabilidade financeira como meio de gerar mais vida',
      'Celebrar o crescimento mútuo em cada contrato renovado'
    ]
  },
  {
    id: 'com_3',
    name: 'Justiça no Preço',
    description: 'Usar balanças e pesos justos.',
    axis: 'Comercial',
    reference: 'Levítico 19:35-36',
    businessApplication: 'Precificação ética, sem exploração.',
    risksWhenNeglected: ['Precificação abusiva', 'Perda de confiança', 'Guerra de preços'],
    practicalRecommendations: [
      'Garantir transparência total na composição de preços e taxas',
      'Cobrar um valor compatível with o benefício entregue',
      'Evitar cobranças ocultas ou taxas surpresas no final',
      'Praticar preços justos mesmo em situações de alta demanda',
      'Ser ético na precificação comparativa with a concorrência',
      'Oferecer condições de pagamento que não asfixiem o cliente',
      'Revisar custos para manter preços competitivos e honestos',
      'Não realizar dumping para destruir concorrentes',
      'Garantir que a margem de lucro seja justa para o reinvestimento',
      'Ser claro sobre o que está e o que não está incluso no preço',
      'Oferecer opções de entrada para diferentes perfis econômicos',
      'Monitorar a percepção de valor x preço constantemente'
    ]
  },
  {
    id: 'com_4',
    name: 'Relacionamento',
    description: 'O ferro afia o ferro.',
    axis: 'Comercial',
    reference: 'Provérbios 27:17',
    businessApplication: 'CRM como cuidado real com clientes.',
    risksWhenNeglected: ['Relações transacionais', 'Desconhecimento das necessidades do cliente', 'Atendimento impessoal'],
    practicalRecommendations: [
      'Conhecer profundamente os desafios e objetivos do negócio do cliente',
      'Praticar o atendimento consultivo, agregando inteligência',
      'Construir parcerias de longo prazo baseadas em confiança mútua',
      'Realizar visitas ou reuniões de relacionamento sem viés de venda',
      'Personalizar a jornada do cliente de acordo com seu perfil',
      'Criar comunidades ou grupos de troca entre seus clientes',
      'Enviar conteúdos e ferramentas úteis fora do ciclo de venda',
      'Lembrar de datas importantes e marcos na história do cliente',
      'Promover encontros de networking entre seus próprios parceiros',
      'Pedir feedback sincero e atuar sobre as sugestões recebidas',
      'Ser um facilitador de conexões para o seu cliente',
      'Manter um tom de voz humano e empático em todos os contatos'
    ]
  },

  // Eixo: Operação
  {
    id: 'op_1',
    name: 'Diligência',
    description: 'A alma do diligente prospera.',
    axis: 'Operação',
    reference: 'Provérbios 13:4',
    businessApplication: 'Eficiência e comprometimento na execução.',
    risksWhenNeglected: ['Atrasos', 'Baixa produtividade', 'Desperdício de tempo'],
    practicalRecommendations: [
      'Estabelecer metas operacionais claras e desafiadoras',
      'Acompanhar indicadores de produtividade em tempo real',
      'Cultivar uma cultura de execução e entrega no prazo',
      'Eliminar distrações e gargalos no fluxo de trabalho',
      'Premiar a proatividade e o esforço acima da média',
      'Garantir que cada colaborador entenda sua importância no fluxo',
      'Treinar a equipe em técnicas de gestão do tempo e foco',
      'Realizar reuniões de alinhamento diárias curtas (dailies)',
      'Manter o ambiente de trabalho propício à concentração',
      'Combater a procrastinação através de prazos intermediários',
      'Garantir que os recursos necessários estejam sempre disponíveis',
      'Revisar processos lentos para ganhar agilidade operacional'
    ]
  },
  {
    id: 'op_2',
    name: 'Ordem Operacional',
    description: 'Que tudo seja feito com decência e ordem.',
    axis: 'Operação',
    reference: '1 Coríntios 14:40',
    businessApplication: 'Processos padronizados e organizados.',
    risksWhenNeglected: ['Retrabalho', 'Erros operacionais', 'Falta de escalabilidade'],
    practicalRecommendations: [
      'Implementar sistemas de gestão integrados (ERP/MES)',
      'Organizar o espaço físico e digital seguindo o 5S',
      'Padronizar todas as tarefas rotineiras e críticas',
      'Manter registros claros de todas as etapas de produção',
      'Garantir que a documentação técnica esteja sempre atualizada',
      'Utilizar sinalizações visuais claras (Kanban) no ambiente',
      'Controlar rigorosamente os acessos e permissões de sistemas',
      'Realizar inventários periódicos de ativos e materiais',
      'Estabelecer fluxos de aprovação claros para cada etapa',
      'Manter o histórico de manutenção de máquinas e softwares',
      'Garantir a limpeza e organização constante dos postos de trabalho',
      'Simplificar processos complexos para reduzir chances de erro'
    ]
  },
  {
    id: 'op_3',
    name: 'Mordomia dos Recursos',
    description: 'Ser achado fiel na administração do que lhe foi confiado.',
    axis: 'Operação',
    reference: '1 Coríntios 4:2',
    businessApplication: 'Gestão fiel dos recursos e ativos produtivos.',
    risksWhenNeglected: ['Desperdício de matéria-prima', 'Má conservação de equipamentos', 'Custos operacionais elevados'],
    practicalRecommendations: [
      'Implementar manutenção preventiva rigorosa em todos os ativos',
      'Controlar o consumo de insumos with metas de redução de perdas',
      'Otimizar o uso de energia, água e outros recursos naturais',
      'Treinar a equipe para cuidar do patrimônio como se fosse seu',
      'Utilizar indicadores de rendimento de matéria-prima',
      'Reutilizar ou reciclar materiais sempre que possível',
      'Evitar estoques excessivos que geram perdas e custos fixos',
      'Investir em equipamentos de alta eficiência e durabilidade',
      'Realizar auditorias de desperdício em toda a cadeia produtiva',
      'Padronizar o uso de materiais para evitar compras desnecessárias',
      'Garantir o armazenamento correto para evitar deterioração',
      'Promover a consciência de custo em todos os níveis operacionais'
    ]
  },
  {
    id: 'op_4',
    name: 'Sustentabilidade',
    description: 'Guardar e cultivar.',
    axis: 'Operação',
    reference: 'Gênesis 2:15',
    businessApplication: 'Operação ecologicamente e socialmente responsável.',
    risksWhenNeglected: ['Impacto ambiental negativo', 'Problemas with comunidade local', 'Insustentabilidade a longo prazo'],
    practicalRecommendations: [
      'Adotar práticas ESG (Environmental, Social, and Governance)',
      'Reduzir a emissão de carbono e poluentes na operação',
      'Garantir a destinação correta de todos os resíduos produzidos',
      'Priorizar fornecedores with certificações de sustentabilidade',
      'Investir em fontes de energia renováveis para a operação',
      'Promover a economia circular dentro dos processos da empresa',
      'Engajar em projetos de preservação ambiental locais',
      'Reduzir o uso de plásticos e materiais não biodegradáveis',
      'Monitorar o impacto social da operação na comunidade vizinha',
      'Treinar colaboradores sobre práticas de vida sustentável',
      'Obter e manter certificações ambientais relevantes (ISO 14001)',
      'Garantir que o crescimento operacional não degrade o entorno'
    ]
  },
  {
    id: 'op_5',
    name: 'Qualidade',
    description: 'Fazer com toda a força.',
    axis: 'Operação',
    reference: 'Eclesiastes 9:10',
    businessApplication: 'Excelência na entrega do produto ou serviço.',
    risksWhenNeglected: ['Produtos defeituosos', 'Insatisfação do cliente', 'Aumento de devoluções/reclamações'],
    practicalRecommendations: [
      'Implementar rigorosos processos de controle de qualidade (CQ)',
      'Promover a cultura de melhoria contínua (Kaizen)',
      'Capacitar tecnicamente a equipe de forma constante',
      'Utilizar ferramentas estatísticas para monitorar a qualidade',
      'Realizar testes exaustivos antes da entrega final',
      'Ouvir o cliente para definir o padrão de qualidade esperado',
      'Paralisar a produção imediatamente ao detectar falhas graves',
      'Investir em tecnologia que reduza a variabilidade humana',
      'Manter rastreabilidade total de lotes e serviços prestados',
      'Incentivar o "zero erro" através de processos de Poka-Yoke',
      'Avaliar fornecedores pela qualidade constante do que entregam',
      'Celebrar o alcance de metas de qualidade sem defeitos'
    ]
  }
];

export interface SacerdotalRule {
  id: string;
  condition: (data: any) => boolean;
  principleId: string;
  misalignment: string;
  impact: string;
  recommendation: string;
  orientation: string;
}

// Engine de regras para avaliar indicadores financeiros
export const SACERDOTAL_FINANCIAL_RULES: SacerdotalRule[] = [
  {
    id: 'rule_fin_liquidez',
    condition: (metrics: any) => (metrics.liquidezCorrente && metrics.liquidezCorrente < 1.0),
    principleId: 'fin_2', // Prudência Financeira
    misalignment: 'Liquidez crítica indica ausência de reservas estratégicas e planejamento para imprevistos.',
    impact: 'Vulnerabilidade operacional e alta dependência de crédito emergencial (caro).',
    recommendation: 'Constituir reserva mínima de caixa para cobrir despesas de curto prazo.',
    orientation: 'Nível Básico → Intermediário'
  },
  {
    id: 'rule_fin_endividamento',
    condition: (metrics: any) => (metrics.alavancagem && metrics.alavancagem > 3.0),
    principleId: 'fin_4', // Dívida Consciente
    misalignment: 'Nível de endividamento (Alavancagem Dívida/EBITDA) acima de limites saudáveis.',
    impact: 'Comprometimento excessivo do fluxo de caixa com serviço da dívida, limitando crescimento sustentável.',
    recommendation: 'Reestruturar dívidas, alongar prazos ou reduzir alavancagem com geração de caixa.',
    orientation: 'Atenção Crítica → Estabilização'
  },
  {
    id: 'rule_fin_margem_ebitda',
    condition: (metrics: any) => (metrics.ebitdaMargin && metrics.ebitdaMargin < 5.0),
    principleId: 'op_1', // Diligência (pode ser visto como operacional/eficiência)
    misalignment: 'Baixa geração de caixa operacional indica ineficiência na gestão de custos ou precificação.',
    impact: 'Incapacidade de sustentar a operação e gerar valor a longo prazo.',
    recommendation: 'Revisar estrutura de custos e política de precificação para garantir margens saudáveis.',
    orientation: 'Sobrevivência → Sustentabilidade'
  }
];

export const SACERDOTAL_AXIS_RULES: SacerdotalRule[] = [
  ...SACERDOTAL_FINANCIAL_RULES,
  // Regras de Cultura
  {
    id: 'rule_cult_turnover',
    condition: (metrics: any) => (metrics['Turnover'] !== undefined && metrics['Turnover'] > 5.0),
    principleId: 'cult_1', // Honra
    misalignment: 'Turnover elevado sugere falha na valorização e retenção de talentos.',
    impact: 'Perda de conhecimento organizacional e alto custo de reposição.',
    recommendation: 'Revisar políticas de reconhecimento e clima organizacional.',
    orientation: 'Atenção'
  },
  {
    id: 'rule_cult_enps',
    condition: (metrics: any) => (metrics['eNPS (Clima)'] !== undefined && metrics['eNPS (Clima)'] < 50),
    principleId: 'cult_5', // Cuidado
    misalignment: 'Baixo eNPS aponta para insatisfação e falta de cuidado com as equipes.',
    impact: 'Desengajamento e potencial risco trabalhista.',
    recommendation: 'Implementar ações de bem-estar e escuta ativa (pesquisas de pulso).',
    orientation: 'Alerta Crítico'
  },
  // Regras de Marketing
  {
    id: 'rule_mkt_cpl',
    condition: (metrics: any) => (metrics['Custo por Lead (CPL)'] !== undefined && metrics['Custo por Lead (CPL)'] > 100),
    principleId: 'mkt_2', // Excelência
    misalignment: 'Custo de aquisição alto pode refletir comunicação ineficiente ou falta de foco.',
    impact: 'Desperdício de orçamento de marketing.',
    recommendation: 'Otimizar canais de mídia e melhorar o direcionamento de anúncios.',
    orientation: 'Atenção'
  },
  // Regras de Comercial
  {
    id: 'rule_com_conversao',
    condition: (metrics: any) => (metrics['Taxa de Conversão'] !== undefined && metrics['Taxa de Conversão'] < 10),
    principleId: 'com_4', // Relacionamento
    misalignment: 'Baixa conversão aponta para falta de conexão real com as dores do cliente.',
    impact: 'Funil de vendas ineficiente e desperdício de leads.',
    recommendation: 'Treinar equipe para vendas consultivas e focar no relacionamento.',
    orientation: 'Alerta'
  },
  // Regras de Operacional
  {
    id: 'rule_op_oee',
    condition: (metrics: any) => (metrics['OEE (Eficiência)'] !== undefined && metrics['OEE (Eficiência)'] < 75),
    principleId: 'op_1', // Diligência
    misalignment: 'Baixa eficiência operacional reflete gargalos e falta de diligência na produção.',
    impact: 'Capacidade ociosa e atrasos na entrega.',
    recommendation: 'Mapear fluxo de valor e eliminar desperdícios na linha de produção.',
    orientation: 'Melhoria Contínua'
  },
  // Regras de Governança
  {
    id: 'rule_gov_maturidade',
    condition: (metrics: any) => (metrics['Índice de Maturidade'] !== undefined && metrics['Índice de Maturidade'] < 60),
    principleId: 'gov_6', // Ordem
    misalignment: 'Baixa maturidade corporativa indica ausência de processos estruturados.',
    impact: 'Riscos de compliance e ineficiência de gestão.',
    recommendation: 'Documentar processos chave e instituir governança básica.',
    orientation: 'Atenção'
  }
];

// Estrutura para Avaliação de Alinhamento Sacerdotal
export interface AssessmentQuestion {
  id: string;
  text: string;
  principleId: string;
  weight: number;
}

export interface AssessmentAxis {
  axis: EixoGestao;
  questions: AssessmentQuestion[];
}

export const SACERDOTAL_ALIGNMENT_ASSESSMENT: AssessmentAxis[] = [
  {
    axis: 'Governança',
    questions: [
      { id: 'q_gov_1', text: 'As decisões críticas são tomadas com integridade e transparência documentada?', principleId: 'gov_1', weight: 1 },
      { id: 'q_gov_2', text: 'Existe um conselho plural ou comitê que valida as grandes estratégias?', principleId: 'gov_2', weight: 1 },
      { id: 'q_gov_3', text: 'Há rituais claros de prestação de contas (Accountability) em todos os níveis?', principleId: 'gov_3', weight: 1 },
      { id: 'q_gov_4', text: 'As promoções e remunerações são percebidas como justas e meritocráticas?', principleId: 'gov_4', weight: 1 },
      { id: 'q_gov_5', text: 'A empresa busca sabedoria externa e dados antes de grandes movimentos?', principleId: 'gov_5', weight: 1 },
      { id: 'q_gov_6', text: 'Os processos estão em ordem e devidamente mapeados?', principleId: 'gov_6', weight: 1 },
      { id: 'q_gov_7', text: 'Há espaço para escuta ativa e discernimento calmo antes de agir?', principleId: 'gov_7', weight: 1 },
      { id: 'q_gov_8', text: 'A liderança recebe acompanhamento ou mentoria para sua saúde emocional/espiritual?', principleId: 'gov_8', weight: 1 },
      { id: 'q_gov_9', text: 'A empresa atua como um agente de serviço para a prosperidade da cidade local?', principleId: 'gov_9', weight: 1 }
    ]
  },
  {
    axis: 'Cultura',
    questions: [
      { id: 'q_cult_1', text: 'A cultura de honra e reconhecimento é praticada genuinamente?', principleId: 'cult_1', weight: 1 },
      { id: 'q_cult_2', text: 'As equipes trabalham em unidade, sem silos ou conflitos ocultos?', principleId: 'cult_2', weight: 1 },
      { id: 'q_cult_3', text: 'A liderança é servidora, focada em remover obstáculos para o time?', principleId: 'cult_3', weight: 1 },
      { id: 'q_cult_4', text: 'A comunicação é baseada na verdade e transparência total?', principleId: 'cult_4', weight: 1 },
      { id: 'q_cult_5', text: 'Existe um cuidado real com o desenvolvimento e bem-estar das pessoas?', principleId: 'cult_5', weight: 1 },
      { id: 'q_cult_6', text: 'O ritmo de trabalho permite descanso e renovação sustentável?', principleId: 'cult_6', weight: 1 }
    ]
  },
  {
    axis: 'Gestão',
    questions: [
      { id: 'q_fin_1', text: 'Há mordomia financeira rigorosa e separação de contas?', principleId: 'fin_1', weight: 1 },
      { id: 'q_fin_2', text: 'A empresa mantém reservas (prudência) para tempos difíceis?', principleId: 'fin_2', weight: 1 },
      { id: 'q_fin_3', text: 'O crescimento financeiro é sustentável e sem atalhos?', principleId: 'fin_3', weight: 1 },
      { id: 'q_fin_4', text: 'As dívidas são conscientes, planejadas e produtivas?', principleId: 'fin_4', weight: 1 },
      { id: 'q_fin_5', text: 'Existe uma cultura de generosidade e retorno social (dízimo corporativo)?', principleId: 'fin_5', weight: 1 },
      { id: 'q_fin_6', text: 'O capital é investido para frutificar e gerar novos resultados?', principleId: 'fin_6', weight: 1 },
      { id: 'q_fin_7', text: 'A contabilidade e os impostos são tratados com transparência total?', principleId: 'fin_7', weight: 1 },
      { id: 'q_fin_8', text: 'Os resultados são distribuídos de forma justa e equilibrada?', principleId: 'fin_8', weight: 1 }
    ]
  },
  {
    axis: 'Inovação',
    questions: [
      { id: 'q_inov_1', text: 'A criatividade é incentivada e tem espaço para florescer?', principleId: 'inov_1', weight: 1 },
      { id: 'q_inov_2', text: 'Novas ideias passam por um filtro de prudência e viabilidade?', principleId: 'inov_2', weight: 1 },
      { id: 'q_inov_3', text: 'Existe persistência para "semear" e aguardar o tempo da colheita na inovação?', principleId: 'inov_3', weight: 1 },
      { id: 'q_inov_4', text: 'A empresa tem ousadia para arriscar em novos mercados e tecnologias?', principleId: 'inov_4', weight: 1 }
    ]
  },
  {
    axis: 'Marketing',
    questions: [
      { id: 'q_mkt_1', text: 'O testemunho (reputação) da marca reflete seus valores internos?', principleId: 'mkt_1', weight: 1 },
      { id: 'q_mkt_2', text: 'A comunicação e design buscam a excelência em todos os detalhes?', principleId: 'mkt_2', weight: 1 },
      { id: 'q_mkt_3', text: 'As promessas de marketing são absolutamente verdadeiras e sem enganos?', principleId: 'mkt_3', weight: 1 },
      { id: 'q_mkt_4', text: 'A marca exerce uma influência positiva e transformadora no mercado?', principleId: 'mkt_4', weight: 1 }
    ]
  },
  {
    axis: 'Comercial',
    questions: [
      { id: 'q_com_1', text: 'A empresa é fiel nos compromissos com todos os clientes, pequenos ou grandes?', principleId: 'com_1', weight: 1 },
      { id: 'q_com_2', text: 'O foco comercial é trazer abundância e valor real para a vida do cliente?', principleId: 'com_2', weight: 1 },
      { id: 'q_com_3', text: 'A precificação é justa e ética, sem exploração de vulnerabilidades?', principleId: 'com_3', weight: 1 },
      { id: 'q_com_4', text: 'As vendas são baseadas em relacionamento consultivo e confiança?', principleId: 'com_4', weight: 1 }
    ]
  },
  {
    axis: 'Operação',
    questions: [
      { id: 'q_op_1', text: 'A operação é diligente, eficiente e comprometida com prazos?', principleId: 'op_1', weight: 1 },
      { id: 'q_op_2', text: 'Há ordem e padronização nos processos produtivos?', principleId: 'op_2', weight: 1 },
      { id: 'q_op_3', text: 'Existe uma mordomia fiel dos recursos e ativos da empresa?', principleId: 'op_3', weight: 1 },
      { id: 'q_op_4', text: 'A operação busca sustentabilidade e menor impacto negativo?', principleId: 'op_4', weight: 1 },
      { id: 'q_op_5', text: 'A qualidade é perseguida com "toda a força" em cada entrega?', principleId: 'op_5', weight: 1 }
    ]
  }
];

export function getPrincipleById(id: string): SacerdotalPrinciple | undefined {
  return SACERDOTAL_PRINCIPLES.find(p => p.id === id);
}

export function evaluateFinancialRules(metrics: any): (SacerdotalRule & { principle: SacerdotalPrinciple })[] {
  const triggeredRules = SACERDOTAL_FINANCIAL_RULES.filter(rule => {
    try {
      return rule.condition(metrics);
    } catch (e) {
      return false;
    }
  });

  return triggeredRules.map(rule => ({
    ...rule,
    principle: getPrincipleById(rule.principleId)!
  })).filter(r => r.principle !== undefined);
}

export function evaluateAxisRules(metrics: any, axis: string): (SacerdotalRule & { principle: SacerdotalPrinciple })[] {
  const axisRules = SACERDOTAL_AXIS_RULES.filter(r => {
    const p = getPrincipleById(r.principleId);
    return p && p.axis === axis;
  });

  const triggeredRules = axisRules.filter(rule => {
    try {
      return rule.condition(metrics);
    } catch (e) {
      return false;
    }
  });

  return triggeredRules.map(rule => ({
    ...rule,
    principle: getPrincipleById(rule.principleId)!
  }));
}

// Cálculo do Score de Alinhamento (simplificado para demonstração)
export function calculateSacerdotalAlignmentScore(data: any): number {
  let score = 50; 
  
  if (data.hasMVV) score += 10;
  if (data.hasCompliance) score += 10;
  if (data.liquidezCorrente > 1.2) score += 10;
  if (data.turnoverBaixo) score += 10;
  if (data.ebitdaMargin > 15) score += 10;

  return Math.min(100, score);
}
