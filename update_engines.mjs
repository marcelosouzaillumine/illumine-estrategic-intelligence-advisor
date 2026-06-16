import fs from 'fs';

const files = [
  'src/core/runtime/executive-consolidation/LiquidityExecutiveAssessmentEngine.ts',
  'src/core/runtime/executive-consolidation/CapitalStructureExecutiveAssessmentEngine.ts',
  'src/core/runtime/executive-consolidation/CapitalPreservationExecutiveAssessmentEngine.ts',
  'src/core/runtime/executive-consolidation/WorkingCapitalExecutiveAssessmentEngine.ts',
  'src/core/runtime/executive-consolidation/AssetQualityExecutiveAssessmentEngine.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Update interface if it's the main file
  if (file.includes('LiquidityExecutiveAssessmentEngine.ts')) {
    content = content.replace(
      /export interface ExecutiveAssessmentResult \{[\s\S]*?\}/,
      `export interface ExecutiveAssessmentResult {
  healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'INSUFFICIENT_DATA';
  score: number | null;
  primaryDriver: string;
  primaryDriverKpi?: string;
  executiveNarrative: string;
  justification?: string;
  managerialImplication?: string;
  priorityAction?: string;
  confidence?: 'Alta' | 'Média' | 'Baixa';
}`
    );
  }

  // Update const justification = narrative.justification;
  // Add const managerialImplication = narrative.managerialImplication ?? narrative.justification;
  // Add const priorityAction = narrative.priorityAction;
  if (!content.includes('const priorityAction = narrative.priorityAction;')) {
    content = content.replace(
      /const justification = narrative\.justification;/,
      `const justification = narrative.justification;
    const managerialImplication = narrative.managerialImplication ?? narrative.justification;
    const priorityAction = narrative.priorityAction;`
    );
  }

  // Add them to return {
  if (!content.includes('managerialImplication,')) {
    content = content.replace(
      /justification,(\s*)confidence:/,
      `justification,
      managerialImplication,
      priorityAction,$1confidence:`
    );
  }

  fs.writeFileSync(file, content);
}
