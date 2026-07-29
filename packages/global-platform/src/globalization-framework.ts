export type SupportedRegion = 'BR' | 'LATAM' | 'US' | 'EU';

export interface RegionConfig {
  region: SupportedRegion;
  defaultCurrency: 'BRL' | 'USD' | 'EUR';
  locale: string;
  complianceRules: string[];
}

export class GlobalizationFramework {
  public static getRegionConfig(region: SupportedRegion): RegionConfig {
    const configs: Record<SupportedRegion, RegionConfig> = {
      BR: { region: 'BR', defaultCurrency: 'BRL', locale: 'pt-BR', complianceRules: ['LGPD', 'BACEN'] },
      LATAM: { region: 'LATAM', defaultCurrency: 'USD', locale: 'es-MX', complianceRules: ['LOCAL_TAX'] },
      US: { region: 'US', defaultCurrency: 'USD', locale: 'en-US', complianceRules: ['SOC2', 'SEC'] },
      EU: { region: 'EU', defaultCurrency: 'EUR', locale: 'en-GB', complianceRules: ['GDPR', 'ISO27001'] }
    };

    return configs[region];
  }
}
