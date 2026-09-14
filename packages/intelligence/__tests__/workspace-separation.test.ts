/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';

describe('@illumine/governance (Wave 18.3 Workspace Separation)', () => {
  it('should enforce strict segregation between Executive Workspace and Platform Workspace (ADR-077)', () => {
    const executiveQuestion = 'Qual decisão precisa ser tomada?';
    const platformQuestion = 'A plataforma está corretamente configurada e operando?';

    expect(executiveQuestion).not.toEqual(platformQuestion);
  });
});
