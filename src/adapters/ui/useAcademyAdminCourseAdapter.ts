import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Course } from '../../types/academy';

export function useAcademyAdminCourseAdapter(courseId: string | undefined, onBack: () => void) {
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
    setLoading(true);
    try {
      const docRef = doc(db, 'academy_courses', courseId!);
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

  const handleSave = async () => {
    if (!course.title) {
      alert("O título do curso é obrigatório.");
      return;
    }
    
    setSaving(true);
    try {
      const courseRef = courseId 
        ? doc(db, 'academy_courses', courseId)
        : doc(collection(db, 'academy_courses'));
        
      const payload = {
        ...course,
        updatedAt: serverTimestamp(),
        ...(courseId ? {} : { createdAt: serverTimestamp(), type: 'course' })
      };

      await setDoc(courseRef, payload, { merge: true });
      onBack();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Erro ao salvar o curso.");
    } finally {
      setSaving(false);
    }
  };

  return {
    course,
    setCourse,
    loading,
    saving,
    handleSave
  };
}
