const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/marcelosouza/.gemini/antigravity-ide/brain/6fdc5c95-af59-471a-aa47-d4cdd00fd5ed';
const candidates = JSON.parse(fs.readFileSync(path.join(ARTIFACT_DIR, 'EVC_MANUAL_REVIEW_CANDIDATES.json'), 'utf8'));

const disposition = candidates.map((c, i) => {
  let type = "UNKNOWN";
  if (c.currentValue.startsWith('bg-') || c.currentValue.startsWith('text-')) type = "COLOR";
  else if (c.currentValue.startsWith('rounded')) type = "RADIUS";
  else if (c.currentValue.startsWith('w-') || c.currentValue.startsWith('h-')) type = "DIMENSION";

  return {
    id: `EVC-MR-${String(i + 1).padStart(4, '0')}`,
    file: c.file,
    line: c.line,
    finding: c.currentValue,
    type: type,
    componentMaturity: c.componentStatus,
    semanticRole: c.semanticRole,
    disposition: "PENDING",
    proposedToken: c.proposedValue,
    requiresVisualReview: true,
    decisionSource: null
  };
});

fs.writeFileSync(path.join(ARTIFACT_DIR, 'EVC_MANUAL_REVIEW_DISPOSITION.json'), JSON.stringify(disposition, null, 2));
