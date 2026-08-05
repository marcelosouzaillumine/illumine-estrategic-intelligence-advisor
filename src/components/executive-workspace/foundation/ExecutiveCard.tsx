import React from 'react';
import { WidgetMetadata } from '../../../workspace/types';

interface ExecutiveCardProps {
  children: React.ReactNode;
  metadata?: WidgetMetadata;
  className?: string;
}

export function ExecutiveCard({ children, metadata, className = '' }: ExecutiveCardProps) {
  // Uses generic theme-agnostic tokens (e.g. bg-card, text-card-foreground)
  // Instead of hardcoded colors like bg-white/5
  return (
    <div className={`flex flex-col bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm relative group ${className}`}>
      {children}
      {/* Optional Metadata hover trigger (e.g. favoriting, info) could be injected here */}
      {metadata && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Action icon for settings/metadata could go here */}
        </div>
      )}
    </div>
  );
}
