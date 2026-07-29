import 'global-jsdom/register';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderHook } from '@testing-library/react';
import { useExecutivePerspectiveViewData } from '../src/capabilities/executive/presentation/hooks/useExecutivePerspectiveViewData';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { ExecutiveAdvisoryReport } from '../src/lib/executive-advisory-engine';
import { ExecutiveIntelligenceReport } from '../src/services/FiduciaryRuntimeAdapter';

// We need a dummy provider for translation
const wrapper = ({ children }: any) => <LanguageProvider>{children}</LanguageProvider>;

describe('useExecutivePerspectiveViewData', () => {
  it('somente advisoryReport: should return transformed data', () => {
    const advisoryReport = {
      confidenceLevel: 'HIGH_CONFIDENCE',
      executivePosture: 'Growth Strategy',
      executiveSummary: 'Summary',
      institutionalDiagnosis: 'Diagnosis',
      dominantRisks: ['Risk 1'],
      strategicPriorities: ['Priority 1'],
      actionMatrix: []
    } as unknown as ExecutiveAdvisoryReport;
    
    const { result } = renderHook(() => useExecutivePerspectiveViewData({ advisoryReport }), { wrapper });
    assert.equal(result.current.hasSource, true);
    assert.ok(result.current.data);
  });

  it('nenhum relatório: should return null and hasSource false', () => {
    const { result } = renderHook(() => useExecutivePerspectiveViewData({}), { wrapper });
    assert.equal(result.current.hasSource, false);
    assert.equal(result.current.data, null);
  });
});
