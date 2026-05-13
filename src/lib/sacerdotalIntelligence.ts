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
  relatedIndicators: string[];
  maturityLevel: 'Incipiente' | 'Básico' | 'Intermediário' | 'Avançado' | 'Master';
  executiveSuggestions: string[];
  // Novos campos para Motor de Maturidade
  weight: 1 | 2 | 3 | 4 | 5;
  maturityQuestion: string;
  expectedEvidences: string[];
  crossAxisImpact?: string;
}

export const SACERDOTAL_PRINCIPLES: SacerdotalPrinciple[] = [
  // Eixo: Governança Corporativa
  {
    id: 'gov_1',
    name: 'Integridade Inabalável',
    description: 'A integridade dos retos os guia, mas a falsidade dos pérfidos os destrói.',
    axis: 'Governança Corporativa',
    reference: 'Provérbios 11:3',
    businessApplication: 'Cultura de transparência total e ética radical em todos os níveis decisórios.',
    risksWhenNeglected: ['Corrupção passiva/ativa', 'Perda de reputação institucional', 'Passivos jurídicos graves'],
    practicalRecommendations: [
      'Implementar canal de denúncias externo e independente',
      'Auditorias de conformidade ética semestrais',
      'Código de conduta revisado e assinado anualmente',
      'Transparência radical em atas de conselho',
      'Processos de procurement com triple-check',
      'Treinamento de compliance para novos líderes',
      'Políticas de conflito de interesses documentadas',
      'Background check para cargos de confiança',
      'Relatório de transparência pública para sócios',
      'Conselho de ética com membros externos',
      'Cláusulas anticorrupção em todos os contratos',
      'Cultura de admissão de erro sem punição'
    ],
    relatedIndicators: ['Índice de Compliance', 'Nº de Incidentes Éticos', 'Taxa de Auditorias Limpas'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Instituir o cargo de Chief Integrity Officer', 'Vincular bônus à conformidade ética'],
    weight: 5,
    maturityQuestion: 'As decisões estratégicas são tomadas e registradas com integridade, transparência e coerência ética mesmo sob pressão?',
    expectedEvidences: ['Código de Ética', 'Relatórios de Auditoria', 'Atas Registradas', 'Canal de Denúncias'],
    crossAxisImpact: 'Influencia a Cultura e a Gestão de Marketing (Reputação)'
  },
  {
    id: 'gov_2',
    name: 'Conselho Plural e Sábio',
    description: 'Não havendo sábia direção, o povo cai, mas na multidão de conselheiros há segurança.',
    axis: 'Governança Corporativa',
    reference: 'Provérbios 11:14',
    businessApplication: 'Estruturação de board com diversidade de pensamento e independência.',
    risksWhenNeglected: ['Visão de túnel (ego)', 'Decisões enviesadas', 'Fragilidade estratégica'],
    practicalRecommendations: [
      'Criar conselho consultivo com membros externos',
      'Limitar tempo de mandato dos conselheiros',
      'Garantir diversidade de competências no board',
      'Rituais de mentoria reversa para o board',
      'Acesso do conselho a dados crus (sem filtro)',
      'Avaliação anual de performance do conselho',
      'Comitês técnicos de apoio (financeiro/gente)',
      'Reuniões de board fora da sede (offsite)',
      'Atas deliberativas públicas para stakeholders',
      'Incentivar a discordância construtiva',
      'Conselho de intercessores ou mentores morais',
      'Planejamento de sucessão do próprio conselho'
    ],
    relatedIndicators: ['Diversidade do Board', 'Eficiência Decisória', 'Nº de Reuniões de Conselho'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Aumentar o peso de conselheiros independentes', 'Criar comitê de estratégia separado'],
    weight: 4,
    maturityQuestion: 'A empresa possui um conselho plural ou comitê consultivo que valida as grandes estratégias e evita decisões monocráticas?',
    expectedEvidences: ['Atas de Reunião', 'Contratos de Conselheiros', 'Regimento Interno'],
    crossAxisImpact: 'Impacta na Gestão de Inovação e Administração e Finanças'
  },
  {
    id: 'gov_3',
    name: 'Accountability Radical',
    description: 'Assim, cada um de nós prestará contas de si mesmo a Deus.',
    axis: 'Governança Corporativa',
    reference: 'Romanos 14:12',
    businessApplication: 'Criação de rituais de prestação de contas que eliminam a ocultação de erros.',
    risksWhenNeglected: ['Cultura de desculpas', 'Ineficiência operacional', 'Desperdício de capital'],
    practicalRecommendations: [
      'Reuniões mensais de prestação de contas (RPR)',
      'Dashboards em tempo real por gestor',
      'Matriz de responsabilidade RACI clara',
      'Feedback 360 focado em entregas reais',
      'Publicação de indicadores internos de falhas',
      'Incentivo à autoavaliação crítica',
      'Consequências claras para metas não atingidas',
      'Transparência de remuneração variável',
      'Sistemas de ERP integrados sem silos',
      'Auditoria de processos por amostragem',
      'Cultura de "donos" de indicadores',
      'Relatórios de impacto para investidores'
    ],
    relatedIndicators: ['Meta vs Realizado', 'Nível de Responsabilização', 'Delay em Reportes'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Automatizar 100% dos reportes financeiros', 'Instituir rituais de debriefing de falhas'],
    weight: 5,
    maturityQuestion: 'Há rituais claros de prestação de contas (Accountability) em todos os níveis, com registro de falhas e aprendizados?',
    expectedEvidences: ['Dashboards Ativos', 'Atas de RPR', 'Controle de Metas'],
    crossAxisImpact: 'Vital para Administração e Finanças'
  },
  {
    id: 'gov_4',
    name: 'Equidade e Justiça',
    description: 'Ele te declarou, ó homem, o que é bom e que é o que o Senhor pede de ti: que prides a justiça.',
    axis: 'Governança Corporativa',
    reference: 'Miquéias 6:8',
    businessApplication: 'Sistemas de mérito e remuneração que honram o esforço e o resultado de forma justa.',
    risksWhenNeglected: ['Desmotivação em massa', 'Fuga de talentos chave', 'Litígios trabalhistas'],
    practicalRecommendations: [
      'Grade salarial baseada em benchmarks de mercado',
      'Critérios de promoção 100% objetivos',
      'Auditoria de equidade de gênero e raça',
      'Canal de ouvidoria para injustiças internas',
      'PLR proporcional ao impacto real',
      'Reconhecimento público de mérito extra',
      'Programas de stock options para key players',
      'Avaliação de desempenho sem vieses',
      'Benefícios flexíveis por necessidade',
      'Transparência nos critérios de bônus',
      'Apoio jurídica e social ao colaborador',
      'Justiça na seleção de fornecedores'
    ],
    relatedIndicators: ['Índice de Turnovers', 'Gini Interno', 'Clima de Justiça'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Realizar auditoria anual de equidade salarial', 'Implementar comitê de meritocracia'],
    weight: 5,
    maturityQuestion: 'As promoções e remunerações são percebidas como justas, meritocráticas e fundamentadas em critérios objetivos e transparentes?',
    expectedEvidences: ['Plano de Cargos e Salários', 'Relatório de Equidade', 'Critérios de PLR'],
    crossAxisImpact: 'Impacto direto na Cultura Organizacional'
  },
  {
    id: 'gov_5',
    name: 'Discernimento Estratégico',
    description: 'Se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente.',
    axis: 'Governança Corporativa',
    reference: 'Tiago 1:5',
    businessApplication: 'Uso de dados, oração e conselho para decisões de alto impacto.',
    risksWhenNeglected: ['Decisões impulsivas', 'Erros de investimento fatais', 'Perda de timing de mercado'],
    practicalRecommendations: [
      'Pausa obrigatória de 48h para decisões críticas',
      'Uso intensivo de BI e Predição de Dados',
      'Consultas formais a especialistas externos',
      'Workshops de cenário (What-if)',
      'Oração e reflexão silenciosa coletiva',
      'Documentar a lógica por trás da decisão',
      'Realizar post-mortem de decisões passadas',
      'Evitar decisões sob pressão extrema',
      'Buscar a paz interior como sinal de validação',
      'Testar hipóteses em escala reduzida',
      'Mentoria para alta liderança',
      'Aprender com falhas de concorrentes'
    ],
    relatedIndicators: ['ROI de Decisões Críticas', 'Precisão de Forecast', 'Nº de Pivôs Estratégicos'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Implementar ritual de "pré-morte" de projetos', 'Contratar BI de alta performance'],
    weight: 4,
    maturityQuestion: 'A empresa busca sabedoria, dados e discernimento calmo antes de grandes movimentos estratégicos?',
    expectedEvidences: ['Estudos de Viabilidade', 'Mapas de Risco', 'Relatórios de BI'],
    crossAxisImpact: 'Impacta na Gestão de Inovação'
  },
  {
    id: 'gov_6',
    name: 'Ordem Institucional',
    description: 'Mas tudo deve ser feito com decência e ordem.',
    axis: 'Governança Corporativa',
    reference: '1 Coríntios 14:40',
    businessApplication: 'Estruturação de processos e governança documentada para escalabilidade.',
    risksWhenNeglected: ['Caos operacional', 'Dependência de pessoas (heróis)', 'Fragilidade em auditorias'],
    practicalRecommendations: [
      'Documentar 100% dos processos críticos',
      'Matriz de alçada decisória automatizada',
      'Gestão eletrônica de documentos (GED)',
      'Padrões visuais de governança (dashboards)',
      'Fluxogramas de processos acessíveis',
      'Rituais de revisão de processos trimestrais',
      'SLA entre departamentos internos',
      'Centralização de contratos em repositório',
      'Manuais de integração de novos sócios',
      'Políticas de segurança da informação',
      'Arquitetura de dados organizada',
      'Compliance regulatório monitorado'
    ],
    relatedIndicators: ['Nível de Burocracia Eficiente', 'Acuracidade de Dados', 'Conformidade de Auditoria'],
    maturityLevel: 'Básico',
    executiveSuggestions: ['Mapear a jornada de valor do cliente', 'Implementar ERP robusto'],
    weight: 3,
    maturityQuestion: 'Os processos críticos estão devidamente mapeados, padronizados e são seguidos com ordem e decência?',
    expectedEvidences: ['Manuais de Processos', 'Organograma Atualizado', 'Fluxogramas'],
    crossAxisImpact: 'Fundamental para a Gestão Operacional'
  },
  {
    id: 'gov_7',
    name: 'Escuta Ativa do Conselho',
    description: 'Seja cada um pronto para ouvir, tardio para falar e tardio para se irar.',
    axis: 'Governança Corporativa',
    reference: 'Tiago 1:19',
    businessApplication: 'Valorização do feedback e do discernimento calmo em ambientes de pressão.',
    risksWhenNeglected: ['Autoritarismo', 'Cegueira coletiva', 'Perda de insights preciosos'],
    practicalRecommendations: [
      'Rodadas de escuta com níveis operacionais',
      'Pesquisas de clima com perguntas abertas',
      'Reuniões de "Town Hall" com Q&A livre',
      'Praticar o silêncio em reuniões críticas',
      'Ouvir clientes detratores pessoalmente',
      'Criar canal de sugestões anônimo',
      'Treinar lideranças em escuta empática',
      'Debriefing de reuniões de board',
      'Incentivar o feedback ascendente',
      'Respeitar o tempo de fala de todos',
      'Anotar insights de todos os stakeholders',
      'Validar o entendimento antes de responder'
    ],
    relatedIndicators: ['Índice de Participação', 'Qualidade do Feedback', 'Nível de Confiança'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Realizar focus groups com colaboradores', 'Mentoria para líderes em Soft Skills'],
    weight: 2,
    maturityQuestion: 'Há espaço para escuta ativa, feedback plural e discernimento calmo antes de agir sob pressão?',
    expectedEvidences: ['Resultados de Pesquisa de Clima', 'Atas de Town Hall', 'Relatórios de Ouvidoria'],
    crossAxisImpact: 'Impacta a Cultura Organizacional'
  },
  {
    id: 'gov_8',
    name: 'Sucessão e Legado',
    description: 'Vinde, filhos, ouvi-me; eu vos ensinarei o temor do Senhor.',
    axis: 'Governança Corporativa',
    reference: 'Salmos 34:11',
    businessApplication: 'Planejamento de continuidade e formação de novas lideranças.',
    risksWhenNeglected: ['Vacuidade de liderança', 'Queda de valor em transições', 'Perda de DNA'],
    practicalRecommendations: [
      'Plano de sucessão para C-Level e Conselho',
      'Identificação de talentos de alto potencial',
      'Programas de mentoria para sucessores',
      'Transição assistida de liderança',
      'Documentar a história e valores da empresa',
      'Desenvolvimento de competências futuras',
      'Governança familiar estruturada (se houver)',
      'Avaliação psicológica de candidatos',
      'Transferência gradual de responsabilidades',
      'Workshops de alinhamento de propósito',
      'Investimento em educação executiva',
      'Celebrar o legado de quem sai'
    ],
    relatedIndicators: ['Readiness de Sucessão', 'Nº de Líderes Formados', 'Estabilidade em Transição'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Criar um programa de trainees executivos', 'Instituir o "Sabbatical" de sucessão'],
    weight: 5,
    maturityQuestion: 'A empresa possui um plano de sucessão claro e rituais que garantem a continuidade dos valores e da operação?',
    expectedEvidences: ['Plano de Sucessão', 'Protocolo de Sócios', 'Manual de Cultura'],
    crossAxisImpact: 'Impacto em todos os eixos a longo prazo'
  },

  // Eixo: Cultura Organizacional
  {
    id: 'cult_1',
    name: 'Cultura de Honra',
    description: 'Amai-vos cordialmente uns aos outros com amor fraternal, preferindo-vos em honra uns aos outros.',
    axis: 'Cultura Organizacional',
    reference: 'Romanos 12:10',
    businessApplication: 'Reconhecimento genuíno e valorização mútua entre todos os níveis da empresa.',
    risksWhenNeglected: ['Clima de desrespeito', 'Turnover de talentos', 'Baixo engajamento'],
    practicalRecommendations: [
      'Rituais de reconhecimento público mensal',
      'Prêmio "Valores da Casa" trimestral',
      'Feedback positivo específico e imediato',
      'Honrar o tempo e os limites do outro',
      'Celebrar anos de casa com presentes significativos',
      'Incentivar a apreciação entre pares',
      'Tratar com honra o colaborador que sai',
      'Respeitar a hierarquia e o conhecimento',
      'Honrar a história dos fundadores',
      'Valorizar a diversidade de talentos',
      'Cuidar da linguagem interna (respeito)',
      'Gestão centrada no ser humano'
    ],
    relatedIndicators: ['eNPS', 'Taxa de Retenção', 'Clima Organizacional'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Implementar programa de Gamificação da Honra', 'Feedback 360 focado em valores'],
    weight: 3,
    maturityQuestion: 'A cultura de honra, gratidão e reconhecimento é praticada genuinamente entre todos os níveis da empresa?',
    expectedEvidences: ['Pautas de Reunião com Reconhecimento', 'Resultados de Pesquisa de Clima', 'Programas de Premiação'],
    crossAxisImpact: 'Impacto direto no Turnover e Retenção'
  },
  {
    id: 'cult_2',
    name: 'Unidade e Harmonia',
    description: 'Oh! Quão bom e quão suave é que os irmãos vivam em união!',
    axis: 'Cultura Organizacional',
    reference: 'Salmos 133:1',
    businessApplication: 'Eliminação de silos e fomento da colaboração radical entre áreas.',
    risksWhenNeglected: ['Guerra de egos entre áreas', 'Lentidão operacional', 'Falta de visão sistêmica'],
    practicalRecommendations: [
      'Metas globais compartilhadas (todos ganham)',
      'Projetos interdepartamentais frequentes',
      'Rituais de integração entre áreas (almoços)',
      'Resolução rápida de conflitos (mediação)',
      'Comunicação transparente para todos',
      'Utilizar ferramentas de colaboração digital',
      'Combater a cultura da culpa (No-blame)',
      'Promover a ajuda mútua espontânea',
      'Unificar a linguagem técnica da empresa',
      'Atividades de Team Building fora da sede',
      'Garantir que a visão seja única e clara',
      'Treinamento de inteligência emocional'
    ],
    relatedIndicators: ['Eficiência Interdepartamental', 'Conflitos Resolvidos', 'Alinhamento com a Visão'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Unificar bônus por resultados globais', 'Rodízio de colaboradores entre áreas'],
    weight: 4,
    maturityQuestion: 'As equipes trabalham em unidade real, sem silos, competições predatórias ou conflitos ocultos entre áreas?',
    expectedEvidences: ['Projetos Interdepartamentais', 'Metas Globais Compartilhadas', 'Rituais de Integração'],
    crossAxisImpact: 'Crucial para a Gestão Operacional'
  },
  {
    id: 'cult_3',
    name: 'Liderança Servidora',
    description: 'Pois o próprio Filho do Homem não veio para ser servido, mas para servir.',
    axis: 'Cultura Organizacional',
    reference: 'Marcos 10:45',
    businessApplication: 'Líderes focados em remover obstáculos para que seus times brilhem.',
    risksWhenNeglected: ['Autoritarismo', 'Desconexão da base', 'Abuso de poder'],
    practicalRecommendations: [
      'Treinar líderes no framework de Serviço',
      'Líderes passam tempo na operação real',
      'Avaliar líderes pelo sucesso do time',
      'Perguntar sempre: "Como posso te ajudar?"',
      'Líder assume tarefas simples em crises',
      'Fomentar a mentoria interna',
      'Liderança pelo exemplo prático',
      'Remover burocracias inúteis',
      'Dar autonomia real às equipes',
      'Celebrar o sucesso como mérito do time',
      'Estar disponível para ouvir dores',
      'Desenvolver sucessores melhores que si'
    ],
    relatedIndicators: ['Aprovação da Liderança', 'Desenvolvimento de Sucessores', 'Autonomia Percebida'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Adotar feedback ascendente obrigatório', 'Bonificar líderes pelo crescimento do time'],
    weight: 5,
    maturityQuestion: 'A liderança é percebida como servidora, focada em remover obstáculos e desenvolver o potencial de cada colaborador?',
    expectedEvidences: ['Avaliação 360º', 'Planos de Desenvolvimento Individual (PDI)', 'Rituais de One-on-One'],
    crossAxisImpact: 'Base fundamental para todos os outros eixos'
  },
  {
    id: 'cult_4',
    name: 'Verdade e Transparência',
    description: 'E conhecereis a verdade, e a verdade vos libertará.',
    axis: 'Cultura Organizacional',
    reference: 'João 8:32',
    businessApplication: 'Comunicação honesta que gera confiança e segurança psicológica.',
    risksWhenNeglected: ['Fofocas e boatos', 'Desconfiança generalizada', 'Ocultação de erros fatais'],
    practicalRecommendations: [
      'Comunicar notícias ruins com rapidez',
      'Transparência total em finanças e metas',
      'Tolerância zero para fofoca interna',
      'Admitir erros da alta gestão publicamente',
      'Canais oficiais de comunicação direta',
      'Reuniões de resultados abertas a todos',
      'Incentivar a franqueza radical com amor',
      'Documentar acordos para evitar dúvidas',
      'Seja claro sobre expectativas de carreira',
      'Evitar agendas ocultas e políticas',
      'Garantir que o "sim" seja "sim"',
      'Feedback direto, nunca pelas costas'
    ],
    relatedIndicators: ['Nível de Confiança', 'Clareza de Comunicação', 'Rapidez de Resposta'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Instituir "Talk to CEO" mensal', 'Publicar dashboard de metas para todos'],
    weight: 5,
    maturityQuestion: 'A comunicação interna é baseada na verdade e transparência radical, eliminando fofocas e agendas ocultas?',
    expectedEvidences: ['Dashboards Públicos', 'Atas de Town Hall', 'Canal de Denúncias'],
    crossAxisImpact: 'Essencial para Governança Corporativa'
  },
  {
    id: 'cult_5',
    name: 'Cuidado Humano Integral',
    description: 'Não olhe cada um somente para o que é seu, mas cada qual também para o que é dos outros.',
    axis: 'Cultura Organizacional',
    reference: 'Filipenses 2:4',
    businessApplication: 'Atenção genuína ao bem-estar físico, mental e espiritual do colaborador.',
    risksWhenNeglected: ['Burnout corporativo', 'Doenças ocupacionais', 'Baixa produtividade'],
    practicalRecommendations: [
      'Programas de saúde mental e terapia',
      'Planos de Desenvolvimento Individual (PDI)',
      'Subsídios para educação e bem-estar',
      'Ergonomia e conforto no trabalho',
      'Apoio a colaboradores em crises pessoais',
      'Promover o equilíbrio vida-trabalho',
      'Investir em espiritualidade e propósito',
      'Espaços de descompressão na sede',
      'Acompanhamento de carreira genuíno',
      'Celebrar marcos pessoais (casamento/filhos)',
      'Escuta ativa para necessidades familiares',
      'Incentivar hábitos saudáveis (esporte)'
    ],
    relatedIndicators: ['Taxa de Burnout', 'Absenteísmo', 'ROI de Treinamento'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Implementar programa de Capelania Corporativa', 'Oferecer "Wellness Credit"'],
    weight: 4,
    maturityQuestion: 'A empresa demonstra cuidado genuíno com o bem-estar integral (físico, mental e espiritual) do colaborador?',
    expectedEvidences: ['PDI Ativos', 'Pesquisa de Clima', 'Programas de Bem-estar'],
    crossAxisImpact: 'Impacta diretamente na Gestão Operacional (Produtividade)'
  },
  {
    id: 'cult_25',
    name: 'Descanso e Renovação',
    description: 'Lembra-te do dia do sábado, para o santificar.',
    axis: 'Cultura Organizacional',
    reference: 'Êxodo 20:8',
    businessApplication: 'Ritmo sustentável que garante produtividade de longo prazo através da renovação.',
    risksWhenNeglected: ['Exaustão crônica', 'Erros operacionais por fadiga', 'High turnover'],
    practicalRecommendations: [
      'Respeito absoluto aos fins de semana',
      'Não enviar mensagens fora do horário',
      'Férias obrigatórias e sem interrupções',
      'Instituir o "Day Off" de aniversário',
      'Pausas curtas obrigatórias durante o dia',
      'Cultura de produtividade, não de horas',
      'Evitar reuniões em horários de transição',
      'Promover hobbies fora do trabalho',
      'Sabbatical para colaboradores seniores',
      'Respeitar o sono e o tempo de família',
      'Celebrar o encerramento de ciclos',
      'Monitorar o excesso de horas extras'
    ],
    relatedIndicators: ['Horas Extras Médias', 'Uso de Férias', 'Engajamento Pós-Descanso'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Proibir reuniões às sextas à tarde', 'Instituir o "Modo Férias" em sistemas'],
    weight: 3,
    maturityQuestion: 'Existe um ritmo sustentável de trabalho que respeita o descanso, evitando o burnout e a exaustão da equipe?',
    expectedEvidences: ['Controle de Horas Extras', 'Cronograma de Férias', 'Políticas de Desconexão'],
    crossAxisImpact: 'Preserva a capacidade de Inovação'
  },
  {
    id: 'cult_26',
    name: 'Alegria e Propósito',
    description: 'E também que todo homem coma e beba, e goze do bem de todo o seu trabalho; é um dom de Deus.',
    axis: 'Cultura Organizacional',
    reference: 'Eclesiastes 3:13',
    businessApplication: 'Conexão do trabalho diário com um propósito maior, gerando satisfação intrínseca.',
    risksWhenNeglected: ['Trabalho mecânico/vazio', 'Falta de significado', 'Baixa inovação'],
    practicalRecommendations: [
      'Comunicar o impacto social do trabalho',
      'Celebrar vitórias com alegria real',
      'Conectar tarefas com a missão da empresa',
      'Ambiente de trabalho leve e positivo',
      'Contar histórias de clientes transformados',
      'Incentivar a diversão ética no escritório',
      'Dar autonomia para criar e contribuir',
      'Alinhamento de valores pessoais e da empresa',
      'Espaço para rir e compartilhar vida',
      'Reconhecer o valor de cada papel',
      'Promover eventos de integração criativos',
      'Incentivar a gratidão diária'
    ],
    relatedIndicators: ['Nível de Felicidade Interna', 'Orgulho de Pertencer', 'Produtividade Criativa'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Implementar "Impact Dashboards"', 'Rituais de gratidão no início de reuniões'],
    weight: 3,
    maturityQuestion: 'O trabalho é realizado com alegria e conectado a um propósito maior que transcende o lucro imediato?',
    expectedEvidences: ['Manifesto de Propósito', 'Relatos de Impacto', 'Eventos de Celebração'],
    crossAxisImpact: 'Fortalece a Gestão de Marketing (Branding)'
  },

  // Eixo: Gestão Financeira e Administrativa
  {
    id: 'fin_1',
    name: 'Mordomia Financeira',
    description: 'Quem é fiel no pouco, também é fiel no muito.',
    axis: 'Administração e Finanças',
    reference: 'Lucas 16:10',
    businessApplication: 'Zelo absoluto pelos recursos da empresa, evitando desperdícios e má gestão.',
    risksWhenNeglected: ['Descontrole de custos', 'Drenagem de lucro', 'Fragilidade de capital'],
    practicalRecommendations: [
      'Separação rigorosa entre sócio e empresa',
      'Controle diário de fluxo de caixa',
      'Orçamento base zero anual',
      'Revisão de despesas fixas mensalmente',
      'Política de gastos e reembolsos clara',
      'Investimento em ativos produtivos',
      'Evitar o "luxo corporativo" desnecessário',
      'Educação financeira para gestores',
      'Gestão de estoque rigorosa',
      'Monitoramento de inadimplência',
      'Auditoria de pagamentos a fornecedores',
      'Zelo pelos bens físicos da empresa'
    ],
    relatedIndicators: ['Margem de Contribuição', 'Custo Fixo/Faturamento', 'Liquidez Corrente'],
    maturityLevel: 'Básico',
    executiveSuggestions: ['Instituir o "Comitê de Eficiência"', 'Automatizar a conciliação bancária'],
    weight: 5,
    maturityQuestion: 'A empresa pratica o zelo absoluto pelos recursos, evitando desperdícios e mantendo separação clara entre sócios e negócio?',
    expectedEvidences: ['Fluxo de Caixa', 'Orçamento Base Zero', 'Auditoria de Despesas'],
    crossAxisImpact: 'Base para a Sustentabilidade Financeira'
  },
  {
    id: 'fin_2',
    name: 'Prudência e Reservas',
    description: 'O homem prudente percebe o perigo e busca refúgio; o inexperiente segue adiante e sofre as consequências.',
    axis: 'Administração e Finanças',
    reference: 'Provérbios 22:3',
    businessApplication: 'Manutenção de reservas de liquidez para crises e oportunidades estratégicas.',
    risksWhenNeglected: ['Quebra por falta de caixa', 'Dependência de empréstimos caros', 'Incapacidade de reagir a crises'],
    practicalRecommendations: [
      'Reserva de emergência (6 meses de custo)',
      'Fundo para investimentos futuros',
      'Seguros patrimoniais e de responsabilidade',
      'Evitar alavancagem excessiva',
      'Análise de risco para novos projetos',
      'Planejamento tributário conservador',
      'Monitorar indicadores de liquidez seca',
      'Diversificar fontes de receita',
      'Manter linhas de crédito pré-aprovadas',
      'Evitar retiradas de lucro sem caixa',
      'Simulações de cenários pessimistas',
      'Zelo pela saúde financeira dos sócios'
    ],
    relatedIndicators: ['Runway (Meses de Caixa)', 'Liquidez Seca', 'Índice de Endividamento'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Constituir Fundo de Reserva Estatutário', 'Adotar política de Hedge se necessário'],
    weight: 5,
    maturityQuestion: 'A organização mantém reservas de liquidez suficientes para enfrentar crises e aproveitar oportunidades estratégicas?',
    expectedEvidences: ['Extratos de Fundo de Reserva', 'Simulações de Stress Test', 'Plano de Contingência'],
    crossAxisImpact: 'Garante a sobrevivência na Gestão Operacional'
  },
  {
    id: 'fin_3',
    name: 'Sustentabilidade de Longo Prazo',
    description: 'A riqueza obtida com facilidade logo se esvazia, mas quem a ajunta aos poucos terá prosperidade.',
    axis: 'Administração e Finanças',
    reference: 'Provérbios 13:11',
    businessApplication: 'Foco no crescimento orgânico e sólido, evitando atalhos financeiros perigosos.',
    risksWhenNeglected: ['Crescimento "bolha"', 'Alavancagem predatória', 'Perda de controle do negócio'],
    practicalRecommendations: [
      'Reinvestir parte do lucro no core business',
      'Crescimento baseado na geração de caixa',
      'Evitar o endividamento para consumo',
      'Focar em lucratividade real (EBITDA)',
      'Manter os custos variáveis controlados',
      'Paciência estratégica para colheita',
      'Não sacrificar o futuro pelo presente',
      'Construir valor de marca perene',
      'Monitorar o ROIC constantemente',
      'Evitar a vaidade do faturamento sem lucro',
      'Crescimento escalável e saudável',
      'Planejamento de longo prazo (5-10 years)'
    ],
    relatedIndicators: ['ROIC', 'Crescimento de EBITDA', 'LTV/CAC'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Vincular remuneração à geração de caixa livre', 'Realizar Valuation anual'],
    weight: 4,
    maturityQuestion: 'O crescimento da empresa é sustentável, focado em lucratividade real e valor de longo prazo, evitando atalhos perigosos?',
    expectedEvidences: ['Histórico de ROIC', 'DRE Gerencial', 'Valuation Atualizado'],
    crossAxisImpact: 'Impacta a Governança e Sucessão'
  },
  {
    id: 'fin_4',
    name: 'Gestão de Dívidas e Compromissos',
    description: 'A ninguém devais coisa alguma, a não ser o amor.',
    axis: 'Administração e Finanças',
    reference: 'Romanos 13:8',
    businessApplication: 'Uso consciente de crédito apenas para ativos que paguem o juro com folga.',
    risksWhenNeglected: ['Escravidão financeira (juros)', 'Insolvência', 'Perda de autonomia estratégica'],
    practicalRecommendations: [
      'Eliminar dívidas de curto prazo caras',
      'Usar crédito apenas para expansão lucrativa',
      'Monitorar o custo médio da dívida',
      'Honrar rigorosamente todos os prazos',
      'Negociar taxas proativamente com bancos',
      'Evitar garantias pessoais dos sócios',
      'Manter rating de crédito impecável',
      'Pagar impostos integralmente em dia',
      'Não dever a colaboradores ou fornecedores',
      'Ter plano de liquidação de passivos',
      'Utilizar financiamentos de longo prazo',
      'Clareza total sobre o CET (Custo Efetivo)'
    ],
    relatedIndicators: ['Dívida Líquida/EBITDA', 'Custo da Dívida', 'Compliance Fiscal'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Trocar dívida cara por equity ou debêntures', 'Saneamento financeiro preventivo'],
    weight: 4,
    maturityQuestion: 'O uso de crédito é consciente, com compromissos honrados rigorosamente e dívidas limitadas a ativos produtivos?',
    expectedEvidences: ['Cronograma de Endividamento', 'Certidões Negativas', 'Rating Bancário'],
    crossAxisImpact: 'Preserva a Reputação na Governança'
  },
  {
    id: 'fin_5',
    name: 'Generosidade e Retorno Social',
    description: 'Trazei todos os dízimos à casa do tesouro... e provai-me nisto, diz o Senhor.',
    axis: 'Administração e Finanças',
    reference: 'Malaquias 3:10',
    businessApplication: 'Destinação sistemática de parte dos lucros para impacto social e causas do Reino.',
    risksWhenNeglected: ['Mentalidade de escassez', 'Apego ao dinheiro', 'Falta de propósito social'],
    practicalRecommendations: [
      'Separar 10% do lucro para causas sociais',
      'Apoiar ONGs e projetos locais/globais',
      'Envolver colaboradores na escolha social',
      'Relatório de impacto social anual',
      'Doação de expertise e tempo (voluntariado)',
      'Praticar o "Dízimo Corporativo"',
      'Apoio a colaboradores em extrema necessidade',
      'Destinar recursos para educação carente',
      'Ser um canal de bênção na cidade',
      'Transparência no destino das doações',
      'Cultivar cultura de generosidade interna',
      'Medir o impacto social gerado'
    ],
    relatedIndicators: ['% de Lucro para Social', 'Nº de Beneficiados', 'Engajamento no Voluntariado'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Criar o "Instituto Illumine" ou similar', 'Integrar impacto social ao core business'],
    weight: 3,
    maturityQuestion: 'A empresa destina sistematicamente parte de seus lucros para impacto social e causas altruístas de forma generosa?',
    expectedEvidences: ['Relatório de Impacto Social', 'Comprovantes de Doação', 'Projetos de Voluntariado'],
    crossAxisImpact: 'Fortalece imensamente a Cultura e Marketing'
  },
  {
    id: 'fin_6',
    name: 'Multiplicação de Talentos',
    description: 'Muito bem, servo bom e fiel; foste fiel no pouco, sobre o muito te colocarei.',
    axis: 'Administração e Finanças',
    reference: 'Mateus 25:21',
    businessApplication: 'Investimento inteligente do capital para gerar novos negócios e oportunidades.',
    risksWhenNeglected: ['Estagnação patrimonial', 'Perda para inflação', 'Morte por obsolescência'],
    practicalRecommendations: [
      'Investir em novas fontes de receita',
      'Aportar capital em intraempreendedorismo',
      'Aquisição estratégica de complementos',
      'Otimizar a alocação de ativos',
      'Buscar retorno acima do custo de capital',
      'Treinar talentos para multiplicar resultados',
      'Modernizar tecnologia para escala',
      'Diversificar portfólio de produtos',
      'Recompensar a inovação lucrativa',
      'Crescimento com foco em equity value',
      'Incentivar a mentalidade de dono',
      'Monitorar a produtividade do capital'
    ],
    relatedIndicators: ['Crescimento de Patrimônio Líquido', 'ROI de Inovação', 'Valor da Empresa'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Criar braço de Corporate Venture Capital', 'Programa de Partnership para talentos'],
    weight: 4,
    maturityQuestion: 'O capital é reinvestido de forma inteligente para gerar novos negócios, tecnologias e oportunidades de multiplicação?',
    expectedEvidences: ['Portfólio de Novos Negócios', 'Plano de Investimentos', 'Acordos de Partnership'],
    crossAxisImpact: 'Alimenta a Gestão de Inovação'
  },
  {
    id: 'fin_7',
    name: 'Transparência e Prestação de Contas',
    description: 'Procuramos o que é honesto, não só diante do Senhor, mas também diante dos homens.',
    axis: 'Administração e Finanças',
    reference: '2 Coríntios 8:21',
    businessApplication: 'Relatórios financeiros claros, auditáveis e honestos para todos os sócios e credores.',
    risksWhenNeglected: ['Fraudes e desvios', 'Quebra de confiança dos sócios', 'Multas regulatórias graves'],
    practicalRecommendations: [
      'Auditoria externa anual independente',
      'Fechamento contábil até o 10º dia útil',
      'Publicação de DRE/BP para sócios mensal',
      'Contabilidade gerencial em tempo real',
      'Compliance fiscal rigoroso (sem sonegação)',
      'Treinamento de ética para setor financeiro',
      'Sistema de controle interno testado',
      'Transparência em retiradas e bônus',
      'Registros impecáveis e auditáveis',
      'Divulgação de riscos financeiros reais',
      'Atas de prestação de contas assinadas',
      'Canal de dúvidas financeiras para sócios'
    ],
    relatedIndicators: ['Acuracidade Contábil', 'Delay de Reporte', 'Nº de Ajustes de Auditoria'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Adotar padrões IFRS de contabilidade', 'Automatizar reportes para investidores'],
    weight: 5,
    maturityQuestion: 'Os relatórios financeiros são precisos, honestos e apresentados pontualmente para todos os sócios e stakeholders?',
    expectedEvidences: ['Balanço Auditado', 'Reporte Mensal aos Sócios', 'Sistemas Integrados'],
    crossAxisImpact: 'Pilar fundamental da Governança'
  },
  {
    id: 'fin_8',
    name: 'Planejamento Prévio',
    description: 'Os planos do diligente levam à fartura, mas o apressado sempre acaba na miséria.',
    axis: 'Administração e Finanças',
    reference: 'Provérbios 21:5',
    businessApplication: 'Execução baseada em orçamento e planejamento estratégico, nunca no improviso.',
    risksWhenNeglected: ['Fim de caixa repentino', 'Erros de execução caros', 'Estresse operacional'],
    practicalRecommendations: [
      'Orçamento anual (Budget) detalhado',
      'Planejamento Estratégico (Planest)',
      'Revisões trimestrais do orçamento (Forecast)',
      'Projeção de fluxo de caixa de 12 meses',
      'Definir metas antes de iniciar o ano',
      'Plano de contingência para crises',
      'Estudo de viabilidade para novos gastos',
      'Cronograma de execução física e financeira',
      'Alinhamento de recursos com prioridades',
      'Evitar gastos de última hora sem verba',
      'Monitorar desvios de orçamento mensal',
      'Documentar premissas do planejamento'
    ],
    relatedIndicators: ['Orçado vs Realizado', 'Acuracidade de Previsão', 'Saúde do Planejamento'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Implementar Rolling Forecast', 'Vincular metas ao orçamento aprovado'],
    weight: 5,
    maturityQuestion: 'As operações financeiras seguem um planejamento prévio rigoroso (Budget), evitando o improviso e a pressa?',
    expectedEvidences: ['Orçamento Aprovado', 'Análise de Desvios (Budget vs Actual)', 'Plano Estratégico'],
    crossAxisImpact: 'Influencia a Gestão Comercial e Operacional'
  },

  // Eixo: Inovação
  {
    id: 'inov_1',
    name: 'Criatividade Refletida',
    description: 'No princípio, criou Deus os céus e a terra.',
    axis: 'Gestão de Inovação',
    reference: 'Gênesis 1:1',
    businessApplication: 'A empresa como agente criador que traz novas soluções para problemas antigos.',
    risksWhenNeglected: ['Obsolescência precoce', 'Perda de relevância', 'Commoditização'],
    practicalRecommendations: [
      'Incentivar o pensamento fora da caixa',
      'Espaço físico/digital para experimentação',
      'Tempo livre para projetos criativos (20%)',
      'Diversidade de backgrounds nas equipes',
      'Workshops de Design Thinking',
      'Desafiar o status quo diariamente',
      'Incentivar a curiosidade intelectual',
      'Concursos internos de ideias disruptivas',
      'Expor a equipe a novas tecnologias',
      'Celebrar a originalidade e o novo',
      'Criar laboratórios de inovação (Labs)',
      'Uso criativo de recursos limitados'
    ],
    relatedIndicators: ['Nº de Novos Projetos', 'Patentes/Propriedade Intelectual', 'Índice de Criatividade'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Criar o cargo de Chief Innovation Officer', 'Vincular bônus a ideias implementadas'],
    weight: 4,
    maturityQuestion: 'A empresa fomenta ativamente a criatividade e a geração de novas soluções para problemas antigos?',
    expectedEvidences: ['Laboratórios de Inovação', 'Nº de Patentes', 'Workshops de Design Thinking'],
    crossAxisImpact: 'Alimenta a Gestão de Marketing e Operacional'
  },
  {
    id: 'inov_2',
    name: 'Prudência na Experimentação',
    description: 'Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?',
    axis: 'Gestão de Inovação',
    reference: 'Lucas 14:28',
    businessApplication: 'Uso de MVPs e testes de pequena escala antes de grandes investimentos.',
    risksWhenNeglected: ['Desperdício massivo de capital', 'Lançamentos fracassados', 'Perda de foco'],
    practicalRecommendations: [
      'Criação de MVPs (Mínimo Produto Viável)',
      'Testes A/B em todas as novas features',
      'Estudo de viabilidade financeira prévio',
      'Definir critérios de parada (Kill Switch)',
      'Ciclos curtos de aprendizado (Sprint)',
      'Ouvir clientes na fase de protótipo',
      'Análise de riscos de novos mercados',
      'Orçamento limitado para experimentação',
      'Validar demanda antes de construir',
      'Documentar hipóteses e resultados',
      'Evitar a perfeição antes da validação',
      'Escalar apenas o que foi provado'
    ],
    relatedIndicators: ['Tempo até o MVP', 'Custo de Experimentação', 'Taxa de Sucesso de Testes'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Adotar metodologia Lean Startup', 'Implementar Stage-Gate process'],
    weight: 3,
    maturityQuestion: 'A empresa utiliza protótipos e testes de pequena escala (MVPs) antes de realizar grandes investimentos em inovação?',
    expectedEvidences: ['Documentação de Testes A/B', 'Relatórios de MVP', 'Matriz de Riscos'],
    crossAxisImpact: 'Preserva a saúde em Administração e Finanças'
  },
  {
    id: 'inov_3',
    name: 'Persistência no Semear',
    description: 'E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos.',
    axis: 'Gestão de Inovação',
    reference: 'Gálatas 6:9',
    businessApplication: 'Investimento contínuo em inovação sem esperar retorno imediato.',
    risksWhenNeglected: ['Visão de curtíssimo prazo', 'Desistência precoce de inovações', 'Falta de profundidade'],
    practicalRecommendations: [
      'Orçamento plurianual para inovação',
      'Tolerância ao erro como aprendizado',
      'Resiliência frente a falhas de testes',
      'Manter o foco na visão de longo prazo',
      'Celebrar o progresso, não só o final',
      'Incentivar a cultura da "tentativa"',
      'Apoio da alta gestão em tempos difíceis',
      'Alocação de recursos constante (Capex)',
      'Paciência estratégica para colheita',
      'Acompanhar tendências por anos',
      'Não mudar a estratégia por impulsos',
      'Construção gradual de novas capabilities'
    ],
    relatedIndicators: ['Investment maturity', 'Ciclo de Vida da Inovação', 'Persistence Index'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Criar fundo de inovação de longo prazo', 'Métricas de "Time to Value"'],
    weight: 4,
    maturityQuestion: 'Existe persistência e investimento contínuo em inovação, mesmo quando os resultados não são imediatos?',
    expectedEvidences: ['Budget Plurianual de P&D', 'Roadmap de Longo Prazo', 'Histórico de Projetos'],
    crossAxisImpact: 'Crucial para o Valor da Empresa (Equity)'
  },
  {
    id: 'inov_4',
    name: 'Renovação da Mente',
    description: 'E não vos conformeis com este mundo, mas transformai-vos pela renovação da vossa mente.',
    axis: 'Gestão de Inovação',
    reference: 'Romanos 12:2',
    businessApplication: 'Inovação como mudança de mentalidade e quebra de paradigmas internos.',
    risksWhenNeglected: ['Obsolescência mental', 'Resistência a mudanças', 'Morte cultural'],
    practicalRecommendations: [
      'Educação executiva contínua (Life Long)',
      'Workshops de quebra de paradigmas',
      'Trazer consultores "outsiders"',
      'Ler e estudar fora do próprio nicho',
      'Incentivar a crítica construtiva interna',
      'Mudar processos obsoletos com coragem',
      'Fomentar a cultura de aprendizado',
      'Palestras inspiradoras semanais',
      'Acesso a bibliotecas corporativas',
      'Incentivar o "unlearning" (desaprender)',
      'Novas formas de resolver problemas',
      'Adaptabilidade como valor central'
    ],
    relatedIndicators: ['Nível de Atualização Técnica', 'Velocidade de Adaptação', 'Horas de Estudo/Líder'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Instituir o "Day of Learning" mensal', 'Subsidiar pós-graduações e MBAs'],
    weight: 5,
    maturityQuestion: 'A liderança e a equipe buscam constantemente a renovação da mente e a quebra de paradigmas obsoletos?',
    expectedEvidences: ['Plano de Treinamento Contínuo', 'Workshops de Atualização', 'PDI Focado em Novas Skills'],
    crossAxisImpact: 'Transforma a Cultura Organizacional'
  },
  {
    id: 'inov_27',
    name: 'Visão de Futuro Documentada',
    description: 'Escreve a visão e torna-a bem legível sobre tábuas, para que a possa ler quem passa correndo.',
    axis: 'Gestão de Inovação',
    reference: 'Habacuque 2:2',
    businessApplication: 'Planejamento e visualização clara do futuro para guiar os esforços criativos.',
    risksWhenNeglected: ['Esforço desconexo', 'Falta de direção', 'Desperdício de energia'],
    practicalRecommendations: [
      'Criação de um Roadmap Tecnológico',
      'Visualização clara da meta de 10 anos',
      'Comunicar a visão para toda a equipe',
      'Documentar tendências e sinais fracos',
      'Painéis visuais de metas inovadoras',
      'Garantir legibilidade da estratégia',
      'Revisão semestral do Roadmap',
      'Alinhamento de inovação com a Visão',
      'Inspirar o time com o "onde chegaremos"',
      'Clareza nos objetivos de inovação',
      'Escrita formal do plano de inovação',
      'Tornar a inovação parte do DNA'
    ],
    relatedIndicators: ['Alinhamento do Roadmap', 'Clareza de Visão Interna', 'Aderência ao Futuro'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Publicar o "Manifesto do Futuro"', 'Instituir o Conselho de Tendências'],
    weight: 4,
    maturityQuestion: 'A visão de futuro está documentada e é legível para todos, orientando os esforços de inovação de longo prazo?',
    expectedEvidences: ['Roadmap Tecnológico', 'Vídeo/Documento de Visão 2030', 'Atas de Planejamento'],
    crossAxisImpact: 'Fundamental para a Governança Corporativa'
  },
  {
    id: 'inov_28',
    name: 'Sabedoria Técnica e Aprendizado',
    description: 'O coração do prudente adquire o conhecimento, e o ouvido dos sábios busca o saber.',
    axis: 'Gestão de Inovação',
    reference: 'Provérbios 18:15',
    businessApplication: 'Busca incessante por conhecimento técnico e domínio das novas tecnologias.',
    risksWhenNeglected: ['Incompetência técnica', 'Atraso tecnológico', 'Dependência excessiva de terceiros'],
    practicalRecommendations: [
      'Treinamentos técnicos profundos',
      'Certificações para a equipe técnica',
      'Incentivar a pesquisa científica interna',
      'Fazer benchmarking com os melhores',
      'Contratação de especialistas sêniores',
      'Comunidades de prática interna',
      'Assinaturas de bases de dados técnicos',
      'Participação em fóruns e congressos',
      'Documentar o conhecimento técnico',
      'Sistemas de gestão do conhecimento',
      'Mentoria técnica (mestre/aprendiz)',
      'Investir em ferramentas de ponta'
    ],
    relatedIndicators: ['Nível de Especialização', 'Nº de Certificações', 'Curva de Aprendizado'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Criar trilhas de carreira técnica (Y)', 'Bonificar por patentes e publicações'],
    weight: 3,
    maturityQuestion: 'A empresa investe no domínio técnico e conhecimento profundo das ferramentas e tecnologias do seu nicho?',
    expectedEvidences: ['Matriz de Competências', 'Certificados da Equipe', 'Acordos de Mentoria'],
    crossAxisImpact: 'Eleva a Qualidade na Gestão Operacional'
  },
  {
    id: 'inov_29',
    name: 'Ousadia com Fé',
    description: 'Não to mandei eu? Sê forte e corajoso... porque o Senhor teu Deus é contigo.',
    axis: 'Gestão de Inovação',
    reference: 'Josué 1:9',
    businessApplication: 'Coragem para tomar riscos calculados e entrar em mercados inexplorados.',
    risksWhenNeglected: ['Covardia estratégica', 'Estagnação', 'Medo paralisante'],
    practicalRecommendations: [
      'Entrar em novos mercados com força',
      'Lançar produtos disruptivos',
      'Tomar riscos baseados em convicção',
      'Coragem para mudar o modelo de negócio',
      'Enfrentar grandes concorrentes',
      'Ousadia para investir em crises',
      'Cultura de "tentar o impossível"',
      'Incentivar o protagonismo ousado',
      'Não temer o erro, mas a inércia',
      'Ousadia para dizer "não" ao lucro fácil',
      'Postura visionária e destemida',
      'Inovação radical vs incremental'
    ],
    relatedIndicators: ['Índice de Ousadia Estratégica', 'Market Share em Novos Mercados', 'Nível de Risco Calculado'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Aprovar orçamento para "Moonshots"', 'Premiar a coragem executiva'],
    weight: 4,
    maturityQuestion: 'A organização demonstra ousadia e coragem para tomar riscos calculados e entrar em territórios desconhecidos?',
    expectedEvidences: ['Business Case de Novos Mercados', 'Lançamentos Disruptivos', 'Decisões de Pivô'],
    crossAxisImpact: 'Impacta a Gestão Comercial e Marketing'
  },

  // Eixo: Marketing
  {
    id: 'mkt_1',
    name: 'Marketing de Testemunho',
    description: 'Assim brilhe a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai.',
    axis: 'Gestão de Marketing',
    reference: 'Mateus 5:16',
    businessApplication: 'Uso da reputação e dos resultados reais como principal ferramenta de persuasão.',
    risksWhenNeglected: ['Incoerência de marca', 'Publicidade vazia', 'Crise de confiança'],
    practicalRecommendations: [
      'Coletar depoimentos reais de clientes',
      'Cases de sucesso com dados provados',
      'Marketing de influência ético',
      'Transparência nas práticas da empresa',
      'Mostrar o "backstage" com verdade',
      'Alinhamento entre discurso e prática',
      'Evidenciar o impacto social gerado',
      'Cultura de "Obras que falam"',
      'Marketing centrado na solução real',
      'Indicações de clientes (Referral)',
      'Responder críticas com transparência',
      'Zelar pela marca como patrimônio'
    ],
    relatedIndicators: ['Net Promoter Score (NPS)', 'Taxa de Recomendação', 'Credibilidade da Marca'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Criar o conselho de "Voz do Cliente"', 'Vincular marketing ao success do cliente'],
    weight: 5,
    maturityQuestion: 'O marketing da empresa é baseado em testemunhos reais e "boas obras" que geram confiança orgânica?',
    expectedEvidences: ['Depoimentos em Vídeo', 'NPS Detalhado', 'Cases de Sucesso'],
    crossAxisImpact: 'Fortalece a Governança (Reputação)'
  },
  {
    id: 'mkt_2',
    name: 'Excelência na Comunicação',
    description: 'Tudo o que fizerdes, fazei-o de todo o coração, como para o Senhor e não para os homens.',
    axis: 'Gestão de Marketing',
    reference: 'Colossenses 3:23',
    businessApplication: 'Busca pelo mais alto padrão de design, conteúdo e experiência do cliente.',
    risksWhenNeglected: ['Comunicação amadora', 'Perda de valor percebido', 'Baixa conversão'],
    practicalRecommendations: [
      'Identidade visual impecável e coesa',
      'Copywriting ético e persuasivo',
      'UX/UI de alta performance',
      'Conteúdo educativo de alto valor',
      'Velocidade e precisão nas mensagens',
      'Personalização da jornada do cliente',
      'Uso de tecnologia de ponta no MKT',
      'Revisão ortográfica e estética total',
      'Design que reflete os valores',
      'Consistência em todos os canais',
      'Investir nos melhores talentos criativos',
      'Melhoria contínua da experiência'
    ],
    relatedIndicators: ['Taxa de Conversão', 'Valor de Marca (Equity)', 'Qualidade Visual'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Adotar o "Signature Executive Design"', 'Auditoria de marca semestral'],
    weight: 4,
    maturityQuestion: 'A comunicação e o design da empresa refletem um padrão de excelência que honra o cliente e o propósito?',
    expectedEvidences: ['Brandbook', 'Site/Materiais de Alta Qualidade', 'Pesquisa de Percepção'],
    crossAxisImpact: 'Alinha com a Gestão Comercial'
  },
  {
    id: 'mkt_3',
    name: 'Verdade Radical no Comunicar',
    description: 'Por isso, deixando a mentira, fale cada um a verdade com o seu próximo.',
    axis: 'Gestão de Marketing',
    reference: 'Efésios 4:25',
    businessApplication: 'Eliminação de gatilhos mentais enganosos e promessas que não serão cumpridas.',
    risksWhenNeglected: ['Propaganda enganosa', 'Perda de credibilidade', 'Multas regulatórias'],
    practicalRecommendations: [
      'Zero letras miúdas enganosas',
      'Promessas 100% entregáveis',
      'Transparência em preços e taxas',
      'Não exagerar resultados de produtos',
      'Corrigir erros públicos imediatamente',
      'Marketing baseado em dados reais',
      'Respeito total à LGPD e privacidade',
      'Comunicação clara e sem dubiedade',
      'Evitar a escassez artificial falsa',
      'Honestidade sobre a origem dos bens',
      'Dizer "não" se o produto não servir',
      'Ser ético na comparação com rivais'
    ],
    relatedIndicators: ['Índice de Reclamações', 'Taxa de Devolução', 'Confiança do Consumidor'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Instituir o "Ethics Officer for Marketing"', 'Publicar termos de uso em linguagem simples'],
    weight: 5,
    maturityQuestion: 'A comunicação de marketing é 100% honesta, sem promessas falsas, letras miúdas ou gatilhos mentais enganosos?',
    expectedEvidences: ['Termos de Uso Claros', 'Políticas de Reembolso', 'Scripts de Vendas Auditados'],
    crossAxisImpact: 'Pilar da Integridade (Governança)'
  },
  {
    id: 'mkt_4',
    name: 'Luz e Sal no Mercado',
    description: 'Vós sois o sal da terra... vós sois a luz do mundo.',
    axis: 'Gestão de Marketing',
    reference: 'Mateus 5:13-14',
    businessApplication: 'Marketing que educa, inspira e eleva o nível moral e intelectual do seu público.',
    risksWhenNeglected: ['Marketing irrelevante', 'Comunicação egoísta', 'Falta de influência'],
    practicalRecommendations: [
      'Educar o mercado com conteúdo útil',
      'Inspirar com valores positivos',
      'Marketing de causa genuíno',
      'Promover a paz e a justiça nas redes',
      'Ser referência ética no seu nicho',
      'Influência positiva na sociedade',
      'Evitar apelos sensacionalistas',
      'Gerar valor antes de pedir venda',
      'Campanhas de conscientização social',
      'Apoio a projetos de bem comum',
      'Comunicação que edifica o ouvinte',
      'Ser luz em tempos de crise'
    ],
    relatedIndicators: ['Impacto Social do Marketing', 'Share of Mind Positivo', 'Sentimento da Marca'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Integrar o marketing ao ESG', 'Criar trilhas de educação gratuita'],
    weight: 3,
    maturityQuestion: 'O marketing da empresa atua como luz e sal, educando e inspirando o mercado de forma positiva?',
    expectedEvidences: ['Blog/Newsletter Educativa', 'Webinars de Valor', 'Projetos de Conscientização'],
    crossAxisImpact: 'Gera Valor Social e Sustentabilidade'
  },
  {
    id: 'mkt_35',
    name: 'Reputação de Ouro',
    description: 'Mais digno de ser escolhido é o bom nome do que as muitas riquezas.',
    axis: 'Gestão de Marketing',
    reference: 'Provérbios 22:1',
    businessApplication: 'Foco total na construção e proteção do nome da empresa acima do lucro imediato.',
    risksWhenNeglected: ['Ganância destrutiva', 'Morte súbita da marca', 'Fragilidade reputacional'],
    practicalRecommendations: [
      'Proteger o "bom nome" custe o que custar',
      'Sacrificar lucro em prol da reputação',
      'Monitoramento constante da marca',
      'Gestão de crises ética e rápida',
      'Cumprir a palavra sempre',
      'Ser reconhecido pela integridade',
      'Investir em Branding de Longo Prazo',
      'Zelar pela conduta dos sócios',
      'Evitar associações duvidosas',
      'Cuidar da percepção pública',
      'Relacionamento ético com a mídia',
      'Legado que sobrevive aos fundadores'
    ],
    relatedIndicators: ['Brand Value', 'Índice de Reputação Online', 'Confiança de Investidores'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Implementar Comitê de Proteção à Marca', 'Seguro de gestão de crise reputacional'],
    weight: 5,
    maturityQuestion: 'A empresa prioriza a manutenção de um bom nome e reputação acima de lucros imediatos?',
    expectedEvidences: ['Monitoramento de Menções', 'Plano de Gestão de Crise', 'Manual de Conduta'],
    crossAxisImpact: 'Pilar da Governança e Valor de Mercado'
  },
  {
    id: 'mkt_36',
    name: 'Mensagem de Esperança',
    description: 'E estai sempre preparados para responder com mansidão e temor a qualquer que vos pedir a razão da esperança que há em vós.',
    axis: 'Gestão de Marketing',
    reference: '1 Pedro 3:15',
    businessApplication: 'Comunicação propositiva que traz soluções e esperança, fugindo do marketing do medo.',
    risksWhenNeglected: ['Marketing de ansiedade', 'Conexão negativa com o cliente', 'Falta de propósito'],
    practicalRecommendations: [
      'Foco na solução e não apenas na dor',
      'Tom de voz manso e encorajador',
      'Evitar gatilhos de medo e escassez',
      'Promover o sucesso e o crescimento',
      'Mensagens que trazem paz e ordem',
      'Comunicar a esperança do negócio',
      'Marketing inspiracional real',
      'Ajudar o cliente a visualizar o futuro',
      'Seja um farol em mercados incertos',
      'Comunicar com mansidão e respeito',
      'Propósito que vai além do produto',
      'Gerar otimismo fundamentado'
    ],
    relatedIndicators: ['Sentimento Positivo da Comunicação', 'Fidelidade Emocional', 'Nível de Inspiração'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Adotar o "Hope-Based Marketing"', 'Auditoria de tom de voz e impacto'],
    weight: 3,
    maturityQuestion: 'A comunicação da empresa transmite esperança e soluções, fugindo do marketing do medo ou da ansiedade?',
    expectedEvidences: ['Análise de Tom de Voz', 'Pesquisa de Sentimento', 'Materiais Inspiracionais'],
    crossAxisImpact: 'Impacta a Cultura e Atração de Talentos'
  },
  {
    id: 'mkt_37',
    name: 'Atração por Valores',
    description: 'Não se pode esconder uma cidade edificada sobre um monte.',
    axis: 'Gestão de Marketing',
    reference: 'Mateus 5:14b',
    businessApplication: 'Marketing que atrai clientes pelo alinhamento de princípios, não apenas por preço.',
    risksWhenNeglected: ['Clientes "caçadores de ofertas"', 'Baixa lealdade', 'Guerra de preços'],
    practicalRecommendations: [
      'Comunicar os valores explicitamente',
      'Atrair clientes por identidade e DNA',
      'Ser autêntico e inimitável',
      'Nicho de mercado por princípios',
      'Marketing de comunidade (Tribos)',
      'Expor o propósito em cada peça',
      'Selecionar clientes pelo fit cultural',
      'Ser visível e não se esconder',
      'Irradiação natural de bons valores',
      'Posicionamento ético claro',
      'Magnetismo por excelência e moral',
      'Marca que é um "farol"'
    ],
    relatedIndicators: ['Fit do Cliente (Churn reduzido)', 'Força de Atração Orgânica', 'Custo de Aquisição (CAC)'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Implementar o "Culture-Based Lead Scoring"', 'Vincular branding aos 7 eixos'],
    weight: 4,
    maturityQuestion: 'A empresa atrai clientes e parceiros pelo alinhamento de valores e princípios, não apenas por preço ou produto?',
    expectedEvidences: ['Lead Scoring por Fit', 'Pesquisa de Percepção de Valor', 'Taxa de Retenção'],
    crossAxisImpact: 'Reduz o CAC e aumenta o LTV'
  },

  // Eixo: Comercial
  {
    id: 'com_1',
    name: 'Fidelidade nos Compromissos',
    description: 'Aquele que é fiel no pouco, também é fiel no muito.',
    axis: 'Gestão Comercial',
    reference: 'Lucas 16:10',
    businessApplication: 'Atendimento de excelência a todos os clientes, independentemente do tamanho do contrato.',
    risksWhenNeglected: ['Perda de base de clientes', 'Má reputação no mercado', 'Inconstância de faturamento'],
    practicalRecommendations: [
      'SLA de atendimento igualitário',
      'Cumprir 100% dos prazos comerciais',
      'Honrar acordos verbais e escritos',
      'Zelar pelos pequenos clientes',
      'Consistência no pós-venda',
      'Transparência em atrasos ou erros',
      'CRM atualizado com rigor',
      'Personalizar o contato humano',
      'Resolver reclamações com agilidade',
      'Ser proativo em trazer soluções',
      'Fidelidade à proposta original',
      'Manter a qualidade na entrega final'
    ],
    relatedIndicators: ['Churn Rate', 'Satisfação do Cliente (CSAT)', 'Frequência de Recompra'],
    maturityLevel: 'Básico',
    executiveSuggestions: ['Implementar sistema de Key Account Management', 'Bonificar equipe por retenção'],
    weight: 5,
    maturityQuestion: 'A empresa demonstra fidelidade total aos compromissos assumidos com todos os clientes, independentemente do tamanho do contrato?',
    expectedEvidences: ['Relatórios de Churn', 'CSAT/NPS', 'Registros de Atendimento'],
    crossAxisImpact: 'Impacta a Reputação e Fluxo de Caixa'
  },
  {
    id: 'com_2',
    name: 'Comércio de Abundância',
    description: 'Eu vim para que tenham vida, e a tenham com abundância.',
    axis: 'Gestão Comercial',
    reference: 'João 10:10',
    businessApplication: 'Foco comercial em gerar valor transformador que faz o negócio do cliente prosperar.',
    risksWhenNeglected: ['Exploração de clientes', 'Foco no lucro predatório', 'Visão de curto prazo'],
    practicalRecommendations: [
      'Vendas consultivas (foco no valor)',
      'Modelo ganha-ganha real',
      'Gerar ROI claro para o cliente',
      'Compartilhar saber que gera lucro',
      'Focar na prosperidade mútua',
      'Evitar a escassez forçada',
      'Generosidade comercial (bônus reais)',
      'Ajudar o cliente a crescer sempre',
      'Parceria de longo prazo vs transação',
      'Trazer inovações que reduzam custos',
      'Celebrar o sucesso do seu cliente',
      'Ser um facilitador de abundância'
    ],
    relatedIndicators: ['Sucesso do Cliente (ROI)', 'LTV (Lifetime Value)', 'Expansão de Receita (Upsell)'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Criar equipe de "Customer Success"', 'Modelos de "Success Fee"'],
    weight: 5,
    maturityQuestion: 'O foco comercial está em gerar abundância e prosperidade real para o cliente, não apenas em extrair lucro?',
    expectedEvidences: ['Métricas de Sucesso do Cliente', 'Relatórios de ROI', 'LTV crescente'],
    crossAxisImpact: 'Motor de Crescimento Sustentável'
  },
  {
    id: 'com_3',
    name: 'Justiça na Precificação',
    description: 'Balança enganosa é abominação para o Senhor, mas o peso justo é o seu prazer.',
    axis: 'Gestão Comercial',
    reference: 'Provérbios 11:1',
    businessApplication: 'Precificação ética e transparente, sem exploração de urgências ou monopólios.',
    risksWhenNeglected: ['Perda de confiança', 'Multas por práticas abusivas', 'Baixa sustentabilidade'],
    practicalRecommendations: [
      'Transparência total na formação de preço',
      'Preço justo pelo valor entregue',
      'Evitar taxas e custos ocultos',
      'Ética na negociação sob pressão',
      'Balanças e pesos (medidas) justos',
      'Não explorar a vulnerabilidade alheia',
      'Consistência de preços no mercado',
      'Margens de lucro saudáveis e honestas',
      'Ser claro sobre o que está incluso',
      'Negociar com base na verdade',
      'Repassar economias quando possível',
      'Zelar pela justiça comercial'
    ],
    relatedIndicators: ['Margem Bruta', 'Índice de Confiança de Preço', 'Taxa de Conversão Ética'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Auditoria externa de precificação', 'Publicar política de preços transparente'],
    weight: 5,
    maturityQuestion: 'A precificação é justa, transparente e ética, evitando explorar a urgência ou vulnerabilidade do cliente?',
    expectedEvidences: ['Tabela de Preços Pública', 'Histórico de Margens', 'Feedback de Clientes'],
    crossAxisImpact: 'Pilar da Integridade Comercial'
  },
  {
    id: 'com_4',
    name: 'Relacionamento Consultivo',
    description: 'Como o ferro com o ferro se afia, assim o homem ao seu amigo.',
    axis: 'Gestão Comercial',
    reference: 'Provérbios 27:17',
    businessApplication: 'Uso das vendas como ferramenta de aconselhamento e crescimento mútuo.',
    risksWhenNeglected: ['Vendas transacionais frias', 'Desconhecimento das dores', 'Baixa lealdade'],
    practicalRecommendations: [
      'Escuta ativa das dores do cliente',
      'Ser um mentor para o cliente',
      'Construir confiança antes da venda',
      'Personalizar soluções complexas',
      'Follow-up frequente e humano',
      'Educar o cliente durante o processo',
      'Focar na relação, não no fechamento',
      'Ser honesto se não for a solução',
      'Criar comunidades de clientes',
      'Networking entre parceiros',
      'Atendimento que agrega saber',
      'Visão de parceiro estratégico'
    ],
    relatedIndicators: ['Fidelidade de Clientes', 'Nº de Recomendações Ativas', 'Tempo de Vida do Cliente'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Transformar vendedores em "Advisors"', 'Investir em CRM Inteligente'],
    weight: 4,
    maturityQuestion: 'A relação comercial é consultiva, focada em "afiar" o negócio do cliente através de aconselhamento estratégico?',
    expectedEvidences: ['Relatórios de Consultoria', 'Indicações Ativas', 'Longevidade de Contratos'],
    crossAxisImpact: 'Transforma o Cliente em Promotor'
  },
  {
    id: 'com_42',
    name: 'Negociação Justa e Ética',
    description: 'Nada vale, nada vale, diz o comprador, mas, indo-se, então se gaba.',
    axis: 'Gestão Comercial',
    reference: 'Provérbios 20:14',
    businessApplication: 'Integridade absoluta em processos de negociação, evitando manipulações ou enganos.',
    risksWhenNeglected: ['Relações tóxicas', 'Quebra de contratos', 'Má fama no setor'],
    practicalRecommendations: [
      'Zero manipulação psicológica',
      'Honestidade sobre prazos e entregas',
      'Não prometer o impossível para fechar',
      'Negociação baseada em fatos',
      'Respeito total ao comprador',
      'Justiça em termos contratuais',
      'Evitar pressão de fechamento indevida',
      'Transparência em descontos',
      'Zelar pela margem do parceiro',
      'Seja claro sobre limitações',
      'Contratos de fácil entendimento',
      'Negociação ganha-ganha real'
    ],
    relatedIndicators: ['Nº de Distratos', 'Tempo de Negociação', 'Nível de Satisfação Pós-Venda'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Treinar equipe em Negociação Baseada em Princípios', 'Auditoria de contratos comerciais'],
    weight: 4,
    maturityQuestion: 'As negociações são conduzidas com integridade absoluta, evitando manipulações ou pressões indevidas?',
    expectedEvidences: ['Scripts de Vendas Auditados', 'Contratos de Fácil Leitura', 'Feedback Pós-Venda'],
    crossAxisImpact: 'Reduz Litígios e Desgastes'
  },
  {
    id: 'com_43',
    name: 'Palavra Empenhada',
    description: 'Seja, porém, o vosso falar: Sim, sim; Não, não; porque o que passa disto é de procedência maligna.',
    axis: 'Gestão Comercial',
    reference: 'Mateus 5:37',
    businessApplication: 'Compromisso radical com a palavra dada em propostas e conversas comerciais.',
    risksWhenNeglected: ['Falta de credibilidade pessoal', 'Erros de expectativa', 'Crise de confiança'],
    practicalRecommendations: [
      'Cumprir acordos verbais como escritos',
      'Simplicidade e clareza no falar',
      'Evitar dubiedades em propostas',
      'Confirmar entendimentos por escrito',
      'Dizer "não" com clareza e respeito',
      'Honrar preços prometidos',
      'Prazos realistas e cumpridos',
      'Zero desculpas para falhas de palavra',
      'Retidão em todas as promessas',
      'Corrigir desvios imediatamente',
      'Cultura de integridade no discurso',
      'Transparência radical nas condições'
    ],
    relatedIndicators: ['Acuracidade de Propostas', 'Nível de Confiança de Clientes', 'Conformidade de Entrega'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Instituir o "Ethics Charter" Comercial', 'Zelar pelo discurso da liderança'],
    weight: 5,
    maturityQuestion: 'A palavra dada em propostas e conversas é honrada integralmente (Sim, sim; Não, não)?',
    expectedEvidences: ['Propostas vs Contratos', 'Histórico de Entregas', 'Pesquisa de Confiança'],
    crossAxisImpact: 'Base da Credibilidade Institucional'
  },
  {
    id: 'com_44',
    name: 'Foco no Próximo (Cliente)',
    description: 'Não atente cada um para o que é propriamente seu, mas cada qual também para o que é dos outros.',
    axis: 'Gestão Comercial',
    reference: 'Filipenses 2:4',
    businessApplication: 'Centralidade no cliente (Customer Centricity) como expressão de serviço ao próximo.',
    risksWhenNeglected: ['Egoísmo corporativo', 'Produtos desalinhados', 'Morte por irrelevância'],
    practicalRecommendations: [
      'Mapear a jornada real do cliente',
      'Ouvir as dores antes de oferecer',
      'Focar no benefício para o cliente',
      'Empatia real no atendimento',
      'Resolver o problema do cliente primeiro',
      'Não empurrar produtos inúteis',
      'Cuidar do sucesso do cliente',
      'Feedback constante do mercado',
      'Personalizar a solução',
      'Ser um facilitador do cliente',
      'Priorizar o humano sobre o processo',
      'Gerar valor antes de capturar valor'
    ],
    relatedIndicators: ['Customer Effort Score (CES)', 'NPS Transacional', 'Taxa de Retenção'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Adotar o framework "Jobs to be Done"', 'Instituir o "Client Advisory Board"'],
    weight: 5,
    maturityQuestion: 'As decisões e processos são centrados no sucesso e nas necessidades do próximo (cliente)?',
    expectedEvidences: ['Jornada do Cliente Mapeada', 'Feedback de Detratores', 'Métricas de Esforço'],
    crossAxisImpact: 'Diferencial Competitivo em Marketing'
  },

  // Eixo: Operação
  {
    id: 'op_1',
    name: 'Diligência na Execução',
    description: 'Viste o homem diligente na sua obra? Perante reis será posto.',
    axis: 'Gestão Operacional',
    reference: 'Provérbios 22:29',
    businessApplication: 'Cultura de execução impecável, produtividade e foco total no resultado.',
    risksWhenNeglected: ['Lentidão operacional', 'Baixa qualidade', 'Desperdiço de tempo'],
    practicalRecommendations: [
      'Metas de produtividade claras',
      'Eliminação de gargalos operacionais',
      'Foco total na entrega no prazo',
      'Uso de metodologias ágeis (Scrum)',
      'Manter ritmo constante e intenso',
      'Combater a procrastinação interna',
      'Treinamento técnico de alto nível',
      'Ferramentas que aumentam o output',
      'Gestão à vista (Dashboards)',
      'Premiar a eficiência comprovada',
      'Automação de tarefas repetitivas',
      'Busca pela maestria técnica'
    ],
    relatedIndicators: ['OEE (Eficiência Global)', 'Produtividade por Colaborador', 'Lead Time'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Implementar Lean Manufacturing/Six Sigma', 'Automatizar fluxos de trabalho'],
    weight: 5,
    maturityQuestion: 'A execução das tarefas é realizada com diligência, produtividade e foco total na entrega impecável?',
    expectedEvidences: ['Dashboards de Produtividade', 'Relatórios de Lead Time', 'Metas de Output'],
    crossAxisImpact: 'Base da Rentabilidade Financeira'
  },
  {
    id: 'op_2',
    name: 'Ordem e Padronização',
    description: 'Pois Deus não é Deus de confusão, senão de paz.',
    axis: 'Gestão Operacional',
    reference: '1 Coríntios 14:33',
    businessApplication: 'Redução de variabilidade e erros através de processos padronizados e organizados.',
    risksWhenNeglected: ['Retrabalho constante', 'Instabilidade de qualidade', 'Incapacidade de escala'],
    practicalRecommendations: [
      'Implementar o 5S (Organização)',
      'POPs (Procedimentos Padrão) escritos',
      'Listas de verificação (Checklists)',
      'Gestão de processos visual (Kanban)',
      'Reduzir a complexidade desnecessária',
      'Unificar métodos de trabalho',
      'Manutenção preventiva rigorosa',
      'Ambiente de trabalho limpo e ordenado',
      'Sistemas de ERP integrados',
      'Auditorias de processo semanais',
      'Treinar novos conforme o padrão',
      'Eliminar a "criatividade" no erro'
    ],
    relatedIndicators: ['Taxa de Retretrabalho', 'Conformidade de Processo', 'Nível de 5S'],
    maturityLevel: 'Básico',
    executiveSuggestions: ['ISO 9001 ou certificações similares', 'Mapeamento de Fluxo de Valor (VSM)'],
    weight: 4,
    maturityQuestion: 'As operações seguem padrões e processos ordenados que reduzem a confusão, o retrabalho e o erro?',
    expectedEvidences: ['Manuais de Procedimentos (POP)', 'Checklists Operacionais', 'Auditorias de Processo'],
    crossAxisImpact: 'Fundamental para a Escalabilidade'
  },
  {
    id: 'op_3',
    name: 'Mordomia dos Ativos',
    description: 'Além disso, requer-se dos despenseiros que cada um se ache fiel.',
    axis: 'Gestão Operacional',
    reference: '1 Coríntios 4:2',
    businessApplication: 'Zelo e manutenção preventiva de todos os equipamentos, imóveis e softwares da empresa.',
    risksWhenNeglected: ['Depreciação acelerada', 'Paradas inesperadas', 'Altos custos de manutenção'],
    practicalRecommendations: [
      'Plano de manutenção preventiva',
      'Zelo pelo patrimônio físico',
      'Atualização constante de softwares',
      'Inventário de ativos atualizado',
      'Treinar equipe para cuidar dos bens',
      'Responsabilidade individual por ativos',
      'Evitar o mau uso de recursos',
      'Otimizar o uso de espaço e energia',
      'Substituição planejada de máquinas',
      'Segurança patrimonial eficiente',
      'Limpeza e conservação impecável',
      'Monitorar a vida útil dos ativos'
    ],
    relatedIndicators: ['Disponibilidade de Máquinas', 'Custo de Manutenção', 'Vida Útil de Ativos'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Implementar sistema de Gestão de Ativos (EAM)', 'Seguros de quebra de máquinas'],
    weight: 3,
    maturityQuestion: 'Existe zelo e manutenção preventiva rigorosa de todos os ativos, equipamentos e ferramentas da empresa?',
    expectedEvidences: ['Cronograma de Manutenção', 'Inventário de Ativos', 'Relatórios de Vida Útil'],
    crossAxisImpact: 'Preserva o Patrimônio Financeiro'
  },
  {
    id: 'op_4',
    name: 'Sustentabilidade e Cuidado',
    description: 'Tomou, pois, o Senhor Deus o homem, e o pôs no jardim do Éden para o lavrar e o guardar.',
    axis: 'Gestão Operacional',
    reference: 'Gênesis 2:15',
    businessApplication: 'Operação consciente que minimiza o desperdício de recursos e o impacto ambiental.',
    risksWhenNeglected: ['Desperdício de capital', 'Multas ambientais', 'Má reputação social'],
    practicalRecommendations: [
      'Redução drástica de desperdícios',
      'Eficiência energética e hídrica',
      'Reciclagem e gestão de resíduos',
      'Priorizar insumos sustentáveis',
      'Inovação em processos "verdes"',
      'Minimizar pegada de carbono',
      'Cuidar do entorno da empresa',
      'Educar o time para sustentabilidade',
      'Logística reversa se aplicável',
      'Zelo pela criação (natureza)',
      'Reduzir uso de descartáveis',
      'Medir o impacto ecológico'
    ],
    relatedIndicators: ['Índice de Desperdício', 'Consumo de Energia/Produção', 'Compliance Ambiental'],
    maturityLevel: 'Intermediário',
    executiveSuggestions: ['Implementar programa de Resíduo Zero', 'Auditoria de eficiência energética'],
    weight: 3,
    maturityQuestion: 'A operação é consciente em relação ao desperdício, cuidando dos recursos e do ambiente como bons mordomos?',
    expectedEvidences: ['Relatórios de Resíduos', 'Certificações Ambientais', 'Metas de Redução de Perdas'],
    crossAxisImpact: 'Reflete a Cultura e Responsabilidade Social'
  },
  {
    id: 'op_5',
    name: 'Força e Qualidade',
    description: 'Tudo quanto te vier à mão para fazer, faze-o conforme as tuas forças.',
    axis: 'Gestão Operacional',
    reference: 'Eclesiastes 9:10',
    businessApplication: 'Busca pela excelência máxima e qualidade intrínseca em cada entrega.',
    risksWhenNeglected: ['Retrabalho constante', 'Perda de reputação', 'Desperdício de recursos'],
    practicalRecommendations: [
      'Estabelecer padrões de qualidade rigorosos (SOPs)',
      'Capacitar tecnicamente a equipe de forma constante',
      'Utilizar ferramentas estatísticas para monitorar a qualidade',
      'Realizar testes exaustivos antes da entrega final',
      'Ouvir o cliente para definir o padrão de qualidade esperado',
      'Paralisar a produção imediatamente ao detectar falhas graves',
      'Investir em tecnologia que reduza a variabilidade humana',
      'Manter rastreabilidade total de lotes e serviços prestados',
      'Incentivar o "zero erro" através de processos de Poka-Yoke',
      'Avaliar fornecedores pela qualidade constante do que entregam',
      'Celebrar o alcance de metas de qualidade sem defeitos',
      'Auditorias de qualidade surpresa'
    ],
    relatedIndicators: ['First Pass Yield (FPY)', 'Taxa de Devolução', 'Custo da Qualidade'],
    maturityLevel: 'Master',
    executiveSuggestions: ['Instituir o "Quality Award" interno', 'Implementar TQM (Total Quality Management)'],
    weight: 5,
    maturityQuestion: 'A empresa busca a excelência e qualidade máxima em cada entrega, agindo com toda a sua força?',
    expectedEvidences: ['Indicadores de FPY', 'Certificações de Qualidade', 'Scripts de Teste'],
    crossAxisImpact: 'Fator Crítico de Marketing e Vendas'
  },
  {
    id: 'op_50',
    name: 'Segurança e Refúgio',
    description: 'Torre forte é o nome do Senhor; a ela correrá o justo, e estará em alto refúgio.',
    axis: 'Gestão Operacional',
    reference: 'Provérbios 18:10',
    businessApplication: 'Garantia de segurança física, digital e emocional para todos na operação.',
    risksWhenNeglected: ['Acidentes de trabalho', 'Vazamento de dados (LGPD)', 'Insegurança emocional'],
    practicalRecommendations: [
      'Segurança do trabalho impecável (EPIs)',
      'Cibersegurança de nível bancário',
      'Ambiente emocionalmente seguro',
      'Planos de contingência e evacuação',
      'Prevenção de assédio e abusos',
      'Proteção física das instalações',
      'Zelo pela vida do colaborador',
      'Sistemas de backup e redundância',
      'Treinamento de primeiros socorros',
      'Seguro de vida e saúde corporativo',
      'Monitoramento de riscos operacionais',
      'Cultura de proteção mútua',
      'Simulados de emergência periódicos'
    ],
    relatedIndicators: ['Índice de Acidentes', 'Segurança da Informação (SI)', 'Conformidade de EPIs'],
    maturityLevel: 'Avançado',
    executiveSuggestions: ['Implementar a ISO 45001 (Segurança)', 'Auditoria de Cibersegurança trimestral'],
    weight: 5,
    maturityQuestion: 'A operação prioriza a segurança física e digital, sendo "prudente" contra perigos e riscos eminentes?',
    expectedEvidences: ['Relatórios de Segurança', 'Backup e DR Plan', 'Certificações de SI'],
    crossAxisImpact: 'Proteção Máxima da Governança'
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
  'Governança Corporativa',
  'Cultura Organizacional',
  'Administração e Finanças',
  'Gestão de Inovação',
  'Gestão de Marketing',
  'Gestão Comercial',
  'Gestão Operacional'
].map(axis => ({
  axis: axis as EixoGestao,
  questions: SACERDOTAL_PRINCIPLES
    .filter(p => p.axis === axis)
    .map(p => ({
      id: `q_${p.id}`,
      text: p.maturityQuestion || p.businessApplication, // Fallback enquanto carrega metadados
      principleId: p.id,
      weight: p.weight || 3
    }))
}));

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

// Novos cálculos para o Motor de Maturidade Sacerdotal
export function calculateSacerdotalMaturityScore(responses: Record<string, number>): number {
  let totalWeightedScore = 0;
  let totalPossibleWeight = 0;

  SACERDOTAL_PRINCIPLES.forEach(principle => {
    const response = responses[principle.id] ?? 0;
    totalWeightedScore += (response / 5) * principle.weight;
    totalPossibleWeight += principle.weight;
  });

  return totalPossibleWeight > 0 ? Math.round((totalWeightedScore / totalPossibleWeight) * 100) : 0;
}

export function calculateAxisMaturity(responses: Record<string, number>, axis: EixoGestao): number {
  const axisPrinciples = SACERDOTAL_PRINCIPLES.filter(p => p.axis === axis);
  let totalWeightedScore = 0;
  let totalPossibleWeight = 0;

  axisPrinciples.forEach(principle => {
    const response = responses[principle.id] ?? 0;
    totalWeightedScore += (response / 5) * principle.weight;
    totalPossibleWeight += principle.weight;
  });

  return totalPossibleWeight > 0 ? Math.round((totalWeightedScore / totalPossibleWeight) * 100) : 0;
}

export function getMaturityClassification(score: number): { label: string; color: string; bg: string; border: string } {
  if (score <= 20) return { label: 'Crítico', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
  if (score <= 40) return { label: 'Fragilizado', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' };
  if (score <= 60) return { label: 'Estruturando', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
  if (score <= 80) return { label: 'Maduro', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' };
  return { label: 'Referência', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
}

// Cálculo do Score de Alinhamento (baseado em indicadores reais)
export function calculateSacerdotalAlignmentScore(indicators: any[]): number {
  if (!indicators || indicators.length === 0) return 50;

  let score = 0;
  const metricsCount = 5;
  const weightPerMetric = 20;

  const getMetric = (name: string) => indicators.find(i => i.ind.toLowerCase().includes(name.toLowerCase()))?.val || 0;

  // 1. Liquidez (Prudência)
  const liq = getMetric('Liquidez Corrente');
  if (liq > 1.5) score += weightPerMetric;
  else if (liq > 1.0) score += weightPerMetric / 2;

  // 2. Margem EBITDA (Eficiência/Frutificação)
  const ebitda = getMetric('Margem EBITDA');
  if (ebitda > 20) score += weightPerMetric;
  else if (ebitda > 10) score += weightPerMetric / 2;

  // 3. Turnover (Honra/Cultura)
  const turnover = getMetric('Turnover');
  if (turnover > 0 && turnover < 5) score += weightPerMetric;
  else if (turnover < 10) score += weightPerMetric / 2;

  // 4. Inadimplência (Justiça/Gestão)
  const inad = getMetric('Inadimplência');
  if (inad > 0 && inad < 3) score += weightPerMetric;
  else if (inad < 7) score += weightPerMetric / 2;

  // 5. Crescimento (Multiplicação)
  const growth = getMetric('Receita Líquida'); // Simplified check
  if (growth > 0) score += weightPerMetric;

  return Math.min(100, Math.max(0, score));
}

// Validação Cruzada: Ajusta o score qualitativo se os dados quantitativos forem incoerentes
export function crossValidateWithIndicators(responses: Record<string, number>, indicators: any[]): Record<string, number> {
  const adjustedResponses = { ...responses };
  
  // Regras de Incoerência
  const incoherenceRules = [
    {
      principleId: 'gov_1', // Integridade
      metric: 'Índice de Incidentes Éticos',
      condition: (val: number) => val > 0,
      maxMaturity: 2,
      reason: 'Incidentes éticos registrados invalidam percepção de alta integridade.'
    },
    {
      principleId: 'fin_1', // Mordomia Financeira
      metric: 'Inadimplência',
      condition: (val: number) => val > 10,
      maxMaturity: 1,
      reason: 'Inadimplência elevada indica falha na mordomia e controle financeiro.'
    },
    {
      principleId: 'fin_2', // Prudência
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
    },
    {
      principleId: 'com_3', // Justiça na Precificação
      metric: 'Margem Líquida',
      condition: (val: number) => val > 40, // Possível exploração?
      maxMaturity: 3,
      reason: 'Margens excessivamente acima do mercado podem indicar desalinhamento na justiça de preços.'
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
