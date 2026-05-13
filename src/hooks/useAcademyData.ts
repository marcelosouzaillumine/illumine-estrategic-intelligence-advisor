import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  deleteDoc, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Course, Module, Lesson, UserProgress, Enrollment } from '../types/academy';

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Gestão Financeira para Executivos',
    description: 'Aprenda a dominar os principais indicadores financeiros e como utilizá-los para tomar decisões estratégicas de alto impacto no seu negócio.',
    category: 'Finanças',
    level: 'Avançado',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    instructor: 'Marcelo Souza',
    duration: '12h 30min',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'c2',
    title: 'Liderança e Cultura Organizacional',
    description: 'Como construir times de alta performance e manter uma cultura de excelência em ambientes de rápido crescimento.',
    category: 'Liderança',
    level: 'Intermediário',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2340&auto=format&fit=crop',
    instructor: 'Renata Almeida',
    duration: '8h 15min',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'c3',
    title: 'Estratégias de Marketing Digital B2B',
    description: 'O guia definitivo para posicionamento de marca e geração de demanda no mercado corporativo.',
    category: 'Marketing',
    level: 'Master',
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2340&auto=format&fit=crop',
    instructor: 'Daniel Ramos',
    duration: '15h 45min',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function useAcademyData(userId?: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'academy_courses'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      
      if (coursesData.length === 0) {
        setCourses(MOCK_COURSES);
      } else {
        setCourses(coursesData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses:", error);
      setCourses(MOCK_COURSES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getCourse = async (courseId: string) => {
    // Implementation for single course fetch if needed
  };

  const getModules = (courseId: string) => {
    const [modules, setModules] = useState<Module[]>([]);
    
    useEffect(() => {
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
      });

      return () => unsubscribe();
    }, [courseId]);

    return modules;
  };

  const getLessons = (moduleId: string) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    
    useEffect(() => {
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
      });

      return () => unsubscribe();
    }, [moduleId]);

    return lessons;
  };

  const getUserProgress = (userId: string, courseId: string) => {
    const [progress, setProgress] = useState<UserProgress[]>([]);
    
    useEffect(() => {
      const q = query(
        collection(db, 'academy_progress'), 
        where('userId', '==', userId),
        where('courseId', '==', courseId)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const progressData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserProgress[];
        setProgress(progressData);
      });

      return () => unsubscribe();
    }, [userId, courseId]);

    return progress;
  };

  return {
    courses,
    loading,
    getModules,
    getLessons,
    getUserProgress
  };
}
