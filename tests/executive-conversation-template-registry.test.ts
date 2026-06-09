// tests/executive-conversation-template-registry.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ExecutiveConversationTemplateRegistry } from '../src/lib/executive-conversation-template-registry';

describe('ExecutiveConversationTemplateRegistry', () => {
  it('must return distinct templates for BOARD and CEO', () => {
    const boardTemplate = ExecutiveConversationTemplateRegistry.getTemplate('BOARD', 'RISKS');
    const ceoTemplate = ExecutiveConversationTemplateRegistry.getTemplate('CEO', 'EXECUTION');

    assert.ok(boardTemplate);
    assert.ok(ceoTemplate);
    assert.notStrictEqual(boardTemplate?.templateStrings.standardFinding, ceoTemplate?.templateStrings.standardFinding);
  });

  it('must return fallback if specific template is missing', () => {
    const fallback = ExecutiveConversationTemplateRegistry.getFallbackTemplate('ADVISOR');
    assert.strictEqual(fallback.mode, 'ADVISOR');
    assert.strictEqual(fallback.focusArea, 'GENERAL');
  });
});
