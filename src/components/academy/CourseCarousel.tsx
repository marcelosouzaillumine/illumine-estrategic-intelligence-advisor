import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CourseCard } from './CourseCard';
import type { Course } from '../../types/academy';

interface CourseCarouselProps {
  title: string;
  courses: Course[];
  onSelect: (course: Course) => void;
  onPlay: (course: Course) => void;
}

export function CourseCarousel({ title, courses, onSelect, onPlay }: CourseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (courses.length === 0) return null;

  return (
    <div className="space-y-4 group/carousel relative">
      <h2 className="text-xl font-black text-text-main px-2 tracking-tight">
        {title}
      </h2>
      
      <div className="relative">
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full bg-gradient-to-r from-bg-main to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-start pl-2 text-white"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full bg-gradient-to-l from-bg-main to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-end pr-2 text-white"
        >
          <ChevronRight size={32} />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-8 px-2 no-scrollbar scroll-smooth"
        >
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onSelect={onSelect} 
              onPlay={onPlay} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
