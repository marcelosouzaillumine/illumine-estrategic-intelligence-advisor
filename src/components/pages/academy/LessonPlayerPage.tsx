import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Menu, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  Download, 
  Link as LinkIcon,
  ChevronRight,
  ChevronDown,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAcademyData } from '../../../hooks/useAcademyData';
import type { Lesson, Module } from '../../../types/academy';
import { cn } from '../../../lib/utils';

interface LessonPlayerPageProps {
  courseId: string;
  onBack: () => void;
  userId: string;
}

export function LessonPlayerPage({ courseId, onBack, userId }: LessonPlayerPageProps) {
  const { courses, getModules, getLessons, getUserProgress } = useAcademyData();
  const course = courses.find(c => c.id === courseId);
  const modules = getModules(courseId);
  const progress = getUserProgress(userId, courseId);
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  // Auto-select first lesson when modules load
  useEffect(() => {
    if (modules.length > 0 && !currentLesson) {
      // This is a simplified fetch, ideally getLessons should be called for each module
      // or we fetch all lessons for the course
    }
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-bg-main z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-20 bg-bg-card border-b border-border-main flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-bg-surface rounded-full transition-colors text-text-dim hover:text-text-main"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-black text-text-main leading-tight">{course.title}</h1>
            <p className="text-xs text-text-dim uppercase tracking-widest font-bold">Módulo Atual: Introdução</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Seu Progresso</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[30%]" />
              </div>
              <span className="text-sm font-black text-text-main">30%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Player Area */}
        <div className="flex-1 overflow-y-auto bg-black flex flex-col">
          <div className="aspect-video w-full bg-bg-surface relative group">
            {currentLesson?.contentType === 'video' ? (
              <iframe 
                src={currentLesson.videoUrl} 
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-12 text-center">
                 <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {currentLesson?.contentType === 'pdf' ? <FileText size={40} /> : <LinkIcon size={40} />}
                 </div>
                 <h2 className="text-3xl font-black text-white">{currentLesson?.title}</h2>
                 <p className="text-white/60 max-w-lg">{currentLesson?.description}</p>
                 <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                    Acessar Conteúdo
                 </button>
              </div>
            )}
          </div>

          <div className="p-12 max-w-4xl mx-auto w-full space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white font-display">
                {currentLesson?.title || 'Selecione uma aula para começar'}
              </h2>
              <p className="text-xl text-white/60 leading-relaxed">
                {currentLesson?.description || 'Explore o menu lateral para navegar entre os módulos e aulas deste curso.'}
              </p>
            </div>

            {currentLesson?.textContent && (
              <div className="prose prose-invert max-w-none pt-8 border-t border-white/10">
                <div dangerouslySetInnerHTML={{ __html: currentLesson.textContent }} />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className="w-96 bg-bg-card border-l border-border-main flex flex-col shrink-0 overflow-hidden">
          <div className="p-6 border-b border-border-main bg-bg-surface/30">
            <h3 className="font-black text-text-main uppercase tracking-widest text-sm">Conteúdo do Curso</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {modules.map((module, mIdx) => (
              <div key={module.id} className="border-b border-border-main last:border-0">
                <button 
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-bg-surface transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-text-dim">{String(mIdx + 1).padStart(2, '0')}</span>
                    <span className="font-bold text-text-main text-left">{module.title}</span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={cn("text-text-dim transition-transform", expandedModules.includes(module.id) && "rotate-180")} 
                  />
                </button>

                <AnimatePresence>
                  {expandedModules.includes(module.id) && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-bg-surface/20"
                    >
                      {/* This would be real lesson data */}
                      {[1, 2, 3].map(lIdx => (
                        <button 
                          key={lIdx}
                          className={cn(
                            "w-full px-8 py-4 flex items-center gap-4 hover:bg-bg-surface transition-all text-left group",
                            lIdx === 1 ? "bg-primary/5 text-primary" : "text-text-muted"
                          )}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-current opacity-40">
                             <PlayCircle size={14} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold leading-tight">Aula {lIdx}: Nome da Aula Exemplo</p>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">12 min</p>
                          </div>
                          {lIdx === 1 && <CheckCircle2 size={16} className="text-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
