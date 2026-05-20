import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Layout, Video, FileText, Link as LinkIcon, Users, Clock, Filter, Search } from 'lucide-react';
import { useAcademyData } from '../../../hooks/useAcademyData';
import { PageHeader } from '../../Common';
import type { Course } from '../../../types/academy';

interface AdminAcademyDashboardProps {
  onEditCourse: (courseId: string) => void;
  onCreateCourse: () => void;
}

export function AdminAcademyDashboard({ onEditCourse, onCreateCourse }: AdminAcademyDashboardProps) {
  const { courses, loading } = useAcademyData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <PageHeader 
        title="Gestão da Academia"
        subtitle="Administre cursos, módulos, aulas e acompanhe o engajamento dos alunos."
        icon={Layout}
        actions={
          <button 
            onClick={onCreateCourse}
            className="px-4 md:px-6 py-2 md:py-3 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all border border-secondary/20 shadow-lg shadow-secondary/10 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            Novo Curso
          </button>
        }
      />

      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-md border border-border shadow-sm">
        <div className="relative flex-1 w-full group">
          <input 
            type="text" 
            placeholder="Pesquisar cursos, instrutores ou categorias..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container border border-border rounded-md focus:border-secondary focus:bg-card transition-all outline-none text-xs font-medium text-foreground placeholder-muted-foreground/60" 
          />
          <Search size={14} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
        </div>
        <button className="w-full md:w-auto px-4 md:px-6 py-2 md:py-2.5 bg-card text-muted-foreground rounded-md border border-border flex items-center justify-center gap-2 font-medium text-[10px] uppercase tracking-widest hover:bg-surface-container transition-all active:scale-95">
          <Filter size={14} />
          Filtros Avançados
        </button>
      </div>

      <div className="bg-card rounded-md border border-border overflow-hidden shadow-premium">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-border">
              <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Curso</th>
              <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Categoria</th>
              <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Instrutor</th>
              <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
              <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Alunos</th>
              <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-muted-foreground">
                  Nenhum curso encontrado.
                </td>
              </tr>
            ) : filteredCourses.map(course => (
              <tr key={course.id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-5 md:px-8 py-2.5 md:py-4">
                  <div className="flex items-center gap-4">
                    <img src={course.coverImage} className="w-12 h-12 rounded-md object-cover border border-border shadow-sm" alt="" />
                    <div>
                      <p className="font-bold text-foreground group-hover:text-secondary transition-colors text-sm">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.duration} • {course.level}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-2.5 md:py-4">
                  <span className="px-3 py-1 rounded-sm bg-surface-container border border-border text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    {course.category}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-2.5 md:py-4 text-xs font-medium text-muted-foreground">{course.instructor}</td>
                <td className="px-4 md:px-6 py-2.5 md:py-4">
                  <span className={`px-2.5 py-1 rounded-sm text-[10px] font-medium uppercase tracking-widest ${
                    course.status === 'published' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'
                  }`}>
                    {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-2.5 md:py-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
                    <Users size={12} />
                    <span>124</span>
                  </div>
                </td>
                <td className="px-5 md:px-8 py-2.5 md:py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-surface-container rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Visualizar">
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => onEditCourse(course.id)}
                      className="p-2 hover:bg-primary/10 rounded-md text-muted-foreground hover:text-primary transition-colors" 
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button className="p-2 hover:bg-rose-500/10 rounded-md text-muted-foreground hover:text-destructive transition-colors" title="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
