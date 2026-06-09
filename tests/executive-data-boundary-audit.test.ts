import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mapToExecutiveCardViewModel, RuntimePayload } from "../src/core/presentation/mappers/executive-presentation-mapper";

const FORBIDDEN_VIEWMODEL_VISIBLE_TOKENS = [
  "DFC_",
  "BP_",
  "DRE_",
  "ESG_",
  "EFSI",
  "CDIL",
  "CRITICAL",
  "WARNING",
  "NORMAL",
  "TECHNICAL",
  "EXECUTIVE",
  "BOARD",
  "sectionId",
  "sourceModule",
  "runtime",
  "moduleId",
  "severityCode",
  "technicalCode",
  "Id", // Note: Id in values or visible keys, not in 'internal' keys
];

describe("Executive Data Boundary Audit", () => {
  it("should not leak technical codes into the visible section of a ViewModel", () => {
    const rawRuntimePayload: RuntimePayload = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      sectionId: "DFC_CAUSAL_INTELLIGENCE",
      severityCode: "CRITICAL",
      title: "DFC_CAUSAL_INTELLIGENCE",
      description: "Anomaly detected in sourceModule: core_engine",
      technicalCode: "ERR_001",
    };

    const viewModel = mapToExecutiveCardViewModel(rawRuntimePayload);

    // 1. Check that 'visible' does not contain any forbidden tokens in its values
    const visibleValues = Object.values(viewModel.visible);

    // 1. Check for forbidden tokens
    FORBIDDEN_VIEWMODEL_VISIBLE_TOKENS.forEach(token => {
      visibleValues.forEach(value => {
        if (typeof value === "string") {
          assert.ok(!new RegExp(token).test(value), `Found forbidden token ${token} in visible value: ${value}`);
        }
      });
    });

    // 2. Check that no internal metadata leaked to visible (e.g. no runtime code inside visible values)
    const internalValues = Object.values(viewModel.internal || {});
    internalValues.forEach(internalVal => {
      if (typeof internalVal === "string" && internalVal.length > 2) {
        visibleValues.forEach(visibleVal => {
          if (typeof visibleVal === "string") {
            assert.ok(!visibleVal.includes(internalVal), `Internal metadata ${internalVal} leaked into visible value: ${visibleVal}`);
          }
        });
      }
    });

    // 2. Check that the translation worked
    assert.strictEqual(viewModel.visible.attentionLabel, "Atenção máxima");
    assert.strictEqual(viewModel.visible.title, "Inteligência causal do fluxo de caixa");

    // 3. Ensure internal metadata is isolated
    assert.strictEqual(viewModel.internal?.id, "123e4567-e89b-12d3-a456-426614174000");
    assert.strictEqual(viewModel.internal?.runtimeCode, "ERR_001");
  });
});
