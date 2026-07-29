import { Identifier } from '@illumine/core-primitives';

export interface OrganizationalContext {
  readonly tenantId: Identifier;
  readonly companyName: string;
  readonly sector: string;
  readonly activeStrategy: string;
  readonly period: string;
}
