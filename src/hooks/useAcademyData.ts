import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Course, Module, Lesson, UserProgress } from '../types/academy';

const MOCK_COURSES: Course[] = [];

/** Hook principal para listar cursos da academia */
export function useAcademyData() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'academy_courses'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      
      setCourses(coursesData.length === 0 ? MOCK_COURSES : coursesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses:", error);
      setCourses(MOCK_COURSES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { courses, loading };
}

/** Hook dedicado para carregar módulos de um curso */
export function useAcademyModules(courseId: string) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      setModules([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'academy_modules'), 
      where('courseId', '==', courseId),
      orderBy('order', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const modulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Module[];
      setModules(modulesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching modules:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [courseId]);

  return { modules, loading };
}

/** Hook dedicado para carregar lições de um módulo */
export function useAcademyLessons(moduleId: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) {
      setLessons([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'academy_lessons'), 
      where('moduleId', '==', moduleId),
      orderBy('order', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lesson[];
      setLessons(lessonsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching lessons:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [moduleId]);

  return { lessons, loading };
}

/** Hook dedicado para buscar o progresso de um usuário em um curso para um cliente específico */
export function useAcademyProgress(userId: string, clientId: string, courseId: string) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !clientId || !courseId) {
      setProgress([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'academy_progress'), 
      where('userId', '==', userId),
      where('clientId', '==', clientId),
      where('courseId', '==', courseId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const progressData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProgress[];
      setProgress(progressData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching progress:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, clientId, courseId]);

  return { progress, loading };
}

/** Função utilitária para salvar o progresso de uma lição */
export async function toggleLessonProgress(params: {
  userId: string;
  clientId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
}) {
  const { userId, clientId, courseId, moduleId, lessonId, completed } = params;
  const progressId = `${userId}_${clientId}_${lessonId}`;
  
  const progressRef = doc(db, 'academy_progress', progressId);
  
  await setDoc(progressRef, {
    userId,
    clientId,
    courseId,
    moduleId,
    lessonId,
    completed,
    completedAt: completed ? serverTimestamp() : null,
    lastAccessAt: serverTimestamp()
  }, { merge: true });
}
