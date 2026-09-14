// src/core/runtime/observability/InstitutionalExplainabilityEngine.ts
import { InstitutionalFinancialThesisProfile } from '../../../core/runtime/InstitutionalFinancialThesisEngine';
import { CausalityPropagationLink } from '../../../core/runtime/CrossStatementCausalityEngine';

export interface ExplainabilityLayer {
  title: string;
  description: string;
  items: {
    label: string;
    value: string;
    severity?: string;
  }[];
}

export interface FiduciaryRationale {
  executiveSummary: ExplainabilityLayer;
  structuralDrivers: ExplainabilityLayer;
  mathematicalEvidence: ExplainabilityLayer;
  confidenceDecomposition: {
    baseConfidence: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
    sustainmentFactors: string[];
    degradationFactors: string[];
  };
}

export function generateFiduciaryRationale(
  profile: InstitutionalFinancialThesisProfile,
  tensions: CausalityPropagationLink[],
  confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE',
  isCompletelyEmpty: boolean
): FiduciaryRationale {

  // 1. Executive Summary
  const executiveSummary: ExplainabilityLayer = {
    title: 'Executive Summary',
    description: 'Síntese institucional e severidade estrutural consolidada.',
    items: [
      { label: 'Status da Tese', value: profile.isAvailable ? 'Operante' : 'Indisponível' },
      { label: 'Severidade Consolidada', value: profile.consolidatedSeverity, severity: profile.consolidatedSeverity }
    ]
  };

  // 2. Structural Drivers
  const driverItems = [];
  profile.structuralRisks.forEach(risk => {
    driverItems.push({
      label: `Risco: ${risk.component}`,
      value: risk.id.replace(/_/g, ' '),
      severity: risk.severity
    });
  });
  tensions.forEach(tension => {
    driverItems.push({
      label: `Tensão: ${tension.propagationDirection}`,
      value: tension.mechanism,
      severity: tension.severity
    });
  });

  const structuralDrivers: ExplainabilityLayer = {
    title: 'Structural Drivers',
    description: 'Vetores primários que forçaram a interpretação institucional.',
    items: driverItems.length > 0 ? driverItems : [{ label: 'Drivers Estruturais', value: 'Nenhum risco ou tensão material identificado.' }]
  };

  // 3. Mathematical Evidence (Gatilhos)
  // To keep it clean, we extract the core triggers
  const evidenceItems = [];
  tensions.forEach(tension => {
    evidenceItems.push({ label: `Gatilho (${tension.source})`, value: tension.evidence });
  });
  profile.pressures.forEach(press => {
    evidenceItems.push({ label: `Gatilho (${press.component})`, value: press.id.replace(/_/g, ' ') });
  });

  const mathematicalEvidence: ExplainabilityLayer = {
    title: 'Mathematical Evidence',
    description: 'Evidência fiduciária e limites matemáticos disparados no runtime.',
    items: evidenceItems.length > 0 ? evidenceItems : [{ label: 'Evidência', value: 'Operação dentro das faixas de normalidade.' }]
  };

  // 4. Confidence Decomposition
  const sustainmentFactors = [];
  const degradationFactors = [];

  if (isCompletelyEmpty) {
    degradationFactors.push('Ciclo institucional vazio. Faltam DRE, BP e DFC.');
  } else {
    sustainmentFactors.push('Ciclo institucional com demonstrações validadas.');
    if (confidenceLevel === 'LOW_CONFIDENCE') {
      degradationFactors.push('Inconsistências detectadas em reconciliação ou falta de peças contábeis.');
    } else if (confidenceLevel === 'MEDIUM_CONFIDENCE') {
      degradationFactors.push('Falta DFC ou DLPA para validação completa.');
    } else {
      sustainmentFactors.push('Todas as peças contábeis (DRE, BP, DFC) reconciliadas.');
    }
  }

  return {
    executiveSummary,
    structuralDrivers,
    mathematicalEvidence,
    confidenceDecomposition: {
      baseConfidence: confidenceLevel,
      sustainmentFactors,
      degradationFactors
    }
  };
}
