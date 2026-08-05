import React from 'react';

interface ExecutiveAvatarProps {
  initials: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ExecutiveAvatar({ initials, imageUrl, size = 'md', className = '' }: ExecutiveAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-sm'
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold border border-border overflow-hidden ${sizeClasses[size]} ${className}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={initials} className="w-full h-full object-cover" />
      ) : (
        <span>{initials.toUpperCase().substring(0, 2)}</span>
      )}
    </div>
  );
}
