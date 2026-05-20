const fs = require('fs');
const file = 'src/lib/governanceIntelligence.ts';
let content = fs.readFileSync(file, 'utf8');

const axesData = {
  'Governança Corporativa': {
    verbs: ['Auditar', 'Estruturar', 'Instituir', 'Documentar', 'Avaliar', 'Vincular', 'Revisar', 'Garantir', 'Mapear'],
    contexts: ['políticas de compliance', 'matrizes de risco', 'processos do conselho', 'acordos societários', 'diretrizes éticas', 'fluxos de aprovação', 'regras de conduta'],
    values: ['para mitigar passivos ocultos', 'visando a perenidade do negócio', 'para assegurar conformidade total', 'para maior transparência corporativa']
  },
  'Cultura Organizacional': {
    verbs: ['Promover', 'Treinar', 'Integrar', 'Reconhecer', 'Fomentar', 'Incentivar', 'Mapear', 'Alinhar'],
    contexts: ['rituais de feedback', 'programas de liderança', 'pesquisas de clima', 'ações de engajamento', 'dinâmicas de grupo', 'processos de onboarding'],
    values: ['para aumentar a retenção de talentos', 'visando a segurança psicológica', 'para fortalecer o propósito central', 'para desenvolver o capital humano']
  },
  'Gestão Administrativa e Financeira': {
    verbs: ['Otimizar', 'Reduzir', 'Automatizar', 'Monitorar', 'Projetar', 'Controlar', 'Digitalizar', 'Mensurar'],
    contexts: ['fluxos de caixa', 'orçamentos departamentais', 'rotinas contábeis', 'despesas variáveis', 'processos de compras', 'controles internos'],
    values: ['para maximizar a margem líquida', 'visando a sustentabilidade financeira', 'para evitar quebras de caixa', 'para alocação eficiente de capital']
  },
  'Gestão de Inovação': {
    verbs: ['Testar', 'Prototipar', 'Mapear', 'Acelerar', 'Investir em', 'Explorar', 'Validar', 'Impulsionar'],
    contexts: ['novas tecnologias', 'tendências de mercado', 'ideias disruptivas', 'produtos experimentais', 'processos ágeis', 'sessões de ideação'],
    values: ['para garantir vantagem competitiva', 'visando a diferenciação no mercado', 'para reduzir o tempo de lançamento', 'para fomentar o intraempreendedorismo']
  },
  'Gestão de Marketing': {
    verbs: ['Posicionar', 'Comunicar', 'Monitorar', 'Alavancar', 'Mensurar', 'Afinar', 'Ampliar', 'Desenvolver'],
    contexts: ['narrativas de marca', 'campanhas de atração', 'canais de aquisição', 'dados de mercado', 'relacionamento digital', 'jornada do lead'],
    values: ['para reduzir o custo de aquisição (CAC)', 'visando fortalecer o Brand Equity', 'para aumentar a lembrança de marca', 'para elevar a autoridade no nicho']
  },
  'Gestão Comercial': {
    verbs: ['Fidelizar', 'Prospectar', 'Negociar', 'Reativar', 'Acompanhar', 'Escalar', 'Padronizar', 'Treinar'],
    contexts: ['carteiras de clientes', 'processos de vendas', 'técnicas de conversão', 'indicadores de Churn', 'scripts de atendimento', 'propostas comerciais'],
    values: ['para aumentar o Lifetime Value (LTV)', 'visando bater metas sem ferir a margem', 'para construir relacionamentos longos', 'para alavancar conversões éticas']
  },
  'Gestão Operacional': {
    verbs: ['Padronizar', 'Agilizar', 'Desgargalar', 'Controlar', 'Revisar', 'Qualificar', 'Sistematizar', 'Mapear'],
    contexts: ['procedimentos operacionais (POPs)', 'tempos de entrega (Lead Time)', 'controles de qualidade', 'rotinas de manutenção', 'fluxos de produção', 'auditorias técnicas'],
    values: ['para zerar o retrabalho', 'visando a máxima eficiência operacional', 'para garantir qualidade excepcional', 'para fluidez sem atritos']
  }
};

const generalVerbs = ['Implementar', 'Estruturar', 'Monitorar', 'Garantir', 'Capacitar a equipe em', 'Digitalizar', 'Revisar anualmente', 'Vincular a metas', 'Zelar por', 'Aprofundar', 'Consolidar', 'Analisar'];
const generalContexts = ['rotinas diárias', 'indicadores de performance', 'processos internos', 'rituais de gestão', 'fluxos de trabalho', 'sistemas de gestão', 'reuniões táticas'];
const generalValues = ['visando a excelência', 'para otimizar resultados', 'como pilar estratégico', 'para maior clareza operacional', 'para suportar o crescimento', 'para mitigar desvios operacionais'];

