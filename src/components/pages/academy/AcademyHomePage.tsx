import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Users, GraduationCap, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useAcademyData } from '../../../hooks/useAcademyData';
import { HeroBanner } from '../../academy/HeroBanner';
import { CourseCarousel } from '../../academy/CourseCarousel';
import { VerticalCourseCard } from '../../academy/VerticalCourseCard';
import type { Course } from '../../../types/academy';
import { cn } from '../../../lib/utils';

interface AcademyHomePageProps {
  onNavigate: (page: any, params?: any) => void;
}

export function AcademyHomePage({ onNavigate }: AcademyHomePageProps) {
  const { courses, loading } = useAcademyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Gestão', 'Finanças', 'Liderança', 'Marketing', 'Operações', 'Cultura'];

  const featuredCourse = courses.find(c => c.status === 'published') || courses[0];
  
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || c.category === selectedCategory;
    return matchesSearch && matchesCategory && c.status === 'published';
  });

  const categoriesWithCourses = categories.filter(cat => 
    cat === 'Todos' || courses.some(c => c.category === cat && c.status === 'published')
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Full Width Strategic Header */}
      <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-white mb-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <GraduationCap size={28} />
               </div>
               <h1 className="text-4xl font-display font-black tracking-tight">Trilha do Conhecimento</h1>
            </div>
            <p className="text-slate-400 text-lg font-medium">Educação corporativa, mentoria e formação continuada para excelência na gestão.</p>
          </div>
          
          <div className="relative group min-w-[320px]">
            <input 
              type="text" 
              placeholder="Buscar conteúdo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-secondary transition-all outline-none text-sm text-white placeholder:text-slate-500" 
            />
            <Search size={20} className="text-slate-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {featuredCourse && (
        <HeroBanner 
          course={featuredCourse} 
          onPlay={(c) => onNavigate('academy_player', { courseId: c.id })}
          onSelect={(c) => onNavigate('academy_course', { courseId: c.id })}
        />
      )}

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {categoriesWithCourses.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-secondary text-primary shadow-lg shadow-secondary/20 border border-secondary/20' 
                : 'bg-bg-surface text-text-muted hover:text-text-main border border-border-main'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Vertical Banners Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-text-main px-2 flex items-center gap-3">
          <Sparkles className="text-secondary" /> Conteúdos Recomendados
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-10 px-2 no-scrollbar">
          {courses.slice(0, 5).map(course => (
            <VerticalCourseCard 
              key={course.id}
              course={course}
              onSelect={(c) => onNavigate('academy_course', { courseId: c.id })}
              onPlay={(c) => onNavigate('academy_player', { courseId: c.id })}
            />
          ))}
        </div>
      </div>

      {/* Carousels by Category */}
      <div className="space-y-16">
        {selectedCategory === 'Todos' ? (
          categoriesWithCourses.filter(cat => cat !== 'Todos').map(cat => (
            <CourseCarousel 
              key={cat}
              title={cat}
              courses={courses.filter(c => c.category === cat && c.status === 'published')}
              onSelect={(c) => onNavigate('academy_course', { courseId: c.id })}
              onPlay={(c) => onNavigate('academy_player', { courseId: c.id })}
            />
          ))
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map(course => (
              <VerticalCourseCard 
                key={course.id}
                course={course}
                onSelect={(c) => onNavigate('academy_course', { courseId: c.id })}
                onPlay={(c) => onNavigate('academy_player', { courseId: c.id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Value Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-20">
        {[
          { icon: BookOpen, label: 'Masterclasses', value: courses.length, color: 'secondary' },
          { icon: Clock, label: 'Minutos de Mentoria', value: '45.000+', color: 'primary' },
          { icon: Users, label: 'Comunidade Ativa', value: '1.200+', color: 'secondary' },
          { icon: Zap, label: 'Aceleração de Gestão', value: '94%', color: 'primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-bg-card p-10 rounded-[40px] border border-border-main/50 flex flex-col items-center text-center space-y-6 hover:shadow-premium transition-all">
            <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center", 
              stat.color === 'secondary' ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary")}>
              {(() => {
                const Icon = stat.icon;
                return <Icon size={32} />;
              })()}
            </div>
            <div>
              <p className="text-4xl font-black text-text-main tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim mt-2">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
