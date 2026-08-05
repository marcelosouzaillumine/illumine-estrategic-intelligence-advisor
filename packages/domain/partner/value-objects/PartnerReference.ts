import { Identifier } from '../../shared';

export type PartnerId = Identifier;
export type CommissionProfileReference = Identifier;

export interface PartnerReference {
  partnerId: PartnerId;
  name: string;
}
