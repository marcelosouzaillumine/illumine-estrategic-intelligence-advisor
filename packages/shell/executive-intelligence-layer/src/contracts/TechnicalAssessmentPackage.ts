import { TechnicalAssessment } from './TechnicalAssessment';

/**
 * Contêiner que agrega todos os Assessments especialistas produzidos.
 * Nenhuma decisão institucional existe neste nível.
 */
export interface TechnicalAssessmentPackage {
  sessionId: string;
  generatedAt: Date;
  
  // Assessments Individuais (Podem estar nulos se não houver dados)
  financialAssessment?: TechnicalAssessment; // BP
  economicAssessment?: TechnicalAssessment;  // DRE
  cashAssessment?: TechnicalAssessment;      // DFC
  commercialAssessment?: TechnicalAssessment;
  operationalAssessment?: TechnicalAssessment;
  riskAssessment?: TechnicalAssessment;
  peopleAssessment?: TechnicalAssessment;
  innovationAssessment?: TechnicalAssessment;
  missionAssessment?: TechnicalAssessment;
  governanceAssessment?: TechnicalAssessment;
  
  // Metadados do pacote
  overallDataIntegrity: number;
  missingDomains: string[];
}
