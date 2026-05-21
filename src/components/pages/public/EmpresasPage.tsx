import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { SalesPage } from '../SalesPage';

export function EmpresasPage() {
  useDocumentTitle('Illumine | Empresas');
  const navigate = useNavigate();

  return (
    <SalesPage onLoginClick={() => navigate('/login')} />
  );
}
