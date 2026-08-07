import React from 'react';
import { SeoManager } from '../../../../core/seo/SeoManager';
import { LeadCaptureEntryPoint } from '../../../ui/public/commercial/LeadCaptureEntryPoint';
import { 
  CheckCircle2, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Zap,
  Layers,
  ArrowRight,
  ChevronDown,
  Building2,
  Users,
  Activity,
  Box,
  BrainCircuit,
  BarChart3,
  Globe2,
  Network
} from 'lucide-react';

export function NonprofitPlansPage() {
  const offices = [
    'Executive Command Center',
    'Financial Intelligence',
    'Governance Intelligence',
    'Commercial Intelligence',
    'Operational Intelligence',
    'People Intelligence',
    'Risk Intelligence',
    'Institutional Intelligence',
    'Executive AI',
    'API Hub',
    'Executive Reports',
    'Executive Dashboards'
  ];

  const includesList = [
    { name: 'Executive AI', icon: BrainCircuit },
    { name: 'Todos os Offices', icon: Building2 },
    { name: 'Dashboards', icon: BarChart3 },
    { name: 'API Ready', icon: Network },
    { name: 'Cloud', icon: Cloud },
    { name: 'Segurança', icon: ShieldCheck },
    { name: 'Atualizações', icon: Zap },
    { name: 'Portal do Conhecimento', icon: Globe2 }
  ];

  return (
    <div className="flex flex-col bg-[#0A0A0B] text-slate-200">
      <SeoManager pageKey="NONPROFIT_PLANS" />
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            A mesma plataforma.<br />
            A capacidade ideal para o Terceiro Setor.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transforme dados de impacto em decisões executivas com uma plataforma desenvolvida para ONGs, Fundações, Institutos e Redes que desejam governar com inteligência, sustentabilidade e transparência.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LeadCaptureEntryPoint className="px-8 py-4 text-lg" />
          </div>
        </div>
      </section>

      {/* 2. Todos utilizam a mesma plataforma (Offices & Tech) */}
      <section className="py-24 bg-[#050506] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Todas as organizações utilizam a mesma Executive Intelligence Platform™</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Os planos diferenciam apenas a capacidade operacional licenciada e os serviços contratados. Não existem versões reduzidas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {includesList.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <item.icon className="w-8 h-8 text-amber-500 mb-4" />
                <span className="text-sm font-semibold text-white">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {offices.map((office, idx) => (
              <div key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium">
                {office}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. O que muda? (Capacidade) */}
      <section className="py-16 bg-[#0A0A0B]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Então, o que muda entre os planos?</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {['Capacidade Operacional', 'Usuários Licenciados', 'Infraestrutura', 'Processamento', 'Armazenamento'].map((diff, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <span className="text-slate-300 font-medium">{diff}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Compare os Planos */}
      <section className="py-24 bg-[#050506] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Community */}
            <div className="bg-[#0A0A0B] border border-white/10 rounded-3xl p-8 flex flex-col relative group hover:border-amber-500/50 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Community™</h3>
              <p className="text-sm text-slate-400 mb-8 h-12">Ideal para pequenas organizações e OSCs em fase de estruturação.</p>
              
              <div className="mb-8">
                <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Licenciamento</div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">R$ 597</span>
                  <span className="text-slate-500 mb-1">/mês</span>
                </div>
              </div>

              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Executive Enablement™</div>
                <div className="text-xl font-bold text-white">R$ 1.997</div>
                <div className="text-xs text-slate-500 mt-1">Taxa única de implantação</div>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Até 1 organização ou projeto',
                  'Até 3 usuários licenciados',
                  'Executive Intelligence Platform™ completa',
                  'Executive AI e Dashboards',
                  'Governança Institucional e Indicadores de Impacto'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-tight">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <LeadCaptureEntryPoint label="Agendar Demo" variant="outline" className="w-full py-3" />
              </div>
            </div>

            {/* Growth */}
            <div className="bg-[#0A0A0B] border border-white/10 rounded-3xl p-8 flex flex-col relative group hover:border-amber-500/50 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Growth™</h3>
              <p className="text-sm text-slate-400 mb-8 h-12">Ideal para organizações em crescimento e amadurecimento.</p>
              
              <div className="mb-8">
                <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Licenciamento</div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">R$ 1.197</span>
                  <span className="text-slate-500 mb-1">/mês</span>
                </div>
              </div>

              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Executive Enablement™</div>
                <div className="text-xl font-bold text-white">R$ 2.997</div>
                <div className="text-xs text-slate-500 mt-1">Taxa única de implantação</div>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Até 3 unidades ou projetos',
                  'Até 10 usuários licenciados',
                  'API Integration Ready™, quando houver estrutura disponível',
                  'Executive Intelligence Platform™ completa',
                  'Executive AI e Dashboards Executivos'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-tight">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <LeadCaptureEntryPoint label="Agendar Demo" variant="outline" className="w-full py-3" />
              </div>
            </div>

            {/* Network */}
            <div className="bg-[#0A0A0B] border border-amber-500/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_40px_rgba(245,158,11,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                Recomendado
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Network™</h3>
              <p className="text-sm text-slate-400 mb-8 h-12">Ideal para organizações com múltiplos programas ou filiais.</p>
              
              <div className="mb-8">
                <div className="text-sm text-amber-500 font-semibold uppercase tracking-wider mb-2">Licenciamento</div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">R$ 2.497</span>
                  <span className="text-slate-500 mb-1">/mês</span>
                </div>
              </div>

              <div className="mb-8 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1">Executive Enablement™</div>
                <div className="text-xl font-bold text-white">R$ 4.997</div>
                <div className="text-xs text-slate-400 mt-1">Taxa única de implantação</div>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Até 10 unidades ou projetos',
                  'Até 25 usuários licenciados',
                  'API Integration Ready™, quando houver estrutura disponível',
                  'Executive Intelligence Platform™ completa'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-tight">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <LeadCaptureEntryPoint label="Agendar Demo" variant="primary" className="w-full py-3" />
              </div>
            </div>

            {/* Alliance */}
            <div className="bg-gradient-to-b from-[#111113] to-[#0A0A0B] border border-white/10 rounded-3xl p-8 flex flex-col relative group hover:border-white/30 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Alliance™</h3>
              <p className="text-sm text-slate-400 mb-8 h-12">Para grandes organizações, federações, fundações e redes.</p>
              
              <div className="mb-8">
                <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Licenciamento</div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">Sob proposta</span>
                </div>
              </div>

              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Executive Enablement™</div>
                <div className="text-xl font-bold text-white">Sob proposta</div>
                <div className="text-xs text-slate-500 mt-1">Desenho customizado</div>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Operações nacionais ou internacionais',
                  'Arquitetura personalizada e integrações corporativas',
                  'Recursos Enterprise e alta capacidade operacional',
                  'Desenho de implantação sob medida'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-tight">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <LeadCaptureEntryPoint label="Falar com Especialista" variant="secondary" className="w-full py-3" />
              </div>
            </div>
          </div>

          <div className="mt-16 bg-[#0A0A0B] border border-white/10 rounded-3xl p-8 lg:p-10 text-left md:text-center max-w-4xl mx-auto shadow-lg">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center md:justify-center gap-3">
              <Network className="w-6 h-6 text-amber-500" />
              Integrações com Sistemas Institucionais
            </h4>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Os planos Growth™, Network™ e Alliance™ contemplam a configuração da integração da plataforma Illumine com sistemas que disponibilizem APIs, conectores ou mecanismos de integração compatíveis, <strong className="text-white font-medium">desde que a estrutura técnica necessária seja fornecida pelo sistema da organização</strong>.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
              <p className="text-sm text-amber-500/90 leading-relaxed font-medium">
                Quando a integração exigir o desenvolvimento de novos conectores, APIs, adaptadores ou componentes específicos, será elaborado um projeto de desenvolvimento dedicado, sujeito à análise de viabilidade técnica, definição de escopo e proposta comercial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Executive Enablement & Serviços Adicionais */}
      <section className="py-24 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enablement */}
            <div className="bg-gradient-to-br from-[#1A1A1E] to-[#0D0D10] border border-white/10 rounded-3xl p-10">
              <h3 className="text-3xl font-bold text-white mb-6">Executive Enablement™</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                O programa estruturado de implantação que prepara a plataforma para refletir a realidade institucional da organização antes do início da operação.
              </p>
              <ul className="space-y-4">
                {['Diagnóstico institucional', 'Configuração do ambiente', 'Parametrização de indicadores', 'Estruturação de usuários e permissões', 'Capacitação das equipes', 'Homologação e Go Live assistido'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Adicionais */}
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-white mb-2">Serviços Adicionais</h3>
              
              <div className="bg-[#050506] border border-white/5 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-500" />
                  Office Integration™
                </h4>
                <p className="text-sm text-slate-400 mb-4">Integração com ERPs, CRMs e sistemas de captação ou RH do Terceiro Setor.</p>
                <div className="text-xs text-slate-500 bg-white/5 p-3 rounded-xl">Sujeito a avaliação técnica e proposta comercial dedicada caso exija novos conectores.</div>
              </div>

              <div className="bg-[#050506] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Users className="w-24 h-24 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Executive Advisory™</h4>
                <p className="text-sm text-slate-400">
                  Serviço profissional opcional, realizado por Advisors Partners credenciados ou por equipes autorizadas, conforme o modelo de atuação adotado para cada projeto institucional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Jornada de Implantação */}
      <section className="py-24 bg-[#050506] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-16">A Jornada para a Inteligência Executiva</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {[
              { title: 'Diagnóstico', icon: Activity },
              { title: 'Enablement™', icon: Box },
              { title: 'Configuração', icon: Layers },
              { title: 'Integrações', icon: Database },
              { title: 'Treinamento', icon: Users },
              { title: 'Go Live', icon: Zap },
              { title: 'Evolução Contínua', icon: ArrowRight, active: true }
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className={`flex flex-col items-center gap-4 w-32 ${step.active ? 'text-amber-500' : 'text-slate-400'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${step.active ? 'bg-amber-500 text-black' : 'bg-white/5 border border-white/10'}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${step.active ? 'text-amber-500' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden md:block w-8 h-px bg-white/10"></div>
                )}
                {idx < arr.length - 1 && (
                  <div className="block md:hidden h-8 w-px bg-white/10"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-[#0A0A0B]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "Todos utilizam a mesma plataforma?",
                a: "Sim. A Illumine não comercializa 'versões reduzidas'. Toda organização social tem acesso à mesma Executive Intelligence Platform™ premium, variando apenas a capacidade operacional conforme o plano."
              },
              {
                q: "O que muda entre os planos?",
                a: "Os planos refletem a escala institucional: limite de unidades/projetos atendidos e quantidade de usuários licenciados que poderão acessar a plataforma."
              },
              {
                q: "A implantação está incluída no valor mensal?",
                a: "Não. A implantação é realizada através do programa Executive Enablement™, cobrado como uma taxa única no início do projeto, para configurar indicadores, governança e treinar a equipe."
              },
              {
                q: "Como funcionam as integrações?",
                a: "Para sistemas que já dispõem de API aberta e moderna, a integração está inclusa (API Ready) a partir do plano Growth. Caso exija desenvolvimento de novos conectores específicos, será avaliado via escopo dedicado."
              },
              {
                q: "Existe apoio consultivo associado à plataforma?",
                a: "Sim. Opcionalmente, organizações podem contratar o serviço de Executive Advisory™, realizado por especialistas ou parceiros certificados, para apoiar ativamente o Conselho e a Diretoria Executiva."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-[#050506] border border-white/5 rounded-2xl overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-medium text-white select-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA Final */}
      <section className="py-32 bg-amber-500 text-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Inteligência de impacto para sua organização.
          </h2>
          <p className="text-xl font-medium opacity-80 mb-10 max-w-2xl mx-auto">
            Descubra como a Illumine pode apoiar sua organização na construção de uma gestão mais transparente, sustentável e orientada por dados de impacto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LeadCaptureEntryPoint 
              label="Agendar uma Executive Demo" 
              className="bg-black text-white hover:bg-slate-900 shadow-2xl px-8 py-4 text-lg"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
