export interface OrganizationQueryOptions {
  tenantId: string;
  businessUnitId?: string;
}

export interface OrganizationRepository {
  getOrganizationDetails(options: OrganizationQueryOptions): Promise<any>;
  saveOrganizationDetails(tenantId: string, data: any): Promise<void>;
}
