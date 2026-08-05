import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  Building, 
  Target, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Users, 
  Compass, 
  Briefcase,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LanguageSelector } from '../../shared/LanguageSelector';
import { CanonicalBrandSignature } from '../../brand/BrandLogo';
import { Locale } from '../../../i18n';

// Multilingual Dictionary Object with English Trademark Preservation
const DICTIONARY: Record<Locale, {
  headerVersion: string;
  navInstitutional: string;
  navAdvisorNetwork: string;
  navTese: string;
  navManifesto: string;
  navStack: string;
  navDominios: string;
  navAdvisory: string;
  navTrust: string;
  navRestricted: string;
  navEvaluate: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroDisclaimer: string;
  thesisTag: string;
  thesisTitle: string;
  thesisPara1: string;
  thesisPara2: string;
  thesisPara3: string;
  thesisFooterTag: string;
  thesisFooterBadge: string;
  manifestoTag: string;
  manifestoTitle: string;
  manifestoPara1: string;
  manifestoPara2: string;
  manifestoPara3: string;
  manifestoQuoteTag: string;
  manifestoQuote: string;
  manifestoQuoteSub: string;
  whyNowTag: string;
  whyNowTitle: string;
  whyNowSub: string;
  whyNowCards: { num: string; title: string; desc: string }[];
  loopTag: string;
  loopTitle: string;
  loopSub: string;
  loopSteps: { step: string; name: string; desc: string }[];
  stackTag: string;
  stackTitle: string;
  stackSub: string;
  stackLayers: { layer: string; name: string; role: string }[];
  paradigmTag: string;
  paradigmTitle: string;
  paradigmTraditionalTitle: string;
  paradigmTraditionalTag: string;
  paradigmTraditionalSteps: string[];
  paradigmIllumineTitle: string;
  paradigmIllumineTag: string;
  paradigmIllumineSteps: string[];
  domainsTag: string;
  domainsTitle: string;
  domainsSub: string;
  domainsObservedSignalsTag: string;
  domainsList: { question: string; desc: string; insights: string[] }[];
  advisoryTag: string;
  advisoryTitle: string;
  advisorySub: string;
  advisoryCards: { title: string; desc: string }[];
  governanceTag: string;
  governanceTitle: string;
  governanceSub: string;
  esgimCards: { letter: string; name: string; desc: string }[];
  trustTag: string;
  trustTitle: string;
  trustCards: { title: string; desc: string }[];
  transformTag: string;
  transformTitle: string;
  transformTableBeforeHeader: string;
  transformTableAfterHeader: string;
  transformTable: { antes: string; depois: string }[];
  useCasesTag: string;
  useCasesTitle: string;
  useCasesCards: { title: string; desc: string }[];
  closingTag: string;
  closingQuote: string;
  closingSub: string;
  closingCtaPrimary: string;
  closingCtaSecondary: string;
  footerRights: string;
  footerTop: string;
  footerPartners: string;
  footerLogin: string;
}> = {
  'pt-BR': {
    headerVersion: 'Institutional Experience v2.0',
    navInstitutional: 'Institucional',
    navAdvisorNetwork: 'Advisor Network',
    navTese: 'Tese & Manifesto',
    navManifesto: 'Manifesto',
    navStack: 'Intelligence Stack™',
    navDominios: 'Domínios',
    navAdvisory: 'Advisory™',
    navTrust: 'Trust',
    navRestricted: 'Acesso Restrito',
    navEvaluate: 'Avaliar Robustez',
    heroBadge: 'The Assisted Digital Executive Board',
    heroHeadline: 'As melhores decisões são tomadas antes que os problemas se tornem visíveis.',
    heroSubheadline: 'Uma camada institucional de inteligência executiva que conecta dados financeiros, operacionais, fiduciários e estratégicos para apoiar decisões de diretores e conselhos em tempo real.',
    heroCtaPrimary: 'Avaliar Robustez Organizacional',
    heroCtaSecondary: 'Conhecer a Plataforma',
    heroDisclaimer: 'Uma camada institucional que amplia a capacidade de análise e interpretação de líderes, sem substituir o julgamento humano ou a responsabilidade executiva.',
    thesisTag: 'Tese Fundacional',
    thesisTitle: 'O Paradoxo da Informação Corporativa',
    thesisPara1: 'As organizações foram construídas para administrar operações. Entretanto, o ambiente empresarial tornou-se exponencialmente mais complexo do que os modelos de gestão tradicionais conseguem interpretar.',
    thesisPara2: 'Nos últimos anos, a quantidade de dados disponíveis cresceu continuamente, mas a capacidade das organizações de transformar esses dados em decisões executivas consistentes não evoluiu na mesma velocidade.',
    thesisPara3: 'as empresas nunca tiveram tanta informação e nunca enfrentaram tanta dificuldade para interpretar sua própria realidade.',
    thesisFooterTag: 'Tese Fundacional da Illumine Executive Intelligence Platform',
    thesisFooterBadge: 'Aprendizado Institucional Contínuo',
    manifestoTag: 'Manifesto de Inteligência Executiva',
    manifestoTitle: 'Do Controle de Operações ao Aprendizado Contínuo',
    manifestoPara1: 'As organizações do século XX foram construídas para controlar operações. As organizações do século XXI precisam aprender continuamente.',
    manifestoPara2: 'Durante décadas, executivos dependeram de planilhas, dashboards isolados, reuniões extensas e interpretações subjetivas para compreender a realidade. Hoje, a velocidade dos mercados tornou esse modelo insuficiente.',
    manifestoPara3: 'A próxima geração de organizações será capaz de observar continuamente seus sinais, interpretar relações invisíveis, antecipar riscos, priorizar decisões e aprender institucionalmente a partir de cada resultado.',
    manifestoQuoteTag: 'Nossa Convicção Institucional',
    manifestoQuote: '“Toda organização produz dados. Poucas conseguem transformá-los em decisões. Menos ainda conseguem transformar decisões em aprendizado organizacional.”',
    manifestoQuoteSub: 'Visão que orienta a arquitetura de toda a plataforma Illumine.',
    whyNowTag: 'Por que Agora',
    whyNowTitle: 'Por que a gestão tradicional não responde mais ao tempo presente',
    whyNowSub: 'Quatro vetores de aceleração que tornaram o modelo de relatórios estáticos obsoleto:',
    whyNowCards: [
      { num: '01', title: 'Complexidade Exponencial', desc: 'Múltiplas fontes de dados desconectados ocultam fricções operacionais e financeiras até se tornarem crises.' },
      { num: '02', title: 'Velocidade da IA', desc: 'A aceleração tecnológica exige interpretação contínua de sinais em tempo real, não diagnósticos trimestrais.' },
      { num: '03', title: 'Riscos Interconectados', desc: 'Falhas de liquidez, governança e reputação ocorrem de forma cruzada e simultânea.' },
      { num: '04', title: 'Decisões com Baixa Visibilidade', desc: 'Tomar decisões estratégicas sob dados fragmentados destrói valor e compromete a continuidade.' }
    ],
    loopTag: 'Institutional Learning Loop™',
    loopTitle: 'O Ciclo de Inteligência & Aprendizado Organizacional',
    loopSub: 'O mecanismo intelectual contínuo que transforma dados em evolução institucional:',
    loopSteps: [
      { step: '01', name: 'OBSERVAR', desc: 'Monitoramento de sinais' },
      { step: '02', name: 'INTERPRETAR', desc: 'Análise causal' },
      { step: '03', name: 'DECIDIR', desc: 'Priorização estratégica' },
      { step: '04', name: 'EXECUTAR', desc: 'Plano de ação' },
      { step: '05', name: 'MEDIR', desc: 'Acompanhamento' },
      { step: '06', name: 'APRENDER', desc: 'Memória institucional' },
      { step: '07', name: 'EVOLUIR', desc: 'Novo ciclo' }
    ],
    stackTag: 'Executive Intelligence Stack™',
    stackTitle: 'A Arquitetura de Inteligência de 6 Camadas',
    stackSub: 'Como a Illumine conecta a infraestrutura de dados existente à decisão executiva do conselho:',
    stackLayers: [
      { layer: 'Layer 6', name: 'Executive Advisory™', role: 'Decisão, priorização e acompanhamento executivo contínuo' },
      { layer: 'Layer 5', name: 'Institutional Learning Loop™', role: 'Aprendizado organizacional, memória histórica e evolução contínua' },
      { layer: 'Layer 4', name: 'Executive Intelligence Agents™', role: 'Interpretação especializada por domínios de inteligência' },
      { layer: 'Layer 3', name: 'Executive Intelligence Engines™', role: 'Motores analíticos de correlação, análise causal e priorização estratégica' },
      { layer: 'Layer 2', name: 'Observability Layer', role: 'Monitoramento contínuo, detecção de desvios e sinais precoces' },
      { layer: 'Layer 1', name: 'Enterprise Data Foundation', role: 'ERP, CRM, Dados Financeiros, Operacionais, Fiduciários e Pessoas' }
    ],
    paradigmTag: 'Mudança de Paradigma',
    paradigmTitle: 'Uma nova categoria de infraestrutura decisória',
    paradigmTraditionalTitle: 'Modelo Tradicional (Fragmentado)',
    paradigmTraditionalTag: 'Reativo',
    paradigmTraditionalSteps: [
      'ERP / CRM (Silos Isolados)',
      'Planilhas manuais e consolidadores',
      'BI com relatórios passivos',
      'Reuniões extensas de alinhamento',
      'Decisão reativa após a crise instalada'
    ],
    paradigmIllumineTitle: 'Modelo Illumine (Executive Intelligence)',
    paradigmIllumineTag: 'Antecipatório',
    paradigmIllumineSteps: [
      'Enterprise Data Foundation',
      'Executive Intelligence Network™ & Engines™',
      'Executive Intelligence Agents™',
      'Executive Advisory™ (Recomendações Priorizadas)',
      'Aprendizado Institucional Contínuo'
    ],
    domainsTag: 'Executive Intelligence Network™',
    domainsTitle: 'Infraestrutura de Conhecimento por Domínios Especializados',
    domainsSub: 'Nove capacidades dedicadas que observam, correlacionam e produzem inteligência decisória:',
    domainsObservedSignalsTag: 'Sinais & Evidências Observadas:',
    domainsList: [
      {
        question: 'A organização protege valor e assegura conformidade fiduciária?',
        desc: 'Supervisão ativa de conformidade societária, limites de alçada, acordos de sócios e salvaguardas fiduciárias.',
        insights: ['Auditoria Ativa de Alçadas', 'Aderência a Acordos de Sócios', 'Mitigação de Contingências Fiscais']
      },
      {
        question: 'A estrutura de capital produz valor real e liquidez sustentável?',
        desc: 'Análise contínua do ROIC real, geração de caixa vs. lucro contábil e eliminação de custos invisíveis.',
        insights: ['Retorno sobre Capital Empregado (ROIC)', 'Geração de Caixa vs. Lucro Contábil', 'Asfixia Oculta de Capital de Giro']
      },
      {
        question: 'Os processos operacionais sustentam o ritmo de expansão?',
        desc: 'Mapeamento de gargalos físicos com impacto financeiro e elasticidade operacional dos custos.',
        insights: ['Elasticidade Operacional dos Custos', 'Gargalos Físicos de Alto Impacto', 'Eficiência dos Fluxos Produtivos']
      },
      {
        question: 'O crescimento em vendas constrói margem sustentável ou asfixia o caixa?',
        desc: 'Diagnóstico da qualidade da receita, margem de contribuição por cliente e sustentabilidade comercial.',
        insights: ['Qualidade da Receita Recorrente', 'Margem de Contribuição Efetiva', 'Custo de Aquisição vs. LTV Real']
      },
      {
        question: 'A continuidade depende excessivamente de pessoas-chave?',
        desc: 'Avaliação de dependência de fundadores, mecanismos de sucessão e resiliência do capital humano.',
        insights: ['Mecanismos de Sucessão Executiva', 'Dependência de Pessoas-Chave', 'Índice de Alinhamento da Liderança']
      },
      {
        question: 'A organização antecipa volatilidades ou reage apenas a crises?',
        desc: 'Stress tests sistemáticos, exposição a garantias cruzadas e mitigação preventiva de riscos de mercado.',
        insights: ['Stress Tests Macroeconômicos', 'Exposição a Garantias e Fianças', 'Radar de Riscos Regulatórios']
      },
      {
        question: 'A reputação e a marca sobrevivem além das pessoas que as construíram?',
        desc: 'Preservação de ativos intangíveis, governança de marcas e fortalecimento da perenidade institucional.',
        insights: ['Proteção do Valor de Marca', 'Resiliência contra Crises Reputacionais', 'Estruturação Fiduciária de Ativos']
      },
      {
        question: 'As decisões operacionais cumprem a missão fundadora?',
        desc: 'Verificação da coerência entre o propósito declarado e a realidade da execução diária.',
        insights: ['Mapeamento de Desvios de Missão', 'Coerência Decisória com Propósito', 'Preservação de Princípios Fundadores']
      },
      {
        question: 'A organização desenvolve capacidades futuras ou apenas defende o modelo atual?',
        desc: 'Avaliação da taxa de adaptação a novos ciclos tecnológicos e renovação do modelo de negócios.',
        insights: ['Radar de Tendências de Disrupção', 'Capacidade de Renovação do Modelo', 'Vetor de Longevidade Tecnológica']
      }
    ],
    advisoryTag: 'Executive Advisory™',
    advisoryTitle: 'O Sistema Operacional de Decisão Executiva',
    advisorySub: 'A plataforma não apenas mede e gera relatórios. Ela apoia ativamente a liderança em cada etapa decisória:',
    advisoryCards: [
      { title: 'Observa', desc: 'Monitora continuamente vetores de risco e sinais de fricção operacional.' },
      { title: 'Interpreta', desc: 'Correlaciona causas invisíveis por trás dos indicadores financeiros.' },
      { title: 'Explica', desc: 'Fornece fundamentação clara e explicabilidade fiduciária sem caixa-preta.' },
      { title: 'Recomenda', desc: 'Produz planos de ação estratégicos ordenados por retorno e impacto.' },
      { title: 'Prioriza', desc: 'Filtra o ruído operacional e direciona o foco da diretoria ao que é crítico.' },
      { title: 'Aprende', desc: 'Registra o histórico de decisões e ajusta os modelos a cada novo ciclo.' }
    ],
    governanceTag: 'Inteligência em Governança & ESGIM™',
    governanceTitle: 'A Dimensão Fiduciária & Framework ESGIM™',
    governanceSub: 'O reposicionamento do Illumine Governance™ como o domínio fiduciário central da plataforma, mensurado pelo framework proprietário ESGIM™:',
    esgimCards: [
      { letter: 'E', name: 'Environmental', desc: 'Resiliência socioambiental e sustentabilidade operacional.' },
      { letter: 'S', name: 'Social', desc: 'Desenvolvimento do capital humano e tecido relacional.' },
      { letter: 'G', name: 'Governance', desc: 'Sucessão, alçadas decisórias e conformidade societária.' },
      { letter: 'I', name: 'Institutional', desc: 'Salvaguarda de marca, reputação e preservação de legado.' },
      { letter: 'M', name: 'Mission', desc: 'Alinhamento da operação com a missão fundadora.' }
    ],
    trustTag: 'Credibilidade Executiva',
    trustTitle: 'Por que Conselhos e Lideranças Confiam na Illumine',
    trustCards: [
      { title: 'Metodologia Proprietária', desc: 'Frameworks testados em ambientes corporativos de alta complexidade.' },
      { title: 'Arquitetura Canônica', desc: 'Estruturação fiduciária rigorosa baseada no Executive Design System.' },
      { title: 'Governança Ativa de Dados', desc: 'Segurança de nível enterprise, conformidade e isolamento de informações.' },
      { title: 'Observabilidade Total', desc: 'Rastreabilidade ponta a ponta das evidências que fundamentam cada análise.' },
      { title: 'Explicabilidade sem Caixa-Preta', desc: 'Todas as recomendações apresentam a causa raiz e o racional de cálculo.' },
      { title: 'Auditoria & Audit-Trail', desc: 'Registro histórico imutável das decisões tomadas ao longo do tempo.' }
    ],
    transformTag: 'Transformação Executiva',
    transformTitle: 'O que muda no dia a dia da diretoria',
    transformTableBeforeHeader: 'Antes da Illumine (Reativo)',
    transformTableAfterHeader: 'Depois da Illumine (Antecipatório)',
    transformTable: [
      { antes: 'Reuniões de conselho dedicadas a discutir a veracidade dos dados.', depois: 'Reuniões de conselho focadas em decisões estratégicas fundamentadas.' },
      { antes: 'Planilhas dispersas e indicadores desconectados por área.', depois: 'Inteligência executiva integrada em 9 domínios em tempo real.' },
      { antes: 'Descoberta de gargalos e riscos apenas quando viram crises.', depois: 'Identificação antecipada de sinais precoces e fricções invisíveis.' },
      { antes: 'Decisões intuitivas sem rastreabilidade histórica.', depois: 'Advisory contínuo com explicabilidade fiduciária e aprendizado.' },
      { antes: 'Dependência excessiva da memória de pessoas-chave.', depois: 'Memória e inteligência institucional preservadas no negócio.' }
    ],
    useCasesTag: 'Organizações Complexas',
    useCasesTitle: 'Desenvolvido para estruturas de alta complexidade',
    useCasesCards: [
      { title: 'Holdings & Grupos Econômicos', desc: 'Consolidação de riscos cruzados e visibilidade fiduciária de portfólio.' },
      { title: 'Hospitais & Saúde', desc: 'Complexidade regulatória, proteção de fluxos de caixa e governança clínica.' },
      { title: 'Empresas Familiares', desc: 'Transição geracional, preservação do legado e governança de sócios.' },
      { title: 'Indústrias', desc: 'Mitigação de volatilidade operacional e resiliência do capital de giro.' },
      { title: 'Terceiro Setor', desc: 'Proteção contra desvios de missão e governança de doadores.' },
      { title: 'Organizações por Propósito', desc: 'Alinhamento permanente entre princípios fundadores e execução comercial.' }
    ],
    closingTag: 'Perpetuidade & Continuidade Institucional',
    closingQuote: '“A próxima geração de organizações não será definida apenas pela capacidade de executar melhor. Será definida pela capacidade de compreender melhor, decidir melhor e aprender continuamente.”',
    closingSub: 'Essa é a base da Illumine Executive Intelligence Platform.',
    closingCtaPrimary: 'Solicitar Diagnóstico Executivo',
    closingCtaSecondary: 'Falar com um Executive Advisor',
    footerRights: '© 2026 Illumine Executive Intelligence Platform. Todos os direitos reservados.',
    footerTop: 'Voltar ao Topo',
    footerPartners: 'Executive Advisor Network™',
    footerLogin: 'Acesso Restrito'
  },
  'en-US': {
    headerVersion: 'Institutional Experience v2.0',
    navInstitutional: 'Institutional',
    navAdvisorNetwork: 'Advisor Network',
    navTese: 'Thesis & Manifesto',
    navManifesto: 'Manifesto',
    navStack: 'Intelligence Stack™',
    navDominios: 'Domains',
    navAdvisory: 'Advisory™',
    navTrust: 'Trust',
    navRestricted: 'Restricted Access',
    navEvaluate: 'Assess Robustness',
    heroBadge: 'The Assisted Digital Executive Board',
    heroHeadline: 'The best decisions are made before problems become visible.',
    heroSubheadline: 'An institutional layer of executive intelligence connecting financial, operational, fiduciary, and strategic data to support board and executive decisions in real time.',
    heroCtaPrimary: 'Evaluate Organizational Robustness',
    heroCtaSecondary: 'Explore the Platform',
    heroDisclaimer: 'An institutional layer that amplifies leadership analysis and interpretation without replacing human judgment or executive responsibility.',
    thesisTag: 'Foundational Thesis',
    thesisTitle: 'The Corporate Information Paradox',
    thesisPara1: 'Organizations were built to manage operations. However, the business environment has become exponentially more complex than traditional management models can interpret.',
    thesisPara2: 'In recent years, the amount of available data has grown continuously, but organizations’ capacity to turn that data into consistent executive decisions has not evolved at the same pace.',
    thesisPara3: 'companies have never had so much information and have never faced such difficulty interpreting their own reality.',
    thesisFooterTag: 'Foundational Thesis of Illumine Executive Intelligence Platform',
    thesisFooterBadge: 'Continuous Institutional Learning',
    manifestoTag: 'Executive Intelligence Manifesto',
    manifestoTitle: 'From Operational Control to Continuous Learning',
    manifestoPara1: 'Twentieth-century organizations were built to control operations. Twenty-first-century organizations need to learn continuously.',
    manifestoPara2: 'For decades, executives relied on spreadsheets, isolated dashboards, lengthy meetings, and subjective interpretations to understand reality. Today, market velocity has made that model insufficient.',
    manifestoPara3: 'The next generation of organizations will continuously observe their signals, interpret invisible relationships, anticipate risks, prioritize decisions, and institutionally learn from every outcome.',
    manifestoQuoteTag: 'Our Institutional Conviction',
    manifestoQuote: '“Every organization produces data. Few manage to turn it into decisions. Fewer still manage to turn decisions into organizational learning.”',
    manifestoQuoteSub: 'The vision guiding the architecture of the entire Illumine platform.',
    whyNowTag: 'Why Now',
    whyNowTitle: 'Why traditional management no longer responds to the present era',
    whyNowSub: 'Four acceleration vectors that rendered static reporting models obsolete:',
    whyNowCards: [
      { num: '01', title: 'Exponential Complexity', desc: 'Multiple disconnected data sources conceal operational and financial friction until they turn into crises.' },
      { num: '02', title: 'AI Velocity', desc: 'Technological acceleration requires continuous real-time signal interpretation, not quarterly diagnostics.' },
      { num: '03', title: 'Interconnected Risks', desc: 'Liquidity, governance, and reputational failures occur in cross-functional, simultaneous ways.' },
      { num: '04', title: 'Low-Visibility Decisions', desc: 'Making strategic decisions under fragmented data destroys value and compromises continuity.' }
    ],
    loopTag: 'Institutional Learning Loop™',
    loopTitle: 'The Intelligence & Organizational Learning Cycle',
    loopSub: 'The continuous intellectual engine turning data into institutional evolution:',
    loopSteps: [
      { step: '01', name: 'OBSERVE', desc: 'Signal monitoring' },
      { step: '02', name: 'INTERPRET', desc: 'Causal analysis' },
      { step: '03', name: 'DECIDE', desc: 'Strategic prioritization' },
      { step: '04', name: 'EXECUTE', desc: 'Action plan' },
      { step: '05', name: 'MEASURE', desc: 'Performance tracking' },
      { step: '06', name: 'LEARN', desc: 'Institutional memory' },
      { step: '07', name: 'EVOLVE', desc: 'New cycle' }
    ],
    stackTag: 'Executive Intelligence Stack™',
    stackTitle: 'The 6-Layer Intelligence Architecture',
    stackSub: 'How Illumine connects existing data infrastructure to executive board decisions:',
    stackLayers: [
      { layer: 'Layer 6', name: 'Executive Advisory™', role: 'Continuous executive decision-making, prioritization, and tracking' },
      { layer: 'Layer 5', name: 'Institutional Learning Loop™', role: 'Organizational learning, historical memory, and continuous evolution' },
      { layer: 'Layer 4', name: 'Executive Intelligence Agents™', role: 'Specialized interpretation across intelligence domains' },
      { layer: 'Layer 3', name: 'Executive Intelligence Engines™', role: 'Analytical correlation engines, causal analysis, and strategic prioritization' },
      { layer: 'Layer 2', name: 'Observability Layer', role: 'Continuous monitoring, anomaly detection, and early warning signals' },
      { layer: 'Layer 1', name: 'Enterprise Data Foundation', role: 'ERP, CRM, Financial, Operational, Fiduciaries, and People Data' }
    ],
    paradigmTag: 'Paradigm Shift',
    paradigmTitle: 'A new category of decision infrastructure',
    paradigmTraditionalTitle: 'Traditional Model (Fragmented)',
    paradigmTraditionalTag: 'Reactive',
    paradigmTraditionalSteps: [
      'ERP / CRM (Isolated Silos)',
      'Manual spreadsheets and aggregators',
      'BI with passive reporting',
      'Extensive alignment meetings',
      'Reactive decisions after crises install'
    ],
    paradigmIllumineTitle: 'Illumine Model (Executive Intelligence)',
    paradigmIllumineTag: 'Anticipatory',
    paradigmIllumineSteps: [
      'Enterprise Data Foundation',
      'Executive Intelligence Network™ & Engines™',
      'Executive Intelligence Agents™',
      'Executive Advisory™ (Prioritized Recommendations)',
      'Continuous Institutional Learning'
    ],
    domainsTag: 'Executive Intelligence Network™',
    domainsTitle: 'Knowledge Infrastructure across Specialized Domains',
    domainsSub: 'Nine dedicated capabilities observing, correlating, and producing decision intelligence:',
    domainsObservedSignalsTag: 'Observed Signals & Evidence:',
    domainsList: [
      {
        question: 'Does the organization protect value and ensure fiduciary compliance?',
        desc: 'Active oversight of corporate compliance, authority thresholds, shareholder agreements, and fiduciary safeguards.',
        insights: ['Active Authority Auditing', 'Shareholder Agreement Adherence', 'Fiscal Contingency Mitigation']
      },
      {
        question: 'Does capital structure generate real value and sustainable liquidity?',
        desc: 'Continuous analysis of real ROIC, cash generation vs. accounting profit, and elimination of hidden costs.',
        insights: ['Return on Invested Capital (ROIC)', 'Cash Generation vs. Accounting Profit', 'Hidden Working Capital Squeeze']
      },
      {
        question: 'Do operational processes support the pace of expansion?',
        desc: 'Mapping physical bottlenecks with financial impact and cost operational elasticity.',
        insights: ['Cost Operational Elasticity', 'High-Impact Physical Bottlenecks', 'Production Flow Efficiency']
      },
      {
        question: 'Does sales growth build sustainable margins or drain cash?',
        desc: 'Revenue quality diagnosis, contribution margin per customer, and commercial sustainability.',
        insights: ['Recurring Revenue Quality', 'Effective Contribution Margin', 'Acquisition Cost vs. Real LTV']
      },
      {
        question: 'Is continuity overly dependent on key individuals?',
        desc: 'Founder dependency assessment, succession mechanisms, and human capital resilience.',
        insights: ['Executive Succession Mechanisms', 'Key Individual Dependency', 'Leadership Alignment Index']
      },
      {
        question: 'Does the organization anticipate volatility or react only to crises?',
        desc: 'Systematic stress testing, cross-guarantee exposure, and preventive market risk mitigation.',
        insights: ['Macroeconomic Stress Tests', 'Guarantees & Sureties Exposure', 'Regulatory Risk Radar']
      },
      {
        question: 'Will reputation and brand survive beyond the people who built them?',
        desc: 'Preservation of intangible assets, brand governance, and strengthening institutional perenity.',
        insights: ['Brand Value Protection', 'Reputational Crisis Resilience', 'Fiduciary Structuring of Assets']
      },
      {
        question: 'Do operational decisions fulfill the founding mission?',
        desc: 'Verification of coherence between declared purpose and daily operational execution.',
        insights: ['Mission Drift Mapping', 'Purpose-Driven Decision Coherence', 'Founding Principles Preservation']
      },
      {
        question: 'Does the organization develop future capabilities or merely defend its current model?',
        desc: 'Evaluation of adaptation speed to new technological cycles and business model renewal.',
        insights: ['Disruption Trend Radar', 'Business Model Renewal Rate', 'Technological Longevity Vector']
      }
    ],
    advisoryTag: 'Executive Advisory™',
    advisoryTitle: 'The Executive Decision Operating System',
    advisorySub: 'The platform does not merely measure and output reports. It actively supports leadership at every decision stage:',
    advisoryCards: [
      { title: 'Observes', desc: 'Continuously monitors risk vectors and operational friction signals.' },
      { title: 'Interprets', desc: 'Correlates invisible root causes behind financial indicators.' },
      { title: 'Explains', desc: 'Provides clear rationale and fiduciary explainability with zero black boxes.' },
      { title: 'Recommends', desc: 'Produces strategic action plans ordered by return and impact.' },
      { title: 'Prioritizes', desc: 'Filters operational noise and focuses board attention on what is critical.' },
      { title: 'Learns', desc: 'Records decision history and refines models with every new cycle.' }
    ],
    governanceTag: 'Governance Intelligence™ & ESGIM™',
    governanceTitle: 'Fiduciary Dimension & ESGIM™ Framework',
    governanceSub: 'The repositioning of Illumine Governance™ as the central fiduciary domain, measured by the proprietary ESGIM™ framework:',
    esgimCards: [
      { letter: 'E', name: 'Environmental', desc: 'Socioenvironmental resilience and operational sustainability.' },
      { letter: 'S', name: 'Social', desc: 'Human capital development and relational fabric.' },
      { letter: 'G', name: 'Governance', desc: 'Succession, authority thresholds, and corporate compliance.' },
      { letter: 'I', name: 'Institutional', desc: 'Brand safeguard, reputational protection, and legacy preservation.' },
      { letter: 'M', name: 'Mission', desc: 'Operational alignment with the founding mission.' }
    ],
    trustTag: 'Executive Trust',
    trustTitle: 'Why Boards and Leadership Trust Illumine',
    trustCards: [
      { title: 'Proprietary Methodology', desc: 'Frameworks tested in high-complexity corporate environments.' },
      { title: 'Canonical Architecture', desc: 'Rigorous fiduciary structuring based on the Executive Design System.' },
      { title: 'Active Data Governance', desc: 'Enterprise-grade security, compliance, and data isolation.' },
      { title: 'Total Observability', desc: 'End-to-end traceability of evidence backing every analysis.' },
      { title: 'Explainability without Black Boxes', desc: 'All recommendations show root causes and calculation rationale.' },
      { title: 'Audit Trail', desc: 'Immutable historical ledger of executive decisions over time.' }
    ],
    transformTag: 'Executive Transformation',
    transformTitle: 'What changes in daily board operations',
    transformTableBeforeHeader: 'Before Illumine (Reactive)',
    transformTableAfterHeader: 'After Illumine (Anticipatory)',
    transformTable: [
      { antes: 'Board meetings spent debating data accuracy.', depois: 'Board meetings focused on grounded strategic decisions.' },
      { antes: 'Dispersed spreadsheets and disconnected KPIs by department.', depois: 'Executive intelligence integrated across 9 domains in real time.' },
      { antes: 'Discovering bottlenecks and risks only when they become crises.', depois: 'Early detection of weak signals and invisible frictions.' },
      { antes: 'Intuitive decisions without historical traceability.', depois: 'Continuous Advisory with fiduciary explainability and learning.' },
      { antes: 'Overreliance on key individuals’ memory.', depois: 'Institutional memory and intelligence preserved within the business.' }
    ],
    useCasesTag: 'Complex Organizations',
    useCasesTitle: 'Engineered for high-complexity enterprise structures',
    useCasesCards: [
      { title: 'Holdings & Conglomerates', desc: 'Cross-risk consolidation and portfolio fiduciary visibility.' },
      { title: 'Hospitals & Healthcare', desc: 'Regulatory complexity, cash flow protection, and clinical governance.' },
      { title: 'Family Businesses', desc: 'Generational transition, legacy preservation, and shareholder governance.' },
      { title: 'Manufacturing & Industry', desc: 'Operational volatility mitigation and working capital resilience.' },
      { title: 'Non-Profit / Third Sector', desc: 'Protection against mission drift and donor governance.' },
      { title: 'Purpose-Driven Entities', desc: 'Permanent alignment between founding principles and commercial execution.' }
    ],
    closingTag: 'Perpetuity & Institutional Continuity',
    closingQuote: '“The next generation of organizations will not be defined merely by their ability to execute better. They will be defined by their ability to understand better, decide better, and learn continuously.”',
    closingSub: 'This is the foundation of the Illumine Executive Intelligence Platform.',
    closingCtaPrimary: 'Request Executive Diagnostic',
    closingCtaSecondary: 'Speak with an Executive Advisor',
    footerRights: '© 2026 Illumine Executive Intelligence Platform. All rights reserved.',
    footerTop: 'Back to Top',
    footerPartners: 'Executive Advisor Network™',
    footerLogin: 'Restricted Access'
  },
  'es-ES': {
    headerVersion: 'Institutional Experience v2.0',
    navInstitutional: 'Institucional',
    navAdvisorNetwork: 'Advisor Network',
    navTese: 'Tesis y Manifiesto',
    navManifesto: 'Manifiesto',
    navStack: 'Intelligence Stack™',
    navDominios: 'Dominios',
    navAdvisory: 'Advisory™',
    navTrust: 'Trust',
    navRestricted: 'Acceso Restringido',
    navEvaluate: 'Evaluar Robustez',
    heroBadge: 'The Assisted Digital Executive Board',
    heroHeadline: 'Las mejores decisiones se toman antes de que los problemas se vuelvan visibles.',
    heroSubheadline: 'Una capa institucional de inteligencia ejecutiva que conecta datos financieros, operacionales, fiduciarios y estratégicos para apoyar decisiones del consejo y directiva en tiempo real.',
    heroCtaPrimary: 'Evaluar Robustez Organizacional',
    heroCtaSecondary: 'Conocer la Plataforma',
    heroDisclaimer: 'Una capa institucional que amplía la capacidad de análisis de líderes, sin sustituir el juicio humano o la responsabilidad ejecutiva.',
    thesisTag: 'Tesis Fundacional',
    thesisTitle: 'El Paradoja de la Información Corporativa',
    thesisPara1: 'Las organizaciones fueron construidas para administrar operaciones. Sin embargo, el entorno empresarial se ha vuelto exponencialmente más complejo de lo que los modelos tradicionales pueden interpretar.',
    thesisPara2: 'En los últimos años, la cantidad de datos ha crecido continuamente, pero la capacidad de transformar esos datos en decisiones consistentes no ha evolucionado al mismo ritmo.',
    thesisPara3: 'las empresas nunca han tenido tanta información y nunca han enfrentado tanta dificultad para interpretar su propia realidad.',
    thesisFooterTag: 'Tesis Fundacional de Illumine Executive Intelligence Platform',
    thesisFooterBadge: 'Aprendizaje Institucional Continuo',
    manifestoTag: 'Manifiesto de Inteligencia Ejecutiva',
    manifestoTitle: 'Del Control Operacional al Aprendizaje Continuo',
    manifestoPara1: 'Las organizaciones del siglo XX fueron construidas para controlar operaciones. Las del siglo XXI necesitan aprender continuamente.',
    manifestoPara2: 'Durante décadas, los ejecutivos dependieron de hojas de cálculo, dashboards aislados y reuniones extensas. Hoy, la velocidad de los mercados torna ese modelo insuficiente.',
    manifestoPara3: 'La próxima generación de organizaciones observará continuamente sus señales, interpretará relaciones invisibles, anticipará riesgos y aprenderá institucionalmente de cada resultado.',
    manifestoQuoteTag: 'Nuestra Convicción Institucional',
    manifestoQuote: '“Toda organización produce datos. Pocas logran transformarlos en decisiones. Menos aún logran transformar decisiones en aprendizaje organizacional.”',
    manifestoQuoteSub: 'Visión que orienta la arquitectura de toda la plataforma Illumine.',
    whyNowTag: '¿Por qué ahora?',
    whyNowTitle: 'Por qué la gestión tradicional ya no responde al tiempo presente',
    whyNowSub: 'Cuatro vectores de aceleración que volvieron obsoletos los informes estáticos:',
    whyNowCards: [
      { num: '01', title: 'Complejidad Exponencial', desc: 'Múltiples fuentes de datos desconectados ocultan fricciones hasta convertirse en crisis.' },
      { num: '02', title: 'Velocidad de la IA', desc: 'La aceleración tecnológica exige interpretación continua en tiempo real, no diagnósticos trimestrales.' },
      { num: '03', title: 'Riesgos Interconectados', desc: 'Fallas de liquidez, gobernanza y reputación ocurren de manera cruzada y simultánea.' },
      { num: '04', title: 'Decisiones con Baja Visibilidad', desc: 'Tomar decisiones bajo datos fragmentados destruye valor y compromete la continuidad.' }
    ],
    loopTag: 'Institutional Learning Loop™',
    loopTitle: 'El Ciclo de Inteligencia y Aprendizaje Organizacional',
    loopSub: 'El mecanismo intelectual continuo que transforma datos en evolución institucional:',
    loopSteps: [
      { step: '01', name: 'OBSERVAR', desc: 'Monitoreo de señales' },
      { step: '02', name: 'INTERPRETAR', desc: 'Análisis causal' },
      { step: '03', name: 'DECIDIR', desc: 'Priorización estratégica' },
      { step: '04', name: 'EJECUTAR', desc: 'Plan de acción' },
      { step: '05', name: 'MEDIR', desc: 'Seguimiento' },
      { step: '06', name: 'APRENDER', desc: 'Memoria institucional' },
      { step: '07', name: 'EVOLUCIONAR', desc: 'Nuevo ciclo' }
    ],
    stackTag: 'Executive Intelligence Stack™',
    stackTitle: 'La Arquitectura de Inteligencia de 6 Capas',
    stackSub: 'Cómo Illumine conecta la infraestructura de datos existente con las decisiones del consejo:',
    stackLayers: [
      { layer: 'Layer 6', name: 'Executive Advisory™', role: 'Decisión, priorización y acompañamiento ejecutivo continuo' },
      { layer: 'Layer 5', name: 'Institutional Learning Loop™', role: 'Aprendizaje organizacional, memoria histórica y evolución continua' },
      { layer: 'Layer 4', name: 'Executive Intelligence Agents™', role: 'Interpretación especializada por dominios de inteligencia' },
      { layer: 'Layer 3', name: 'Executive Intelligence Engines™', role: 'Motores analíticos de correlación, análisis causal y priorización' },
      { layer: 'Layer 2', name: 'Observability Layer', role: 'Monitoreo continuo, detección de desvíos y señales tempranas' },
      { layer: 'Layer 1', name: 'Enterprise Data Foundation', role: 'ERP, CRM, Datos Financieros, Operacionales, Fiduciarios y Personas' }
    ],
    paradigmTag: 'Cambio de Paradigma',
    paradigmTitle: 'Una nueva categoría de infraestructura decisória',
    paradigmTraditionalTitle: 'Modelo Tradicional (Fragmentado)',
    paradigmTraditionalTag: 'Reactivo',
    paradigmTraditionalSteps: [
      'ERP / CRM (Silos Aislados)',
      'Hojas de cálculo manuales y consolidadores',
      'BI con informes pasivos',
      'Reuniones extensas de alineación',
      'Decisión reactiva tras la crisis instalada'
    ],
    paradigmIllumineTitle: 'Modelo Illumine (Executive Intelligence)',
    paradigmIllumineTag: 'Anticipatorio',
    paradigmIllumineSteps: [
      'Enterprise Data Foundation',
      'Executive Intelligence Network™ & Engines™',
      'Executive Intelligence Agents™',
      'Executive Advisory™ (Recomendaciones Priorizadas)',
      'Aprendizaje Institucional Continuo'
    ],
    domainsTag: 'Executive Intelligence Network™',
    domainsTitle: 'Infraestructura de Conocimiento por Dominios Especializados',
    domainsSub: 'Nueve capacidades dedicadas que observan, correlacionan y producen inteligencia decisória:',
    domainsObservedSignalsTag: 'Señales y Evidencias Observadas:',
    domainsList: [
      {
        question: '¿La organización protege el valor y asegura el cumplimiento fiduciario?',
        desc: 'Supervisión activa de cumplimiento societario, límites de autoridad y salvaguardas fiduciarias.',
        insights: ['Auditoría Activa de Autoridades', 'Adherencia a Acuerdos de Socios', 'Mitigación de Contingencias Fiscales']
      },
      {
        question: '¿La estructura de capital produce valor real y liquidez sostenible?',
        desc: 'Análisis continuo del ROIC real, generación de caja vs. beneficio contable y eliminación de costes invisibles.',
        insights: ['Retorno sobre Capital Empregado (ROIC)', 'Generación de Caja vs. Beneficio Contable', 'Asfixia Oculta de Capital de Trabajo']
      },
      {
        question: '¿Los procesos operacionales sostienen el ritmo de expansión?',
        desc: 'Mapeo de cuellos de botella físicos con impacto financiero y elasticidad operacional.',
        insights: ['Elasticidad Operacional de Costes', 'Cuellos de Botella de Alto Impacto', 'Eficiencia de Flujos Productivos']
      },
      {
        question: '¿El crecimiento en ventas construye margen sostenible o asfixia la caja?',
        desc: 'Diagnóstico de la calidad de ingresos, margen de contribución y sostenibilidad comercial.',
        insights: ['Calidad de Ingresos Recurrentes', 'Margen de Contribución Efectivo', 'Coste de Adquisición vs. LTV Real']
      },
      {
        question: '¿La continuidad depende excesivamente de personas clave?',
        desc: 'Evaluación de dependencia de fundadores, mecanismos de sucesión y resiliencia del capital humano.',
        insights: ['Mecanismos de Sucesión Ejecutiva', 'Dependencia de Personas Clave', 'Índice de Alineación del Liderazgo']
      },
      {
        question: '¿La organización anticipa volatilidades o reacciona solo ante crisis?',
        desc: 'Pruebas de estrés sistemáticas, exposición a garantías y mitigación preventiva de riesgos.',
        insights: ['Pruebas de Estrés Macroeconómicas', 'Exposición a Garantías y Fianzas', 'Radar de Riesgos Regulatorios']
      },
      {
        question: '¿La reputación y la marca sobreviven más allá de las personas que las construyeron?',
        desc: 'Preservación de activos intangibles, gobernanza de marcas y fortalecimiento de la perenidad institucional.',
        insights: ['Protección del Valor de Marca', 'Resiliencia ante Crisis Reputacionales', 'Estructuración Fiduciaria de Activos']
      },
      {
        question: '¿Las decisiones operacionales cumplen la misión fundadora?',
        desc: 'Verificación de la coherencia entre el propósito declarado y la realidad de la ejecución diaria.',
        insights: ['Mapeo de Desvíos de Misión', 'Coherencia Decisoria con Propósito', 'Preservación de Principios Fundadores']
      },
      {
        question: '¿La organización desarrolla capacidades futuras o solo defiende el modelo actual?',
        desc: 'Evaluación de la tasa de adaptación a nuevos ciclos tecnológicos y renovación del modelo de negocio.',
        insights: ['Radar de Tendencias de Disrupción', 'Capacidad de Renovación del Modelo', 'Vector de Longevidade Tecnológica']
      }
    ],
    advisoryTag: 'Executive Advisory™',
    advisoryTitle: 'El Sistema Operativo de Decisión Ejecutiva',
    advisorySub: 'La plataforma no solo mide y genera informes. Apoya activamente al liderazgo en cada etapa decisória:',
    advisoryCards: [
      { title: 'Observa', desc: 'Monitorea continuamente vectores de riesgo y señales de fricción operacional.' },
      { title: 'Interpreta', desc: 'Correlaciona causas invisibles detrás de los indicadores financieros.' },
      { title: 'Explica', desc: 'Proporciona fundamentación clara y explicabilidad fiduciaria sin cajas negras.' },
      { title: 'Recomienda', desc: 'Produce planes de acción estratégicos ordenados por retorno e impacto.' },
      { title: 'Prioriza', desc: 'Filtra el ruido operacional y enfoca la atención del consejo en lo crítico.' },
      { title: 'Aprende', desc: 'Registra el historial de decisiones y ajusta los modelos a cada nuevo ciclo.' }
    ],
    governanceTag: 'Inteligencia en Gobernanza y ESGIM™',
    governanceTitle: 'La Dimensión Fiduciaria y Marco ESGIM™',
    governanceSub: 'El reposicionamiento de Illumine Governance™ como el dominio fiduciario central, medido por el marco propietario ESGIM™:',
    esgimCards: [
      { letter: 'E', name: 'Environmental', desc: 'Resiliencia socioambiental y sostenibilidad operacional.' },
      { letter: 'S', name: 'Social', desc: 'Desarrollo del capital humano y tejido relacional.' },
      { letter: 'G', name: 'Governance', desc: 'Sucesión, límites de autoridad y cumplimiento societario.' },
      { letter: 'I', name: 'Institutional', desc: 'Salvaguarda de marca, protección reputacional y legado.' },
      { letter: 'M', name: 'Mission', desc: 'Alineación de la operación con la misión fundadora.' }
    ],
    trustTag: 'Confianza Ejecutiva',
    trustTitle: 'Por qué los Consejos y Liderazgos Confían en Illumine',
    trustCards: [
      { title: 'Metodología Propietaria', desc: 'Marcos probados en entornos corporativos de alta complejidad.' },
      { title: 'Arquitectura Canónica', desc: 'Estructuración fiduciaria rigurosa basada en el Executive Design System.' },
      { title: 'Gobernanza Activa de Datos', desc: 'Seguridad de nivel enterprise, cumplimiento e aislamiento de datos.' },
      { title: 'Observabilidad Total', desc: 'Trazabilidad de extremo a extremo de las evidencias de cada análisis.' },
      { title: 'Explicabilidad sin Cajas Negras', desc: 'Todas las recomendaciones presentan la causa raíz y el cálculo.' },
      { title: 'Auditoría y Audit Trail', desc: 'Registro histórico inmutable de las decisiones ejecutivas tomadas.' }
    ],
    transformTag: 'Transformación Ejecutiva',
    transformTitle: 'Lo que cambia en el día a día de la directiva',
    transformTableBeforeHeader: 'Antes de Illumine (Reactivo)',
    transformTableAfterHeader: 'Después de Illumine (Antecipatório)',
    transformTable: [
      { antes: 'Reuniones de consejo dedicadas a debatir la veracidad de los datos.', depois: 'Reuniones de consejo enfocadas en decisiones estratégicas fundamentadas.' },
      { antes: 'Hojas de cálculo dispersas e indicadores desconectados por área.', depois: 'Inteligencia ejecutiva integrada en 9 dominios en tiempo real.' },
      { antes: 'Descubrimiento de cuellos de botella solo cuando se convierten en crisis.', depois: 'Detección temprana de señales débiles y fricciones invisibles.' },
      { antes: 'Decisiones intuitivas sin trazabilidad histórica.', depois: 'Advisory continuo con explicabilidad fiduciaria y aprendizaje.' },
      { antes: 'Dependencia excesiva de la memoria de personas clave.', depois: 'Memoria e inteligencia institucional preservadas en la empresa.' }
    ],
    useCasesTag: 'Organizaciones Complejas',
    useCasesTitle: 'Desarrollado para estructuras de alta complejidad',
    useCasesCards: [
      { title: 'Holdings y Grupos Económicos', desc: 'Consolidación de riesgos cruzados y visibilidad fiduciaria de cartera.' },
      { title: 'Hospitales y Salud', desc: 'Complejidad regulatoria, protección de flujos de caja y gobernanza clínica.' },
      { title: 'Empresas Familiares', desc: 'Transición generacional, preservación del legado y gobernanza de socios.' },
      { title: 'Industria y Manufactura', desc: 'Mitigación de volatilidad operacional y resiliencia del capital de trabajo.' },
      { title: 'Tercer Sector', desc: 'Protección contra desvíos de misión y gobernanza de donantes.' },
      { title: 'Entidades por Propósito', desc: 'Alineación permanente entre principios fundadores y ejecución comercial.' }
    ],
    closingTag: 'Perpetuidad y Continuidad Institucional',
    closingQuote: '“La próxima generación de organizaciones no se definirá solo por su capacidad de ejecutar mejor. Se definirá por su capacidad de comprender mejor, decidir mejor y aprender continuamente.”',
    closingSub: 'Esta es la base de Illumine Executive Intelligence Platform.',
    closingCtaPrimary: 'Solicitar Diagnóstico Ejecutivo',
    closingCtaSecondary: 'Hablar con un Executive Advisor',
    footerRights: '© 2026 Illumine Executive Intelligence Platform. Todos los derechos reservados.',
    footerTop: 'Volver al Inicio',
    footerPartners: 'Portal de Socios',
    footerLogin: 'Acceso Restringido'
  }
};

export function ExecutivePlatformLandingPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeDomainTab, setActiveDomainTab] = useState(0);
  const [showSticky, setShowSticky] = useState(false);

  // Active Locale Dictionary Fallback
  const dict = DICTIONARY[language as Locale] || DICTIONARY['pt-BR'];

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = (defaultMessage: string) => {
    const phone = "554131514537";
    const encoded = encodeURIComponent(defaultMessage);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Executive Intelligence Network™ - 9 Canonical Domain Titles (Preserved Trademark Names)
  const domainTitles = [
    'Governance Intelligence™',
    'Financial Intelligence™',
    'Operational Intelligence™',
    'Commercial Intelligence™',
    'People Intelligence™',
    'Risk Intelligence™',
    'Institutional Intelligence™',
    'Purpose Intelligence™',
    'Innovation Intelligence™'
  ];

  const domainIcons = [
    <ShieldCheck size={20} className="text-[#FF8A57]" />,
    <BarChart3 size={20} className="text-[#FF8A57]" />,
    <Activity size={20} className="text-[#FF8A57]" />,
    <TrendingUp size={20} className="text-[#FF8A57]" />,
    <Users size={20} className="text-[#FF8A57]" />,
    <Zap size={20} className="text-[#FF8A57]" />,
    <Building size={20} className="text-[#FF8A57]" />,
    <Target size={20} className="text-[#FF8A57]" />,
    <Compass size={20} className="text-[#FF8A57]" />
  ];

  return (
    <main className="min-h-screen bg-[#04070C] text-white relative overflow-x-hidden font-sans selection:bg-[#FF8A57]/20 selection:text-[#FF8A57] antialiased">
      
      {/* Background Ambient Lights */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#FF8A57]/3 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white/[0.015] blur-[180px] pointer-events-none z-0" />

      {/* Navbar Minimalist & Premium with LanguageSelector */}

      {/* 1. HERO SECTION (Foundational Thesis & Digital Executive Board) */}
      <section id="hero" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8A57]/10 border border-[#FF8A57]/30 text-[#FF8A57] text-[10px] font-mono uppercase tracking-widest font-semibold mx-auto">
            <Sparkles size={12} />
            {dict.heroBadge}
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display text-white font-medium tracking-tight leading-[1.08] keep-whole-words">
              {dict.heroHeadline}
            </h1>
            <p className="text-lg md:text-2xl text-[#B9BEC7] font-sans font-light max-w-3xl mx-auto leading-relaxed keep-whole-words">
              {dict.heroSubheadline}
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <button
              id="hero-cta-avaliar"
              onClick={() => handleCTAClick("Olá! Desejo solicitar a avaliação de robustez institucional da minha organização na Illumine Executive Intelligence Platform.")}
              className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-6 sm:px-9 rounded-full bg-[#F9F9F9] text-[#111111] font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(255,138,87,0.30)] text-center"
            >
              <span className="leading-snug">{dict.heroCtaPrimary}</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
            <button
              id="hero-cta-conhecer"
              onClick={() => scrollToSection('stack')}
              className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-6 sm:px-8 rounded-full bg-[#0A0F18] border border-[#2E3642] text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-[#FF8A57]/50 transition-all flex items-center justify-center gap-3 cursor-pointer text-center"
            >
              <span className="leading-snug">{dict.heroCtaSecondary}</span>
            </button>
          </div>

          {/* Micro Disclaimer on Ethics & Human Governance */}
          <p className="text-[11px] text-[#8E95A3] font-mono max-w-2xl mx-auto pt-4 keep-whole-words">
            {dict.heroDisclaimer}
          </p>

        </div>
      </section>

      {/* 2. FOUNDATIONAL THESIS (A Tese Fundacional) */}
      <section id="tese" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.thesisTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.thesisTitle}
            </h2>
          </div>

          <div className="bg-[#0B101A] border border-[#202733] rounded-3xl p-8 sm:p-14 max-w-5xl mx-auto space-y-8 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8A57]/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-xl sm:text-2xl text-white font-display leading-relaxed keep-whole-words">
              {dict.thesisPara1}
            </p>

            <div className="w-16 h-[1px] bg-[#FF8A57]/40" />

            <div className="grid md:grid-cols-2 gap-8 text-[#B9BEC7] text-base leading-relaxed font-sans font-light">
              <p className="keep-whole-words">
                {dict.thesisPara2}
              </p>
              <p className="keep-whole-words">
                O resultado é um paradoxo: <strong className="text-white font-medium">{dict.thesisPara3}</strong>
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#8E95A3]">
              <span>{dict.thesisFooterTag}</span>
              <span className="text-[#FF8A57] font-semibold">{dict.thesisFooterBadge}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. EXECUTIVE INTELLIGENCE MANIFESTO */}
      <section id="manifesto" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.manifestoTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.manifestoTitle}
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6 space-y-6 text-[#B9BEC7] text-base sm:text-lg leading-relaxed font-sans font-light">
              <p className="text-white font-medium text-xl font-display keep-whole-words">
                {dict.manifestoPara1}
              </p>
              <p className="keep-whole-words">
                {dict.manifestoPara2}
              </p>
              <p className="keep-whole-words">
                {dict.manifestoPara3}
              </p>
            </div>

            <div className="lg:col-span-6 bg-[#0B101A] border border-[#202733] rounded-3xl p-8 space-y-6">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#FF8A57] font-bold">
                {dict.manifestoQuoteTag}
              </h4>
              <blockquote className="text-xl font-display italic text-white leading-relaxed keep-whole-words">
                {dict.manifestoQuote}
              </blockquote>
              <div className="pt-4 border-t border-white/5 text-xs text-[#8E95A3] font-mono">
                {dict.manifestoQuoteSub}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. WHY NOW (O Novo Ambiente Empresarial) */}
      <section id="whynow" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.whyNowTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight leading-tight keep-whole-words">
              {dict.whyNowTitle}
            </h2>
            <p className="text-base text-[#8E95A3] font-sans keep-whole-words">
              {dict.whyNowSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch max-w-7xl mx-auto">
            {dict.whyNowCards.map((item, idx) => (
              <div 
                key={idx} 
                className="p-7 sm:p-8 bg-[#0B101A] border border-[#202733] rounded-3xl hover:border-[#2B3443] transition-all flex flex-col justify-between h-full min-h-[240px]"
              >
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#FF8A57] block">{item.num}</span>
                  <h3 className="text-lg sm:text-xl font-display text-white font-semibold leading-snug tracking-tight keep-whole-words">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#8E95A3] leading-relaxed font-sans font-light keep-whole-words pt-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. INSTITUTIONAL LEARNING LOOP™ (O Ciclo Executivo Canônico) */}
      <section id="loop" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.loopTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.loopTitle}
            </h2>
            <p className="text-sm text-[#8E95A3] font-sans keep-whole-words">
              {dict.loopSub}
            </p>
          </div>

          {/* Pipeline Visual */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {dict.loopSteps.map((node, i) => (
              <div 
                key={i} 
                className={`p-4 bg-[#0B101A] border rounded-2xl flex flex-col justify-between min-h-[140px] transition-all ${
                  i === 6 ? 'border-[#FF8A57]/50 bg-[#FF8A57]/5' : 'border-[#202733] hover:border-[#2B3443]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#8E95A3]">{node.step}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${i === 6 ? 'bg-[#FF8A57] animate-pulse' : 'bg-white/20'}`} />
                </div>
                <div className="space-y-1.5">
                  <h5 className={`text-xs font-bold font-mono uppercase tracking-wider keep-whole-words ${i === 6 ? 'text-[#FF8A57]' : 'text-white'}`}>
                    {node.name}
                  </h5>
                  <p className="text-[10px] sm:text-xs text-[#8E95A3] leading-tight font-sans keep-whole-words">
                    {node.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. EXECUTIVE INTELLIGENCE STACK™ (Visão Go-to-Market de 6 Camadas) */}
      <section id="stack" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.stackTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.stackTitle}
            </h2>
            <p className="text-sm text-[#8E95A3] font-sans keep-whole-words">
              {dict.stackSub}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {dict.stackLayers.map((st, idx) => (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  idx === 0 
                    ? 'border-[#FF8A57] bg-[#FF8A57]/10 text-white' 
                    : 'border-[#202733] bg-[#0B101A] text-white/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF8A57] font-bold shrink-0">{st.layer}</span>
                  <h4 className="text-sm sm:text-base font-display font-medium keep-whole-words">{st.name}</h4>
                </div>
                <span className="text-xs font-sans text-[#8E95A3] sm:text-right keep-whole-words">{st.role}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. MUDANÇA DE PARADIGMA (Grid Comparativo Tradicional vs. Illumine) */}
      <section id="paradigma" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.paradigmTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.paradigmTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Modelo Tradicional */}
            <div className="p-8 bg-[#070B12] border border-[#202733] rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h4 className="text-sm font-mono uppercase tracking-wider text-[#8E95A3]">{dict.paradigmTraditionalTitle}</h4>
                <span className="text-[10px] font-mono text-red-400/80">{dict.paradigmTraditionalTag}</span>
              </div>
              <div className="space-y-4 text-xs font-mono text-[#8E95A3]">
                {dict.paradigmTraditionalSteps.map((stepText, idx) => (
                  <React.Fragment key={idx}>
                    <div className={idx === 4 ? "p-3.5 bg-red-950/20 border border-red-500/20 text-red-300 rounded-xl" : "p-3.5 bg-white/[0.02] rounded-xl"}>
                      {stepText}
                    </div>
                    {idx < 4 && <div className="text-center">↓</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Modelo Illumine */}
            <div className="p-8 bg-[#0B101A] border border-[#FF8A57]/40 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A57]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="text-sm font-mono uppercase tracking-wider text-[#FF8A57] font-bold">{dict.paradigmIllumineTitle}</h4>
                <span className="text-[10px] font-mono text-[#FF8A57] font-bold">{dict.paradigmIllumineTag}</span>
              </div>
              <div className="space-y-4 text-xs font-mono text-white">
                {dict.paradigmIllumineSteps.map((stepText, idx) => (
                  <React.Fragment key={idx}>
                    <div className={idx === 4 ? "p-3.5 bg-[#FF8A57]/15 border border-[#FF8A57]/40 text-[#FF8A57] font-bold rounded-xl" : "p-3.5 bg-white/5 rounded-xl border border-white/10"}>
                      {stepText}
                    </div>
                    {idx < 4 && <div className="text-center text-[#FF8A57]">↓</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. EXECUTIVE INTELLIGENCE NETWORK™ (Os 9 Domínios de Inteligência) */}
      <section id="dominios" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.domainsTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.domainsTitle}
            </h2>
            <p className="text-sm text-[#8E95A3] max-w-2xl mx-auto keep-whole-words">
              {dict.domainsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Domain Selector Pills */}
            <div className="lg:col-span-5 space-y-2">
              {domainTitles.map((title, idx) => {
                const isSelected = activeDomainTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveDomainTab(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF8A57]/10 border-[#FF8A57]/40 text-white shadow-lg'
                        : 'bg-[#0B101A] border-[#202733] text-[#8E95A3] hover:border-[#2B3443] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#FF8A57]/20 text-[#FF8A57]' : 'bg-white/5 text-[#8E95A3]'}`}>
                        {domainIcons[idx]}
                      </div>
                      <span className="text-xs font-bold font-mono uppercase tracking-wider keep-whole-words">{title}</span>
                    </div>
                    <ChevronRight size={14} className={`transition-transform ${isSelected ? 'rotate-90 text-[#FF8A57]' : 'text-white/20'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Domain Expanded Card */}
            <div className="lg:col-span-7 bg-[#0B101A] border border-[#202733] rounded-3xl p-8 sm:p-10 space-y-8 min-h-[420px] flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#FF8A57]/10 border border-[#FF8A57]/30 text-[#FF8A57]">
                    {domainIcons[activeDomainTab]}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#FF8A57] uppercase tracking-widest font-bold block">
                      Domínio 0{activeDomainTab + 1}
                    </span>
                    <h3 className="text-2xl font-display text-white font-medium keep-whole-words">
                      {domainTitles[activeDomainTab]}
                    </h3>
                  </div>
                </div>

                <p className="text-lg text-white/90 font-display italic keep-whole-words">
                  “{dict.domainsList[activeDomainTab].question}”
                </p>

                <p className="text-sm text-[#B9BEC7] leading-relaxed font-sans font-light keep-whole-words">
                  {dict.domainsList[activeDomainTab].desc}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-[#FF8A57] tracking-wider block font-bold">
                  {dict.domainsObservedSignalsTag}
                </span>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {dict.domainsList[activeDomainTab].insights.map((insight, i) => (
                    <div key={i} className="p-3 bg-[#070B12] border border-[#202733] rounded-xl text-[11px] text-[#B9BEC7] flex items-center gap-2 font-sans keep-whole-words">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. EXECUTIVE ADVISORY™ & CONTINUOUS INTELLIGENCE */}
      <section id="advisory" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.advisoryTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.advisoryTitle}
            </h2>
            <p className="text-sm text-[#8E95A3] font-sans keep-whole-words">
              {dict.advisorySub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {dict.advisoryCards.map((adv, idx) => (
              <div key={idx} className="p-7 sm:p-8 bg-[#0B101A] border border-[#202733] rounded-3xl space-y-4 hover:border-[#2B3443] transition-all flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <span className="text-xs font-mono text-[#FF8A57] font-bold">0{idx + 1}</span>
                  <h4 className="text-lg font-display text-white font-semibold keep-whole-words">{adv.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#8E95A3] leading-relaxed font-sans font-light keep-whole-words">{adv.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. GOVERNANCE INTELLIGENCE™ & ESGIM™ */}
      <section id="governance" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.governanceTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.governanceTitle}
            </h2>
            <p className="text-sm text-[#8E95A3] max-w-2xl mx-auto keep-whole-words">
              {dict.governanceSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
            {dict.esgimCards.map((dim, i) => (
              <div key={i} className="p-6 sm:p-7 bg-[#0B101A] border border-[#202733] rounded-3xl text-center space-y-4 hover:border-[#2B3443] transition-all flex flex-col justify-between min-h-[200px]">
                <div>
                  <span className="text-4xl sm:text-5xl font-display font-bold text-[#FF8A57] block">{dim.letter}</span>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white font-mono mt-2 keep-whole-words">{dim.name}</h5>
                </div>
                <p className="text-[11px] sm:text-xs text-[#8E95A3] leading-relaxed font-sans font-light keep-whole-words">{dim.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. EXECUTIVE TRUST (Credibilidade & Rigor Enterprise) */}
      <section id="trust" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.trustTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.trustTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {dict.trustCards.map((trust, idx) => (
              <div key={idx} className="p-7 sm:p-8 bg-[#0B101A] border border-[#202733] rounded-3xl space-y-3 flex items-start gap-5">
                <CheckCircle2 size={22} className="text-[#FF8A57] shrink-0 mt-1" />
                <div>
                  <h4 className="text-base sm:text-lg font-display text-white font-medium keep-whole-words">{trust.title}</h4>
                  <p className="text-xs sm:text-sm text-[#8E95A3] leading-relaxed font-sans font-light mt-1.5 keep-whole-words">{trust.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. O QUE MUDA DEPOIS DA ILLUMINE (Antes vs. Depois) */}
      <section id="transformacao" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.transformTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.transformTitle}
            </h2>
          </div>

          {/* High-Contrast Div-Based Executive Comparison Grid (Immune to Global Table CSS) */}
          <div className="max-w-5xl mx-auto bg-[#0B101A] border border-[#202733] rounded-3xl overflow-hidden shadow-2xl divide-y divide-[#202733]">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#050911] border-b border-[#202733]">
              <div className="p-6 sm:p-7 text-xs font-mono uppercase tracking-widest text-[#8E95A3] font-bold flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400/80" />
                <span>{dict.transformTableBeforeHeader}</span>
              </div>
              <div className="p-6 sm:p-7 text-xs font-mono uppercase tracking-widest text-[#FF8A57] font-bold flex items-center gap-2.5 border-t md:border-t-0 md:border-l border-[#202733] bg-[#FF8A57]/5">
                <span className="w-2 h-2 rounded-full bg-[#FF8A57] animate-pulse" />
                <span>{dict.transformTableAfterHeader}</span>
              </div>
            </div>

            {/* Comparison Content Rows */}
            {dict.transformTable.map((row, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 hover:bg-white/[0.02] transition-colors">
                <div className="p-6 sm:p-7 text-xs sm:text-sm text-[#8E95A3] font-sans font-light flex items-start gap-3.5 keep-whole-words">
                  <X size={16} className="text-red-400/70 shrink-0 mt-0.5" />
                  <span>{row.antes}</span>
                </div>
                <div className="p-6 sm:p-7 text-xs sm:text-sm text-white font-medium font-sans border-t md:border-t-0 md:border-l border-[#202733] bg-[#FF8A57]/[0.02] flex items-start gap-3.5 keep-whole-words">
                  <CheckCircle2 size={16} className="text-[#FF8A57] shrink-0 mt-0.5" />
                  <span>{row.depois}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. CASOS DE USO POR SEGMENTO (Desafios Estratégicos) */}
      <section id="segmentos" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.useCasesTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight keep-whole-words">
              {dict.useCasesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {dict.useCasesCards.map((seg, idx) => (
              <div key={idx} className="p-7 sm:p-8 bg-[#0B101A] border border-[#202733] rounded-3xl space-y-3 hover:border-[#2B3443] transition-all flex flex-col justify-between min-h-[200px]">
                <h4 className="text-base sm:text-lg font-display text-white font-semibold keep-whole-words">{seg.title}</h4>
                <p className="text-xs sm:text-sm text-[#8E95A3] leading-relaxed font-sans font-light keep-whole-words">{seg.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 14. ROADMAP VISUAL & ENCERRAMENTO INSTITUCIONAL */}
      <section id="encerramento" className="scroll-mt-24 py-24 sm:py-32 px-6 relative z-10 bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-12">
          
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
            {dict.closingTag}
          </span>

          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-display text-white font-medium tracking-tight leading-tight keep-whole-words">
              {dict.closingQuote}
            </h2>
            <p className="text-base sm:text-lg text-[#8E95A3] font-sans font-light max-w-2xl mx-auto leading-relaxed keep-whole-words">
              {dict.closingSub}
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button
              id="final-cta-diagnostico"
              onClick={() => handleCTAClick("Olá! Desejo solicitar o Diagnóstico Executivo da minha organização na Illumine Executive Intelligence Platform.")}
              className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-6 sm:px-9 rounded-full bg-[#F9F9F9] text-[#111111] font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(255,138,87,0.30)] text-center"
            >
              <span className="leading-snug">{dict.closingCtaPrimary}</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
            <button
              id="final-cta-advisor"
              onClick={() => handleCTAClick("Olá! Desejo agendar uma conversa com um Executive Advisor da Illumine.")}
              className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-6 sm:px-8 rounded-full bg-[#0A0F18] border border-[#2E3642] text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-[#FF8A57]/50 transition-all flex items-center justify-center gap-3 cursor-pointer text-center"
            >
              <span className="leading-snug">{dict.closingCtaSecondary}</span>
            </button>
          </div>

        </div>
      </section>

      {/* STICKY FLOATING CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center"
          >
            <button
              id="sticky-cta-btn"
              onClick={() => handleCTAClick("Olá! Desejo solicitar a avaliação de robustez na Illumine Executive Intelligence Platform.")}
              className="flex items-center gap-3 px-6 min-h-[3.5rem] h-auto py-3 bg-[#F9F9F9] text-[#111111] font-bold text-[10px] uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(255,138,87,0.30)] hover:bg-white transition-all cursor-pointer border border-white/20 text-center"
            >
              <div className="w-7 h-7 rounded-full bg-[#FF8A57]/15 border border-[#FF8A57]/30 flex items-center justify-center text-[#FF8A57] shrink-0">
                <Briefcase size={13} />
              </div>
              <span className="leading-snug">{dict.navEvaluate}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Minimalist */}

    </main>
  );
}
