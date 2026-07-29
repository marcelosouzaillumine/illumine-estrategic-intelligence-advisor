import React, { useState, useEffect } from 'react';
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
  Eye,
  Lock,
  X,
  Send,
  Cpu,
  RefreshCw,
  Award,
  FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LanguageSelector } from '../../shared/LanguageSelector';
import { CanonicalBrandSignature } from '../../brand/BrandLogo';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { Locale } from '../../../i18n';

// Editorial Causal Mesh backdrop (Static & Understated)
const CausalTopologyVisual = () => {
  const nodes = [
    { id: 1, x: 120, y: 150, label: 'Capital de Giro' },
    { id: 2, x: 380, y: 110, label: 'Pressão de Caixa' },
    { id: 3, x: 260, y: 280, label: 'Estrutura Fiduciária' },
    { id: 4, x: 550, y: 220, label: 'Alinhamento Missional' },
    { id: 5, x: 720, y: 120, label: 'Continuidade Institucional' },
    { id: 6, x: 440, y: 350, label: 'Elasticidade Operacional' },
    { id: 7, x: 740, y: 300, label: 'Sucessão & Legado' }
  ];

  const links = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 6 },
    { from: 4, to: 5 },
    { from: 6, to: 7 },
    { from: 4, to: 6 },
    { from: 2, to: 3 },
    { from: 5, to: 7 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden flex items-center justify-center">
      <svg className="w-full h-full max-w-[1200px] max-h-[600px] text-white" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        {links.map((link, i) => {
          const fromNode = nodes.find(n => n.id === link.from);
          const toNode = nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          return (
            <line 
              key={i}
              x1={fromNode.x} 
              y1={fromNode.y} 
              x2={toNode.x} 
              y2={toNode.y} 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="0.75"
            />
          );
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="3" fill="#FF8A57" />
            <text
              x={node.x}
              y={node.y + 18}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="9"
              letterSpacing="0.12em"
              className="font-sans font-medium uppercase select-none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Official Illumine Brand Icon Component (Clean PNG Asset Matching Production)
const IllumineBrandIcon = ({ className = "w-[40px] h-[40px] sm:w-[44px] sm:h-[44px]" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center shrink-0 relative ${className}`}>
      <img 
        src="/logo.png" 
        alt="Illumine Brand Icon" 
        className="w-full h-full object-contain block shrink-0"
      />
    </div>
  );
};

// Multilingual Dictionary for Canonical Executive Advisor Network Landing Page
const DICTIONARY: Record<Locale, {
  headerVersion: string;
  navPlatform: string;
  navTese: string;
  navManifesto: string;
  navLoop: string;
  navStack: string;
  navParadigm: string;
  navBlindSpots: string;
  navDomains: string;
  navJourney: string;
  navTrust: string;
  navRestricted: string;
  navCta: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroDisclaimer: string;
  assistedModelTitle: string;
  assistedModelTag: string;
  assistedModelSub: string;
  assistedModelNote: string;
  thesisTag: string;
  thesisTitle: string;
  thesisPara1: string;
  thesisPara2: string;
  thesisPara3: string;
  thesisFooterTag: string;
  thesisFooterBadge: string;
  manifestoTag: string;
  manifestoTitle: string;
  manifestoSub: string;
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
  loopSteps: { step: string; name: string; desc: string; detail: string }[];
  stackTag: string;
  stackTitle: string;
  stackSub: string;
  stackProtection: string;
  stackLayers: { layer: string; name: string; role: string }[];
  paradigmTag: string;
  paradigmTitle: string;
  paradigmTraditionalTitle: string;
  paradigmTraditionalTag: string;
  paradigmTraditionalSteps: string[];
  paradigmIllumineTitle: string;
  paradigmIllumineTag: string;
  paradigmIllumineSteps: string[];
  blindSpotsTag: string;
  blindSpotsTitle: string;
  blindSpotsSub: string;
  blindSpotsList: { title: string; desc: string; impact: string }[];
  domainsTag: string;
  domainsTitle: string;
  domainsSub: string;
  domainsClarification: string;
  domainsList: { domain: string; question: string; desc: string; insights: string[] }[];
  journeyTag: string;
  journeyTitle: string;
  journeySub: string;
  journeySteps: { step: string; title: string; desc: string }[];
  whoBelongsTag: string;
  whoBelongsTitle: string;
  whoBelongsSub: string;
  whoBelongsProfiles: { role: string; desc: string }[];
  trustTag: string;
  trustTitle: string;
  trustPillars: { title: string; desc: string }[];
  transformTag: string;
  transformTitle: string;
  transformTableBeforeHeader: string;
  transformTableAfterHeader: string;
  transformTable: { antes: string; depois: string }[];
  closingQuote: string;
  closingSub: string;
  closingCtaPrimary: string;
  closingCtaSecondary: string;
  footerRights: string;
  footerPlatform: string;
  footerNetwork: string;
  modalTitle: string;
  modalSub: string;
  formName: string;
  formEmail: string;
  formFirm: string;
  formRole: string;
  formPhone: string;
  formSubmit: string;
  formSuccess: string;
}> = {
  'pt-BR': {
    headerVersion: 'Institutional Experience v2.0',
    navPlatform: 'Plataforma',
    navTese: 'Tese',
    navManifesto: 'Manifesto',
    navLoop: 'Loop™',
    navStack: 'Stack™',
    navParadigm: 'Paradigma',
    navBlindSpots: 'Blind Spots™',
    navDomains: 'Domínios',
    navJourney: 'Jornada',
    navTrust: 'Trust',
    navRestricted: 'Acesso Restrito',
    navCta: 'Tornar-se Executive Advisor',
    heroBadge: 'Illumine Executive Advisor Network™ • Partner Intelligence Experience',
    heroHeadline: 'Você consegue enxergar aquilo que seus clientes ainda não conseguem ver?',
    heroSubheadline: 'O Illumine Executive Advisor Network™ amplia a capacidade de interpretação de advisors que lideram decisões estratégicas em organizações complexas. Uma camada institucional de inteligência que conecta dados financeiros, operacionais, fiduciários e estratégicos para revelar riscos, oportunidades e decisões que normalmente permanecem invisíveis.',
    heroCtaPrimary: 'Tornar-se Executive Advisor Illumine™',
    heroCtaSecondary: 'Conhecer a Jornada',
    heroDisclaimer: 'Uma camada de inteligência complementar e institucional que amplia a capacidade analítica e antecipatória de conselheiros, consultores e executivos de confiança.',
    assistedModelTitle: 'The Assisted Executive Advisor Model™',
    assistedModelTag: 'Modelo Metodológico de Aconselhamento Amplificado',
    assistedModelSub: 'A próxima geração de advisors não será definida apenas pelo conhecimento acumulado, mas pela capacidade de interpretar sistemas organizacionais complexos em tempo real.',
    assistedModelNote: 'A inteligência amplia sua capacidade. A decisão continua humana.',
    thesisTag: 'Nova Tese Fundacional',
    thesisTitle: 'O paradoxo da especialização fragmentada',
    thesisPara1: 'Durante décadas, especialistas foram responsáveis por interpretar partes da organização. Consultores analisavam estratégia. Contadores analisavam números. Advogados analisavam riscos. Conselheiros analisavam decisões.',
    thesisPara2: 'Entretanto, organizações complexas não enfrentam problemas isolados. Elas enfrentam interações entre capital, pessoas, governança, mercado, operação e propósito.',
    thesisPara3: 'O desafio do advisor moderno não é possuir mais conhecimento. É conectar conhecimentos para enxergar a realidade institucional.',
    thesisFooterTag: 'Tese Fundacional da Illumine Executive Advisor Network™',
    thesisFooterBadge: 'Aprendizado Institucional Contínuo',
    manifestoTag: 'Manifesto do Executive Advisor',
    manifestoTitle: 'Do Especialista Fragmentado ao Advisor Institucional',
    manifestoSub: 'Especialistas analisam partes. Executive Advisors interpretam sistemas.',
    manifestoPara1: 'As consultorias e assessorias do século XX foram construídas para emitir relatórios estáticos e recomendações pontuais por departamento.',
    manifestoPara2: 'Os conselhos e diretoria do século XXI exigem conselheiros que compreendam as interações dinâmicas entre capital de giro, governança fiduciária e continuidade estratégica.',
    manifestoPara3: 'O Executive Advisor Institucional combina intuição executiva, metodologia proprietária e inteligência contínua para orientar decisões de alto valor.',
    manifestoQuoteTag: 'Convicção Metodológica',
    manifestoQuote: '“Especialistas analisam partes. Executive Advisors interpretam sistemas e revelam riscos invisíveis.”',
    manifestoQuoteSub: 'Princípio orientador da rede Illumine Executive Advisor Network™.',
    whyNowTag: 'Por Que Agora',
    whyNowTitle: 'O ambiente mudou. O papel do advisor também.',
    whyNowSub: 'Cinco vetores de aceleração exigem uma postura de aconselhamento antecipatório:',
    whyNowCards: [
      { num: '01', title: 'Complexidade Organizacional', desc: 'Clientes cresceram em complexidade societária, operacional e regulatória.' },
      { num: '02', title: 'Excesso de Informação', desc: 'Dados corporativos existem em abundância, mas falta interpretação sistêmica e síntese executiva.' },
      { num: '03', title: 'Decisões Interdependentes', desc: 'Financeiro afeta pessoas. Governança afeta estratégia. Estratégia afeta continuidade.' },
      { num: '04', title: 'Aceleração de Mercado', desc: 'Diagnósticos anuais e trimestrais tornaram-se lentos para dinâmicas competitivas em tempo real.' },
      { num: '05', title: 'Expectativa de Conselhos', desc: 'Líderes e conselhos demandam advisors que tragam visão antecipatória e não apenas históricos estatísticos.' }
    ],
    loopTag: 'Ciclo Metodológico',
    loopTitle: 'Institutional Intelligence Loop™ para Advisors',
    loopSub: 'O advisor não executa pelo cliente. Ele influencia decisões de alto impacto através de um ciclo contínuo:',
    loopSteps: [
      { step: '01', name: 'OBSERVAR', desc: 'Sinais organizacionais', detail: 'Captura contínua de telemetria financeira, operacional e fiduciária.' },
      { step: '02', name: 'INTERPRETAR', desc: 'Relações causais', detail: 'Mapeamento de causa e efeito entre caixa, governança e alocação de capital.' },
      { step: '03', name: 'QUESTIONAR', desc: 'Hipóteses estratégicas', detail: 'Provocação de cenários e revelação de riscos não percebidos pela gestão.' },
      { step: '04', name: 'RECOMENDAR', desc: 'Decisões prioritárias', detail: 'Formulação de diretrizes executivas claras e priorizadas por impacto fiduciário.' },
      { step: '05', name: 'ACOMPANHAR', desc: 'Evolução institucional', detail: 'Monitoramento da execução e desvios em relação à governança estabelecida.' },
      { step: '06', name: 'APRENDER', desc: 'Memória do cliente', detail: 'Construção da memória institucional do cliente para aconselhamento de longo prazo.' }
    ],
    stackTag: 'Arquitetura Tecnológica',
    stackTitle: 'Executive Advisor Intelligence Stack™',
    stackSub: 'Sua experiência de mercado sustentada por 6 camadas institucionais de inteligência:',
    stackProtection: 'Camada de inteligência complementar, não substitutiva (preservando integralmente a autoridade humana do advisor).',
    stackLayers: [
      { layer: 'Layer 6', name: 'Executive Advisory™', role: 'Aconselhamento estratégico contínuo e orientação de conselho.' },
      { layer: 'Layer 5', name: 'Institutional Learning Loop™', role: 'Memória organizacional e rastreabilidade decisória histórica.' },
      { layer: 'Layer 4', name: 'Executive Intelligence Agents™', role: 'Análises especializadas em caixas de ferramentas causais.' },
      { layer: 'Layer 3', name: 'Intelligence Engines™', role: 'Motores de inferência causal, estresse financeiro e priorização.' },
      { layer: 'Layer 2', name: 'Observability Layer', role: 'Telemetria e sinais organizacionais em tempo real.' },
      { layer: 'Layer 1', name: 'Enterprise Data Foundation', role: 'Fundação de dados consolidados do cliente.' }
    ],
    paradigmTag: 'Mudança de Paradigma',
    paradigmTitle: 'A evolução do modelo de consultoria e aconselhamento',
    paradigmTraditionalTitle: 'Modelo Tradicional (Fragmentado)',
    paradigmTraditionalTag: 'Reativo',
    paradigmTraditionalSteps: [
      'Conhecimento especializado isolado',
      'Análise por departamentos em silos',
      'Relatórios estáticos impressos ou em PDF',
      'Recomendações genéricas sem acompanhamento',
      'Diagnóstico tardio entregue após a crise'
    ],
    paradigmIllumineTitle: 'Modelo Illumine (Executive Advisor Network™)',
    paradigmIllumineTag: 'Antecipatório',
    paradigmIllumineSteps: [
      'Conhecimento especializado humano',
      'Executive Intelligence Foundation',
      'Interpretação sistêmica e causal',
      'Executive Advisory™ (Pareceres Priorizados)',
      'Aprendizado e Memória Institucional Contínua'
    ],
    blindSpotsTag: 'Visão Expandida',
    blindSpotsTitle: 'Executive Blind Spots Assessment™',
    blindSpotsSub: 'O que o Executive Advisor passa a enxergar antes da diretoria e do conselho:',
    blindSpotsList: [
      { title: 'Riscos de Continuidade', desc: 'Estruturas fiduciárias e de capital que comprometem a longevidade.', impact: 'Antecipação de Crise' },
      { title: 'Dependência de Pessoas-Chave', desc: 'Vulnerabilidades operacionais concentradas em indivíduos específicos.', impact: 'Resiliência Organizacional' },
      { title: 'Deterioração Silenciosa de Caixa', desc: 'Queima de caixa maquiada por crescimento de receita sem margem.', impact: 'Proteção de Liquidez' },
      { title: 'Conflitos Societários Emergentes', desc: 'Desalinhamento silencioso entre sócios sobre visão de investimento.', impact: 'Governança Fiduciária' },
      { title: 'Desalinhamento com Propósito', desc: 'Execução diária divergente da missão institucional e visão estratégica.', impact: 'Coerência Estratégica' },
      { title: 'Fragilidade de Governança', desc: 'Ausência de alçadas e comitês eficazes no acompanhamento de riscos.', impact: 'Conformidade Fiduciária' },
      { title: 'Destruição Oculta de Valor', desc: 'Ineficiências operacionais acumuladas que corroem o EBITDA.', impact: 'Eficiência de Capital' },
      { title: 'Oportunidades Não Percebidas', desc: 'Alavancagem de capital e parcerias não exploradas pela diretoria.', impact: 'Geração de Valor' }
    ],
    domainsTag: 'Executive Advisor Intelligence Domains™',
    domainsTitle: '7 Domínios de Aconselhamento Executivo',
    domainsSub: 'Nove capacidades especializadas para análise causal e pareceres fiduciários:',
    domainsClarification: 'Uma visão especializada dos domínios mais relevantes para aconselhamento executivo.',
    domainsList: [
      { domain: 'Financial Intelligence', question: 'O crescimento gera valor ou destrói caixa?', desc: 'Análise de sustentabilidade financeira e estrutura de capital.', insights: ['Liquidez Efetiva', 'Margem de Contribuição', 'Elasticidade de Caixa'] },
      { domain: 'Governance Intelligence', question: 'A organização está protegida institucionalmente?', desc: 'Mapeamento fiduciário, alçadas e blindagem patrimonial.', insights: ['Conformidade Fiduciária', 'Alçadas de Decisão', 'Blindagem Patrimonial'] },
      { domain: 'Operational Intelligence', question: 'Onde estão as fricções que reduzem performance?', desc: 'Eficiência de processos e gargalos de execução.', insights: ['Gargalos Produtivos', 'Elasticidade de Custos', 'Produtividade por Unidade'] },
      { domain: 'People Intelligence', question: 'A continuidade depende excessivamente de pessoas-chave?', desc: 'Matriz de sucessão e retenção de lideranças estratégicas.', insights: ['Matriz de Sucessão', 'Dependência Crítica', 'Risco de Liderança'] },
      { domain: 'Strategic Intelligence', question: 'A organização está preparada para o próximo ciclo?', desc: 'Posicionamento competitivo e adaptabilidade ao mercado.', insights: ['Adaptabilidade de Mercado', 'Alocação de Capital', 'Vetor Competitivo'] },
      { domain: 'Institutional Intelligence', question: 'O legado está protegido?', desc: 'Tradição, reputação e continuidade geracional.', insights: ['Proteção de Marca', 'Legado Familiar', 'Reputação Institucional'] },
      { domain: 'Mission Intelligence', question: 'A execução continua alinhada ao propósito?', desc: 'Alinhamento missional entre conselho, executivos e operação.', insights: ['Coerência Missional', 'Alinhamento de Sócios', 'Desvio de Propósito'] }
    ],
    journeyTag: 'Jornada de Certificação',
    journeyTitle: 'Executive Advisor Journey™',
    journeySub: 'Da homologação à expansão de sua autoridade junto a grandes clientes:',
    journeySteps: [
      { step: '01', title: 'Candidatura', desc: 'Submissão de perfil executivo e validação de fit institucional.' },
      { step: '02', title: 'Certificação', desc: 'Imersão na metodologia Illumine e habilitação da plataforma.' },
      { step: '03', title: 'Habilitação', desc: 'Acesso à infraestrutura de inteligência e caixa de ferramentas executivas.' },
      { step: '04', title: 'Engajamento do Cliente', desc: 'Aplicação prática em diagnósticos e acompanhamento de clientes.' },
      { step: '05', title: 'Revisão Executiva', desc: 'Sessões periódicas de refinamento de tese e pareceres fiduciários.' },
      { step: '06', title: 'Aprendizado Comunitário', desc: 'Troca qualificada na rede sênior de Executive Advisors.' }
    ],
    whoBelongsTag: 'Ecossistema Humano',
    whoBelongsTitle: 'Profissionais que influenciam decisões institucionais',
    whoBelongsSub: 'O ecossistema é formado por profissionais de confiança que atuam no topo das organizações:',
    whoBelongsProfiles: [
      { role: 'Conselheiros de Administração', desc: 'Profissionais que buscam dados estruturados para provar e sustentar diretrizes em conselhos.' },
      { role: 'Consultores Empresariais', desc: 'Especialistas que desejam migrar de relatórios estáticos para pareceres contínuos.' },
      { role: 'CFOs Fracionados & Advisory', desc: 'Líderes financeiros que precisam de visão consolidada e causal de caixa e capital.' },
      { role: 'Escritórios Contábeis & Fiscais', desc: 'Firmas que buscam elevar o posicionamento de conformidade para consultoria fiduciária.' },
      { role: 'Escritórios Jurídicos & Societários', desc: 'Advogados corporativos focados em governança, proteção de sócios e sucessão.' },
      { role: 'Especialistas ESG & Governança', desc: 'Líderes que monitoram alinhamento de sustentabilidade e ética corporativa.' },
      { role: 'Mentores Empresariais', desc: 'Orientadores de founders e CEOs que necessitam de métricas rigorosas de progresso.' },
      { role: 'Advisors de Empresas Familiares', desc: 'Especialistas em sucessão, acordo de sócios e proteção de legado familiar.' }
    ],
    trustTag: 'Garantia Fiduciária',
    trustTitle: 'Por que conselhos e advisors confiam na Illumine',
    trustPillars: [
      { title: 'Metodologia Proprietária', desc: 'Frameworks testados em organizações complexas e conselhos fiduciários.' },
      { title: 'Governança de Dados', desc: 'Segurança de classe enterprise com controle de acesso multitenant estrito.' },
      { title: 'Explicabilidade Causal', desc: 'Toda recomendação possui trilha lógica auditável e fundamentação clara.' },
      { title: 'Audit Trail Fiduciário', desc: 'Registro histórico imutável de decisões, pareceres e alertas emitidos.' },
      { title: 'Arquitetura Institucional', desc: 'Desenhada para preservar e elevar a autoridade do profissional perante o cliente.' },
      { title: 'Aprendizado Contínuo', desc: 'Plataforma que evolui a memória do cliente a cada nova rodada de conselho.' }
    ],
    transformTag: 'Transformação de Prática',
    transformTitle: 'O que muda no dia a dia do aconselhamento',
    transformTableBeforeHeader: 'Antes de Illumine Executive Advisor Network™ (Reactivo)',
    transformTableAfterHeader: 'Depois de Illumine Executive Advisor Network™ (Antecipatório)',
    transformTable: [
      { antes: 'Sessões de conselho gastas em discutir divergência de planilhas.', depois: 'Sessões de conselho focadas em pareceres estratégicos causa-efeito.' },
      { antes: 'Relatórios estáticos trimestrais que chegam defasados.', depois: 'Telemetria contínua com alertas antecipatórios de risco.' },
      { antes: 'Diagnósticos isolados sem visibilidade cruzada de caixa e governança.', depois: 'Visão sistêmica conectando dados operacionais, financeiros e fiduciários.' },
      { antes: 'Recomendações genéricas vulneráveis a questionamentos da diretoria.', depois: 'Pareceres fiduciários com explicabilidade causal e audit trail imutável.' },
      { antes: 'Dependência exclusiva da memória individual do consultor.', depois: 'Memória institucional compartilhada no repositório seguro do cliente.' }
    ],
    closingQuote: '“Os melhores advisors não são aqueles que possuem todas as respostas. São aqueles capazes de revelar as perguntas que ninguém ainda fez.”',
    closingSub: 'Eleve o padrão de seu aconselhamento executivo com a Illumine Executive Advisor Network™.',
    closingCtaPrimary: 'Tornar-se Executive Advisor Illumine™',
    closingCtaSecondary: 'Agendar Conversa Estratégica',
    footerRights: '© 2026 Illumine Executive Intelligence Platform. Todos os direitos reservados.',
    footerPlatform: 'Executive Intelligence Platform',
    footerNetwork: 'Executive Advisor Network™',
    modalTitle: 'Candidatura à Executive Advisor Network™',
    modalSub: 'Preencha seus dados para avaliação de perfil e qualificação de membro.',
    formName: 'Nome Completo',
    formEmail: 'E-mail Profissional',
    formFirm: 'Empresa / Firm / Consultoria',
    formRole: 'Atuação Principal (ex: Conselheiro, CFO, Consultor)',
    formPhone: 'Telefone / WhatsApp',
    formSubmit: 'Submeter Candidatura',
    formSuccess: 'Sua candidatura foi submetida com sucesso. Nossa equipe entrará em contato em breve.'
  },
  'en-US': {
    headerVersion: 'Institutional Experience v2.0',
    navPlatform: 'Platform',
    navTese: 'Thesis',
    navManifesto: 'Manifesto',
    navLoop: 'Loop™',
    navStack: 'Stack™',
    navParadigm: 'Paradigm',
    navBlindSpots: 'Blind Spots™',
    navDomains: 'Domains',
    navJourney: 'Journey',
    navTrust: 'Trust',
    navRestricted: 'Restricted Access',
    navCta: 'Become Executive Advisor',
    heroBadge: 'Illumine Executive Advisor Network™ • Partner Intelligence Experience',
    heroHeadline: 'Can you see what your clients cannot yet see?',
    heroSubheadline: 'The Illumine Executive Advisor Network™ expands the interpretative capacity of advisors leading strategic decisions in complex organizations. An institutional intelligence layer connecting financial, operational, fiduciary, and strategic data to reveal invisible risks, opportunities, and decisions.',
    heroCtaPrimary: 'Become an Illumine Executive Advisor™',
    heroCtaSecondary: 'Explore the Journey',
    heroDisclaimer: 'A complementary institutional intelligence layer expanding analytical and anticipatory capabilities of board advisors and trusted executives.',
    assistedModelTitle: 'The Assisted Executive Advisor Model™',
    assistedModelTag: 'Amplified Advisory Methodological Model',
    assistedModelSub: 'The next generation of advisors will not be defined solely by accumulated knowledge, but by the ability to interpret complex organizational systems in real time.',
    assistedModelNote: 'Intelligence amplifies your capacity. The decision remains human.',
    thesisTag: 'New Foundational Thesis',
    thesisTitle: 'The paradox of fragmented specialization',
    thesisPara1: 'For decades, specialists were responsible for interpreting parts of the organization. Consultants analyzed strategy. Accountants analyzed numbers. Lawyers analyzed risks. Board members analyzed decisions.',
    thesisPara2: 'However, complex organizations do not face isolated problems. They face interactions between capital, people, governance, market, operations, and purpose.',
    thesisPara3: 'The challenge of the modern advisor is not possessing more knowledge. It is connecting knowledge to see institutional reality.',
    thesisFooterTag: 'Foundational Thesis of Illumine Executive Advisor Network™',
    thesisFooterBadge: 'Continuous Institutional Learning',
    manifestoTag: 'Executive Advisor Manifesto',
    manifestoTitle: 'From Fragmented Specialist to Institutional Advisor',
    manifestoSub: 'Specialists analyze parts. Executive Advisors interpret systems.',
    manifestoPara1: '20th-century advisory firms were built to issue static reports and isolated departmental recommendations.',
    manifestoPara2: '21st-century boards and executives demand advisors who understand dynamic interactions between working capital, fiduciary governance, and strategic continuity.',
    manifestoPara3: 'The Institutional Executive Advisor combines executive intuition, proprietary methodology, and continuous intelligence to guide high-value decisions.',
    manifestoQuoteTag: 'Methodological Conviction',
    manifestoQuote: '“Specialists analyze parts. Executive Advisors interpret systems and reveal invisible risks.”',
    manifestoQuoteSub: 'Guiding principle of the Illumine Executive Advisor Network™.',
    whyNowTag: 'Why Now',
    whyNowTitle: 'The environment changed. The advisor role changed too.',
    whyNowSub: 'Five acceleration vectors demanding anticipatory advisory positioning:',
    whyNowCards: [
      { num: '01', title: 'Organizational Complexity', desc: 'Clients grew in corporate, operational, and regulatory complexity.' },
      { num: '02', title: 'Information Overload', desc: 'Corporate data exists in abundance, but systemic interpretation and executive synthesis are lacking.' },
      { num: '03', title: 'Interdependent Decisions', desc: 'Financial affects people. Governance affects strategy. Strategy affects continuity.' },
      { num: '04', title: 'Market Acceleration', desc: 'Annual and quarterly diagnoses have become too slow for real-time competitive dynamics.' },
      { num: '05', title: 'Board Expectations', desc: 'Leaders and boards demand advisors who bring anticipatory vision rather than static historical reports.' }
    ],
    loopTag: 'Methodological Cycle',
    loopTitle: 'Institutional Intelligence Loop™ for Advisors',
    loopSub: 'The advisor does not execute for the client. They influence high-impact decisions through a continuous cycle:',
    loopSteps: [
      { step: '01', name: 'OBSERVE', desc: 'Organizational signals', detail: 'Continuous capture of financial, operational, and fiduciary telemetry.' },
      { step: '02', name: 'INTERPRET', desc: 'Causal relationships', detail: 'Mapping cause and effect between cash flow, governance, and capital allocation.' },
      { step: '03', name: 'QUESTION', desc: 'Strategic hypotheses', detail: 'Challenging scenarios and revealing unperceived risks.' },
      { step: '04', name: 'RECOMMEND', desc: 'Priority decisions', detail: 'Formulating clear executive directives prioritized by fiduciary impact.' },
      { step: '05', name: 'MONITOR', desc: 'Institutional evolution', detail: 'Tracking execution and deviations from established governance.' },
      { step: '06', name: 'LEARN', desc: 'Client memory', detail: 'Building the client’s institutional memory for long-term advisory.' }
    ],
    stackTag: 'Technology Architecture',
    stackTitle: 'Executive Advisor Intelligence Stack™',
    stackSub: 'Your market experience supported by 6 institutional intelligence layers:',
    stackProtection: 'Complementary intelligence layer, non-substitutive (fully preserving human advisor authority).',
    stackLayers: [
      { layer: 'Layer 6', name: 'Executive Advisory™', role: 'Continuous strategic advisory and board guidance.' },
      { layer: 'Layer 5', name: 'Institutional Learning Loop™', role: 'Organizational memory and historical decision traceability.' },
      { layer: 'Layer 4', name: 'Executive Intelligence Agents™', role: 'Specialized analysis within causal toolsets.' },
      { layer: 'Layer 3', name: 'Intelligence Engines™', role: 'Causal inference, financial stress, and prioritization engines.' },
      { layer: 'Layer 2', name: 'Observability Layer', role: 'Real-time telemetry and organizational signals.' },
      { layer: 'Layer 1', name: 'Enterprise Data Foundation', role: 'Consolidated client enterprise data foundation.' }
    ],
    paradigmTag: 'Paradigm Shift',
    paradigmTitle: 'The evolution of advisory and consulting models',
    paradigmTraditionalTitle: 'Traditional Model (Fragmented)',
    paradigmTraditionalTag: 'Reactive',
    paradigmTraditionalSteps: [
      'Isolated specialized knowledge',
      'Siloed departmental analysis',
      'Static printed or PDF reports',
      'Generic recommendations without follow-up',
      'Late diagnosis delivered after crises'
    ],
    paradigmIllumineTitle: 'Illumine Model (Executive Advisor Network™)',
    paradigmIllumineTag: 'Anticipatory',
    paradigmIllumineSteps: [
      'Specialized human executive experience',
      'Executive Intelligence Foundation',
      'Systemic and causal interpretation',
      'Executive Advisory™ (Prioritized Opinions)',
      'Continuous Learning & Institutional Memory'
    ],
    blindSpotsTag: 'Expanded Vision',
    blindSpotsTitle: 'Executive Blind Spots Assessment™',
    blindSpotsSub: 'What Executive Advisors see before executive management and the board:',
    blindSpotsList: [
      { title: 'Continuity Risks', desc: 'Fiduciary and capital structures compromising longevity.', impact: 'Crisis Anticipation' },
      { title: 'Key-Person Dependency', desc: 'Operational vulnerabilities concentrated in specific individuals.', impact: 'Organizational Resilience' },
      { title: 'Silent Cash Deterioration', desc: 'Cash burn masked by marginless revenue growth.', impact: 'Liquidity Protection' },
      { title: 'Emerging Partner Conflicts', desc: 'Silent misalignment between partners regarding investment vision.', impact: 'Fiduciary Governance' },
      { title: 'Purpose Misalignment', desc: 'Daily execution diverging from institutional mission.', impact: 'Strategic Coherence' },
      { title: 'Governance Fragility', desc: 'Lack of effective committees and risk monitoring limits.', impact: 'Fiduciary Compliance' },
      { title: 'Hidden Value Destruction', desc: 'Accumulated operational inefficiencies corroding EBITDA.', impact: 'Capital Efficiency' },
      { title: 'Unperceived Opportunities', desc: 'Capital leverage and partnerships unexploited by management.', impact: 'Value Creation' }
    ],
    domainsTag: 'Executive Advisor Intelligence Domains™',
    domainsTitle: '7 Executive Advisory Domains',
    domainsSub: 'Nine specialized capabilities for causal analysis and fiduciary opinions:',
    domainsClarification: 'A specialized view of the most relevant domains for executive advisory.',
    domainsList: [
      { domain: 'Financial Intelligence', question: 'Does growth create value or destroy cash?', desc: 'Financial sustainability and capital structure analysis.', insights: ['Effective Liquidity', 'Contribution Margin', 'Cash Elasticity'] },
      { domain: 'Governance Intelligence', question: 'Is the organization institutionally protected?', desc: 'Fiduciary mapping, authorization limits, and equity shielding.', insights: ['Fiduciary Compliance', 'Decision Limits', 'Equity Shielding'] },
      { domain: 'Operational Intelligence', question: 'Where are the friction points reducing performance?', desc: 'Process efficiency and execution bottlenecks.', insights: ['Production Bottlenecks', 'Cost Elasticity', 'Unit Productivity'] },
      { domain: 'People Intelligence', question: 'Does continuity rely excessively on key individuals?', desc: 'Succession matrix and key talent retention.', insights: ['Succession Matrix', 'Critical Dependency', 'Leadership Risk'] },
      { domain: 'Strategic Intelligence', question: 'Is the organization prepared for the next cycle?', desc: 'Competitive positioning and market adaptability.', insights: ['Market Adaptability', 'Capital Allocation', 'Competitive Vector'] },
      { domain: 'Institutional Intelligence', question: 'Is the legacy protected?', desc: 'Tradition, reputation, and generational continuity.', insights: ['Brand Shielding', 'Family Legacy', 'Institutional Reputation'] },
      { domain: 'Mission Intelligence', question: 'Is execution aligned with purpose?', desc: 'Missional alignment across board, executives, and operations.', insights: ['Missional Coherence', 'Shareholder Alignment', 'Purpose Drift'] }
    ],
    journeyTag: 'Certification Journey',
    journeyTitle: 'Executive Advisor Journey™',
    journeySub: 'From qualification to expanding your authority with major clients:',
    journeySteps: [
      { step: '01', title: 'Application', desc: 'Submission of executive profile and institutional fit validation.' },
      { step: '02', title: 'Certification', desc: 'Immersion in Illumine methodology and platform enablement.' },
      { step: '03', title: 'Enablement', desc: 'Access to intelligence infrastructure and executive toolsets.' },
      { step: '04', title: 'Client Engagement', desc: 'Practical application in client diagnostics and advisory.' },
      { step: '05', title: 'Executive Review', desc: 'Periodic thesis refinement sessions and fiduciary opinions.' },
      { step: '06', title: 'Community Learning', desc: 'Qualified peer exchange within the senior Executive Advisor Network.' }
    ],
    whoBelongsTag: 'Human Ecosystem',
    whoBelongsTitle: 'Professionals who influence institutional decisions',
    whoBelongsSub: 'The network is comprised of trusted professionals operating at the top of organizations:',
    whoBelongsProfiles: [
      { role: 'Board Members', desc: 'Professionals seeking structured data to prove and sustain board directives.' },
      { role: 'Management Consultants', desc: 'Specialists moving from static reports to continuous executive opinions.' },
      { role: 'Fractional CFOs & Advisory', desc: 'Financial leaders requiring a consolidated causal view of cash and capital.' },
      { role: 'Accounting & Tax Firms', desc: 'Firms looking to elevate from compliance to fiduciary advisory.' },
      { role: 'Corporate & Legal Firms', desc: 'Corporate lawyers focused on governance, shareholder protection, and succession.' },
      { role: 'ESG & Governance Specialists', desc: 'Leaders monitoring sustainability alignment and corporate ethics.' },
      { role: 'Business Mentors', desc: 'Founders and CEO advisors needing rigorous progress metrics.' },
      { role: 'Family Business Advisors', desc: 'Specialists in succession, shareholder agreements, and family legacy protection.' }
    ],
    trustTag: 'Fiduciary Assurance',
    trustTitle: 'Why boards and advisors trust Illumine',
    trustPillars: [
      { title: 'Proprietary Methodology', desc: 'Tested frameworks in complex organizations and fiduciary boards.' },
      { title: 'Data Governance', desc: 'Enterprise-grade security with strict multitenant access control.' },
      { title: 'Causal Explainability', desc: 'Every recommendation has an auditably logical trace and clear foundation.' },
      { title: 'Fiduciary Audit Trail', desc: 'Immutable historical record of decisions, opinions, and alerts issued.' },
      { title: 'Institutional Architecture', desc: 'Designed to preserve and elevate the professional’s authority.' },
      { title: 'Continuous Learning', desc: 'Platform evolving client memory with every board session.' }
    ],
    transformTag: 'Advisory Transformation',
    transformTitle: 'What changes in day-to-day advisory work',
    transformTableBeforeHeader: 'Before Illumine Executive Advisor Network™ (Reactive)',
    transformTableAfterHeader: 'After Illumine Executive Advisor Network™ (Anticipatory)',
    transformTable: [
      { antes: 'Board sessions spent debating spreadsheet discrepancies.', depois: 'Board sessions focused on cause-and-effect strategic opinions.' },
      { antes: 'Quarterly static reports arriving out of date.', depois: 'Continuous telemetry with anticipatory risk alerts.' },
      { antes: 'Isolated diagnoses without cross-visibility of cash and governance.', depois: 'Systemic view connecting operational, financial, and fiduciary data.' },
      { antes: 'Generic recommendations vulnerable to executive pushback.', depois: 'Fiduciary opinions with causal explainability and immutable audit trail.' },
      { antes: 'Exclusive reliance on individual consultant memory.', depois: 'Institutional memory shared in the client’s secure repository.' }
    ],
    closingQuote: '“The best advisors are not those who have all the answers. They are those capable of revealing the questions no one has asked yet.”',
    closingSub: 'Elevate your executive advisory standards with the Illumine Executive Advisor Network™.',
    closingCtaPrimary: 'Become an Illumine Executive Advisor™',
    closingCtaSecondary: 'Schedule Strategic Conversation',
    footerRights: '© 2026 Illumine Executive Intelligence Platform. All rights reserved.',
    footerPlatform: 'Executive Intelligence Platform',
    footerNetwork: 'Executive Advisor Network™',
    modalTitle: 'Application for Executive Advisor Network™',
    modalSub: 'Provide your information for profile assessment and member qualification.',
    formName: 'Full Name',
    formEmail: 'Professional Email',
    formFirm: 'Company / Firm / Advisory',
    formRole: 'Primary Role (e.g. Board Member, CFO, Consultant)',
    formPhone: 'Phone / WhatsApp',
    formSubmit: 'Submit Application',
    formSuccess: 'Your application has been submitted successfully. Our team will contact you shortly.'
  },
  'es-ES': {
    headerVersion: 'Institutional Experience v2.0',
    navPlatform: 'Plataforma',
    navTese: 'Tesis',
    navManifesto: 'Manifiesto',
    navLoop: 'Loop™',
    navStack: 'Stack™',
    navParadigm: 'Paradigma',
    navBlindSpots: 'Blind Spots™',
    navDomains: 'Dominios',
    navJourney: 'Jornada',
    navTrust: 'Trust',
    navRestricted: 'Área Restringida',
    navCta: 'Ser Executive Advisor',
    heroBadge: 'Illumine Executive Advisor Network™ • Partner Intelligence Experience',
    heroHeadline: '¿Puedes ver lo que tus clientes aún no consiguen ver?',
    heroSubheadline: 'Illumine Executive Advisor Network™ amplía la capacidad de interpretación de advisors que lideran decisiones estratégicas en organizaciones complejas. Una capa institucional de inteligencia que conecta datos financieros, operacionales, fiduciarios y estratégicos.',
    heroCtaPrimary: 'Ser Executive Advisor Illumine™',
    heroCtaSecondary: 'Conocer la Jornada',
    heroDisclaimer: 'Una capa de inteligencia institucional complementaria que amplía la capacidad analítica de consejeros y consultores de confianza.',
    assistedModelTitle: 'The Assisted Executive Advisor Model™',
    assistedModelTag: 'Modelo Metodológico de Asesoramiento Amplificado',
    assistedModelSub: 'La próxima generación de advisors no se definirá solo por el conocimiento acumulado, sino por la capacidad de interpretar sistemas organizacionales complejos en tiempo real.',
    assistedModelNote: 'La inteligencia amplía su capacidad. La decisión sigue siendo humana.',
    thesisTag: 'Nueva Tesis Fundacional',
    thesisTitle: 'La paradoja de la especialización fragmentada',
    thesisPara1: 'Durante décadas, los especialistas interpretaron partes de la organización. Consultores analizaban estrategia. Contadores analizaban números. Abogados analizaban riesgos. Consejeros analizaban decisiones.',
    thesisPara2: 'Sin embargo, las organizaciones complejas no enfrentan problemas aislados. Enfrentan interacciones entre capital, personas, gobernanza, mercado, operación y propósito.',
    thesisPara3: 'El desafío del advisor moderno no es poseer más conocimiento. Es conectar conocimientos para ver la realidad institucional.',
    thesisFooterTag: 'Tesis Fundacional de Illumine Executive Advisor Network™',
    thesisFooterBadge: 'Aprendizaje Institucional Continuo',
    manifestoTag: 'Manifiesto del Executive Advisor',
    manifestoTitle: 'Del Especialista Fragmentado al Advisor Institucional',
    manifestoSub: 'Los especialistas analizan partes. Los Executive Advisors interpretan sistemas.',
    manifestoPara1: 'Las firmas de asesoría del siglo XX se construyeron para emitir informes estáticos y recomendaciones departamentales aisladas.',
    manifestoPara2: 'Los consejos del siglo XXI exigen consejeros que comprendan las interacciones dinámicas entre capital, gobernanza fiduciaria y continuidad.',
    manifestoPara3: 'El Advisor Institucional combina intuición ejecutiva, metodología propietaria e inteligencia continua para guiar decisiones de alto valor.',
    manifestoQuoteTag: 'Convicción Metodológica',
    manifestoQuote: '“Los especialistas analizan partes. Los Executive Advisors interpretan sistemas y revelan riesgos invisibles.”',
    manifestoQuoteSub: 'Principio orientador de la red Illumine Executive Advisor Network™.',
    whyNowTag: 'Por Qué Ahora',
    whyNowTitle: 'El entorno cambió. El rol del advisor también.',
    whyNowSub: 'Cinco vectores de aceleración que exigen un asesoramiento anticipatorio:',
    whyNowCards: [
      { num: '01', title: 'Complejidad Organizacional', desc: 'Los clientes crecieron en complejidad societaria, operacional y regulatoria.' },
      { num: '02', title: 'Excesso de Información', desc: 'Los datos existen en abundancia, pero falta interpretación sistémica y síntesis ejecutiva.' },
      { num: '03', title: 'Decisiones Interdependientes', desc: 'Lo financiero afecta a personas. La gobernanza afecta la estrategia. La estrategia afecta la continuidad.' },
      { num: '04', title: 'Aceleración del Mercado', desc: 'Los diagnósticos anuales se han vuelto lentos para la dinámica competitiva actual.' },
      { num: '05', title: 'Expectativa de Consejos', desc: 'Los líderes demandan advisors que aporten visión anticipatoria en lugar de reportes históricos estáticos.' }
    ],
    loopTag: 'Ciclo Metodológico',
    loopTitle: 'Institutional Intelligence Loop™ para Advisors',
    loopSub: 'El advisor no ejecuta por el cliente. Influye en decisiones de alto impacto mediante un ciclo continuo:',
    loopSteps: [
      { step: '01', name: 'OBSERVAR', desc: 'Señales organizacionales', detail: 'Captura continua de telemetría financiera, operacional y fiduciaria.' },
      { step: '02', name: 'INTERPRETAR', desc: 'Relaciones causales', detail: 'Mapeo de causa y efecto entre caja, gobernanza y asignación de capital.' },
      { step: '03', name: 'CUESTIONAR', desc: 'Hipótesis estratégicas', detail: 'Provocación de escenarios y revelación de riesgos no percibidos.' },
      { step: '04', name: 'RECOMENDAR', desc: 'Decisiones prioritarias', detail: 'Formulación de directrices ejecutivas prioritarias por impacto fiduciario.' },
      { step: '05', name: 'ACOMPAÑAR', desc: 'Evolución institucional', detail: 'Monitoreo de la ejecución respecto a la gobernanza establecida.' },
      { step: '06', name: 'APRENDER', desc: 'Memoria del cliente', detail: 'Construcción de la memoria institucional del cliente para asesoría a largo plazo.' }
    ],
    stackTag: 'Arquitectura Tecnológica',
    stackTitle: 'Executive Advisor Intelligence Stack™',
    stackSub: 'Su experiencia de mercado respaldada por 6 capas institucionales de inteligencia:',
    stackProtection: 'Capa de inteligencia complementaria, no sustitutiva (preservando la autoridad humana del advisor).',
    stackLayers: [
      { layer: 'Layer 6', name: 'Executive Advisory™', role: 'Asesoramiento estratégico continuo y orientación de consejo.' },
      { layer: 'Layer 5', name: 'Institutional Learning Loop™', role: 'Memoria organizacional y trazabilidad decisoria histórica.' },
      { layer: 'Layer 4', name: 'Executive Intelligence Agents™', role: 'Análisis especializados en herramientas causales.' },
      { layer: 'Layer 3', name: 'Intelligence Engines™', role: 'Motores de inferencia causal, estrés financiero y priorización.' },
      { layer: 'Layer 2', name: 'Observability Layer', role: 'Telemetría y señales organizacionales en tiempo real.' },
      { layer: 'Layer 1', name: 'Enterprise Data Foundation', role: 'Fundación de datos consolidados del cliente.' }
    ],
    paradigmTag: 'Cambio de Paradigma',
    paradigmTitle: 'La evolución del modelo de asesoramiento',
    paradigmTraditionalTitle: 'Modelo Tradicional (Fragmentado)',
    paradigmTraditionalTag: 'Reactivo',
    paradigmTraditionalSteps: [
      'Conocimiento especializado aislado',
      'Análisis por departamentos en silos',
      'Informes estáticos impresos o en PDF',
      'Recomendaciones genéricas sin seguimiento',
      'Diagnóstico tardío entregado tras la crisis'
    ],
    paradigmIllumineTitle: 'Modelo Illumine (Executive Advisor Network™)',
    paradigmIllumineTag: 'Anticipatorio',
    paradigmIllumineSteps: [
      'Experiencia ejecutiva humana especializada',
      'Executive Intelligence Foundation',
      'Interpretación sistémica y causal',
      'Executive Advisory™ (Dictámenes Priorizados)',
      'Aprendizaje y Memoria Institucional Continua'
    ],
    blindSpotsTag: 'Visión Expandida',
    blindSpotsTitle: 'Executive Blind Spots Assessment™',
    blindSpotsSub: 'Lo que el Executive Advisor pasa a ver antes que la directiva y el consejo:',
    blindSpotsList: [
      { title: 'Riesgos de Continuidad', desc: 'Estructuras fiduciarias y de capital que comprometen la longevidad.', impact: 'Anticipación de Crisis' },
      { title: 'Dependencia de Personas Clave', desc: 'Vulnerabilidades operacionales concentradas en individuos específicos.', impact: 'Resiliencia Organizacional' },
      { title: 'Deterioro Silencioso de Caja', desc: 'Quema de caja enmascarada por crecimiento de ingresos sin margen.', impact: 'Protección de Liquidez' },
      { title: 'Conflictos Societarios Emergentes', desc: 'Desalineación silenciosa entre socios sobre la visión de inversión.', impact: 'Gobernanza Fiduciaria' },
      { title: 'Desalineación con Propósito', desc: 'Ejecución diaria divergente de la misión institucional y visión estratégica.', impact: 'Coherencia Estratégica' },
      { title: 'Fragilidad de Gobernanza', desc: 'Ausencia de comités eficaces en el seguimiento de riesgos.', impact: 'Conformidad Fiduciaria' },
      { title: 'Destrucción Oculta de Valor', desc: 'Ineficiencias operacionales acumuladas que corroen el EBITDA.', impact: 'Eficiencia de Capital' },
      { title: 'Oportunidades No Percibidas', desc: 'Apalancamiento de capital y alianzas no explotadas por la directiva.', impact: 'Generación de Valor' }
    ],
    domainsTag: 'Executive Advisor Intelligence Domains™',
    domainsTitle: '7 Dominios de Asesoramiento Ejecutivo',
    domainsSub: 'Nueve capacidades especializadas para análisis causal y dictámenes fiduciarios:',
    domainsClarification: 'Una visión especializada de los dominios más relevantes para el asesoramiento ejecutivo.',
    domainsList: [
      { domain: 'Financial Intelligence', question: '¿El crecimiento genera valor o destruye caja?', desc: 'Análisis de sostenibilidad financiera y estructura de capital.', insights: ['Liquidez Efectiva', 'Margen de Contribución', 'Elasticidad de Caja'] },
      { domain: 'Governance Intelligence', question: '¿La organización está protegida institucionalmente?', desc: 'Mapeo fiduciario, límites y blindaje patrimonial.', insights: ['Conformidad Fiduciaria', 'Límites de Decisión', 'Blindaje Patrimonial'] },
      { domain: 'Operational Intelligence', question: '¿Dónde están las fricciones que reducen el rendimiento?', desc: 'Eficiencia de procesos y cuellos de botella de ejecución.', insights: ['Cuellos de Botella', 'Elasticidad de Costes', 'Productividad por Unidad'] },
      { domain: 'People Intelligence', question: '¿La continuidad depende excesivamente de personas clave?', desc: 'Matriz de sucesión y retención de talento estratégico.', insights: ['Matriz de Sucesión', 'Dependencia Crítica', 'Riesgo de Liderazgo'] },
      { domain: 'Strategic Intelligence', question: '¿La organización está preparada para el próximo ciclo?', desc: 'Posicionamiento competitivo y adaptabilidad al mercado.', insights: ['Adaptabilidad de Mercado', 'Asignación de Capital', 'Vector Competitivo'] },
      { domain: 'Institutional Intelligence', question: '¿El legado está protegido?', desc: 'Tradición, reputación y continuidad generacional.', insights: ['Protección de Marca', 'Legado Familiar', 'Reputación Institucional'] },
      { domain: 'Mission Intelligence', question: '¿La ejecución sigue alineada al propósito?', desc: 'Alineación misional entre consejo, ejecutivos y operación.', insights: ['Coherencia Misional', 'Alineación de Socios', 'Desvío de Propósito'] }
    ],
    journeyTag: 'Jornada de Certificación',
    journeyTitle: 'Executive Advisor Journey™',
    journeySub: 'De la homologación a la expansión de su autoridad con grandes clientes:',
    journeySteps: [
      { step: '01', title: 'Solicitud', desc: 'Presentación de perfil ejecutivo y validación de encaje institucional.' },
      { step: '02', title: 'Certificación', desc: 'Inmersión en la metodología Illumine y habilitación de plataforma.' },
      { step: '03', title: 'Habilitación', desc: 'Acceso a la infraestructura de inteligencia y caja de herramientas.' },
      { step: '04', title: 'Compromiso con el Cliente', desc: 'Aplicación práctica en diagnósticos y asesoramiento a clientes.' },
      { step: '05', title: 'Revisión Ejecutiva', desc: 'Sesiones periódicas de refinación de tesis y opiniones fiduciarias.' },
      { step: '06', title: 'Aprendizaje Comunitario', desc: 'Intercambio calificado en la red sénior de Executive Advisors.' }
    ],
    whoBelongsTag: 'Ecosistema Humano',
    whoBelongsTitle: 'Profesionales que influyen en las decisiones institucionales',
    whoBelongsSub: 'El ecosistema está formado por profesionales de confianza en la cima de las organizaciones:',
    whoBelongsProfiles: [
      { role: 'Consejeros de Administración', desc: 'Profesionales que buscan datos estructurados para sostener directrices.' },
      { role: 'Consultores Empresariales', desc: 'Especialistas que desean migrar de reportes estáticos a dictámenes continuos.' },
      { role: 'CFOs Fracionados & Advisory', desc: 'Líderes financieros que necesitan visión causal consolidada de caja y capital.' },
      { role: 'Despachos Contables y Fiscales', desc: 'Firmas que buscan elevarse hacia la consultoría fiduciaria estratégica.' },
      { role: 'Despachos Jurídicos y Societarios', desc: 'Abogados enfocados en gobernanza, protección de socios y sucesión.' },
      { role: 'Especialistas ESG y Gobernanza', desc: 'Líderes que monitorean sostenibilidad y ética corporativa.' },
      { role: 'Mentores Empresariales', desc: 'Orientadores de fundadores y CEOs que requieren métricas rigurosas.' },
      { role: 'Advisors de Empresas Familiares', desc: 'Especialistas en sucesión y protección del legado familiar.' }
    ],
    trustTag: 'Garantía Fiduciaria',
    trustTitle: 'Por qué los consejos y advisors confían en Illumine',
    trustPillars: [
      { title: 'Metodología Propietaria', desc: 'Frameworks probados en organizaciones complejas y consejos fiduciarios.' },
      { title: 'Gobernanza de Datos', desc: 'Seguridad enterprise con estricto control multitenant.' },
      { title: 'Explicabilidad Causal', desc: 'Toda recomendación tiene traza lógica auditable y fundamentada.' },
      { title: 'Audit Trail Fiduciario', desc: 'Registro histórico inmutable de decisiones y opiniones emitidas.' },
      { title: 'Arquitectura Institucional', desc: 'Diseñada para elevar la autoridad del profesional ante el cliente.' },
      { title: 'Aprendizaje Continuo', desc: 'Plataforma que evoluciona la memoria del cliente en cada consejo.' }
    ],
    transformTag: 'Transformación de Práctica',
    transformTitle: 'Lo que cambia en el día a día del asesoramiento',
    transformTableBeforeHeader: 'Antes de Illumine Executive Advisor Network™ (Reactivo)',
    transformTableAfterHeader: 'Después de Illumine Executive Advisor Network™ (Anticipatorio)',
    transformTable: [
      { antes: 'Sesiones de consejo gastadas en discutir divergencia de hojas de cálculo.', depois: 'Sesiones de consejo enfocadas en dictámenes estratégicos causa-efecto.' },
      { antes: 'Informes estáticos trimestrales que llegan desfasados.', depois: 'Telemetría continua con alertas anticipatorias de riesgo.' },
      { antes: 'Diagnósticos aislados sin visibilidad cruzada de caja y gobernanza.', depois: 'Visión sistémica conectando datos operacionales, financieros y fiduciarios.' },
      { antes: 'Recomendaciones genéricas vulnerables a cuestionamientos de la directiva.', depois: 'Dictámenes fiduciarios con explicabilidad causal y audit trail inmutable.' },
      { antes: 'Dependencia exclusiva de la memoria individual del consultor.', depois: 'Memoria institucional compartida en el repositorio seguro del cliente.' }
    ],
    closingQuote: '“Los mejores advisors no son aquellos que tienen todas las respuestas. Son aquellos capaces de revelar las preguntas que nadie ha hecho aún.”',
    closingSub: 'Eleve el estándar de su asesoramiento ejecutivo con Illumine Executive Advisor Network™.',
    closingCtaPrimary: 'Ser Executive Advisor Illumine™',
    closingCtaSecondary: 'Agendar Conversación Estratégica',
    footerRights: '© 2026 Illumine Executive Intelligence Platform. Todos los derechos reservados.',
    footerPlatform: 'Executive Intelligence Platform',
    footerNetwork: 'Executive Advisor Network™',
    modalTitle: 'Candidatura a la Executive Advisor Network™',
    modalSub: 'Complete sus datos para evaluación de perfil y cualificación de miembro.',
    formName: 'Nombre Completo',
    formEmail: 'Correo Profesional',
    formFirm: 'Empresa / Despacho / Consultoría',
    formRole: 'Función Principal (ej. Consejero, CFO, Consultor)',
    formPhone: 'Teléfono / WhatsApp',
    formSubmit: 'Enviar Candidatura',
    formSuccess: 'Su candidatura ha sido enviada con éxito. Nuestro equipo se pondrá en contacto pronto.'
  }
};

export function ExecutiveAdvisorNetworkLandingPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  useDocumentTitle('Illumine Executive Advisor Network™ | Partner Intelligence Experience');

  const dict = DICTIONARY[language as Locale] || DICTIONARY['pt-BR'];

  // State for interactive UI elements
  const [activeLoopStep, setActiveLoopStep] = useState<number>(0);
  const [activeStackLayer, setActiveStackLayer] = useState<number>(0);
  const [activeDomainTab, setActiveDomainTab] = useState<number>(0);
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firm: '',
    role: '',
    phone: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setFormSubmitted(false);
      setFormData({ name: '', email: '', firm: '', role: '', phone: '' });
    }, 3000);
  };

  const domainIcons = [
    <BarChart3 size={20} className="text-[#FF8A57]" />,
    <ShieldCheck size={20} className="text-[#FF8A57]" />,
    <Activity size={20} className="text-[#FF8A57]" />,
    <Users size={20} className="text-[#FF8A57]" />,
    <TrendingUp size={20} className="text-[#FF8A57]" />,
    <Building size={20} className="text-[#FF8A57]" />,
    <Target size={20} className="text-[#FF8A57]" />
  ];

  return (
    <main className="min-h-screen bg-[#04070C] text-white relative overflow-x-hidden font-sans selection:bg-[#FF8A57]/20 selection:text-[#FF8A57] antialiased">
      
      {/* Background Ambient Lights */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#FF8A57]/3 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white/[0.015] blur-[180px] pointer-events-none z-0" />

      {/* 0. PRE-HERO EYEBROW BAR (Enterprise Header Banner) */}
      <div className="w-full bg-[#050911] border-b border-[#202733] py-2.5 px-4 sm:px-6 text-center relative z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono tracking-widest text-[#8E95A3] uppercase font-semibold">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] animate-pulse" />
            <span className="text-white font-bold tracking-wider">ILLUMINE EXECUTIVE ADVISOR NETWORK™</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-white/50 text-[9px] truncate">
            <span>Executive Intelligence Platform</span>
            <span>•</span>
            <span>Advisor Network™</span>
            <span>•</span>
            <span>Governance</span>
            <span>•</span>
            <span>Institutional Trust</span>
          </div>
          <div className="hidden lg:block text-[9px] text-[#FF8A57] font-bold shrink-0">
            {dict.headerVersion}
          </div>
        </div>
      </div>

      {/* Navbar Minimalist & Premium */}
      <nav className="sticky top-0 inset-x-0 h-20 z-50 border-b border-[#202733] backdrop-blur-xl bg-[#050911]/90 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          
          {/* Official Illumine Brand Logo Signature with Encapsulated Category Pill */}
          <CanonicalBrandSignature categoryBadge="Advisor Network™" onClick={() => scrollToSection('hero')} />

          {/* Strategic Navbar Links Only */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-mono tracking-wider text-[#8E95A3] uppercase">
            <button onClick={() => navigate('/v2')} className="hover:text-white transition-colors cursor-pointer">{dict.navPlatform}</button>
            <button onClick={() => scrollToSection('tese')} className="hover:text-white transition-colors cursor-pointer">Tese & Manifesto</button>
            <button onClick={() => scrollToSection('stack')} className="hover:text-white transition-colors cursor-pointer">Intelligence Stack™</button>
            <button onClick={() => scrollToSection('dominios')} className="hover:text-white transition-colors cursor-pointer">{dict.navDomains}</button>
            <button onClick={() => scrollToSection('jornada')} className="hover:text-white transition-colors cursor-pointer">{dict.navJourney}</button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <LanguageSelector className="bg-[#0B101A] border-[#202733] text-xs text-white" />

            <button
              onClick={() => navigate('/login')}
              className="text-xs font-mono text-[#8E95A3] hover:text-white transition-colors uppercase tracking-wider hidden sm:block cursor-pointer"
            >
              {dict.navRestricted}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-[#F9F9F9] text-[#111111] font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(255,138,87,0.20)] cursor-pointer shrink-0 whitespace-nowrap"
            >
              {dict.navCta}
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <CausalTopologyVisual />

        <div className="max-w-7xl mx-auto text-center space-y-8 sm:space-y-10 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#FF8A57]/10 border border-[#FF8A57]/30 text-[#FF8A57] text-[10px] font-mono uppercase tracking-widest font-semibold mx-auto max-w-full truncate">
            <Sparkles size={12} className="shrink-0" />
            <span className="truncate">{dict.heroBadge}</span>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-white font-medium tracking-tight leading-[1.1] break-words">
              {dict.heroHeadline}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-[#B9BEC7] font-sans font-light max-w-3xl mx-auto leading-relaxed break-words">
              {dict.heroSubheadline}
            </p>
          </div>

          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto h-14 px-8 sm:px-9 rounded-full bg-[#FF8A57] hover:bg-[#E57846] text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(255,138,87,0.30)] whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{dict.heroCtaPrimary}</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
            <button
              onClick={() => scrollToSection('jornada')}
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#0A0F18] border border-[#2E3642] text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-[#FF8A57]/50 transition-all flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{dict.heroCtaSecondary}</span>
            </button>
          </div>

          <p className="text-[11px] text-[#8E95A3] font-mono max-w-2xl mx-auto pt-2 sm:pt-4 break-words">
            {dict.heroDisclaimer}
          </p>

        </div>
      </section>

      {/* 2. THE ASSISTED EXECUTIVE ADVISOR MODEL™ */}
      <section id="modelo" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.assistedModelTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.assistedModelTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#B9BEC7] leading-relaxed font-sans max-w-2xl mx-auto break-words">
              {dict.assistedModelSub}
            </p>
          </div>

          {/* Visual Formula Diagram */}
          <div className="bg-[#0B101A] border border-[#202733] rounded-3xl p-6 sm:p-10 lg:p-14 max-w-5xl mx-auto space-y-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8A57]/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center text-center">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-center items-center min-h-[110px]">
                <Users className="w-6 h-6 text-[#FF8A57] mb-2 shrink-0" />
                <span className="text-xs font-bold font-mono text-white uppercase tracking-wider block break-words">Experiência do Advisor</span>
                <span className="text-[10px] font-mono text-[#8E95A3] mt-0.5">Julgamento Humano</span>
              </div>

              <div className="text-[#FF8A57] text-2xl font-bold font-mono py-1 lg:py-0">+</div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-center items-center min-h-[110px]">
                <Cpu className="w-6 h-6 text-[#3B82F6] mb-2 shrink-0" />
                <span className="text-xs font-bold font-mono text-white uppercase tracking-wider block break-words">Executive Intelligence</span>
                <span className="text-[10px] font-mono text-[#8E95A3] mt-0.5">Causal Telemetry</span>
              </div>

              <div className="text-[#FF8A57] text-2xl font-bold font-mono py-1 lg:py-0">+</div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-center items-center min-h-[110px]">
                <ShieldCheck className="w-6 h-6 text-[#10B981] mb-2 shrink-0" />
                <span className="text-xs font-bold font-mono text-white uppercase tracking-wider block break-words">Governance Frameworks</span>
                <span className="text-[10px] font-mono text-[#8E95A3] mt-0.5">Fiduciary Rigor</span>
              </div>

            </div>

            <div className="my-4 sm:my-6 text-center text-[#FF8A57] font-bold text-2xl sm:text-3xl font-mono">=</div>

            <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#FF8A57]/10 via-[#FF8A57]/20 to-[#FF8A57]/10 border border-[#FF8A57]/40 text-center">
              <span className="text-[10px] font-mono uppercase text-[#FF8A57] tracking-widest font-bold block mb-1">Resultado Institucional</span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-display text-white font-semibold break-words">Executive Advisory Amplificado</h3>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-white/5 text-center">
              <span className="text-xs sm:text-sm font-mono text-[#FF8A57] font-semibold uppercase tracking-wider block break-words">
                “{dict.assistedModelNote}”
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FOUNDATIONAL THESIS */}
      <section id="tese" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.thesisTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.thesisTitle}
            </h2>
          </div>

          <div className="bg-[#0B101A] border border-[#202733] rounded-3xl p-6 sm:p-10 lg:p-14 max-w-5xl mx-auto space-y-8 backdrop-blur-md relative overflow-hidden">
            <p className="text-lg sm:text-2xl text-white font-display leading-relaxed break-words">
              {dict.thesisPara1}
            </p>

            <div className="w-16 h-[1px] bg-[#FF8A57]/40" />

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-[#B9BEC7] text-sm sm:text-base leading-relaxed font-sans font-light">
              <p className="break-words">
                {dict.thesisPara2}
              </p>
              <p className="break-words">
                O desafio do advisor moderno não é possuir mais conhecimento: <strong className="text-white font-medium">{dict.thesisPara3}</strong>
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#8E95A3]">
              <span className="break-words">{dict.thesisFooterTag}</span>
              <span className="text-[#FF8A57] font-semibold shrink-0">{dict.thesisFooterBadge}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. EXECUTIVE ADVISOR MANIFESTO */}
      <section id="manifesto" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.manifestoTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.manifestoTitle}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#FF8A57] font-semibold uppercase tracking-wider break-words">
              {dict.manifestoSub}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-[#B9BEC7] text-sm sm:text-base lg:text-lg leading-relaxed font-sans font-light">
              <p className="text-white font-medium text-lg sm:text-xl font-display break-words">
                {dict.manifestoPara1}
              </p>
              <p className="break-words">
                {dict.manifestoPara2}
              </p>
              <p className="break-words">
                {dict.manifestoPara3}
              </p>
            </div>

            <div className="lg:col-span-6 bg-[#0B101A] border border-[#202733] rounded-3xl p-6 sm:p-8 space-y-6 overflow-hidden">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#FF8A57] font-bold">
                {dict.manifestoQuoteTag}
              </h4>
              <blockquote className="text-lg sm:text-xl font-display italic text-white leading-relaxed break-words">
                {dict.manifestoQuote}
              </blockquote>
              <div className="pt-4 border-t border-white/5 text-xs text-[#8E95A3] font-mono break-words">
                {dict.manifestoQuoteSub}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. WHY NOW */}
      <section id="whynow" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.whyNowTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight leading-tight break-words">
              {dict.whyNowTitle}
            </h2>
            <p className="text-xs sm:text-base text-[#8E95A3] font-sans break-words">
              {dict.whyNowSub}
            </p>
          </div>

          {/* Fully Responsive Grid for 5 Cards with Executive Prominent Titles & Top Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6 items-stretch w-full max-w-[1440px] mx-auto">
            {dict.whyNowCards.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 sm:p-7 bg-[#0B101A] border border-[#202733] rounded-3xl hover:border-[#2B3443] transition-all flex flex-col justify-start space-y-3 sm:space-y-4 h-full min-h-[250px] overflow-hidden min-w-0"
              >
                <span className="text-xs font-mono font-bold text-[#FF8A57] block">{item.num}</span>
                <h3 className="text-base sm:text-lg font-display text-white font-semibold leading-snug tracking-tight break-words">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E95A3] leading-relaxed font-sans font-light break-words pt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. INSTITUTIONAL INTELLIGENCE LOOP™ PARA ADVISORS */}
      <section id="loop" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.loopTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.loopTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#8E95A3] font-sans break-words">
              {dict.loopSub}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 max-w-6xl mx-auto">
            {dict.loopSteps.map((node, i) => (
              <button
                key={i} 
                onClick={() => setActiveLoopStep(i)}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between min-h-[130px] text-left transition-all cursor-pointer overflow-hidden ${
                  activeLoopStep === i 
                    ? 'border-[#FF8A57] bg-[#FF8A57]/15 text-white shadow-xl' 
                    : 'border-[#202733] bg-[#0B101A] text-white/80 hover:border-[#2B3443]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8E95A3] font-bold">{node.step}</span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${activeLoopStep === i ? 'bg-[#FF8A57] animate-pulse' : 'bg-white/20'}`} />
                </div>
                <div className="space-y-1 min-w-0">
                  <h5 className={`text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wider break-words ${activeLoopStep === i ? 'text-[#FF8A57]' : 'text-white'}`}>
                    {node.name}
                  </h5>
                  <p className="text-[10px] sm:text-xs text-[#8E95A3] leading-tight font-sans break-words">
                    {node.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 bg-[#0B101A] border border-[#FF8A57]/30 rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
            <div className="space-y-2 flex-1 min-w-0 w-full">
              <span className="text-xs font-mono uppercase text-[#FF8A57] font-bold">
                Etapa {dict.loopSteps[activeLoopStep].step} — {dict.loopSteps[activeLoopStep].name}
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-white font-medium break-words">{dict.loopSteps[activeLoopStep].desc}</h3>
              <p className="text-xs sm:text-sm text-[#B9BEC7] font-sans font-light max-w-2xl break-words">{dict.loopSteps[activeLoopStep].detail}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shrink-0">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF8A57] animate-spin-slow shrink-0" />
              <span className="text-xs font-mono text-white/80 font-bold">Ciclo Contínuo Institucional</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. EXECUTIVE ADVISOR INTELLIGENCE STACK™ */}
      <section id="stack" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.stackTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.stackTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#8E95A3] font-sans break-words">
              {dict.stackSub}
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-mono max-w-full">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="break-words">{dict.stackProtection}</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {dict.stackLayers.map((st, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveStackLayer(idx)}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-all cursor-pointer overflow-hidden ${
                  activeStackLayer === idx 
                    ? 'border-[#FF8A57] bg-[#FF8A57]/10 text-white shadow-lg' 
                    : 'border-[#202733] bg-[#0B101A] text-white/80 hover:border-[#2B3443]'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF8A57] font-bold shrink-0">{st.layer}</span>
                  <h4 className="text-sm sm:text-base font-display font-medium break-words">{st.name}</h4>
                </div>
                <span className="text-xs font-sans text-[#8E95A3] sm:text-right break-words">{st.role}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. MUDANÇA DE PARADIGMA (Grid Comparativo Tradicional vs. Illumine) */}
      <section id="paradigma" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.paradigmTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.paradigmTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            
            {/* Modelo Tradicional */}
            <div className="p-6 sm:p-8 bg-[#0B101A] border border-[#202733] rounded-3xl space-y-6 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#8E95A3] break-words">{dict.paradigmTraditionalTitle}</h4>
                <span className="text-[10px] font-mono text-red-400/80 shrink-0">{dict.paradigmTraditionalTag}</span>
              </div>
              <div className="space-y-3.5 text-xs font-mono text-[#8E95A3]">
                {dict.paradigmTraditionalSteps.map((stepText, idx) => (
                  <React.Fragment key={idx}>
                    <div className={idx === 4 ? "p-3 sm:p-3.5 bg-red-950/20 border border-red-500/20 text-red-300 rounded-xl break-words" : "p-3 sm:p-3.5 bg-white/[0.02] rounded-xl break-words"}>
                      {stepText}
                    </div>
                    {idx < 4 && <div className="text-center">↓</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Modelo Illumine */}
            <div className="p-6 sm:p-8 bg-[#0B101A] border border-[#FF8A57]/40 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A57]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#FF8A57] font-bold break-words">{dict.paradigmIllumineTitle}</h4>
                <span className="text-[10px] font-mono text-[#FF8A57] font-bold shrink-0">{dict.paradigmIllumineTag}</span>
              </div>
              <div className="space-y-3.5 text-xs font-mono text-white">
                {dict.paradigmIllumineSteps.map((stepText, idx) => (
                  <React.Fragment key={idx}>
                    <div className={idx === 4 ? "p-3 sm:p-3.5 bg-[#FF8A57]/15 border border-[#FF8A57]/40 text-[#FF8A57] font-bold rounded-xl break-words" : "p-3 sm:p-3.5 bg-white/5 rounded-xl border border-white/10 break-words"}>
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

      {/* 9. EXECUTIVE BLIND SPOTS ASSESSMENT™ */}
      <section id="blindspots" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.blindSpotsTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.blindSpotsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#8E95A3] font-sans break-words">
              {dict.blindSpotsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {dict.blindSpotsList.map((spot, idx) => (
              <div key={idx} className="p-6 sm:p-7 bg-[#0B101A] border border-[#202733] rounded-3xl hover:border-[#FF8A57]/40 transition-all flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Eye className="w-5 h-5 text-[#FF8A57] shrink-0" />
                    <span className="px-2 py-0.5 rounded bg-[#FF8A57]/10 text-[#FF8A57] font-mono text-[10px] font-bold uppercase shrink-0">
                      {spot.impact}
                    </span>
                  </div>
                  <h3 className="text-base font-display text-white font-semibold mb-2 break-words">{spot.title}</h3>
                  <p className="text-xs text-[#8E95A3] leading-relaxed font-sans font-light break-words">{spot.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. EXECUTIVE ADVISOR INTELLIGENCE DOMAINS™ */}
      <section id="dominios" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.domainsTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.domainsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#8E95A3] max-w-2xl mx-auto break-words">
              {dict.domainsSub}
            </p>
            <span className="text-xs text-white/40 font-mono italic block break-words">
              * {dict.domainsClarification}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 max-w-7xl mx-auto">
            
            {/* Left Column: Domain Selector Pills */}
            <div className="lg:col-span-5 space-y-2">
              {dict.domainsList.map((item, idx) => {
                const isSelected = activeDomainTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveDomainTab(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'bg-[#FF8A57]/10 border-[#FF8A57]/40 text-white shadow-lg'
                        : 'bg-[#0B101A] border-[#202733] text-[#8E95A3] hover:border-[#2B3443] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-[#FF8A57]/20 text-[#FF8A57]' : 'bg-white/5 text-[#8E95A3]'}`}>
                        {domainIcons[idx]}
                      </div>
                      <span className="text-xs font-bold font-mono uppercase tracking-wider break-words truncate">{item.domain}</span>
                    </div>
                    <ChevronRight size={14} className={`shrink-0 transition-transform ${isSelected ? 'rotate-90 text-[#FF8A57]' : 'text-white/20'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Domain Expanded Card */}
            <div className="lg:col-span-7 bg-[#0B101A] border border-[#202733] rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8 min-h-[380px] flex flex-col justify-between overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#FF8A57]/10 border border-[#FF8A57]/30 text-[#FF8A57] shrink-0">
                    {domainIcons[activeDomainTab]}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#FF8A57] uppercase tracking-widest font-bold block">
                      Domínio 0{activeDomainTab + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display text-white font-medium break-words">
                      {dict.domainsList[activeDomainTab].domain}
                    </h3>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-white/90 font-display italic break-words">
                  “{dict.domainsList[activeDomainTab].question}”
                </p>

                <p className="text-xs sm:text-sm text-[#B9BEC7] leading-relaxed font-sans font-light break-words">
                  {dict.domainsList[activeDomainTab].desc}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-[#FF8A57] tracking-wider block font-bold">
                  Sinais & Evidências Observadas:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {dict.domainsList[activeDomainTab].insights.map((insight, i) => (
                    <div key={i} className="p-3 bg-[#070B12] border border-[#202733] rounded-xl text-[11px] text-[#B9BEC7] flex items-center gap-2 font-sans break-words">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] shrink-0" />
                      <span className="break-words">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. EXECUTIVE ADVISOR JOURNEY™ */}
      <section id="jornada" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.journeyTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.journeyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#8E95A3] font-sans break-words">
              {dict.journeySub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 max-w-7xl mx-auto">
            {dict.journeySteps.map((step, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveJourneyStep(idx)}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full min-h-[190px] overflow-hidden ${
                  activeJourneyStep === idx 
                    ? 'bg-[#FF8A57] text-black border-[#FF8A57] font-semibold shadow-xl' 
                    : 'bg-[#0B101A] text-white border-[#202733] hover:border-[#2B3443]'
                }`}
              >
                <div className="min-w-0">
                  <span className={`text-xs font-mono font-bold block mb-2 ${activeJourneyStep === idx ? 'text-black/60' : 'text-[#FF8A57]'}`}>
                    {step.step}
                  </span>
                  <h4 className="text-xs sm:text-sm font-display font-bold mb-1.5 break-words">{step.title}</h4>
                  <p className={`text-[11px] sm:text-xs leading-relaxed font-sans font-light break-words ${activeJourneyStep === idx ? 'text-black/80' : 'text-[#8E95A3]'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. QUEM PERTENCE À REDE */}
      <section id="rede" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.whoBelongsTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.whoBelongsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#8E95A3] font-sans break-words">
              {dict.whoBelongsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {dict.whoBelongsProfiles.map((profile, idx) => (
              <div key={idx} className="p-6 sm:p-7 bg-[#0B101A] border border-[#202733] rounded-3xl hover:border-[#FF8A57]/40 transition-all flex flex-col justify-between overflow-hidden">
                <div>
                  <Briefcase className="w-6 h-6 text-[#FF8A57] mb-4 shrink-0" />
                  <h3 className="text-base font-display text-white font-semibold mb-2 break-words">{profile.role}</h3>
                  <p className="text-xs text-[#8E95A3] leading-relaxed font-sans font-light break-words">{profile.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. EXECUTIVE TRUST */}
      <section id="trust" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.trustTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.trustTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {dict.trustPillars.map((pillar, idx) => (
              <div key={idx} className="p-6 sm:p-7 bg-[#0B101A] border border-[#202733] rounded-3xl flex items-start gap-4 hover:border-[#2B3443] transition-all overflow-hidden">
                <ShieldCheck className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-display text-white font-semibold mb-1 break-words">{pillar.title}</h3>
                  <p className="text-xs text-[#8E95A3] leading-relaxed font-sans font-light break-words">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 14. O QUE MUDA NO DIA A DIA (Executive Transformation Table) */}
      <section id="transformacao" className="scroll-mt-24 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF8A57] block">
              {dict.transformTag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium tracking-tight break-words">
              {dict.transformTitle}
            </h2>
          </div>

          <div className="bg-[#0B101A] border border-[#202733] rounded-3xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#050911] border-b border-[#202733] p-4 sm:p-5 text-xs font-mono uppercase font-bold tracking-wider gap-2">
              <div className="text-red-400 break-words">{dict.transformTableBeforeHeader}</div>
              <div className="text-[#FF8A57] break-words">{dict.transformTableAfterHeader}</div>
            </div>
            <div className="divide-y divide-white/5">
              {dict.transformTable.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 text-xs font-sans leading-relaxed text-[#B9BEC7] hover:bg-white/[0.02] transition-colors gap-3 sm:gap-0">
                  <div className="sm:pr-4 sm:border-r border-white/5 break-words">{row.antes}</div>
                  <div className="sm:pl-4 text-white font-medium break-words">{row.depois}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 15. FECHAMENTO INSTITUCIONAL DEFINITIVO & CTAS */}
      <section id="fechamento" className="scroll-mt-24 py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#04070C]">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10 relative z-10">
          
          <div className="w-12 h-12 rounded-full bg-[#FF8A57]/10 border border-[#FF8A57]/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-[#FF8A57]" />
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display text-white font-medium leading-relaxed italic break-words">
            {dict.closingQuote}
          </h2>

          <p className="text-sm sm:text-base text-[#8E95A3] font-sans max-w-2xl mx-auto break-words">
            {dict.closingSub}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto h-14 px-8 sm:px-9 rounded-full bg-[#FF8A57] hover:bg-[#E57846] text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(255,138,87,0.30)] whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{dict.closingCtaPrimary}</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#0A0F18] border border-[#2E3642] text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-[#FF8A57]/50 transition-all flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{dict.closingCtaSecondary}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer className="py-12 sm:py-16 border-t border-[#202733] bg-[#050911] text-[#8E95A3] text-[10px] tracking-wider uppercase font-semibold relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <IllumineBrandIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-display font-medium text-white/90 text-sm tracking-tight" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>illumine</span>
              <span className="text-[8px] text-[#8E95A3]">|</span>
              <span className="break-words">{dict.footerRights}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <button id="footer-btn-topo" onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors cursor-pointer">Voltar ao Topo</button>
              <button id="footer-btn-platform" onClick={() => navigate('/v2')} className="hover:text-white transition-colors cursor-pointer">{dict.footerPlatform}</button>
              <button id="footer-btn-network" onClick={() => navigate('/executive-advisor-network')} className="hover:text-white transition-colors cursor-pointer">{dict.footerNetwork}</button>
              <button id="footer-btn-login" onClick={() => navigate('/login')} className="hover:text-white transition-colors cursor-pointer">{dict.navRestricted}</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Onboarding Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#0B101A] border border-[#FF8A57]/40 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase text-[#FF8A57] font-bold block mb-1">
                  Membro & Habilitação
                </span>
                <h3 className="text-xl font-display text-white font-semibold">{dict.modalTitle}</h3>
                <p className="text-xs text-[#8E95A3] font-sans mt-1">{dict.modalSub}</p>
              </div>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 text-center space-y-3">
                  <FileCheck className="w-10 h-10 text-[#10B981] mx-auto" />
                  <p className="text-xs text-white font-medium">{dict.formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[#8E95A3] font-mono mb-1 text-[11px] uppercase">{dict.formName}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#070B12] border border-[#202733] text-white focus:outline-none focus:border-[#FF8A57]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E95A3] font-mono mb-1 text-[11px] uppercase">{dict.formEmail}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#070B12] border border-[#202733] text-white focus:outline-none focus:border-[#FF8A57]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8E95A3] font-mono mb-1 text-[11px] uppercase">{dict.formFirm}</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firm}
                        onChange={e => setFormData({ ...formData, firm: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#070B12] border border-[#202733] text-white focus:outline-none focus:border-[#FF8A57]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8E95A3] font-mono mb-1 text-[11px] uppercase">{dict.formPhone}</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#070B12] border border-[#202733] text-white focus:outline-none focus:border-[#FF8A57]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#8E95A3] font-mono mb-1 text-[11px] uppercase">{dict.formRole}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#070B12] border border-[#202733] text-white focus:outline-none focus:border-[#FF8A57]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#FF8A57] hover:bg-[#E57846] text-black font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>{dict.formSubmit}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}

export default ExecutiveAdvisorNetworkLandingPage;
