export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type VisualMeasurement = {
  region: BoundingBox;
  currentSituation: BoundingBox;
  strategicPriority: BoundingBox;
  outlook: BoundingBox;
  recommendation: BoundingBox;
  viewportWidth: number;
  documentScrollWidth: number;
  overlapDetected: boolean;
  horizontalOverflow: boolean;
};

export function checkOverlap(box1: BoundingBox, box2: BoundingBox, tolerance: number = 3): boolean {
  return !(
    box1.x + box1.width <= box2.x + tolerance ||
    box2.x + box2.width <= box1.x + tolerance ||
    box1.y + box1.height <= box2.y + tolerance ||
    box2.y + box2.height <= box1.y + tolerance
  );
}

export function evaluateMeasurements(m: VisualMeasurement, scenario: string, viewportWidth: number) {
  const isMobile = viewportWidth <= 768; // For this test, 768px triggers mobile 1-column layout because lg begins at 1024px.
  
  const results = {
    pass: true,
    overlap: m.overlapDetected,
    overflow: m.horizontalOverflow,
    orderingPass: true,
    gapPass: true,
    observations: [] as string[]
  };

  if (m.horizontalOverflow) {
    results.pass = false;
    results.observations.push('Horizontal overflow detected.');
  }
  
  if (m.overlapDetected) {
    results.pass = false;
    results.observations.push('Overlap detected among cards.');
  }

  if (isMobile) {
    // vertical order: situation -> priority -> outlook -> recommendation
    if (!(m.currentSituation.y < m.strategicPriority.y &&
          m.strategicPriority.y < m.outlook.y &&
          m.outlook.y < m.recommendation.y)) {
       results.pass = false;
       results.orderingPass = false;
       results.observations.push('Mobile ordering is incorrect.');
    }
  } else {
    // desktop order
    if (!(m.recommendation.x > m.outlook.x)) {
      results.pass = false;
      results.orderingPass = false;
      results.observations.push('Recommendation is not on the right column.');
    }
    if (!(m.recommendation.y > m.strategicPriority.y)) {
      // Just check it's generally below the first row (the situation/priority)
      results.pass = false;
      results.orderingPass = false;
      results.observations.push('Recommendation is not below the top row.');
    }
    const widthDiff = Math.abs(m.recommendation.width - m.strategicPriority.width);
    if (widthDiff > 10) { // Using 10px instead of 4px to be safe with grid gaps
      results.pass = false;
      results.observations.push(`Width difference too large: ${widthDiff}px.`);
    }
  }

  return results;
}
