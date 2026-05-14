import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Plus, Trash2, Layout, Video, FileText, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp, query, where, getDocs, deleteDoc, orderBy } from 'firebase/firestore';
import type { Course, Module, Lesson } from '../../../types/academy';
import { cn } from '../../../lib/utils';

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
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-dim hover:text-text-main transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-widest">Voltar para Gestão</span>
        </button>

        <button
          onClick={handleSaveCourse}
          disabled={saving}
          className="px-8 py-3 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {courseId ? 'Salvar Alterações' : 'Criar Curso'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-bg-card p-10 rounded-[40px] border border-border-main/50 space-y-8 shadow-premium">
            <h3 className="text-xl font-black text-text-main uppercase tracking-widest flex items-center gap-3">
              <Layout className="text-secondary" /> Informações Básicas
            </h3>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Título do Curso</label>
                <input 
                  type="text"
                  value={course.title}
                  onChange={(e) => setCourse({...course, title: e.target.value})}
                  placeholder="Ex: Gestão Financeira para Alta Performance"
                  className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl focus:border-secondary transition-all outline-none text-sm font-bold"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Descrição</label>
                <textarea 
                  rows={4}
                  value={course.description}
                  onChange={(e) => setCourse({...course, description: e.target.value})}
                  placeholder="Descreva os objetivos e o que será aprendido neste curso..."
                  className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl focus:border-secondary transition-all outline-none text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Categoria</label>
                  <select
                    value={course.category}
                    onChange={(e) => setCourse({...course, category: e.target.value})}
                    className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl focus:border-secondary transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    {['Gestão', 'Finanças', 'Liderança', 'Marketing', 'Operações', 'Cultura'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Nível</label>
                  <select
                    value={course.level}
                    onChange={(e) => setCourse({...course, level: e.target.value as any})}
                    className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl focus:border-secondary transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    {['Iniciante', 'Intermediário', 'Avançado', 'Master'].map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Instrutor</label>
                  <input 
                    type="text"
                    value={course.instructor}
                    onChange={(e) => setCourse({...course, instructor: e.target.value})}
                    placeholder="Nome do especialista"
                    className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl focus:border-secondary transition-all outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Duração Estimada</label>
                  <input 
                    type="text"
                    value={course.duration}
                    onChange={(e) => setCourse({...course, duration: e.target.value})}
                    placeholder="Ex: 8h 30min"
                    className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl focus:border-secondary transition-all outline-none text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-bg-card p-10 rounded-[40px] border border-border-main/50 space-y-8 shadow-premium">
            <h3 className="text-xl font-black text-text-main uppercase tracking-widest flex items-center gap-3">
              <ImageIcon className="text-secondary" /> Imagem de Capa
            </h3>
            <div className="space-y-6">
               <div className="aspect-video bg-bg-surface rounded-2xl border-2 border-dashed border-border-main flex items-center justify-center overflow-hidden">
                 {course.coverImage ? (
                   <img src={course.coverImage} className="w-full h-full object-cover" alt="Preview" />
                 ) : (
                   <div className="text-center p-6">
                     <ImageIcon size={40} className="mx-auto text-text-dim mb-3" />
                     <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Insira uma URL de imagem</p>
                   </div>
                 )}
               </div>
               <input 
                 type="text"
                 value={course.coverImage}
                 onChange={(e) => setCourse({...course, coverImage: e.target.value})}
                 placeholder="https://exemplo.com/imagem.jpg"
                 className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl focus:border-secondary transition-all outline-none text-xs font-medium"
               />
            </div>
          </div>

          <div className="bg-bg-card p-10 rounded-[40px] border border-border-main/50 space-y-8 shadow-premium">
            <h3 className="text-xl font-black text-text-main uppercase tracking-widest flex items-center gap-3">
              Status da Publicação
            </h3>
            <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-main">
              {(['draft', 'published'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setCourse({...course, status})}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    course.status === status 
                      ? "bg-bg-card text-secondary shadow-premium border border-border-main" 
                      : "text-text-dim hover:text-text-main"
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
