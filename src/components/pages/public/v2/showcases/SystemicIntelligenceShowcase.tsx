import React from 'react';
import { Cpu, TrendingUp, AlertTriangle, Zap, Target, ShieldCheck, Activity, ArrowRightLeft, Sparkles, Layers } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { InstitutionalShowcase } from './InstitutionalShowcase';
import { useExecutiveFormatter } from '../../../../../core/localization';

export function SystemicIntelligenceShowcase() {
  const formatter = useExecutiveFormatter();
  const { t } = useTranslation('showcases/systemic-governance');

  const rawResonance = t('resonanceData', { returnObjects: true });
  const resonanceDataSubjects = Array.isArray(rawResonance) ? rawResonance as { subject: string }[] : [];
  
  const rawFriction = t('frictionSources', { returnObjects: true });
  const frictionSourcesData = Array.isArray(rawFriction) ? rawFriction as { name: string }[] : [];

  const stats = {
    alignmentScore: 92,
    frictionIndex: 4.2,
    estimatedLoss: 1250000,
    humanLeverage: 3.4,
    perenityIndex: 88,
    valuationPremium: 27,
    ebitda: 45000000,
    resonanceData: [
      { subject: resonanceDataSubjects[0]?.subject || 'Governança', A: 95, fullMark: 100 },
      { subject: resonanceDataSubjects[1]?.subject || 'Cultura', A: 88, fullMark: 100 },
      { subject: resonanceDataSubjects[2]?.subject || 'Finanças', A: 92, fullMark: 100 },
      { subject: resonanceDataSubjects[3]?.subject || 'Inovação', A: 85, fullMark: 100 },
      { subject: resonanceDataSubjects[4]?.subject || 'Marketing', A: 90, fullMark: 100 },
      { subject: resonanceDataSubjects[5]?.subject || 'Comercial', A: 94, fullMark: 100 },
      { subject: resonanceDataSubjects[6]?.subject || 'Operacional', A: 89, fullMark: 100 },
    ],
    frictionSources: [
      { name: frictionSourcesData[0]?.name || 'Silos de Dados', value: 35, impact: 'High' },
      { name: frictionSourcesData[1]?.name || 'Processos Manuais', value: 25, impact: 'High' },
      { name: frictionSourcesData[2]?.name || 'Alinhamento Liderança', value: 20, impact: 'Medium' },
      { name: frictionSourcesData[3]?.name || 'Retenção Talentos', value: 20, impact: 'Medium' },
    ],
    warnings: [
      {
        id: 'warn-1',
        title: 'Alerta: Silos de Dados',
        desc: 'Impacto crítico detectado no eixo Operacional. Risco de comprometimento do Fluxo de Caixa.',
        severity: 'high',
        axis: 'Gestão Operacional'
      }
    ]
  };

  const formatCurrency = (value: number) => {
    return formatter.currency(value);
  };

  return (
    <InstitutionalShowcase title="Systemic Governance Engine (Grupo Atlas Participações)" className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6 w-full text-zinc-100 font-sans">
        
        <div className="space-y-10 pb-10">
          <div className="flex items-center justify-between gap-4 flex-wrap bg-zinc-900/60 p-4 rounded-md border border-zinc-800 backdrop-blur-sm shadow-sm mb-10">
            <div className="flex items-center gap-3">
              <div className="px-4 md:px-6 py-2 md:py-3 bg-zinc-950 border border-zinc-800 rounded-md shadow-sm flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest block mb-1">{t('ui.score_label')}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-medium text-amber-500">{stats.alignmentScore}%</span>
                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${stats.alignmentScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md shadow-sm flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{t('ui.multidimensional_tag')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Radar de Ressonância Estratégica */}
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-lg flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[10px] font-medium text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                    <ArrowRightLeft size={16} className="text-amber-500" />
                    {t('ui.resonance_title')}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-widest">{t('ui.resonance_desc')}</p>
                </div>
              </div>
              
              <div className="h-[250px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.resonanceData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 9, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Maturidade"
                      dataKey="A"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="#f59e0b"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Índice de Atrito Sistêmico */}
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-lg flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[10px] font-medium text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    {t('ui.friction_title')}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-widest">{t('ui.friction_desc')}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-medium text-red-500">{stats.frictionIndex}%</span>
                  <span className="text-[8px] font-medium text-zinc-500 block uppercase tracking-widest">{t('ui.loss_label')}</span>
                </div>
              </div>

              <div className="h-[180px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.frictionSources} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 500 }} width={120} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#09090b', color: '#f4f4f5' }}
                      formatter={(val: number) => [`${val}%`, t('ui.contribution_label')]}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                      {stats.frictionSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.impact === 'High' ? '#ef4444' : '#f59e0b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border bg-zinc-900 border-zinc-800">
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">{t('ui.impact_label')}</span>
                <span className="text-sm font-medium text-red-500">{formatCurrency(stats.estimatedLoss)} / per</span>
              </div>
            </div>

            {/* Valuation Premium Guard */}
            <div className="bg-zinc-950 p-8 rounded-lg border border-zinc-800 text-zinc-100 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <h3 className="text-amber-500 font-medium text-[10px] uppercase tracking-widest mb-4">{t('ui.premium_tag')}</h3>
                <h2 className="text-4xl font-medium tracking-tight leading-tight mb-6">
                  +{stats.valuationPremium}% <span className="text-zinc-500 text-2xl block mt-1">{t('ui.premium_val')}</span>
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-medium text-zinc-500 uppercase mb-2 tracking-widest">
                      <span>{t('ui.market_label')}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full">
                      <div className="h-full bg-zinc-600 w-[70%] rounded-full" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-medium text-amber-500 uppercase mb-2 tracking-widest">
                      <span>Illumine Signature</span>
                    </div>
                    <div className="h-2 bg-amber-500/20 rounded-full">
                      <div className="h-full bg-amber-500 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </InstitutionalShowcase>
  );
}
