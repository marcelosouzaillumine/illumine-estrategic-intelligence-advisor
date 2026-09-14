import { AdvisoryOrganizationContract } from '@illumine/executive-contracts';

export class WhiteLabelEngine {
  public static generateCustomBrandingStyle(org: AdvisoryOrganizationContract): { readonly primaryColor: string; readonly brandName: string } {
    return {
      primaryColor: org.branding.primaryColor,
      brandName: org.name
    };
  }
}
