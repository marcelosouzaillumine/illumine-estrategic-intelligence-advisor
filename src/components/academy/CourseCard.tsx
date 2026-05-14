import React from 'react';
import { Play, Info, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import type { Course } from '../../types/academy';
import { cn } from '../../lib/utils';

interface CourseCardProps {
  key?: React.Key;
  course: Course;
  onSelect: (course: Course) => void;
  onPlay: (course: Course) => void;
  progress?: number;
}

export function CourseCard({ course, onSelect, onPlay, progress }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="relative flex-shrink-0 w-[300px] h-[170px] rounded-xl overflow-hidden cursor-pointer group shadow-lg bg-bg-card border border-border-main/50"
    >
      {/* Background Image */}
      <img 
        src={course.coverImage} 
        alt={course.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-primary/90 text-white">
              {course.category}
            </span>
            <span className="text-[10px] font-bold text-white/80">
              {course.level}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white line-clamp-1 leading-tight">
            {course.title}
          </h3>
          
          <div className="flex items-center gap-3 pt-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
             <button 
              onClick={(e) => { e.stopPropagation(); onPlay(course); }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary hover:bg-accent transition-colors"
             >
               <Play size={16} fill="currentColor" />
             </button>
             <button 
              onClick={(e) => { e.stopPropagation(); onSelect(course); }}
              className="w-8 h-8 rounded-full bg-bg-surface/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-bg-surface/60 transition-colors"
             >
               <Info size={16} />
             </button>
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-accent"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
