export type AdvisorInsightSource = 
  | 'DIGITAL_TWIN' 
  | 'INVESTIGATION' 
  | 'TIME_MACHINE' 
  | 'BOARD_PACK' 
  | 'ESGIM' 
  | 'SCENARIO';

export interface AdvisorInsightReference {
  referenceId: string;
  source: AdvisorInsightSource;
  
  organizationId: string;
  
  // IDs específicos do ecossistema
  sourceEntityId: string; 
  
  title: string;
  summary?: string;
  
  createdAt: string;
}
