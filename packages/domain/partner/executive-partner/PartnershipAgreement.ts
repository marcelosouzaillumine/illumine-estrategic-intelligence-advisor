import { Identifier } from '../../../shared';

export interface PartnershipAgreement {
  agreementId: Identifier;
  revenueSharePercentage: number;
  territory?: string;
  exclusivity: boolean;
  coSellingRules: string[];
  validFrom: string;
  validTo?: string;
}
