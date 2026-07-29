import React from 'react';
import { FiduciaryValidationCenter } from './FiduciaryValidationCenter';

/**
 * FiduciaryGovernanceCenter (Canonical Alias)
 * Delegado diretamente para FiduciaryValidationCenter para garantir unificação
 * de rotas e eliminar duplicidade arquitetural.
 */
export function FiduciaryGovernanceCenter() {
  return <FiduciaryValidationCenter />;
}
