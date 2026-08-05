import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DiagnosticRegistry } from '../../intelligence/diagnostics/catalog/diagnostic-registry';
import { ProfileRegistry } from '../../intelligence/executive-profile/profile-registry';
import { ExecutiveDiagnostic, DiagnosticQuestion } from '../../intelligence/diagnostics/core/diagnostic-contracts';
import { DiagnosticResponse } from '../../intelligence/diagnostics/core/diagnostic-types';
import { ExecutiveIntelligenceProfile } from '../../intelligence/diagnostics/models/executive-intelligence-profile';

import { DiagnosticIntro } from './DiagnosticIntro';
import { DiagnosticQuestionCard } from './DiagnosticQuestionCard';
import { DiagnosticProgressIndicator } from './DiagnosticProgressIndicator';
import { DiagnosticProfileView } from './DiagnosticProfileView';
import { Sparkles, ArrowLeft } from 'lucide-react';

type DiagnosticPhase = 'intro' | 'questions' | 'calculating' | 'profile';

export function DiagnosticJourneyPage() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  
  const [diagnostic, setDiagnostic] = useState<ExecutiveDiagnostic | null>(null);
  const [phase, setPhase] = useState<DiagnosticPhase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<DiagnosticResponse[]>([]);
  const [profile, setProfile] = useState<ExecutiveIntelligenceProfile | null>(null);

  useEffect(() => {
    if (journeyId) {
      const found = DiagnosticRegistry.findByJourneyId(journeyId);
      if (found) {
        setDiagnostic(found);
      } else {
        // Fallback if not found
        navigate('/');
      }
    }
  }, [journeyId, navigate]);

  const currentQuestion: DiagnosticQuestion | undefined = diagnostic?.questions[currentQuestionIndex];
  
  const currentDimension = useMemo(() => {
    if (!currentQuestion || !diagnostic) return undefined;
    return diagnostic.dimensions.find(d => d.id === currentQuestion.dimensionId);
  }, [currentQuestion, diagnostic]);

  const completedDimensionsCount = useMemo(() => {
    if (!diagnostic || !currentQuestion) return 0;
    // Count how many unique dimension IDs we have passed
    const passedQuestions = diagnostic.questions.slice(0, currentQuestionIndex);
    const passedDims = new Set(passedQuestions.map(q => q.dimensionId));
    return passedDims.size + 1; // +1 because we are in the current one
  }, [diagnostic, currentQuestionIndex, currentQuestion]);

  const nextDimensionName = useMemo(() => {
    if (!diagnostic || !currentQuestion) return undefined;
    const remainingQuestions = diagnostic.questions.slice(currentQuestionIndex + 1);
    const nextQ = remainingQuestions.find(q => q.dimensionId !== currentQuestion.dimensionId);
    if (nextQ) {
      const dim = diagnostic.dimensions.find(d => d.id === nextQ.dimensionId);
      return dim?.name;
    }
    return undefined;
  }, [diagnostic, currentQuestion, currentQuestionIndex]);

  const handleStart = () => {
    setPhase('questions');
  };

  const handleOptionSelected = async (optionId: string) => {
    if (!currentQuestion || !diagnostic) return;

    const newResponse: DiagnosticResponse = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      timestamp: new Date().toISOString()
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    if (currentQuestionIndex < diagnostic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished all questions
      setPhase('calculating');
      try {
        const finalProfile = await diagnostic.generateProfile({
          journeyId: diagnostic.journeyId,
          source: 'concierge',
          responses: updatedResponses
        });
        
        // Save profile to Registry (persists and triggers Advisory Context if consumers set)
        const profileRecord = {
          id: `prf_${Date.now()}`,
          organizationId: 'current_org', // This should be fetched from context in a real scenario
          domain: diagnostic.domain,
          generatedAt: new Date().toISOString(),
          dataSource: 'questionnaire' as any,
          consumers: ['advisory'] as any[],
          profile: finalProfile
        };
        
        await ProfileRegistry.saveProfile(profileRecord); 
        
        // Artificial delay for premium "calculating" feel
        setTimeout(() => {
          setProfile(finalProfile);
          setPhase('profile');
        }, 2000);
      } catch (error) {
        console.error("Error generating profile", error);
      }
    }
  };

  if (!diagnostic) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans">
      
      {/* Premium Minimal Header */}
      <header className="h-20 border-b border-white/5 flex items-center px-8 shrink-0">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="mx-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-white font-bold tracking-wide">Illumine</span>
        </div>
        <div className="w-20" /> {/* Spacer to balance header */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-4xl mx-auto relative z-10">
          
          {phase === 'intro' && (
            <DiagnosticIntro diagnostic={diagnostic} onStart={handleStart} />
          )}

          {phase === 'questions' && currentQuestion && currentDimension && (
            <div className="w-full animate-in fade-in duration-500">
              <DiagnosticProgressIndicator 
                currentDimensionName={currentDimension.name}
                nextDimensionName={nextDimensionName}
                completedDimensionsCount={completedDimensionsCount}
                totalDimensionsCount={diagnostic.dimensions.length}
              />
              {/* Key forces re-render of animation when question changes */}
              <div key={currentQuestion.id}>
                <DiagnosticQuestionCard 
                  question={currentQuestion} 
                  onOptionSelected={handleOptionSelected} 
                />
              </div>
            </div>
          )}

          {phase === 'calculating' && (
            <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500 min-h-[400px]">
              <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-8" />
              <h2 className="text-xl font-light text-white mb-2">
                Processando Inteligência Executiva...
              </h2>
              <p className="text-slate-400 text-sm">
                Consolidando vetores de {diagnostic.domain}
              </p>
            </div>
          )}

          {phase === 'profile' && profile && (
            <DiagnosticProfileView profile={profile} />
          )}

        </div>
      </main>
    </div>
  );
}
