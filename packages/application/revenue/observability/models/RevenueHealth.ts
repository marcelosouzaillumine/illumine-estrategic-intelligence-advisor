export interface RevenueHealth {
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  activeIncidents: number;
  lastCalculatedAt: string;
  components: {
    contractEngine: 'HEALTHY' | 'DEGRADED';
    subscriptionEngine: 'HEALTHY' | 'DEGRADED';
    billingEngine: 'HEALTHY' | 'DEGRADED';
    licensingEngine: 'HEALTHY' | 'DEGRADED';
    entitlementEngine: 'HEALTHY' | 'DEGRADED';
    provisioningEngine: 'HEALTHY' | 'DEGRADED';
    processManager: 'HEALTHY' | 'DEGRADED';
  };
}
