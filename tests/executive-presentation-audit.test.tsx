import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from "react";
import { render } from "@testing-library/react";
import { ExecutiveBaseViewModel } from "../src/core/presentation/contracts/executive-view-models";

const FORBIDDEN_DOM_TOKENS = [
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
  "Id"
];

// Mock Component that strictly uses the ViewModel
const MockExecutiveCard: React.FC<{ data: ExecutiveBaseViewModel }> = ({ data }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div data-testid="mock-card">
      <h2>{data.visible.title}</h2>
      {data.visible.attentionLabel && <span>{data.visible.attentionLabel}</span>}
      <button onClick={() => setExpanded(!expanded)}>Expand</button>
      {expanded && (
        <div data-testid="expanded-content">
          <p>{data.visible.description}</p>
          {/* Deliberately avoiding rendering data.internal */}
        </div>
      )}
    </div>
  );
};

describe("Executive Presentation Audit", () => {
  it("must not expose internal codes in the DOM even after interaction", async () => {
    const safeViewModel: ExecutiveBaseViewModel = {
      visible: {
        title: "Inteligência causal do fluxo de caixa",
        attentionLabel: "Atenção máxima",
        description: "Análise de impacto em estabilidade."
      },
      internal: {
        id: "123-CRITICAL-ID",
        runtimeCode: "ERR_DFC_01",
      }
    };

    const { getByText } = render(<MockExecutiveCard data={safeViewModel} />);

    FORBIDDEN_DOM_TOKENS.forEach(token => {
      assert.ok(!new RegExp(token).test(document.body.textContent || ""));
    });

    const button = getByText("Expand") as HTMLButtonElement;
    button.click();

    FORBIDDEN_DOM_TOKENS.forEach(token => {
      assert.ok(!new RegExp(token).test(document.body.textContent || ""));
    });
  });
});

