import { ExecutiveAdvisoryWidget } from '../../../../../capabilities/executive-advisory/components/ExecutiveAdvisoryWidget';

/**
 * COMPATIBILITY WRAPPER
 * 
 * Este arquivo foi preservado para evitar quebras de dependência em cascata.
 * O componente legado ("Illumine Copilot") foi substituído pelo novo "Executive Intelligence Concierge™".
 * O wiring foi restabelecido para usar o `ExecutiveAdvisoryWidget`.
 * 
 * DEPRECATED: Esta casca será removida em limpezas arquiteturais futuras.
 */
export function ExecutiveCopilotWidget() {
  return <ExecutiveAdvisoryWidget />;
}
