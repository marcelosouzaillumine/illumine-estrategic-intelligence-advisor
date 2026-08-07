import { describe, it, expect } from 'vitest';
import { DecisionRoomProduct } from '../../products/board/DecisionRoomProduct';
import { ExecutiveOffice } from '../offices/ExecutiveOffice';
import { ExecutiveProductType } from '../../products/ExecutiveProductType';

describe('Decision Authority Regression', () => {
  it('must ensure only BOARD_INTELLIGENCE can issue DECISION_PRODUCT with decision authority', () => {
    // Board is allowed to have decision authority
    expect(DecisionRoomProduct.office).toBe(ExecutiveOffice.BOARD_INTELLIGENCE);
    expect(DecisionRoomProduct.productType).toBe(ExecutiveProductType.DECISION_PRODUCT);
    expect(DecisionRoomProduct.experience.rules.decisionAuthority).toBe(true);
  });
});
