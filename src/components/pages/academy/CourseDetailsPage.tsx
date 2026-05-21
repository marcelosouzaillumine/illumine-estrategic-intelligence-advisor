import React from 'react';
import { Play, ChevronLeft, Clock, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';
import { useAcademyData, useAcademyModules } from '../../../hooks/useAcademyData';
import { cn } from '../../../lib/utils';
import { DashboardSkeleton } from '../../ui/skeletons';

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
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-16 pb-32 animate-executive-fade">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group text-[10px] font-black uppercase tracking-[0.2em]"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-secondary" strokeWidth={3} />
        Voltar para a Trilha
      </button>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-10">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest border border-secondary/20 shadow-sm">
                {course.category}
              </span>
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{course.level}</span>
            </div>
            
            <h1 className="text-5xl font-display font-medium text-foreground leading-tight tracking-tight">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary border border-border">
                  <Clock size={16} />
                </div>
                <span className="text-sm font-semibold text-foreground">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary border border-border">
                  <GraduationCap size={16} />
                </div>
                <span className="text-sm font-semibold text-foreground">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary border border-border">
                  <BookOpen size={16} />
                </div>
                <span className="text-sm font-semibold text-foreground">{modules.length} Módulos</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-medium text-foreground">Sobre este curso</h2>
            <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap font-medium">
              {course.description}
            </p>
          </div>

          {/* Curriculum */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-medium text-foreground">Conteúdo do curso</h2>
            <div className="space-y-4">
              {modules.length === 0 ? (
                <div className="bg-surface-container border border-border rounded-[32px] p-12 text-center text-muted-foreground">
                  <BookOpen size={36} className="mx-auto mb-3 opacity-30 text-secondary" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Módulos em preparação estratégica</p>
                </div>
              ) : (
                modules.map((module, idx) => (
                  <div key={module.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-secondary/20 transition-colors">
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container border border-border flex items-center justify-center text-secondary text-xs font-black group-hover:bg-secondary group-hover:text-primary transition-colors">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{module.title}</h3>
                          {module.description && (
                            <p className="text-xs text-muted-foreground mt-1 font-medium">{module.description}</p>
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
          <div className="sticky top-32 bg-card rounded-[48px] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all">
            <img 
              src={course.coverImage} 
              alt={course.title} 
              className="w-full h-56 object-cover"
            />
            <div className="p-8 space-y-8">
              <button 
                onClick={() => onStart(course.id)}
                className="w-full py-4.5 bg-secondary text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all border border-secondary/20 shadow-lg shadow-secondary/15 flex items-center justify-center gap-3 group"
              >
                <Play size={16} fill="currentColor" className="group-hover:scale-115 transition-transform" />
                Começar agora
              </button>
              
              <div className="space-y-6 pt-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary border-b border-border pb-3">O que você vai aprender</p>
                <ul className="space-y-4">
                  {[
                    'Mentalidade estratégica aplicada',
                    'Domínio de ferramentas de gestão',
                    'Casos práticos e mentorias',
                    'Certificado de conclusão'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-muted-foreground font-medium">
                      <div className="mt-1 w-2 h-2 rounded-full bg-secondary/35 shrink-0 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                      </div>
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
