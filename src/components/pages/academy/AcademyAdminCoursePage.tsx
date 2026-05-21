import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Plus, Trash2, Layout, Video, FileText, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp, query, where, getDocs, deleteDoc, orderBy } from 'firebase/firestore';
import type { Course, Module, Lesson } from '../../../types/academy';
import { cn } from '../../../lib/utils';
import { FormSkeleton } from '../../ui/skeletons';

interface AcademyAdminCoursePageProps {
  courseId?: string;
  onBack: () => void;
}

export function AcademyAdminCoursePage({ courseId, onBack }: AcademyAdminCoursePageProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    category: 'Gestão',
    level: 'Iniciante',
    instructor: '',
    duration: '',
    status: 'draft',
    coverImage: ''
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'academy_courses', courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      const id = courseId || doc(collection(db, 'academy_courses')).id;
      const payload = {
        ...course,
        updatedAt: serverTimestamp(),
        createdAt: course.createdAt || serverTimestamp()
      };
      await setDoc(doc(db, 'academy_courses', id), payload);
      onBack();
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-16 pb-32 animate-executive-fade">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-border/40">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-secondary" strokeWidth={3} />
          Voltar para Gestão
        </button>

        <button
          onClick={handleSaveCourse}
          disabled={saving}
          className="px-5 md:px-8 py-2.5 md:py-3.5 bg-secondary text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all border border-secondary/20 shadow-lg shadow-secondary/15 flex items-center gap-2 group disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {courseId ? 'Salvar Alterações' : 'Criar Curso'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card p-12 rounded-[48px] border border-border space-y-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container border border-border flex items-center justify-center text-secondary">
                <Layout size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-medium text-foreground tracking-tight uppercase tracking-[0.1em]">Informações Básicas</h3>
                <p className="text-body-sm text-muted-foreground font-medium">Parâmetros essenciais de apresentação do curso.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Título do Curso</label>
                <input 
                  type="text"
                  value={course.title}
                  onChange={(e) => setCourse({...course, title: e.target.value})}
                  placeholder="Ex: Gestão Financeira para Alta Performance"
                  className="w-full px-5 py-4 bg-surface-container border border-border rounded-[20px] text-sm font-semibold outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner focus:border-secondary text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Descrição Detalhada</label>
                <textarea 
                  rows={4}
                  value={course.description}
                  onChange={(e) => setCourse({...course, description: e.target.value})}
                  placeholder="Descreva os objetivos e o que será aprendido neste curso..."
                  className="w-full px-5 py-4 bg-surface-container border border-border rounded-[20px] text-sm font-semibold outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner focus:border-secondary text-foreground resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Categoria de Estudo</label>
                  <div className="relative">
                    <select
                      value={course.category}
                      onChange={(e) => setCourse({...course, category: e.target.value})}
                      className="w-full px-5 py-4 bg-surface-container border border-border rounded-[20px] text-sm font-semibold outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner focus:border-secondary text-foreground appearance-none cursor-pointer"
                    >
                      {['Gestão', 'Finanças', 'Liderança', 'Marketing', 'Operações', 'Cultura'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Nível de Complexidade</label>
                  <div className="relative">
                    <select
                      value={course.level}
                      onChange={(e) => setCourse({...course, level: e.target.value as any})}
                      className="w-full px-5 py-4 bg-surface-container border border-border rounded-[20px] text-sm font-semibold outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner focus:border-secondary text-foreground appearance-none cursor-pointer"
                    >
                      {['Iniciante', 'Intermediário', 'Avançado', 'Master'].map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Especialista / Instrutor</label>
                  <input 
                    type="text"
                    value={course.instructor}
                    onChange={(e) => setCourse({...course, instructor: e.target.value})}
                    placeholder="Nome do palestrante ou mentor"
                    className="w-full px-5 py-4 bg-surface-container border border-border rounded-[20px] text-sm font-semibold outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner focus:border-secondary text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Duração Total Estimada</label>
                  <input 
                    type="text"
                    value={course.duration}
                    onChange={(e) => setCourse({...course, duration: e.target.value})}
                    placeholder="Ex: 8h 30min"
                    className="w-full px-5 py-4 bg-surface-container border border-border rounded-[20px] text-sm font-semibold outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner focus:border-secondary text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card p-10 rounded-[48px] border border-border space-y-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container border border-border flex items-center justify-center text-secondary">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-xl font-display font-medium text-foreground tracking-tight uppercase tracking-[0.1em]">Imagem de Capa</h3>
            </div>
            <div className="space-y-6">
               <div className="aspect-video bg-surface-container rounded-[24px] border-2 border-dashed border-border flex items-center justify-center overflow-hidden shadow-inner">
                 {course.coverImage ? (
                   <img src={course.coverImage} className="w-full h-full object-cover" alt="Preview" />
                 ) : (
                   <div className="text-center p-6 space-y-3">
                     <ImageIcon size={32} className="mx-auto text-muted-foreground/35" />
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">Insira uma URL de imagem válida abaixo</p>
                   </div>
                 )}
               </div>
               <input 
                 type="text"
                 value={course.coverImage}
                 onChange={(e) => setCourse({...course, coverImage: e.target.value})}
                 placeholder="https://exemplo.com/imagem.jpg"
                 className="w-full px-5 py-3.5 bg-surface-container border border-border rounded-[20px] text-[11px] font-medium outline-none focus:ring-1 focus:ring-secondary/20 transition-all shadow-inner focus:border-secondary text-foreground"
               />
            </div>
          </div>

          <div className="bg-card p-10 rounded-[48px] border border-border space-y-8 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-display font-medium text-foreground tracking-tight uppercase tracking-[0.1em]">Status da Publicação</h3>
            <div className="flex bg-surface-container p-1.5 rounded-[24px] border border-border shadow-inner">
              {(['draft', 'published'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setCourse({...course, status})}
                  className={cn(
                    "flex-1 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                    course.status === status 
                      ? "bg-card text-secondary shadow-sm border border-border" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {status === 'draft' ? 'Rascunho' : 'Publicado'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
