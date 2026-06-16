import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, CheckCircle2, PlayCircle, FileText, Link as LinkIcon, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAcademyData, useAcademyModules, useAcademyLessons, useAcademyProgress, toggleLessonProgress } from '../../../hooks/useAcademyData';
import type { Lesson } from '../../../types/academy';
import { cn } from '../../../lib/utils';

interface LessonPlayerPageProps {
  courseId: string;
  onBack: () => void;
  userId: string;
  clientId: string;
}

/** Inner component that can call useAcademyLessons per module safely */
function ModuleLessonList({
  moduleId,
  moduleIdx,
  currentLessonId,
  completedLessonIds,
  onSelectLesson,
  onToggleProgress,
}: {
  moduleId: string;
  moduleIdx: number;
  currentLessonId: string | null;
  completedLessonIds: Set<string>;
  onSelectLesson: (lesson: Lesson) => void;
  onToggleProgress: (lesson: Lesson, completed: boolean) => void;
}) {
  const { lessons, loading } = useAcademyLessons(moduleId);

  if (loading) {
    return (
      <div className="px-5 md:px-8 py-3 md:py-5 flex items-center gap-3 text-muted-foreground">
        <Loader2 size={14} className="animate-spin text-secondary" />
        <span className="text-[10px] font-black uppercase tracking-widest">Carregando aulas...</span>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <p className="px-5 md:px-8 py-3 md:py-5 text-xs text-muted-foreground italic">Nenhuma aula cadastrada.</p>
    );
  }

  return (
    <>
      {lessons.map((lesson, lIdx) => {
        const isActive = currentLessonId === lesson.id;
        const isDone = completedLessonIds.has(lesson.id);
        return (
          <div
            key={lesson.id}
            className={cn(
              "w-full px-5 md:px-8 py-3 md:py-5 flex items-center gap-4 hover:bg-surface-container/50 transition-all group border-b border-border/10 last:border-0",
              isActive ? "bg-secondary/5" : ""
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleProgress(lesson, !isDone);
              }}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all active:scale-90",
                isDone 
                  ? "bg-secondary border-secondary text-primary" 
                  : (isActive ? "border-secondary text-secondary" : "border-border text-muted-foreground hover:border-secondary hover:text-secondary")
              )}
            >
              {isDone ? <CheckCircle2 size={12} strokeWidth={3} /> : <PlayCircle size={12} />}
            </button>
            
            <button
              onClick={() => onSelectLesson(lesson)}
              className="flex-1 min-w-0 text-left cursor-pointer"
            >
              <p className={cn(
                "text-xs font-bold leading-normal transition-colors",
                isActive ? "text-foreground font-black" : (isDone ? "text-muted-foreground/75" : "text-muted-foreground group-hover:text-foreground")
              )}>
                Aula {lIdx + 1}: {lesson.title}
              </p>
              {lesson.duration && (
        <p className="text-[9px] font-black uppercase tracking-widest text-executive-secondary/75 mt-1">
                  {lesson.duration} min
                </p>
              )}
            </button>
          </div>
        );
      })}
    </>
  );
}

