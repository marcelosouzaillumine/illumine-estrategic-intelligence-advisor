import { ExecutiveOffice } from '../../navigation/types';

export const CEO_OFFICE: ExecutiveOffice = {
  id: 'ceo-office',
  nameKey: 'product.offices.ceo.name',
  descriptionKey: 'product.offices.ceo.description',
  availability: 'active'
};

export const CFO_OFFICE: ExecutiveOffice = {
  id: 'cfo-office',
  nameKey: 'product.offices.cfo.name',
  descriptionKey: 'product.offices.cfo.description',
  availability: 'active'
};

export const COO_OFFICE: ExecutiveOffice = {
  id: 'coo-office',
  nameKey: 'product.offices.coo.name',
  descriptionKey: 'product.offices.coo.description',
  availability: 'foundation'
};

export const CCO_OFFICE: ExecutiveOffice = {
  id: 'cco-office',
  nameKey: 'product.offices.cco.name',
  descriptionKey: 'product.offices.cco.description',
  availability: 'foundation'
};

export const CHRO_OFFICE: ExecutiveOffice = {
  id: 'chro-office',
  nameKey: 'product.offices.chro.name',
  descriptionKey: 'product.offices.chro.description',
  availability: 'future'
};

export const RISK_OFFICE: ExecutiveOffice = {
  id: 'risk-office',
  nameKey: 'product.offices.risk.name',
  descriptionKey: 'product.offices.risk.description',
  availability: 'future'
};

export const INNOVATION_OFFICE: ExecutiveOffice = {
  id: 'innovation-office',
  nameKey: 'product.offices.innovation.name',
  descriptionKey: 'product.offices.innovation.description',
  availability: 'future'
};

export const BOARD_OFFICE: ExecutiveOffice = {
  id: 'board-office',
  nameKey: 'product.offices.board.name',
  descriptionKey: 'product.offices.board.description',
  availability: 'future'
};

export const ADVISOR_OFFICE: ExecutiveOffice = {
  id: 'advisor-office',
  nameKey: 'product.offices.advisor.name',
  descriptionKey: 'product.offices.advisor.description',
  availability: 'active'
};

export const INTELLIGENCE_OFFICE: ExecutiveOffice = {
  id: 'governance-office',
  nameKey: 'product.offices.governance.name',
  descriptionKey: 'product.offices.governance.description',
  availability: 'foundation'
};

export const EXECUTIVE_OFFICE_REGISTRY: ExecutiveOffice[] = [
  CEO_OFFICE,
  CFO_OFFICE,
  COO_OFFICE,
  CCO_OFFICE,
  CHRO_OFFICE,
  RISK_OFFICE,
  INNOVATION_OFFICE,
  BOARD_OFFICE,
  ADVISOR_OFFICE,
  INTELLIGENCE_OFFICE
];
