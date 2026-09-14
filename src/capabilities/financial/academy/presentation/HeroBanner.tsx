import React from 'react';
import { Play, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import type { Course } from '../../../../types/academy';

interface HeroBannerProps {
  course: Course;
  onPlay: (course: Course) => void;
  onSelect: (course: Course) => void;
}

export function HeroBanner({ course, onPlay, onSelect }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-12 group">
      {/* Background with parallax effect possibility */}
      <img 
        src={course.coverImage} 
        alt={course.title} 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Gradients for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent" />

      <div className="absolute inset-0 p-16 flex flex-col justify-center max-w-2xl space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-2 bg-accent/20 backdrop-blur-md px-3 py-1 rounded-full border border-accent/30 text-accent text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={12} />
            Destaque da Semana
          </div>
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{course.category}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black text-white leading-[1.1] font-display"
        >
          {course.title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/70 leading-relaxed line-clamp-3"
        >
          {course.description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 pt-4"
        >
          <button 
            onClick={() => onPlay(course)}
            className="px-5 md:px-8 py-2.5 md:py-4 bg-white text-primary rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-accent transition-all hover:-translate-y-1 active:scale-95"
          >
            <Play size={20} fill="currentColor" />
            Assistir Agora
          </button>
          <button 
            onClick={() => onSelect(course)}
            className="px-5 md:px-8 py-2.5 md:py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Info size={20} />
            Mais Informações
          </button>
        </motion.div>
      </div>
    </div>
  );
}
