import { describe, it, expect } from 'vitest';
import { ExecutivePriorityEngine } from '../index';

describe('@illumine/executive-priority-engine (Wave 16 Phase 5 Priority Engine)', () => {
  it('should calculate priority score (Impact 40%, Urgency 25%, Confidence 20%, Alignment 15%) and classify CRITICAL', () => {
    // 95*0.4 + 90*0.25 + 92*0.2 + 90*0.15 = 38 + 22.5 + 18.4 + 13.5 = 92.4 -> 92
    const result = ExecutivePriorityEngine.calculatePriority(95, 90, 92, 90);
    expect(result.priorityScore.value).toBe(92);
    expect(result.classification).toBe('CRITICAL');
  });
});
