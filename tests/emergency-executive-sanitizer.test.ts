import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizeExecutivePayload } from "../src/core/presentation/emergency-executive-sanitizer";

describe("Emergency Executive Sanitizer", () => {
  it("should sanitize nested objects and arrays", () => {
    const payload = {
      data: {
        status: "CRITICAL",
        id: "sectionId",
      },
      list: [{ section: "DFC_CAUSAL_GOVERNANCE" }, { status: "NORMAL" }, "Regular text"],
    };

    const sanitized = sanitizeExecutivePayload(payload);

    assert.strictEqual((sanitized as any).data.status, "Atenção máxima");
    assert.strictEqual((sanitized as any).data.id, "Informação institucional");
    assert.strictEqual((sanitized as any).list[0].section, "Inteligência causal do fluxo de caixa");
    assert.strictEqual((sanitized as any).list[1].status, "Situação controlada");
    assert.strictEqual((sanitized as any).list[2], "Regular text");
  });
});
