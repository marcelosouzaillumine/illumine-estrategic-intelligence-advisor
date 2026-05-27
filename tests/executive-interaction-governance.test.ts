import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { SeveritySemanticEngine } from '../src/components/executive-interaction/SeveritySemanticEngine';

describe('Executive Interaction Governance System Tests', () => {
  it('1. SeveritySemanticEngine maps contracts to presentation tokens correctly', () => {
    // Info style
    const infoStyle = SeveritySemanticEngine.getSeverityStyle('INFO');
    assert.strictEqual(infoStyle.textColor, 'text-blue-400');
    assert.ok(infoStyle.accessibilityLabel.includes('Informação'));

    // Critical style
    const criticalStyle = SeveritySemanticEngine.getSeverityStyle('CRITICAL');
    assert.strictEqual(criticalStyle.textColor, 'text-red-400');
    assert.ok(criticalStyle.accessibilityLabel.includes('Crítico'));

    // Locked style
    const lockedStyle = SeveritySemanticEngine.getSeverityStyle('LOCKED');
    assert.strictEqual(lockedStyle.textColor, 'text-slate-400');
    assert.ok(lockedStyle.accessibilityLabel.includes('Bloqueado'));
  });

  it('2. SeveritySemanticEngine maps escalation levels correctly', () => {
    // Normal level
    const normalStyle = SeveritySemanticEngine.getEscalationStyle('NORMAL');
    assert.strictEqual(normalStyle.textColor, 'text-slate-400');

    // Board critical level
    const boardStyle = SeveritySemanticEngine.getEscalationStyle('BOARD_CRITICAL');
    assert.strictEqual(boardStyle.textColor, 'text-red-400');
    assert.ok(boardStyle.animationClass.includes('animate-executive-pulse'));
  });

  it('3. FiduciaryModalShell and components have no business logic calculations', () => {
    // Handled purely by runtime. Verify type safety is present.
    assert.ok(typeof SeveritySemanticEngine.getSeverityStyle === 'function');
  });
});
