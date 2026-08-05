import React from 'react';
import { useAuthorization } from '../../hooks/useAuthorization';
import { SystemCapability } from '../../domain/authorization/Capabilities';

interface CanProps {
  capability: SystemCapability;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ capability, children, fallback = null }) => {
  const { can, loading } = useAuthorization();

  if (loading) {
    // Optionally return a spinner or null during loading
    return null;
  }

  if (can(capability)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