export function LessonPlayerPage({ courseId, onBack, userId, clientId }: LessonPlayerPageProps) {
  const { courses } = useAcademyData();
  const { modules } = useAcademyModules(courseId);
  const { progress } = useAcademyProgress(userId, clientId, courseId);
  
  const course = courses.find(c => c.id === courseId);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  // Auto-expand first module when loaded
  useEffect(() => {
    if (modules.length > 0 && expandedModules.length === 0) {
      setExpandedModules([modules[0].id]);
    }
  }, [modules]);

  const completedLessonIds = useMemo(() => {
    return new Set(progress.filter(p => p.completed).map(p => p.lessonId));
  }, [progress]);

  const progressPct = useMemo(() => {
    const totalLessons = course?.lessonsCount || 0;
    if (totalLessons === 0) return 0;
    return Math.round((completedLessonIds.size / totalLessons) * 100);
  }, [completedLessonIds, course]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleToggleProgress = async (lesson: Lesson, completed: boolean) => {
    try {
      await toggleLessonProgress({
        userId,
        clientId,
        courseId,
        moduleId: lesson.moduleId,
        lessonId: lesson.id,
        completed
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Sanitize HTML content to prevent XSS (basic implementation)
  const sanitizeHtml = (html: string): string => {
    const allowedTags = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'br', 'a', 'blockquote'];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // Remove script tags and event attributes
    tempDiv.querySelectorAll('script, style, iframe, object, embed').forEach(el => el.remove());
    tempDiv.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || attr.name === 'src' && el.tagName !== 'IMG') {
          el.removeAttribute(attr.name);
        }
      });
    });
    return tempDiv.innerHTML;
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col overflow-hidden animate-executive-fade">
      {/* Header */}
      <header className="h-20 bg-card border-b border-border flex items-center justify-between px-8 shrink-0 relative z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-surface-container hover:bg-secondary/10 border border-border flex items-center justify-center text-muted-foreground hover:text-secondary transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-base font-display font-medium text-foreground leading-tight tracking-tight text-primary">{course.title}</h1>
            {currentLesson && (
       <p className="text-[9px] text-executive-secondary uppercase tracking-[0.2em] font-black max-w-xs truncate mt-1">
                {currentLesson.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[8.5px] font-black uppercase tracking-[0.2em] text-muted-foreground">Progresso no Cliente</span>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="w-32 h-1.5 bg-surface-container rounded-full overflow-hidden border border-border/50">
                <div 
                  className="h-full bg-secondary transition-all duration-500" 
                  style={{ width: `${progressPct}%` }} 
                />
              </div>
              <span className="text-xs font-black text-foreground font-mono">{progressPct}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Main Player Area */}
        <div className="flex-1 overflow-y-auto bg-black flex flex-col">
          <div className="aspect-video w-full bg-neutral-950 relative border-b border-border/5">
            {currentLesson?.contentType === 'video' ? (
              <iframe 
                src={currentLesson.videoUrl} 
                className="w-full h-full"
                allowFullScreen
                title={currentLesson.title}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-12 text-center">
                <div className="w-20 h-20 rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-lg shadow-secondary/5">
                  {currentLesson?.contentType === 'pdf' 
                    ? <FileText size={36} /> 
                    : currentLesson 
                      ? <LinkIcon size={36} /> 
                      : <PlayCircle size={36} />
                  }
                </div>
                <h2 className="text-2xl font-display font-medium text-white max-w-xl">
                  {currentLesson?.title || 'Selecione uma aula para começar'}
                </h2>
                <p className="text-white/50 max-w-lg text-sm font-medium leading-relaxed">
                  {currentLesson?.description || 'Explore o painel de navegação à direita para iniciar o seu aprendizado estratégico corporativo.'}
                </p>
                {currentLesson?.externalLink && (
                  <a 
                    href={currentLesson.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 md:px-8 py-2.5 md:py-3.5 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all border border-secondary/20 shadow-lg shadow-secondary/15 flex items-center gap-2 group"
                  >
                    Acessar Conteúdo Externo
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="p-12 max-w-4xl mx-auto w-full space-y-8">
            {currentLesson && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                    {currentLesson.title}
                  </h2>
                  <button
                    onClick={() => handleToggleProgress(currentLesson, !completedLessonIds.has(currentLesson.id))}
                    className={cn(
                      "px-4 md:px-6 py-2 md:py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 self-start sm:self-auto cursor-pointer",
                      completedLessonIds.has(currentLesson.id)
                        ? "bg-secondary text-primary shadow-lg shadow-secondary/15 border border-secondary/20"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
                    )}
                  >
                    {completedLessonIds.has(currentLesson.id) ? <CheckCircle2 size={14} strokeWidth={3} /> : <PlayCircle size={14} />}
                    {completedLessonIds.has(currentLesson.id) ? 'Concluída' : 'Marcar como Concluída'}
                  </button>
                </div>
                <p className="text-base text-white/70 leading-relaxed font-medium">
                  {currentLesson.description}
                </p>
              </div>
            )}

            {currentLesson?.textContent && (
              <div 
                className="prose prose-invert max-w-none pt-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentLesson.textContent) }} 
              />
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className="w-96 bg-card border-l border-border flex flex-col shrink-0 overflow-hidden relative z-20 shadow-xl">
          <div className="p-6 border-b border-border bg-surface-container/30">
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Conteúdo do Curso</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1.5">{modules.length} módulos estratégicos</p>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-48">
                <Loader2 size={24} className="animate-spin text-secondary mb-4" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Carregando módulos...</p>
              </div>
            ) : (
              modules.map((module, mIdx) => (
                <div key={module.id} className="border-b border-border last:border-0">
                  <button 
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-surface-container/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                      <span className="text-[10px] font-black text-secondary group-hover:scale-105 transition-transform">{String(mIdx + 1).padStart(2, '0')}</span>
                      <span className="text-xs font-bold text-foreground text-left leading-tight truncate">{module.title}</span>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={cn("text-muted-foreground transition-transform shrink-0", expandedModules.includes(module.id) && "rotate-180")} 
                    />
                  </button>

                  <AnimatePresence>
                    {expandedModules.includes(module.id) && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-surface-container/10"
                      >
                        <ModuleLessonList
                          moduleId={module.id}
                          moduleIdx={mIdx}
                          currentLessonId={currentLesson?.id || null}
                          completedLessonIds={completedLessonIds}
                          onSelectLesson={setCurrentLesson}
                          onToggleProgress={handleToggleProgress}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
