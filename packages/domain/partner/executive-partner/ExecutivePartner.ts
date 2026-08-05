import { Partner } from '../models/Partner';
import { PartnerType } from '../enums/PartnerEnums';
import { PartnershipAgreement } from './PartnershipAgreement';

/**
 * Representa um parceiro institucional (escala exponencial / ecossistema).
 */
export interface ExecutivePartner extends Partner {
  type: PartnerType.EXECUTIVE_PARTNER;
  
  // Específico para Executive Partner
  organizationName: string;
  agreements: PartnershipAgreement[];
}
