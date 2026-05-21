import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { PartnerSalesPage } from '../PartnerSalesPage';

export function ParceirosPage() {
  useDocumentTitle('Illumine | Parceiros Estratégicos');
  const navigate = useNavigate();

  return (
    <PartnerSalesPage onLoginClick={() => navigate('/login')} />
  );
}
