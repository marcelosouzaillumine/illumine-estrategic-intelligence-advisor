import React from 'react';
import { Play, Info } from 'lucide-react';
import { motion } from 'motion/react';
import type { Course } from '../../../../types/academy';

interface VerticalCourseCardProps {
  key?: React.Key;
  course: Course;
  onSelect: (course: Course) => void;
  onPlay: (course: Course) => void;
}

export function VerticalCourseCard({ course, onSelect, onPlay }: VerticalCourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="relative flex-shrink-0 w-[240px] h-[360px] rounded-[32px] overflow-hidden cursor-pointer group shadow-2xl bg-bg-card border border-border-main/20"
    >
      {/* Background Image */}
      <img 
        src={course.coverImage} 
        alt={course.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-secondary text-primary">
              {course.category}
            </span>
            <h3 className="text-xl font-black text-white leading-tight">
              {course.title}
            </h3>
          </div>
          
          <p className="text-white/60 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {course.description}
          </p>

          <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
             <button 
              onClick={(e) => { e.stopPropagation(); onPlay(course); }}
              className="px-4 py-2 rounded-xl bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors flex items-center gap-2"
             >
               <Play size={14} fill="currentColor" />
               Assistir
             </button>
             <button 
              onClick={(e) => { e.stopPropagation(); onSelect(course); }}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
             >
               <Info size={18} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