function generatePractices(principleName, axisName, existingRecs, neededCount) {
  const newRecs = new Set(existingRecs);
  const axis = axesData[axisName] || axesData['Gestão Operacional'];
  
  const specificTemplates = [
    `Instituir rituais mensais de monitoramento focado em ${principleName}`,
    `Integrar a avaliação de ${principleName} aos OKRs (Objetivos e Resultados Chave)`,
    `Criar um comitê responsável por garantir a ${principleName} na operação`,
    `Desenvolver indicadores (KPIs) específicos para medir a evolução da ${principleName}`,
    `Capacitar todas as lideranças em práticas avançadas de ${principleName}`,
    `Digitalizar fluxos que garantam a rastreabilidade das ações de ${principleName}`,
    `Vincular os resultados de ${principleName} à avaliação de desempenho e bônus`,
    `Realizar benchmarking trimestral para incorporar inovações ligadas à ${principleName}`,
    `Mapear os riscos de negócio associados à negligência da ${principleName}`,
    `Fomentar a cultura interna de responsabilidade mútua sobre a ${principleName}`,
    `Estabelecer canais de comunicação transparentes e contínuos focados em ${principleName}`,
    `Revisar e atualizar anualmente as políticas internas referentes à ${principleName}`,
    `Implementar auditorias surpresa para validar a aderência prática à ${principleName}`,
    `Criar materiais visuais (Playbooks/Manuais) sobre a aplicação diária da ${principleName}`,
    `Definir "Donos do Processo" responsáveis pela manutenção da ${principleName}`
  ];
  
  for (const t of specificTemplates) {
    if (newRecs.size >= neededCount + existingRecs.length) break;
    newRecs.add(t);
  }
  
  let panicCounter = 0;
  while (newRecs.size < neededCount + existingRecs.length && panicCounter < 1000) {
    panicCounter++;
    const useAxisData = Math.random() > 0.3;
    
    let verb, context, value;
    if (useAxisData) {
      verb = axis.verbs[Math.floor(Math.random() * axis.verbs.length)];
      context = axis.contexts[Math.floor(Math.random() * axis.contexts.length)];
      value = axis.values[Math.floor(Math.random() * axis.values.length)];
    } else {
      verb = generalVerbs[Math.floor(Math.random() * generalVerbs.length)];
      context = generalContexts[Math.floor(Math.random() * generalContexts.length)];
      value = generalValues[Math.floor(Math.random() * generalValues.length)];
    }
    
    const mode = Math.floor(Math.random() * 3);
    let practice = '';
    
    if (mode === 0) {
      practice = `${verb} ${context} que fortaleçam a ${principleName} ${value}`;
    } else if (mode === 1) {
      practice = `${verb} práticas de ${principleName} aplicadas a ${context} ${value}`;
    } else {
      practice = `${verb} ${context} ${value}, tendo a ${principleName} como base`;
    }
    
    newRecs.add(practice);
  }
  
  return Array.from(newRecs);
}

const principleRegex = /id:\s*'[^']+',[\s\S]*?name:\s*'([^']+)',[\s\S]*?axis:\s*'([^']+)'[\s\S]*?executiveRecommendations:\s*\[([\s\S]*?)\]/g;

let match;
const replacements = [];

while ((match = principleRegex.exec(content)) !== null) {
  const fullMatch = match[0];
  const name = match[1];
  const axis = match[2];
  const currentRecsStr = match[3];
  
  const currentRecs = currentRecsStr.split(',').map(s => {
    const m = s.match(/'([^']+)'/);
    return m ? m[1] : null;
  }).filter(Boolean);
  
  const expandedRecs = generatePractices(name, axis, currentRecs, 50 - currentRecs.length);
  const formattedRecs = expandedRecs.slice(0, 50).map(r => `      '${r}'`).join(',\n');
  const replacement = fullMatch.replace(match[3], '\n' + formattedRecs + '\n    ');
  
  replacements.push({
    target: fullMatch,
    replacement: replacement
  });
}

let newContent = content;
for (const rep of replacements) {
  newContent = newContent.replace(rep.target, rep.replacement);
}

fs.writeFileSync(file, newContent, 'utf8');
console.log('Processamento concluído. ' + replacements.length + ' princípios atualizados.');
