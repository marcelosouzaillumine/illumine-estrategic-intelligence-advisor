export interface SaaSOrganizationContract {
  readonly organizationId: string;
  readonly name: string;
  readonly createdAt: string;
  readonly ownerUserId: string;
  readonly defaultTenantId: string;
  readonly subscriptionPlan: 'ENTERPRISE_PARTNER' | 'HOLDING_GROUP' | 'ADVISORY_PRO' | 'BUSINESS';
}
