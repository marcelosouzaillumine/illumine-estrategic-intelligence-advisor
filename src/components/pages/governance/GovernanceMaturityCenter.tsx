import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { ExecutiveSummarySection } from '@/components/ui/executive-summary-section';
import { ExecutiveTechnicalEvidenceSection } from '@/components/executive-architecture/executive-technical-evidence-section';
import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Target, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle, Zap, ChevronRight, Brain, Activity, Download, Share2, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { PageHeader, MarkdownText } from '@/components/Common';
import { cn } from '@/lib/utils';
import { GOVERNANCE_PRINCIPLES, calculateGovernanceMaturityScore, calculateAxisMaturity, getMaturityClassification, GOVERNANCE_ALIGNMENT_ASSESSMENT, getPrincipleById, crossValidateWithIndicators, calculateGovernanceAlignmentScore } from '@/lib/governanceIntelligence';
import { useGovernanceMaturityAdapter } from '@/adapters/ui/useGovernanceMaturityAdapter';
import { generateGovernanceDiagnosis } from '@/services/aiService';

export function GovernanceMaturityCenter({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<'principios' | 'score'>('score');
  const [selectedAxis, setSelectedAxis] = useState<string>('Todos');
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<any>(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [saving, setSaving] = useState(false);

  const eixos = ['Todos', 'Governança Corporativa', 'Cultura Organizacional', 'Gestão Administrativa e Financeira', 'Gestão de Inovação', 'Gestão de Marketing', 'Gestão Comercial', 'Gestão Operacional'];

  const {
    indicators,
    responses: adapterResponses,
    aiDiagnosis: adapterAiDiagnosis,
    hasDiagnosis,
    saveDiagnosis
  } = useGovernanceMaturityAdapter(clientId);
  
  useEffect(() => {
    if (Object.keys(adapterResponses).length > 0) setResponses(adapterResponses);
    if (adapterAiDiagnosis) setAiDiagnosis(adapterAiDiagnosis);
    if (hasDiagnosis) setShowResults(true);
  }, [adapterResponses, adapterAiDiagnosis, hasDiagnosis]);

  const filteredPrinciples = selectedAxis === 'Todos' 
    ? GOVERNANCE_PRINCIPLES 
    : GOVERNANCE_PRINCIPLES.filter(p => p.axis === selectedAxis);

  const handleScoreChange = (principleId: string, value: number) => {
    setResponses(prev => ({ ...prev, [principleId]: value }));
  };

  // Cross-validation logic
  const finalResponses = useMemo(() => {
    if (!indicators.length) return responses;
    return crossValidateWithIndicators(responses, indicators);
  }, [responses, indicators]);

  const maturityScore = calculateGovernanceMaturityScore(finalResponses);
  const alignmentScore = calculateGovernanceAlignmentScore(indicators);
  const classification = getMaturityClassification(maturityScore);
  const hasData = indicators.length > 0 || Object.keys(responses).length > 0;

  const radarData = eixos.filter(e => e !== 'Todos').map(e => ({
    subject: e.replace('Gestão ', ''),
    A: calculateAxisMaturity(finalResponses, e as any),
    fullMark: 100,
  }));

  const handleGenerateIntelligence = async () => {
    setShowResults(true);
    setLoadingDiagnosis(true);
    
    const axisScores: Record<string, number> = {};
    eixos.filter(e => e !== 'Todos').forEach(e => {
      axisScores[e] = calculateAxisMaturity(finalResponses, e as any);
    });

    const diagnosis = await generateGovernanceDiagnosis(axisScores, indicators, "Empresa");
    setAiDiagnosis(diagnosis);
    setLoadingDiagnosis(false);
  };

  const handleSaveDiagnosis = async () => {
    if (!aiDiagnosis) return;
    setSaving(true);
    try {
      const axisScores = eixos.filter(e => e !== 'Todos').reduce((acc, e) => ({
        ...acc,
        [e]: calculateAxisMaturity(finalResponses, e as any)
      }), {});
      await saveDiagnosis({
        maturityScore,
        alignmentScore,
        classification: classification.label,
        responses: finalResponses,
        diagnosis: aiDiagnosis,
        axisScores
      });
      console.log('Diagnóstico salvo com sucesso no histórico executivo.');
    } catch (error) {
      console.error('Erro ao salvar diagnóstico:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Inteligência de Governança" 
        subtitle="O motor de maturidade organizacional baseado em princípios de gestão e cruzamento semântico de dados reais." 
        icon={Brain}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-card px-4 py-2 rounded-md border border-border shadow-sm flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-warning-soft rounded-md flex items-center justify-center text-warning">
                <Target size={18} />
              </div>
              <div>
                <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Maturidade</ExecutiveText>
                <ExecutiveText as="div" variant="bodyStandard" className="text-foreground">{hasData ? maturityScore : '---'}<span className="text-[10px] text-muted-foreground">/100</span></ExecutiveText>
              </div>
            </div>

            <div className="w-px h-8 bg-border" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-md flex items-center justify-center text-secondary">
                <Activity size={18} />
              </div>
              <div>
                <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Alinhamento</ExecutiveText>
                <ExecutiveText as="div" variant="bodyStandard" className="text-foreground">{hasData ? alignmentScore : '---'}<span className="text-[10px] text-muted-foreground">/100</span></ExecutiveText>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "px-4 md:px-6 py-2 md:py-2.5 rounded-md border shadow-sm flex items-center gap-3", 
            hasData ? classification.bg : "bg-surface-container", 
            hasData ? classification.border : "border-border"
          )}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse", hasData ? classification.color.replace('text', 'bg') : "bg-muted")} />
            <span className={cn("text-[10px] font-medium uppercase tracking-widest", hasData ? classification.color : "text-muted-foreground")}>
              {hasData ? classification.label : 'Pendente'}
            </span>
          </div>
        </div>
      </div>




      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-surface-container rounded-md w-fit">
        <button
          onClick={() => setActiveTab('score')}
          className={cn(
            "px-5 md:px-8 py-2 md:py-3 text-[10px] font-medium uppercase tracking-widest rounded-md transition-all",
            activeTab === 'score' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Checklist de Maturidade
        </button>
        <button
          onClick={() => setActiveTab('principios')}
          className={cn(
            "px-5 md:px-8 py-2 md:py-3 text-[10px] font-medium uppercase tracking-widest rounded-md transition-all",
            activeTab === 'principios' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Biblioteca de Princípios
        </button>
      </div>

      {activeTab === 'principios' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-wrap gap-2">
            {eixos.map(eixo => (
              <button
                key={eixo}
                onClick={() => setSelectedAxis(eixo)}
                className={cn(
                  "px-5 py-2.5 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all",
                  selectedAxis === eixo 
                    ? "bg-executive text-white shadow-premium scale-105" 
                    : "bg-card text-muted-foreground border border-border hover:border-warning/30 hover:text-warning"
                )}
              >
                {eixo}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPrinciples.map(principle => (
                <motion.div
                  key={principle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-2xl p-8 hover:border-warning/20 transition-all flex flex-col h-full group"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-surface-container rounded-md group-hover:bg-warning/5 transition-colors">
                        <BookOpen size={20} className="text-warning" />
                      </div>
                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest bg-surface-container px-3 py-1 rounded-md">
                         {principle.reference}
                      </span>
                    </div>
                    <div className="space-y-1">
                       <ExecutiveText as="div" variant="bodyStandard" className="text-warning">{principle.axis}</ExecutiveText>
                       <ExecutiveHeading as="h3" className="text-h3 text-foreground">{principle.name}</ExecutiveHeading>
                    </div>
                  </div>
                  
                  <ExecutiveText as="div" variant="bodyStandard" className="text-body-sm text-muted-foreground italic mb-8">"{principle.description}"</ExecutiveText>
                  
                  <div className="mt-auto space-y-6 pt-6 border-t border-border pt-8 mb-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Impacto Estratégico</ExecutiveText>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={10} 
                              className={cn(
                                star <= principle.strategicImpact ? "fill-warning text-warning" : "fill-muted text-muted-foreground/20"
                              )} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Cross-Impact</ExecutiveText>
                        <ExecutiveText as="div" variant="bodyStandard" className="text-foreground">{principle.crossAxisImpact}</ExecutiveText>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Plano de Ação Executivo (50 Sugestões Práticas)</ExecutiveText>
                       <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {principle.executiveRecommendations.map((rec, i) => (
                            <div key={i} className="flex gap-3 items-start group/item">
                              <div className="w-5 h-5 rounded-md bg-surface-container text-muted-foreground flex items-center justify-center shrink-0 text-[9px] font-medium group-hover/item:bg-warning group-hover/item:text-white transition-colors">
                                {i + 1}
                              </div>
                              <p className="text-[11px] font-medium text-muted-foreground leading-snug pt-0.5 italic">
                                 {rec}
                              </p>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {activeTab === 'score' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {!showResults ? (
            <div className="space-y-16">
              <div className="bg-card border border-border rounded-2xl p-12 md:p-16 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-warning/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-20 -mb-20 blur-[80px]" />
                 
                 <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                   <div className="shrink-0 relative">
                     <div className="absolute inset-0 bg-warning blur-2xl opacity-10 animate-pulse" />
                     <div className="w-24 h-24 bg-executive rounded-md flex items-center justify-center text-warning shadow-premium relative z-10 rotate-3 group-hover:rotate-0 transition-all duration-700">
                       <Target size={40} />
                     </div>
                   </div>
                   
                   <div className="flex-1 space-y-4">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-warning-soft text-warning rounded-md border border-warning/10 text-[10px] font-medium uppercase tracking-widest mb-2">
                        <Activity size={12} /> Avaliação Inteligente
                     </div>
                     <ExecutiveHeading as="h2" className="text-h1 text-foreground">
                       Checklist de Maturidade Sistêmica
                     </ExecutiveHeading>
                     <p className="text-body-md text-muted-foreground leading-relaxed max-w-2xl font-medium">
                       Esta jornada cruzará sua percepção qualitativa com os indicadores reais da organização, gerando uma camada semântica de análise sobre a integridade e maturidade da sua gestão.
                     </p>
                   </div>
                   
                   <div className="hidden xl:block w-px h-24 bg-border" />
                   
                   <div className="hidden xl:flex flex-col items-center gap-2 px-8">
                     <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Progresso</ExecutiveText>
                     <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-20 h-20 rotate-[-90deg]">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-surface-container)" strokeWidth="8" />
                          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-warning)" strokeWidth="8" strokeDasharray={`${(Object.keys(responses).length / 50) * 226} 226`} strokeLinecap="round" className="transition-all duration-1000" />
                        </svg>
                        <span className="absolute text-sm font-medium text-foreground">{Math.round((Object.keys(responses).length / 50) * 100)}%</span>
                     </div>
                   </div>
                 </div>
              </div>

              {/* Questionnaire */}
              <div className="space-y-12">
                {GOVERNANCE_ALIGNMENT_ASSESSMENT.map((axisGroup) => (
                  <div key={axisGroup.axis} className="space-y-8">
                    <div className="flex items-center gap-6">
                       <ExecutiveHeading as="h3" className="text-muted-foreground whitespace-nowrap">{axisGroup.axis}</ExecutiveHeading>
                       <div className="h-px w-full bg-border" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {axisGroup.questions.map((q) => {
                        const principle = q;
                        if (!principle) return null;
                        
                        return (
                          <motion.div 
                            key={q.id}
                            className={cn(
                              "bg-card border border-border rounded-2xl p-10 transition-all space-y-8 relative overflow-hidden group hover:border-warning/20",
                              responses[principle.id] !== undefined && "border-warning/20 bg-warning/5"
                            )}
                          >
                            <div className="flex justify-between items-start gap-6">
                              <div className="space-y-2 flex-1">
                                <span className="text-[10px] font-medium text-warning uppercase tracking-widest">{principle.name}</span>
                                <ExecutiveHeading as="h4" className="text-body-md text-foreground">{principle.maturityQuestion}</ExecutiveHeading>
                              </div>
                              <div className="shrink-0 bg-surface-container px-4 py-2 rounded-md border border-border text-[10px] font-medium text-muted-foreground group-hover:bg-warning-soft group-hover:text-warning group-hover:border-warning/20 transition-colors flex items-center gap-2">
                                <span className="uppercase tracking-widest">Impacto</span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={8} 
                                      className={cn(
                                        star <= principle.strategicImpact ? "fill-warning text-warning" : "fill-muted text-muted-foreground/20"
                                      )} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-2">
                                <span>Inexistente (0)</span>
                                <span>Referência (5)</span>
                              </div>
                              <div className="flex gap-3">
                                {[0, 1, 2, 3, 4, 5].map((val) => (
                                  <button
                                    key={val}
                                    onClick={() => handleScoreChange(principle.id, val)}
                                    className={cn(
                                      "flex-1 py-5 rounded-md text-xl font-medium transition-all border",
                                      responses[principle.id] === val 
                                        ? "bg-warning border-warning text-primary shadow-premium scale-110 z-10" 
                                        : "bg-surface-container border-border text-muted-foreground hover:border-warning/30 hover:text-warning"
                                    )}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-8 pt-8 border-t border-border mb-8">
                               <div className="space-y-2">
                                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-success" />
                                    Evidências Esperadas
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {principle.expectedEvidences.map((ev, i) => (
                                      <span key={i} className="text-[9px] font-medium bg-surface-container text-muted-foreground px-2 py-1 rounded-md border border-border uppercase tracking-widest">{ev}</span>
                                    ))}
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <p className="text-[9px] font-medium text-destructive uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle size={12} />
                                    Risco Crítico
                                  </p>
                                  <p className="text-[10px] font-medium text-destructive leading-tight bg-destructive/5 p-2 rounded-md border border-destructive/10 italic">
                                    {principle.risksWhenNeglected[0]}
                                  </p>
                                </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="bg-executive text-white p-20 rounded-md text-center shadow-premium relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 space-y-10">
                    <div className="w-24 h-24 bg-warning rounded-md mx-auto flex items-center justify-center text-primary shadow-premium rotate-3 group-hover:rotate-12 transition-transform">
                      <Zap size={48} />
                    </div>
                    <div className="space-y-4">
                      <ExecutiveHeading as="h3" className="text-h1">Finalizar Diagnóstico Sistêmico</ExecutiveHeading>
                      <p className="text-white/60 text-body-md max-w-2xl mx-auto font-medium">
                        O motor de IA consolidará {Object.keys(responses).length} respostas com os indicadores reais da empresa para gerar o Índice de Maturidade Governança Organizacional.
                      </p>
                    </div>
                    <button 
                      onClick={handleGenerateIntelligence}
                      className="btn-executive bg-warning border-warning mx-auto hover:bg-warning/90"
                    >
                      Gerar Inteligência Estratégica
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
              <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                 {/* Dashboard de Resultados */}
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Radar Chart Section */}
                    <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-12 flex flex-col">
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <ExecutiveHeading as="h3" className="text-h2 text-foreground">Mapa de Maturidade Organizacional</ExecutiveHeading>
                          <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-1">Análise por Pilares de Gestão</ExecutiveText>
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={handleSaveDiagnosis}
                             disabled={saving || !aiDiagnosis}
                             className="p-3 bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors disabled:opacity-50"
                             title="Salvar no Histórico"
                           >
                              {saving ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                           </button>
                           <button className="p-3 bg-surface-container text-muted-foreground rounded-md hover:bg-muted/10 transition-colors">
                              <Download size={20} />
                           </button>
                           <button className="p-3 bg-surface-container text-muted-foreground rounded-md hover:bg-muted/10 transition-colors">
                              <Share2 size={20} />
                           </button>
                        </div>
                      </div>

                      <div className="flex-1 min-h-[500px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={500}>
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="currentColor" strokeWidth={2} />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: 900 }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                              name="Maturidade"
                              dataKey="A"
                              stroke="var(--color-warning)"
                              strokeWidth={4}
                              fill="var(--color-warning)"
                              fillOpacity={0.15}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                       <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-border pt-8 mb-8">
                          {radarData.map(d => (
                            <div key={d.subject} className="space-y-2 text-center">
                              <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">{d.subject}</ExecutiveText>
                              <ExecutiveText as="div" variant="bodyStandard" className="text-foreground">{d.A}%</ExecutiveText>
                              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${d.A}%` }}
                                  className={cn("h-full", d.A > 80 ? "bg-secondary" : d.A > 60 ? "bg-success" : "bg-warning")}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Classification Card */}
                    <div className="lg:col-span-4 space-y-8">
                      <div className={cn("p-10 rounded-md border shadow-premium flex flex-col items-center text-center space-y-6", classification.bg, classification.border)}>
                          <div className={cn("w-20 h-20 rounded-md flex items-center justify-center shadow-sm", classification.bg, "border border-current opacity-30")}>
                            <ShieldCheck size={40} className={classification.color} />
                          </div>
                          <div className="space-y-2">
                             <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Classificação Atual</ExecutiveText>
                             <h3 className={cn("text-3xl font-medium", classification.color)}>{classification.label}</h3>
                          </div>
                          <div className="text-6xl font-medium text-foreground tracking-tighter">
                            {maturityScore}<span className="text-2xl text-muted-foreground">%</span>
                          </div>
                          <div className="text-[11px] font-medium text-muted-foreground mt-2 italic leading-relaxed">
                            <MarkdownText text={`Sua organização está no nível **"${classification.label}"**, indicando ${maturityScore > 60 ? 'uma base sólida mas com oportunidades de refino.' : 'necessidade urgente de estruturação básica.'}`} />
                          </div>
                      </div>

                      <div className="bg-executive p-10 rounded-md text-white space-y-8 shadow-premium">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-warning rounded-md flex items-center justify-center text-primary">
                               <Zap size={20} />
                            </div>
                            <ExecutiveHeading as="h4" className="text-h3">Parecer Executivo</ExecutiveHeading>
                         </div>
                         
                         <div className="space-y-6">
                           {loadingDiagnosis ? (
                             <div className="space-y-4 py-8 flex flex-col items-center">
                               <Loader2 size={32} className="text-amber-500 animate-spin" />
                               <ExecutiveText as="div" variant="caption" className="text-muted-foreground">IA Consolidando Diagnóstico...</ExecutiveText>
                             </div>
                           ) : (
                             <>
                               <div className="p-6 bg-white/5 rounded-md border border-white/10 space-y-3">
                                 <ExecutiveText as="div" variant="bodyStandard" className="text-warning">Resumo Estratégico</ExecutiveText>
                                 <p className="text-body-sm text-white/80 leading-relaxed italic font-medium">
                                   {aiDiagnosis?.resumoExecutivo || "Aguardando geração do diagnóstico para exibir o resumo estratégico..."}
                                 </p>
                               </div>

                               <div className="space-y-4">
                                  <ExecutiveText as="div" variant="bodyStandard" className="text-white">Ações Prioritárias</ExecutiveText>
                                  <ul className="space-y-4">
                                    {(aiDiagnosis?.recomendacoesPrioritarias || []).map((item: string, i: number) => (
                                      <li key={i} className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center shrink-0 text-[10px] font-medium">{i+1}</div>
                                        <ExecutiveText as="div" variant="caption" className="text-white/60 italic">{item}</ExecutiveText>
                                      </li>
                                    ))}
                                    {!aiDiagnosis?.recomendacoesPrioritarias && (
                                      <ExecutiveText as="div" variant="bodyStandard" className="text-white/40 italic">Gere o diagnóstico para visualizar as ações prioritárias.</ExecutiveText>
                                    )}
                                  </ul>
                               </div>
                             </>
                           )}
                         </div>

                         <button 
                           onClick={() => setShowResults(false)}
                           className="w-full py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
                         >
                           Recalcular Maturidade
                         </button>
                      </div>
                    </div>
                 </div>

                 {/* AI Intelligence Detailed Report */}
                 {!loadingDiagnosis && aiDiagnosis && (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                      <div className="bg-card border border-border rounded-2xl p-10 space-y-6">
                         <ExecutiveHeading as="h4" className="text-body-md text-foreground flex items-center gap-3">
                            <AlertTriangle className="text-destructive" size={20} />
                            Riscos e Gargalos
                         </ExecutiveHeading>
                         <div className="space-y-3">
                            {aiDiagnosis.principaisRiscos.map((r: string, i: number) => (
                               <div key={i} className="p-4 bg-destructive/5 border border-destructive/10 rounded-md">
                                  <ExecutiveText as="div" variant="bodyStandard" className="text-body-sm text-destructive italic">{r}</ExecutiveText>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-card border border-border rounded-2xl p-10 space-y-6">
                         <ExecutiveHeading as="h4" className="text-body-md text-foreground flex items-center gap-3">
                            <Activity className="text-secondary" size={20} />
                            Potenciais Ocultos
                         </ExecutiveHeading>
                         <div className="space-y-3">
                            {aiDiagnosis.potenciaisOcultos.map((p: string, i: number) => (
                               <div key={i} className="p-4 bg-secondary/5 border border-secondary/10 rounded-md">
                                  <ExecutiveText as="div" variant="bodyStandard" className="text-body-sm text-secondary italic">{p}</ExecutiveText>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-card border border-border rounded-2xl p-10 space-y-6">
                         <ExecutiveHeading as="h4" className="text-body-md text-foreground flex items-center gap-3">
                            <TrendingUp className="text-success" size={20} />
                            Plano de Ação
                         </ExecutiveHeading>
                         <div className="space-y-3">
                            {aiDiagnosis.planoAcaoSugerido.map((a: string, i: number) => (
                               <div key={i} className="p-4 bg-success/5 border border-success/10 rounded-md flex gap-3">
                                  <CheckCircle2 size={16} className="text-success shrink-0" />
                                  <ExecutiveText as="div" variant="bodyStandard" className="text-body-sm text-success italic">{a}</ExecutiveText>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}

                 {/* Heatmap Section */}
                 <div className="bg-card border border-border rounded-2xl p-12 mt-8">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <ExecutiveHeading as="h4" className="text-h2 text-foreground">Mapa de Calor: Princípios Críticos</ExecutiveHeading>
                        <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-1">Visão 360º de Riscos e Oportunidades</ExecutiveText>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-destructive" />
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Crítico</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-warning" />
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Alerta</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-success" />
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Maturidade</span>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                      {GOVERNANCE_PRINCIPLES.map(p => {
                        const score = finalResponses[p.id] ?? 0;
                        const isAdjusted = responses[p.id] !== undefined && finalResponses[p.id] !== responses[p.id];
                        return (
                          <div key={p.id} className={cn(
                            "p-6 rounded-md border text-center space-y-2 transition-all relative overflow-hidden group hover:scale-105",
                            score <= 1 ? "bg-destructive/5 border-destructive/10 text-destructive" :
                            score <= 3 ? "bg-warning/5 border-warning/10 text-warning" :
                            "bg-success/5 border-success/10 text-success"
                          )}>
                            {isAdjusted && (
                              <div className="absolute top-2 right-2">
                                 <AlertTriangle size={12} className="text-destructive" />
                              </div>
                            )}
                            <ExecutiveText as="div" variant="bodyStandard" className="opacity-60">{p.name}</ExecutiveText>
                            <ExecutiveText as="div" variant="bodyStandard">{score}</ExecutiveText>
                            <div className="h-1 bg-current opacity-20 rounded-full w-1/2 mx-auto" />
                          </div>
                        );
                      })}
                    </div>
                 </div>
              </div>
          )}
        </div>
      )}
    </div>
  );
}
