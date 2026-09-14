import { collection, query, where, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import type { Course, Module, Lesson, UserProgress } from '../../../../../types/academy';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export class FirestoreAcademyAdapter {
  static listenToCourses(onUpdate: (courses: Course[]) => void, onError: (err: any) => void): () => void {
    const q = query(collection(db, 'academy_courses'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
      onUpdate(coursesData);
    }, onError);
  }

  static listenToModules(courseId: string, onUpdate: (modules: Module[]) => void, onError: (err: any) => void): () => void {
    const q = query(collection(db, 'academy_modules'), where('courseId', '==', courseId), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const modulesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Module[];
      onUpdate(modulesData);
    }, onError);
  }

  static listenToLessons(moduleId: string, onUpdate: (lessons: Lesson[]) => void, onError: (err: any) => void): () => void {
    const q = query(collection(db, 'academy_lessons'), where('moduleId', '==', moduleId), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lesson[];
      onUpdate(lessonsData);
    }, onError);
  }

  static listenToProgress(userId: string, clientId: string, courseId: string, onUpdate: (progress: UserProgress[]) => void, onError: (err: any) => void): () => void {
    const q = query(
      collection(db, 'academy_progress'), 
      where('userId', '==', userId),
      where('clientId', '==', clientId),
      where('courseId', '==', courseId)
    );
    return onSnapshot(q, (snapshot) => {
      const progressData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProgress[];
      onUpdate(progressData);
    }, onError);
  }

  static async toggleLessonProgress(params: { userId: string; clientId: string; courseId: string; moduleId: string; lessonId: string; completed: boolean; }): Promise<void> {
    const { userId, clientId, courseId, moduleId, lessonId, completed } = params;
    const progressId = `${userId}_${clientId}_${lessonId}`;
    const progressRef = doc(db, 'academy_progress', progressId);
    blockedFirestoreWrite(); // setDoc(progressRef, {
      // userId,
      // clientId,
      // courseId,
      // moduleId,
      // lessonId,
      // completed,
      // completedAt: completed ? serverTimestamp() : null,
      // lastAccessAt: serverTimestamp()
    // }, { merge: true });
  }
}
