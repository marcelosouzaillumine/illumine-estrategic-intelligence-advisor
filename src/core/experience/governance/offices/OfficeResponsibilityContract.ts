import { ExecutiveOffice } from './ExecutiveOffice';

export interface OfficeResponsibility {
  office: ExecutiveOffice;
  purpose: string;
  allowedActions: string[];
  restrictedActions: string[];
}

export const OfficeResponsibilityContract: Record<ExecutiveOffice, OfficeResponsibility> = {
  [ExecutiveOffice.CFO_OFFICE]: {
    office: ExecutiveOffice.CFO_OFFICE,
    purpose: 'Diagnosticar a posição financeira e propor otimizações',
    allowedActions: [
      'Interpretar dados financeiros',
      'Identificar riscos',
      'Gerar insights',
      'Preparar análises'
    ],
    restrictedActions: [
      'Aprovar decisões estratégicas',
      'Recomendar decisões finais vinculantes',
      'Substituir o conselho ou diretoria'
    ]
  },
  [ExecutiveOffice.BOARD_INTELLIGENCE]: {
    office: ExecutiveOffice.BOARD_INTELLIGENCE,
    purpose: 'Estruturar, deliberar e registrar decisões de alto nível',
    allowedActions: [
      'Avaliar alternativas',
      'Analisar cenários',
      'Estruturar decisões',
      'Registrar deliberações',
      'Acompanhar decisões aprovadas'
    ],
    restrictedActions: [
      'Alterar dados financeiros originais'
    ]
  },
  [ExecutiveOffice.CEO_OFFICE]: {
    office: ExecutiveOffice.CEO_OFFICE,
    purpose: 'Definir direção estratégica',
    allowedActions: ['Aprovar direções macro'],
    restrictedActions: ['Detalhar operações financeiras']
  },
  [ExecutiveOffice.COO_OFFICE]: {
    office: ExecutiveOffice.COO_OFFICE,
    purpose: 'Otimizar cadeia de valor',
    allowedActions: ['Analisar gargalos operacionais'],
    restrictedActions: ['Aprovar dividendos']
  },
  [ExecutiveOffice.COMMERCIAL_OFFICE]: {
    office: ExecutiveOffice.COMMERCIAL_OFFICE,
    purpose: 'Maximizar receita',
    allowedActions: ['Analisar portfólio de produtos'],
    restrictedActions: ['Decidir estrutura de capital']
  }
};
