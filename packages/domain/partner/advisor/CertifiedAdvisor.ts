import { Partner } from '../models/Partner';
import { PartnerType } from '../enums/PartnerEnums';
import { Certification } from './Certification';

/**
 * Representa um Certified Advisor (escala linear de Advisory).
 * Herda as propriedades base de Partner.
 */
export interface CertifiedAdvisor extends Partner {
  type: PartnerType.CERTIFIED_ADVISOR;
  
  // Específico para Advisor
  certifications: Certification[];
  specializations: string[]; // e.g. "Finanças", "Governança"
}
