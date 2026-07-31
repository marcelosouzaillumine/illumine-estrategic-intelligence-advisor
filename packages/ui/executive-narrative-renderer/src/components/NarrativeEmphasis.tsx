import React from 'react';

export const NarrativeEmphasis: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <strong className="font-semibold text-foreground">{children}</strong>;
};
