export type ContentType = 'video' | 'text' | 'pdf' | 'link';

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description?: string;
  contentType: ContentType;
  videoUrl?: string;
  pdfUrl?: string;
  externalLink?: string;
  textContent?: string;
  duration?: number; // in minutes
  order: number;
  isPublished: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons?: Lesson[];
  createdAt: any;
  updatedAt: any;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Master';
  coverImage: string;
  instructor: string;
  duration: string; // e.g. "12h 30min"
  status: 'draft' | 'published';
  modulesCount?: number;
  lessonsCount?: number;
  createdAt: any;
  updatedAt: any;
}

export interface UserProgress {
  id: string;
  userId: string;
  clientId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: any;
  lastAccessAt: any;
  progressPercentage?: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  clientId: string;
  courseId: string;
  enrolledAt: any;
  status: 'active' | 'completed' | 'inactive';
}
