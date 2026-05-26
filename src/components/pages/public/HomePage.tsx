import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { SalesPage } from '../SalesPage';

export function HomePage() {
  useDocumentTitle('Illumine | Governance');
  const navigate = useNavigate();

  // Por padrão usando a SalesPage, pode ser substituída por uma Landing genérica
  return (
    <SalesPage onLoginClick={() => navigate('/login')} />
  );
}
