import React from 'react';
import { Database, LineChart, Cpu, MessageSquare, Brain, ArrowRight, Combine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstitutionalHero } from '@/components/ui/public/InstitutionalHero';
import { InstitutionalSection } from '@/components/ui/public/InstitutionalSection';
import { InstitutionalTitle } from '@/components/ui/public/InstitutionalTitle';
import { InstitutionalCard } from '@/components/ui/public/InstitutionalCard';

export function InstitutionalManifestoPage() {
  return (
    <div className="flex flex-col bg-[#050506] text-slate-200">
      
      {/* HERO */}
      <InstitutionalHero
        tagline="The Illumine Manifesto"
        title="A Era da Informação atingiu seu limite."
        subtitle="Bem-vindos à Era do Contexto."
        description={
          <>
            <p className="mb-4">As empresas nunca tiveram tantos dados.<br/>Mas nunca tiveram tanta dificuldade para transformar informação em decisões melhores.</p>
            <p className="text-slate-400">O próximo diferencial competitivo não será apenas acessar dados. Será preservar contexto, ampliar julgamento e transformar experiências em inteligência institucional.</p>
          </>
        }
        showScrollIndicator={true}
      />

      {/* CAPÍTULO 1: O Problema */}
      <InstitutionalSection variant="dark">
        <InstitutionalTitle 
          chapter="Capítulo 1"
          title={<>O problema não é informação.<br/>É interpretação.</>}
          align="center"
        />
        <div className="max-w-4xl mx-auto px-6 space-y-8 text-2xl md:text-3xl text-slate-400 leading-relaxed font-medium text-left md:text-center">
          <p>As organizações não sofrem pela ausência de dados.</p>
          <p>Elas sofrem porque dados fragmentados não carregam contexto, julgamento ou aprendizado.</p>
          <p className="text-slate-300 pt-12 mt-12 border-t border-white/10">
            Entre o que aconteceu e a decisão que precisa ser tomada existe uma camada invisível: <span className="text-white">a inteligência institucional</span>.
          </p>
        </div>
      </InstitutionalSection>

      {/* CAPÍTULO 2: A Evolução das Eras */}
      <InstitutionalSection variant="darker">
        <InstitutionalTitle 
          chapter="Capítulo 2"
          title="A evolução da infraestrutura corporativa."
        />
        <div className="flex flex-col max-w-2xl mx-auto space-y-12 px-6">
          {[
            { title: "ERP", action: "Registrar eventos.", icon: Database, color: "text-slate-500" },
            { title: "BI", action: "Visualizar resultados.", icon: LineChart, color: "text-slate-400" },
            { title: "Analytics", action: "Interpretar padrões.", icon: Cpu, color: "text-slate-300" },
            { title: "Generative AI", action: "Sintetizar conhecimento.", icon: MessageSquare, color: "text-slate-200" },
            { title: "Executive Intelligence", action: "Decidir, aprender e evoluir.", icon: Brain, color: "text-amber-500", highlight: true }
          ].map((era, i, arr) => (
            <div key={i} className="relative group">
              <InstitutionalCard 
                variant={era.highlight ? 'highlight' : 'default'}
                className={`p-6 md:p-8 flex items-center gap-8 ${era.highlight ? 'scale-105 shadow-[0_0_30px_rgba(255,150,0,0.15)] border-amber-500/30 bg-amber-500/10' : ''}`}
                hoverable={!era.highlight}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${era.highlight ? 'bg-amber-500/20' : 'bg-white/10'}`}>
                  <era.icon className={`w-8 h-8 ${era.highlight ? 'text-amber-500' : era.color}`} />
                </div>
                <div>
                  <h3 className={`text-2xl md:text-3xl font-bold ${era.highlight ? 'text-white' : 'text-slate-300'} mb-2`}>{era.title}</h3>
                  <p className={`text-lg font-mono tracking-wider uppercase ${era.highlight ? 'text-amber-500' : 'text-slate-500'}`}>{era.action}</p>
                </div>
              </InstitutionalCard>
              {i < arr.length - 1 && (
                <div className="absolute left-14 md:left-16 top-[100%] h-12 w-[2px] bg-gradient-to-b from-white/10 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </InstitutionalSection>

      {/* CAPÍTULO 3: Amnésia Institucional */}
      <InstitutionalSection variant="dark">
        <InstitutionalTitle 
          chapter="Capítulo 3"
          title="A era da Amnésia Institucional."
        />
        <div className="max-w-4xl mx-auto px-6">
          <InstitutionalCard className="p-8 md:p-16 text-left relative" hoverable={false}>
            <div className="absolute top-0 right-0 opacity-5 p-12"><Combine size={150} /></div>
            <div className="text-2xl md:text-4xl text-slate-300 leading-relaxed font-serif relative z-10 space-y-8">
              <p>"Quando um executivo deixa uma organização, ele não leva apenas sua experiência.</p>
              <p>Ele leva embora anos de contexto: decisões tomadas, premissas consideradas, riscos avaliados e aprendizados conquistados."</p>
            </div>
            <p className="mt-16 pt-8 border-t border-white/10 text-xl text-slate-400 font-medium relative z-10">
              Essa perda silenciosa compromete a continuidade estratégica e reduz a capacidade da organização de evoluir.
            </p>
          </InstitutionalCard>
        </div>
      </InstitutionalSection>

      {/* CAPÍTULO 4: A Nova Tese */}
      <InstitutionalSection variant="darker">
        <InstitutionalTitle 
          chapter="Capítulo 4"
          title="Organizações inteligentes precisam de três capacidades fundamentais:"
        />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <InstitutionalCard className="p-10">
            <h3 className="text-4xl font-bold text-white mb-6">Memória.</h3>
            <p className="text-slate-400 text-xl leading-relaxed">Preservar o contexto de cada decisão.</p>
          </InstitutionalCard>
          <InstitutionalCard className="p-10">
            <h3 className="text-4xl font-bold text-white mb-6">Raciocínio.</h3>
            <p className="text-slate-400 text-xl leading-relaxed">Conectar causas, consequências e impactos sistêmicos.</p>
          </InstitutionalCard>
          <InstitutionalCard className="p-10">
            <h3 className="text-4xl font-bold text-white mb-6">Aprendizado.</h3>
            <p className="text-slate-400 text-xl leading-relaxed">Transformar experiências em conhecimento permanente.</p>
          </InstitutionalCard>
        </div>
      </InstitutionalSection>

      {/* CAPÍTULO 5: A Illumine */}
      <InstitutionalSection variant="glow">
        <InstitutionalTitle 
          chapter="Capítulo 5"
          title={<span style={{ fontFamily: '"Tilt Warp", sans-serif' }} className="text-6xl md:text-8xl">illumine</span>}
          subtitle="A plataforma construída para criar e escalar Inteligência Institucional em organizações complexas."
        />
        
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-24">
          <InstitutionalCard variant="highlight" className="p-10 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Executive Intelligence Platform™</h3>
            <p className="text-slate-400 leading-relaxed text-xl">
              Conecta dados corporativos, contexto decisório e raciocínio executivo para reduzir a distância entre informação e decisão.
            </p>
          </InstitutionalCard>
          <InstitutionalCard variant="highlight" className="p-10 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Institutional Learning Architecture™</h3>
            <p className="text-slate-400 leading-relaxed text-xl">
              Transforma decisões passadas em conhecimento estratégico, permitindo que a organização aprenda continuamente.
            </p>
          </InstitutionalCard>
        </div>

        <div className="text-center mb-24 relative z-10 px-6">
           <p className="text-white font-medium text-3xl md:text-4xl leading-tight">
             A inteligência amplia.<br />
             <span className="text-slate-500">A decisão permanece humana.</span>
           </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 px-6">
          <Link 
            to="/plataforma"
            className="px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-lg"
          >
            Conhecer a Plataforma
            <ArrowRight size={20} />
          </Link>
        </div>
      </InstitutionalSection>

    </div>
  );
}
