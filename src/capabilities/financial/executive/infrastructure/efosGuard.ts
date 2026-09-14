// src/services/efosGuard.ts

// Centralized guard utilities for EFOS page to avoid direct runtime imports.
// Re-export the needed functions/classes from their original locations.

import { sanitize, translate } from '../../../../workspace/runtime/executive-consolidation/ExecutiveSemanticBoundaryGuard';
import { audit } from '../../../../workspace/runtime/executive-consolidation/ExecutiveSemanticAudit';
import { ExecutiveSemanticRegistry } from '../../../../workspace/runtime/presentation-governance/ExecutiveSemanticRegistry';

export { isDebugAllowed } from '../../../../workspace/runtime/executive-consolidation/ProductionVisibilityPolicy';
export { ExecutivePresentationRegistry } from '../../../../workspace/runtime/presentation-governance/ExecutivePresentationRegistry';
export { sanitize, translate, audit };
export const languageSanitize = sanitize;

// Minimal fallback view for blocked executive content (status not rendered for BOARD/EXECUTIVE)
export const fallbackInstitutionalView = {
  title: 'Visualização Executiva Indisponível',
  message: 'A visualização executiva foi bloqueada por inconsistência de linguagem institucional. Reprocessar o relatório antes de deliberação.',
  status: 'BLOCKED_FOR_EXECUTIVE_REVIEW',
};
