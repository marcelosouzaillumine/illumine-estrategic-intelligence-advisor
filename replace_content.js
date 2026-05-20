const fs = require('fs');

const targetPath = '/Users/marcelosouza/Documents/illumine-advisor/src/components/pages/LandingAuthPage.tsx';
let content = fs.readFileSync(targetPath, 'utf8');

const newCompanyContent = `function CompanyContent({ onConsultant }: { onConsultant: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCTA = (message: string) => {
    window.open(
      \`https://wa.me/554131514537?text=\${encodeURIComponent(message)}\`,
      '_blank'
    );
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Por que o acompanhamento mínimo recomendado é de 6 meses?',
      a: 'Porque crescimento sustentável exige continuidade, acompanhamento e amadurecimento gerencial. A transformação estratégica acontece de forma progressiva e integrada.'
    },
    {
      q: 'Como funciona o Diagnóstico Estratégico Inicial?',
      a: 'A Illumine realiza uma análise aprofundada da estrutura financeira, operacional, organizacional e gerencial da empresa para identificar riscos, gargalos, oportunidades e prioridades estratégicas.'
    },
    {
      q: 'Qual é o nível de envolvimento esperado dos sócios e executivos?',
      a: 'O envolvimento da liderança é essencial para garantir alinhamento estratégico, clareza de direção e evolução consistente da gestão.'
    },
    {
      q: 'A Illumine executa as melhorias operacionais?',
      a: 'Além do acompanhamento recorrente, a Illumine também atua em projetos estratégicos complementares conforme a necessidade e complexidade de cada operação.'
    },
    {
      q: 'Para quais empresas a Illumine é recomendada?',
      a: 'Empresas em crescimento, profissionalização, reorganização financeira, expansão operacional ou fortalecimento de governança.'
    },
    {
      q: 'Como funciona a segurança das informações?',
      a: 'Toda a estrutura opera em ambiente privado, com controle de acesso, confidencialidade operacional e acompanhamento seguro das informações estratégicas.'
    },
    {
      q: 'Os relatórios permanecem disponíveis após o encerramento do contrato?',
      a: 'Durante a vigência do acompanhamento, a empresa possui acesso completo à estrutura estratégica Illumine. Em caso de encerramento contratual, a Illumine disponibiliza um relatório executivo consolidado com os principais indicadores e análises gerenciais.'
    }
  ];

  return (
    <div className="space-y-0 text-foreground">
      {/* Hero */}
      <section id="hero" className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md text-primary text-[11px] font-semibold uppercase tracking-widest shadow-xs"
          >
            <Sparkles size={13} className="text-secondary animate-pulse" />
            <span>Illumine Strategic Intelligence &amp; Advisory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.08]"
            style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}
          >
            Inteligência estratégica, governança e <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">advisory executivo</span> para empresas
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="space-y-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground font-medium leading-relaxed"
          >
            <p>
              Inteligência estratégica, governança e advisory executivo para empresas que desejam crescer com clareza, estrutura e sustentabilidade.
            </p>
            <p className="text-base text-muted-foreground/80 font-normal leading-relaxed">
              A Illumine integra inteligência financeira, governança corporativa, indicadores estratégicos e acompanhamento executivo em um ecossistema contínuo de Strategic Intelligence &amp; Advisory.
            </p>
            <p className="text-base text-muted-foreground/80 font-normal leading-relaxed">
              Mais do que dashboards ou relatórios, oferecemos uma estrutura integrada de inteligência empresarial para líderes que precisam tomar decisões com maior segurança, organização e visão de longo prazo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <button
              onClick={() => scrollToSection('porque')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Conhecer a Estrutura Illumine</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleCTA('Gostaria de agendar um diagnóstico estratégico')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container/80 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={16} className="text-secondary" />
              <span>Agendar Diagnóstico Estratégico</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Por que Illumine (Direção Estratégica) */}
      <section id="porque" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              Direção Estratégica
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
              Empresas não precisam apenas de dados. Precisam de direção estratégica.
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>
                A maioria das empresas já possui sistemas, relatórios e informações operacionais.
              </p>
              <p>
                O verdadeiro desafio está em:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>interpretar cenários;</li>
                <li>identificar gargalos;</li>
                <li>integrar áreas;</li>
                <li>organizar prioridades;</li>
                <li>reduzir riscos;</li>
                <li>transformar dados em decisões consistentes.</li>
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/10 rounded-card blur-lg opacity-30" />
            <div className="relative p-8 rounded-card bg-background border border-border shadow-md space-y-4 hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold text-xl text-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                O Ecossistema Illumine
              </h4>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                A Illumine foi criada para preencher exatamente esse espaço.
              </p>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                Nosso ecossistema integra tecnologia, análise executiva, governança e acompanhamento estratégico contínuo para apoiar empresas em crescimento, profissionalização e expansão sustentável.
              </p>
              <p className="text-primary font-bold text-sm leading-relaxed mt-2">
                A tecnologia organiza a informação.<br/>
                A inteligência estratégica transforma direção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Proprietário */}
      <section id="framework" className="py-24 px-6 bg-foreground text-background relative">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">Framework Proprietário</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
              7 Pilares de Inteligência Empresarial
            </h3>
            <p className="text-lg text-background/70 leading-relaxed font-medium pt-2">
              Toda a estrutura de acompanhamento da Illumine é construída sobre um framework proprietário desenvolvido para gerar visão integrada da empresa, fortalecer a gestão e apoiar decisões estratégicas sustentáveis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {[
              { title: 'Governança Corporativa', desc: 'Estruturas de liderança, direção institucional, compliance e sustentabilidade organizacional.' },
              { title: 'Cultura Organizacional', desc: 'Valores, alinhamento interno e fortalecimento da identidade empresarial.' },
              { title: 'Gestão Financeira', desc: 'Inteligência financeira aplicada à sustentabilidade, rentabilidade e crescimento estruturado.' },
              { title: 'Gestão de Inovação', desc: 'Capacidade de adaptação, melhoria contínua e desenvolvimento estratégico.' },
              { title: 'Gestão de Marketing', desc: 'Posicionamento, comunicação, percepção de valor e fortalecimento da autoridade.' },
              { title: 'Gestão Comercial', desc: 'Estrutura comercial orientada à performance, previsibilidade e crescimento.' },
              { title: 'Gestão Operacional', desc: 'Eficiência operacional, integração de processos e fortalecimento da execução.' }
            ].map((pilar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-card bg-background/5 border border-background/10 space-y-3 hover:bg-background/10 hover:border-background/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span className="font-bold text-sm uppercase tracking-wider text-background">{pilar.title}</span>
                </div>
                <p className="text-background/60 font-medium text-xs leading-relaxed">{pilar.desc}</p>
              </div>
            ))}
          </div>

          {/* As 5 Inteligências */}
          <div className="pt-16 border-t border-background/10 space-y-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">As 5 Inteligências</h2>
              <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
                Nossa Visão: Inteligência em Unidade
              </h3>
              <p className="text-lg text-background/70 leading-relaxed font-medium">
                Acreditamos que organizações saudáveis são construídas quando governança, tecnologia, inteligência de dados, identidade organizacional e desenvolvimento humano operam em unidade.
              </p>
              <p className="text-lg text-background/70 leading-relaxed font-medium">
                Mais do que processos e indicadores, empresas fortes nascem da integração entre estratégia, cultura, propósito e capacidade de execução.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Governança', desc: 'Estruturas de liderança, responsabilidade institucional e direção estratégica.' },
                { title: 'Econômica', desc: 'Gestão financeira e inteligência econômica aplicadas à sustentabilidade do negócio.' },
                { title: 'Identidade', desc: 'Cultura, valores e princípios que sustentam a essência organizacional.' },
                { title: 'Sistêmica', desc: 'Integração entre dados, processos, tecnologia e operação.' },
                { title: 'Antropológica', desc: 'Compreensão da natureza humana como fundamento da liderança, das relações e da cultura empresarial.' }
              ].map((intel, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-card bg-background/5 border border-background/10 space-y-3 hover:bg-background/10 hover:border-background/20 transition-all duration-300"
                >
                  <span className="font-bold text-sm uppercase tracking-wider text-secondary block">{intel.title}</span>
                  <p className="text-background/60 font-medium text-xs leading-relaxed">{intel.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Estrutura Integrada de Inteligência Empresarial */}
      <section id="ecossistema" className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Network size={16} className="text-secondary" />
              <span>Estrutura Integrada de Inteligência Empresarial</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
              Uma estrutura contínua de acompanhamento estratégico, governança e inteligência aplicada à gestão.
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              A Illumine combina tecnologia, advisory e análise estratégica em uma estrutura privada e continuamente acompanhada por especialistas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: LineChart, title: 'Indicadores Estratégicos Integrados', desc: 'Indicadores financeiros, operacionais e gerenciais organizados em uma central executiva para acompanhamento e tomada de decisão.' },
              { icon: BarChart3, title: 'Diagnósticos Executivos', desc: 'Análises aprofundadas que revelam riscos, gargalos, oportunidades e maturidade organizacional.' },
              { icon: Users, title: 'Advisory Estratégico Contínuo', desc: 'Acompanhamento executivo recorrente com análise interpretativa, direcionamento estratégico e suporte à tomada de decisão.' },
              { icon: Building2, title: 'Governança Corporativa', desc: 'Estrutura orientada à profissionalização da gestão, transparência institucional e fortalecimento organizacional.' },
              { icon: Database, title: 'Inteligência Orientada por Dados', desc: 'Integração entre métricas, inteligência gerencial, automação e monitoramento estratégico da performance empresarial.' },
              { icon: BrainCircuit, title: 'Curadoria Especializada', desc: 'A equipe Illumine acompanha, organiza e interpreta os indicadores de forma contínua, promovendo maior clareza gerencial e consistência analítica.' },
              { icon: ShieldCheck, title: 'Governança e Segurança', desc: 'Ambiente privado com controle de acesso, confidencialidade operacional e estrutura segura para gestão estratégica recorrente.' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-card bg-white border border-border/80 shadow-xs hover:shadow-lg hover:border-secondary/35 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-button bg-surface-container flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors duration-300">
                  <item.icon size={22} className="text-secondary group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                <p className="text-muted-foreground font-medium leading-relaxed text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como a Illumine Atua */}
      <section className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Como a Illumine Atua</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
              Uma estrutura contínua de inteligência estratégica e acompanhamento executivo.
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Diagnóstico Estratégico', desc: 'Leitura aprofundada da realidade organizacional, financeira e operacional da empresa.' },
              { title: 'Acompanhamento Executivo', desc: 'Estrutura recorrente de inteligência estratégica, governança aplicada e suporte à tomada de decisão.' },
              { title: 'Projetos Estratégicos Complementares', desc: 'Frentes especializadas de transformação, estruturação e crescimento empresarial conforme a necessidade de cada operação.' },
              { title: 'Governance & Advisory', desc: 'Apoio executivo para empresas que demandam maior maturidade de gestão, organização estratégica e suporte recorrente à liderança.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-card bg-background border border-border/80 shadow-xs">
                <h4 className="text-lg font-bold text-primary mb-2">{item.title}</h4>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estruturas de Strategic Intelligence & Advisory */}
      <section id="modalidades" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Estruturas de Strategic Intelligence &amp; Advisory</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
              Estruturas desenvolvidas para empresas em diferentes níveis de operação, maturidade e complexidade estratégica.
            </h3>
            <div className="text-lg text-muted-foreground leading-relaxed font-medium bg-surface-container/30 p-6 rounded-xl border border-border/50 inline-block text-left mt-4">
              <p className="font-bold text-foreground mb-2">Todos os modelos incluem:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>acesso completo à estrutura estratégica Illumine;</li>
                <li>curadoria contínua dos indicadores;</li>
                <li>acompanhamento executivo recorrente;</li>
                <li>inteligência gerencial integrada;</li>
                <li>advisory estratégico especializado;</li>
                <li>monitoramento orientado por dados.</li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch pt-4">
            {/* ESSENTIAL */}
            <div className="rounded-card bg-card border border-border/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 group">
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>ESSENTIAL</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Estruturação e Clareza Operacional</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Perfil recomendado</p>
                  <ul className="text-xs text-foreground font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">• Até 10 colaboradores</li>
                    <li className="flex items-center gap-1.5">• Faturamento de até R$ 150 mil/mês</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'encontro executivo mensal',
                    'estruturação dos indicadores essenciais',
                    'curadoria estratégica das informações',
                    'acompanhamento consultivo recorrente',
                    'central executiva Illumine',
                    'advisory estratégico contínuo'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCTA('Gostaria de falar com um especialista sobre o modelo Essential')}
                className="w-full h-12 mt-8 rounded-button bg-surface-container hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Falar com um especialista
              </button>
            </div>

            {/* STRATEGIC */}
            <div className="rounded-card bg-card border-2 border-primary p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-primary/5 transform lg:-translate-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-secondary to-[#E96F3D]" />
              <div className="absolute top-6 right-6 px-3 py-1 bg-secondary text-secondary-foreground text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow-sm animate-pulse">
                Recomendado
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>STRATEGIC</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Expansão e Performance Empresarial</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Perfil recomendado</p>
                  <ul className="text-xs text-foreground font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">• 10 a 40 colaboradores</li>
                    <li className="flex items-center gap-1.5">• Faturamento entre R$ 150k e R$ 1M/mês</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'dois encontros executivos mensais',
                    'inteligência gerencial personalizada',
                    'curadoria avançada de indicadores',
                    'acompanhamento financeiro e operacional',
                    'apoio à liderança e gestão',
                    'advisory estratégico contínuo',
                    'central executiva Illumine'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCTA('Gostaria de agendar um diagnóstico estratégico - Modelo Strategic')}
                className="w-full h-12 mt-8 rounded-button bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Agendar diagnóstico estratégico
              </button>
            </div>

            {/* EXECUTIVE ADVISORY */}
            <div className="rounded-card bg-card border border-border/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 group">
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>EXECUTIVE ADVISORY</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Governança, Inteligência e Escala</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Perfil recomendado</p>
                  <ul className="text-xs text-foreground font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">• Acima de 40 colaboradores</li>
                    <li className="flex items-center gap-1.5">• Faturamento acima de R$ 1 milhão/mês</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'encontros executivos semanais ou quinzenais',
                    'advisory estratégico personalizado',
                    'curadoria executiva contínua',
                    'relatórios gerenciais integrados',
                    'apoio à governança corporativa',
                    'estruturação avançada de indicadores',
                    'acompanhamento multidisciplinar',
                    'central estratégica Illumine'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCTA('Gostaria de solicitar uma reunião executiva - Executive Advisory')}
                className="w-full h-12 mt-8 rounded-button bg-surface-container hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Solicitar reunião executiva
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Alinhamento Estratégico - FAQ */}
      <section id="faq" className="py-24 px-6 bg-surface-container/30 border-y border-border/40">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Alinhamento Estratégico</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
              Perguntas Frequentes
            </h3>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    "border rounded-card bg-background overflow-hidden transition-all duration-300",
                    isOpen ? "border-secondary/35 shadow-md shadow-secondary/[0.01]" : "border-border/80"
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex justify-between items-center text-left font-bold text-foreground hover:bg-surface-container/30 transition-colors cursor-pointer"
                  >
                    <span className="text-base pr-4 transition-colors duration-300">{faq.q}</span>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0",
                      isOpen ? "bg-secondary/15 text-secondary" : "bg-surface-container text-muted-foreground"
                    )}>
                      <ChevronRight
                        size={16}
                        className={cn(
                          "transition-transform duration-300",
                          isOpen && "transform rotate-90"
                        )}
                      />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-muted-foreground font-medium text-sm leading-relaxed border-t border-border/30 pt-4 bg-surface-container/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conclusão */}
      <section id="conclusao" className="py-24 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background leading-tight" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>
            Crescimento exige mais do que informação
          </h3>
          <div className="text-lg md:text-xl text-background/70 space-y-4 font-medium leading-relaxed">
            <p>
              Empresas sustentáveis não são construídas apenas com dados.
            </p>
            <p>
              São construídas com clareza estratégica, estrutura de gestão, capacidade de decisão e acompanhamento consistente.
            </p>
            <p className="text-background font-bold text-xl pt-4">
              A Illumine existe para apoiar líderes e organizações que desejam crescer com direção, governança e inteligência aplicada à realidade do negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Buttons */}
      <section className="py-20 px-6 bg-surface-container/20 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h4 className="text-2xl font-bold text-foreground" style={{ fontFamily: \"'Tilt Warp', sans-serif\" }}>Illumine Strategic Intelligence &amp; Advisory</h4>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Inteligência estratégica, governança e performance para empresas que desejam crescer com clareza, estrutura e sustentabilidade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('ecossistema')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-surface-container border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container/85 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Conhecer a Estrutura Illumine
            </button>
            <button
              onClick={() => handleCTA('Gostaria de agendar um diagnóstico estratégico')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Agendar Diagnóstico Estratégico
            </button>
            <button
              onClick={() => handleCTA('Gostaria de falar com um Advisor')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-surface-container border border-secondary/35 text-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container/85 hover:border-secondary/55 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Falar com um Advisor Illumine
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

const match = content.match(/function CompanyContent\(\{ onConsultant \}: \{ onConsultant: \(\) => void \}\) \{[\s\S]*?(?=\n\n\/\/ ─── Partner Content)/);
if (match) {
  content = content.substring(0, match.index) + newCompanyContent + content.substring(match.index + match[0].length);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log("Success");
} else {
  console.log("Match failed");
}
