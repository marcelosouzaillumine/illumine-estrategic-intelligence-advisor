import { AggregateRoot, Identifier } from '../../shared';
import { PartnerId, CommissionProfileReference } from '../value-objects/PartnerReference';
import { PartnerType, PartnerStatus, PartnerTier, PartnerCapability } from '../enums/PartnerEnums';

export interface Partner extends AggregateRoot<PartnerId> {
  type: PartnerType;
  status: PartnerStatus;
  tier: PartnerTier;
  capabilities: PartnerCapability[];
  identityReference: Identifier; // Refers to the physical identity/user of the partner
  commissionProfileId?: CommissionProfileReference; // Linked but decoupled from Commission domain
}
