import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  Link as LinkIcon,
  ChevronDown,
  Loader2
} from 'lucide-react';
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
      <div className="px-8 py-4 flex items-center gap-2 text-text-dim">
        <Loader2 size={14} className="animate-spin" />
        <span className="text-xs">Carregando aulas...</span>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <p className="px-8 py-4 text-xs text-text-dim italic">Nenhuma aula cadastrada.</p>
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
              "w-full px-8 py-4 flex items-center gap-4 hover:bg-bg-surface transition-all group border-b border-border-main/5 last:border-0",
              isActive ? "bg-primary/5" : ""
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleProgress(lesson, !isDone);
              }}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all",
                isDone ? "bg-accent border-accent text-white" : (isActive ? "border-primary text-primary" : "border-current opacity-40 hover:opacity-100")
              )}
            >
              {isDone ? <CheckCircle2 size={14} /> : <PlayCircle size={14} />}
            </button>
            
            <button
              onClick={() => onSelectLesson(lesson)}
              className="flex-1 min-w-0 text-left"
            >
              <p className={cn(
                "text-sm font-bold leading-tight truncate transition-colors",
                isActive ? "text-primary" : (isDone ? "text-text-main/70" : "text-text-muted group-hover:text-text-main")
              )}>
                Aula {lIdx + 1}: {lesson.title}
              </p>
              {lesson.duration && (
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
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
            {currentLesson && (
              <p className="text-xs text-text-dim uppercase tracking-widest font-bold truncate max-w-xs">
                {currentLesson.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Progresso no Cliente Ativo</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500" 
                  style={{ width: `${progressPct}%` }} 
                />
              </div>
              <span className="text-sm font-black text-text-main">{progressPct}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Player Area */}
        <div className="flex-1 overflow-y-auto bg-black flex flex-col">
          <div className="aspect-video w-full bg-bg-surface relative">
            {currentLesson?.contentType === 'video' ? (
              <iframe 
                src={currentLesson.videoUrl} 
                className="w-full h-full"
                allowFullScreen
                title={currentLesson.title}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {currentLesson?.contentType === 'pdf' 
                    ? <FileText size={40} /> 
                    : currentLesson 
                      ? <LinkIcon size={40} /> 
                      : <PlayCircle size={40} />
                  }
                </div>
                <h2 className="text-3xl font-black text-white">
                  {currentLesson?.title || 'Selecione uma aula para começar'}
                </h2>
                <p className="text-white/60 max-w-lg">
                  {currentLesson?.description || 'Explore o menu lateral para navegar entre os módulos e aulas deste curso.'}
                </p>
                {currentLesson?.externalLink && (
                  <a 
                    href={currentLesson.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
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
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-black text-white font-display">
                    {currentLesson.title}
                  </h2>
                  <button
                    onClick={() => handleToggleProgress(currentLesson, !completedLessonIds.has(currentLesson.id))}
                    className={cn(
                      "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3",
                      completedLessonIds.has(currentLesson.id)
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {completedLessonIds.has(currentLesson.id) ? <CheckCircle2 size={16} /> : <PlayCircle size={16} />}
                    {completedLessonIds.has(currentLesson.id) ? 'Concluída' : 'Marcar como Concluída'}
                  </button>
                </div>
                <p className="text-xl text-white/60 leading-relaxed">
                  {currentLesson.description}
                </p>
              </div>
            )}

            {currentLesson?.textContent && (
              <div 
                className="prose prose-invert max-w-none pt-8 border-t border-white/10"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentLesson.textContent) }} 
              />
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className="w-96 bg-bg-card border-l border-border-main flex flex-col shrink-0 overflow-hidden">
          <div className="p-6 border-b border-border-main bg-bg-surface/30">
            <h3 className="font-black text-text-main uppercase tracking-widest text-sm">Conteúdo do Curso</h3>
            <p className="text-xs text-text-dim mt-1">{modules.length} módulos</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Loader2 size={24} className="animate-spin text-text-dim mb-4" />
                <p className="text-text-dim text-sm">Carregando módulos...</p>
              </div>
            ) : (
              modules.map((module, mIdx) => (
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
