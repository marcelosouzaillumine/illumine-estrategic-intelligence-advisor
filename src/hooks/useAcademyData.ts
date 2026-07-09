import { useState, useEffect } from 'react';
import { FirestoreAcademyAdapter } from '../adapters/persistence/FirestoreAcademyAdapter';

import type { Course, Module, Lesson, UserProgress } from '../types/academy';

const MOCK_COURSES: Course[] = [];

/** Hook principal para listar cursos da academia */
export function useAcademyData() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirestoreAcademyAdapter.listenToCourses((coursesData) => {
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

    const unsubscribe = FirestoreAcademyAdapter.listenToModules(courseId, (modulesData) => {
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

    const unsubscribe = FirestoreAcademyAdapter.listenToLessons(moduleId, (lessonsData) => {
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

    const unsubscribe = FirestoreAcademyAdapter.listenToProgress(userId, clientId, courseId, (progressData) => {
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
  await FirestoreAcademyAdapter.toggleLessonProgress(params);
}
