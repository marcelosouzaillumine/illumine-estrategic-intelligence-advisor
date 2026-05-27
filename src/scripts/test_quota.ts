import { TenantLicensingEngine } from '../core/commercial/TenantLicensingEngine';

try {
  console.log('Testing quota for basic with usage 5...');
  TenantLicensingEngine.checkQuota('tenant-a', 'basic', 'simulationQuotas', 5);
  console.log('No exception thrown for basic with 5!');
} catch (e: any) {
  console.log('Threw exception:', e.message, 'decisionCode:', e.decisionCode);
}

try {
  console.log('Testing quota for basic with usage 9999...');
  TenantLicensingEngine.checkQuota('tenant-a', 'basic', 'simulationQuotas', 9999);
  console.log('No exception thrown for basic with 9999!');
} catch (e: any) {
  console.log('Threw exception:', e.message, 'decisionCode:', e.decisionCode);
}
