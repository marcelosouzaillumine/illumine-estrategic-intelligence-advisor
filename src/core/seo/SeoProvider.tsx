import React, { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';

interface SeoProviderProps {
  children: ReactNode;
}

export function SeoProvider({ children }: SeoProviderProps) {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
}
