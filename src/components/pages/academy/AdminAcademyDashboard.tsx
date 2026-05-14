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
      {/* Strategic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Layout size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Gestão da Academia</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Administre cursos, módulos, aulas e acompanhe o engajamento dos alunos.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button 
            onClick={onCreateCourse}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Novo Curso
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full group">
          <input 
            type="text" 
            placeholder="Pesquisar cursos, instrutores ou categorias..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-secondary focus:bg-white transition-all outline-none text-sm font-medium" 
          />
          <Search size={18} className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
        </div>
        <button className="w-full md:w-auto px-8 py-4 bg-white text-slate-600 rounded-2xl border border-slate-200 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
          <Filter size={18} />
          Filtros Avançados
        </button>
      </div>

      <div className="bg-bg-card rounded-[32px] border border-border-main/50 overflow-hidden shadow-premium">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-surface/50 border-b border-border-main">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Curso</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Categoria</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Instrutor</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Alunos</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/30">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-text-dim">
                  Nenhum curso encontrado.
                </td>
              </tr>
            ) : filteredCourses.map(course => (
              <tr key={course.id} className="hover:bg-bg-surface/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={course.coverImage} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <p className="font-bold text-text-main group-hover:text-primary transition-colors">{course.title}</p>
                      <p className="text-xs text-text-dim">{course.duration} • {course.level}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 rounded-full bg-bg-surface border border-border-main text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {course.category}
                  </span>
                </td>
                <td className="px-6 py-6 text-sm text-text-muted">{course.instructor}</td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    course.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <Users size={14} />
                    <span>124</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-bg-surface rounded-lg text-text-dim hover:text-text-main transition-colors" title="Visualizar">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onEditCourse(course.id)}
                      className="p-2 hover:bg-primary/10 rounded-lg text-text-dim hover:text-primary transition-colors" 
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-rose-500/10 rounded-lg text-text-dim hover:text-rose-500 transition-colors" title="Excluir">
                      <Trash2 size={18} />
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
