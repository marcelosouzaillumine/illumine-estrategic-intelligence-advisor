import React from 'react';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SystemicHeatmapComplianceGuard } from '../src/components/systemic-heatmap/SystemicHeatmapComplianceGuard';

describe('Systemic Heatmap UI Compliance', () => {
  it('1. Renderiza empty state quando não há runtime consolidado', () => {
    const props = { output: undefined };
    const guard = SystemicHeatmapComplianceGuard(props as any);
    assert.strictEqual(guard.props.isEmpty, true);
  });

  it('2. Renderiza systemicStressMap quando existe output consolidado', () => {
    const props = { 
      output: { 
        systemicStressMap: [], 
        systemicConfidence: 'EXACT_MATCH' 
      } 
    };
    const guard = SystemicHeatmapComplianceGuard(props as any);
    assert.strictEqual(guard.props.isEmpty, false);
  });

  it('3. Exibe alerta quando systemicConfidence = LOW_CONFIDENCE_PROPAGATION', () => {
    const props = { 
      output: { 
        systemicStressMap: [], 
        systemicConfidence: 'LOW_CONFIDENCE_PROPAGATION' 
      } 
    };
    const guard = SystemicHeatmapComplianceGuard(props as any);
    assert.strictEqual(guard.props.hasLowConfidence, true);
  });

  it('4. Exibe alerta quando systemicConfidence = UNVERIFIED_DEPENDENCY', () => {
    const props = { 
      output: { 
        systemicStressMap: [], 
        systemicConfidence: 'UNVERIFIED_DEPENDENCY' 
      } 
    };
    const guard = SystemicHeatmapComplianceGuard(props as any);
    assert.strictEqual(guard.props.hasUnverifiedDependency, true);
  });
});
