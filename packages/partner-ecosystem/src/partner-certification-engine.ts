export interface CertifiedPartner {
  partnerId: string;
  partnerName: string;
  partnerType: 'ADVISOR' | 'INDUSTRY_SPECIALIST' | 'TECHNOLOGY' | 'IMPLEMENTATION';
  certificationScore: number;
  certifiedStatus: 'ACTIVE_CERTIFIED' | 'PENDING_REVIEW';
}

export class PartnerCertificationEngine {
  private partners = new Map<string, CertifiedPartner>();

  public certifyPartner(partner: CertifiedPartner): void {
    this.partners.set(partner.partnerId, partner);
  }

  public getPartner(partnerId: string): CertifiedPartner | undefined {
    return this.partners.get(partnerId);
  }
}

export const partnerCertificationEngine = new PartnerCertificationEngine();
