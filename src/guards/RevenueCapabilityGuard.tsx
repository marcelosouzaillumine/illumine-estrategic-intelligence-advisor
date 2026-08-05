import React from 'react';
import { Navigate } from 'react-router-dom';
import { useInstitutionalAuth } from '../core/security/auth/InstitutionalAuthProvider';

interface RevenueCapabilityGuardProps {
  children: React.ReactNode;
}

export const RevenueCapabilityGuard: React.FC<RevenueCapabilityGuardProps> = ({ children }) => {
  const { session, loading } = useInstitutionalAuth();

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Validating Revenue Credentials...</div>;

  const role = session?.role;
  const isAuthorized = role === 'SUPER_ADMIN' || role === 'TENANT_ADMIN'; 
  
  if (!isAuthorized) {
    return <Navigate to="/dashboard/efos" replace />;
  }

  return <>{children}</>;
};
