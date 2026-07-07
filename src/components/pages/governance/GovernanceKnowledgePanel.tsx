// src/components/pages/governance/GovernanceKnowledgePanel.tsx

import React, { useState } from 'react';
import { BookOpen, Scale, Award, Shield, AlertTriangle, Compass, CheckCircle2, HelpCircle, Activity, Lock, FileText } from 'lucide-react';
import { FiduciaryRuntimeAdapter, ESGIMScenario, PrincipleMatch } from '../../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../../contexts/LanguageContext';

interface GovernanceKnowledgePanelProps {
  clientId: string;
  scenario: ESGIMScenario;
  executiveSummary: string;
}

export function GovernanceKnowledgePanel({ clientId, scenario, executiveSummary }: GovernanceKnowledgePanelProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 1. Calculate PAI and details
  const { score: paiScore, level: paiLevel } = FiduciaryRuntimeAdapter.governanceKnowledgeEngine.calculatePAI(clientId, scenario);
  
  // 2. Fetch matched principles
  const knowledgeResult = FiduciaryRuntimeAdapter.governanceKnowledgeEngine.matchFinding(
    `GKP-${clientId}`,
    'ESGIM',
    executiveSummary
  );
  
  const matches = knowledgeResult.principleMatches || [];

  // PAI Color & Badge mappings
  const getPAITheme = (level: string) => {
    switch (level) {
      case 'EXCELLENT':
        return {
          text: 'text-emerald-400',
          bg: 'bg-success-soft0/10',
          border: 'border-emerald-500/30',
          accent: 'bg-success-soft0',
          progressColor: 'var(--color-executive-primary)',
          label: 'Excelente'
        };
      case 'MATURE':
        return {
          text: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/30',
          accent: 'bg-teal-500',
          progressColor: 'var(--color-executive-primary)',
          label: 'Maduro'
        };
      case 'DEVELOPING':
        return {
          text: 'text-amber-400',
          bg: 'bg-warning-soft0/10',
          border: 'border-amber-500/30',
          accent: 'bg-warning-soft0',
          progressColor: 'var(--color-executive-primary)',
          label: 'Em Desenvolvimento'
        };
      case 'CONCERN':
        return {
          text: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          accent: 'bg-orange-500',
          progressColor: 'var(--color-executive-primary)',
          label: 'Preocupante'
        };
      case 'CRITICAL':
        return {
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          accent: 'bg-red-500',
          progressColor: 'var(--color-executive-primary)',
          label: 'Crítico'
        };
      default:
        return {
          text: 'text-muted-foreground',
          bg: 'bg-gray-500/10',
          border: 'border-border',
          accent: 'bg-gray-500',
          progressColor: 'var(--color-executive-primary)',
          label: 'Indefinido'
        };
    }
  };

  const theme = getPAITheme(paiLevel);

  // All 8 IWL Categories
  const allCategories = [
    { key: 'GOVERNANCE', label: 'Governança', desc: 'Estruturação fiduciária e colegiada.' },
    { key: 'LEADERSHIP', label: 'Liderança', desc: 'Cultura de serviço e mentoria.' },
    { key: 'STRATEGIC', label: 'Estratégico', desc: 'Inovação e prontidão tecnológica.' },
    { key: 'ETHICAL', label: 'Ético', desc: 'Conformidade e integridade incondicional.' },
    { key: 'ESG', label: 'ESG', desc: 'Governança socialmente responsável.' },
    { key: 'INSTITUTIONAL', label: 'Institucional', desc: 'Sucessão e legado multigeração.' },
    { key: 'BAM', label: 'BAM', desc: 'Business as Mission e valores sociais.' },
    { key: 'BIBLICAL', label: 'Bíblico', desc: 'Princípios e mordomia fiduciária.' }
  ];

  // Filtering principles based on category selected
  const filteredMatches = selectedCategory 
    ? matches.filter(m => m.category === selectedCategory) 
    : matches;

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Background radial accent */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[120px] opacity-10 transition-colors duration-1000 ${theme.progressColor === 'var(--color-executive-primary)' ? 'bg-red-500' : 'bg-success-soft0'}`} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-2xl border border-primary text-primary shadow-lg shadow-indigo-500/5">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Governance Knowledge Layer
              </h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary border border-primary text-primary rounded-full">
                GKL™ v1.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              Materialização em Runtime da IWL™ (Institutional Wisdom Library)
            </p>
          </div>
        </div>

        {/* Informative override alert */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-gray-950/40 border border-border px-3 py-1.5 rounded-xl">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="uppercase tracking-wider">A evidência governa; os princípios explicam</span>
        </div>
      </div>

      {/* Cockpit Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dial & Score Panel */}
        <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Score Dial</span>
          </div>

          <div className="relative flex items-center justify-center my-6">
            {/* SVG Circular Progress */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke={theme.progressColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={427}
                strokeDashoffset={427 - (427 * paiScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">{paiScore}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Pontos PAI™</span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <div className={`py-2 px-4 rounded-xl border ${theme.bg} ${theme.border} text-center`}>
              <span className={`text-sm font-black uppercase tracking-wider ${theme.text}`}>
                Aderência: {theme.label}
              </span>
            </div>
            
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              O **PAI™** mede a aderência prática aos princípios constitucionais cruzando a resolutividade decisória (GDTL™) e maturidade operacional (ESGIM™).
            </p>
          </div>
        </div>

        {/* Executive Rationale & Cap Warnings */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="bg-black/20 border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Raciocínio Epistemológico Geral
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {knowledgeResult.executiveRationale}
            </p>
            
            <div className="text-[11px] text-muted-foreground font-mono bg-black/40 p-2.5 rounded border border-border break-all">
              <span className="text-primary font-bold block mb-1">LIN-GKL HASH:</span>
              {knowledgeResult.lineageHash}
            </div>
          </div>

          {/* Scenario Caps Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border text-xs ${scenario === 'CONSTITUTIONAL_BREACH' ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-950/20 border-border'}`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <Lock className={`w-3.5 h-3.5 ${scenario === 'CONSTITUTIONAL_BREACH' ? 'text-red-400' : 'text-muted-foreground'}`} />
                <span className={scenario === 'CONSTITUTIONAL_BREACH' ? 'text-red-400' : 'text-muted-foreground'}>Constitutional Breach Cap</span>
              </div>
              <p className="text-[10px] text-muted-foreground">PAI limitado a **34** caso haja violações de cláusulas pétreas ou alçadas fiduciárias.</p>
            </div>

            <div className={`p-4 rounded-xl border text-xs ${scenario === 'LIQUIDITY_SHOCK' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-gray-950/20 border-border'}`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className={`w-3.5 h-3.5 ${scenario === 'LIQUIDITY_SHOCK' ? 'text-orange-400' : 'text-muted-foreground'}`} />
                <span className={scenario === 'LIQUIDITY_SHOCK' ? 'text-orange-400' : 'text-muted-foreground'}>Liquidity Shock Cap</span>
              </div>
              <p className="text-[10px] text-muted-foreground">PAI limitado a **48** devido ao estresse extremo de sobrevivência e runway fiduciário.</p>
            </div>

            <div className={`p-4 rounded-xl border text-xs ${scenario === 'MISSION_STRESS' ? 'bg-warning-soft0/10 border-amber-500/30' : 'bg-gray-950/20 border-border'}`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <Compass className={`w-3.5 h-3.5 ${scenario === 'MISSION_STRESS' ? 'text-amber-400' : 'text-muted-foreground'}`} />
                <span className={scenario === 'MISSION_STRESS' ? 'text-amber-400' : 'text-muted-foreground'}>Mission Stress Cap</span>
              </div>
              <p className="text-[10px] text-muted-foreground">PAI limitado a **55** devido ao desalinhamento fiduciário do legado principal.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Library Categories & Matched Principles */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            Coleções de Princípios da Biblioteca de Sabedoria Institucional (IWL™)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Selecione uma categoria para filtrar as justificativas runtime e demonstrar como nossos valores dão suporte direto ao plano de ação fiduciário.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allCategories.map(cat => {
              const activeCount = matches.filter(m => m.category === cat.key).length;
              const isSelected = selectedCategory === cat.key;
              
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected 
                      ? 'bg-primary border-primary text-primary ring-2 ring-indigo-500/20' 
                      : activeCount > 0
                        ? 'bg-gray-950/40 border-border hover:border-border text-muted-foreground'
                        : 'bg-gray-950/10 border-border opacity-40 hover:opacity-60 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black tracking-wider uppercase">{cat.label}</span>
                    {activeCount > 0 && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-primary text-primary' : 'bg-gray-800 text-primary'}`}>
                        {activeCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-snug line-clamp-1">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Principles Applied Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Princípios Praticados no Período ({filteredMatches.length})
            </span>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="text-[9px] font-bold text-accent hover:text-accent uppercase tracking-widest"
              >
                Limpar Filtro
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((pm, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-black/25 border border-border hover:border-border transition-colors rounded-2xl flex items-start gap-4 shadow-sm"
              >
                <div className="p-2.5 bg-success-soft0/10 border border-emerald-500/20 text-emerald-400 rounded-xl mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary px-2 py-0.5 rounded border border-primary">
                      {pm.category}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground font-mono">
                      {pm.principleId}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">
                    {pm.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {pm.explanation}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Aderência Teórica: <strong>{pm.relevanceScore}%</strong></span>
                  </div>
                </div>
              </div>
            ))}

            {filteredMatches.length === 0 && (
              <div className="col-span-2 text-center p-8 bg-black/15 border border-border rounded-2xl border-dashed">
                <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nenhum princípio ativamente referenciado nesta coleção no baseline fiduciário atual.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
