import React from 'react';
import { Play, ChevronLeft, Clock, GraduationCap, BookOpen } from 'lucide-react';
import { useAcademyData, useAcademyModules } from '../../../hooks/useAcademyData';

interface CourseDetailsPageProps {
  courseId: string;
  onBack: () => void;
  onStart: (courseId: string) => void;
}

export function CourseDetailsPage({ courseId, onBack, onStart }: CourseDetailsPageProps) {
  const { courses, loading } = useAcademyData();
  const { modules } = useAcademyModules(courseId);
  const course = courses.find(c => c.id === courseId);

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-text-dim hover:text-text-main transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Voltar para Trilha do Conhecimento</span>
      </button>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {course.category}
              </span>
              <span className="text-text-dim text-xs font-bold uppercase tracking-widest">{course.level}</span>
            </div>
            
            <h1 className="text-5xl font-black text-text-main font-display leading-tight">
              {course.title}
            </h1>

            <div className="flex items-center gap-8 py-4 border-y border-border-main/50">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-secondary" />
                <span className="text-sm font-bold text-text-main">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-secondary" />
                <span className="text-sm font-bold text-text-main">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-secondary" />
                <span className="text-sm font-bold text-text-main">{modules.length} Módulos</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-black text-text-main mb-4">Sobre este curso</h2>
            <p className="text-text-muted leading-relaxed text-lg whitespace-pre-wrap">
              {course.description}
            </p>
          </div>

          {/* Curriculum */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-text-main">Conteúdo do curso</h2>
            <div className="space-y-4">
              {modules.length === 0 ? (
                <div className="bg-bg-surface border border-border-main rounded-2xl p-8 text-center text-text-dim">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-bold uppercase tracking-widest">Módulos em preparação</p>
                </div>
              ) : (
                modules.map((module, idx) => (
                  <div key={module.id} className="bg-bg-surface border border-border-main rounded-2xl overflow-hidden">
                    <div className="p-6 flex items-center justify-between bg-bg-card">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-text-main">{module.title}</h3>
                          {module.description && (
                            <p className="text-xs text-text-dim">{module.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="space-y-6">
          <div className="sticky top-32 bg-bg-card rounded-[40px] border border-border-main/50 overflow-hidden shadow-premium">
            <img 
              src={course.coverImage} 
              alt={course.title} 
              className="w-full h-56 object-cover"
            />
            <div className="p-8 space-y-6">
              <button 
                onClick={() => onStart(course.id)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-lg shadow-primary/20"
              >
                <Play size={20} fill="currentColor" />
                Começar agora
              </button>
              
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-text-dim border-b border-border-main pb-2">O que você vai aprender</p>
                <ul className="space-y-3">
                  {[
                    'Mentalidade estratégica aplicada',
                    'Domínio de ferramentas de gestão',
                    'Casos práticos e mentorias',
                    'Certificado de conclusão'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
