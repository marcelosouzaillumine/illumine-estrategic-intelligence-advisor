import { TemporalCausalityOutput } from '../core/runtime/institutional-memory/types';

interface InstitutionalSession {
  isReady: boolean;
  tenantId: string;
  entityScope: string[];
}

export function useTemporalRuntime(session: InstitutionalSession, rawPayload: TemporalCausalityOutput | null) {
  if (!session.isReady) {
    return { temporalData: null, isLoading: true, error: null };
  }

  if (!rawPayload) {
    return { temporalData: null, isLoading: false, error: null };
  }

  // Fail-closed verifications
  if (rawPayload.tenantId !== session.tenantId) {
    return { temporalData: null, isLoading: false, error: 'CROSS_TENANT_BLOCKED' };
  }

  if (!session.entityScope.includes(rawPayload.entityScope)) {
    return { temporalData: null, isLoading: false, error: 'OUT_OF_SCOPE' };
  }

  if (!rawPayload.lineageHash) {
    return { temporalData: null, isLoading: false, error: 'MISSING_LINEAGE_HASH' };
  }

  if (!rawPayload.correlationId) {
    return { temporalData: null, isLoading: false, error: 'MISSING_CORRELATION_ID' };
  }

  if (!rawPayload.confidenceState) {
    return { temporalData: null, isLoading: false, error: 'MISSING_CONFIDENCE_STATE' };
  }

  // Pass strict validation
  return { temporalData: rawPayload, isLoading: false, error: null };
}
