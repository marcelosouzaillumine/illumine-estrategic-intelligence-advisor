export interface FoundingPartner {
  id: string;
  companyName: string;
  industry: 'MANUFACTURING' | 'HEALTHCARE' | 'FAMILY_BUSINESS' | 'SERVICES';
  onboardingStatus: 'DAY_1_DATA_CAPTURE' | 'DAY_2_TWIN_GEN' | 'DAY_3_BOARD_REPORT';
  enrolledAt: string;
}

export class FoundingPartnersProgram {
  private partners: FoundingPartner[] = [];

  public enrollPartner(companyName: string, industry: FoundingPartner['industry']): FoundingPartner {
    if (this.partners.length >= 10) {
      throw new Error('Programa Founding Enterprise Partners atingiu o limite de 10 clientes piloto.');
    }

    const partner: FoundingPartner = {
      id: `fp-${Math.random().toString(36).substring(2, 9)}`,
      companyName,
      industry,
      onboardingStatus: 'DAY_1_DATA_CAPTURE',
      enrolledAt: new Date().toISOString()
    };

    this.partners.push(partner);
    return partner;
  }

  public listPartners(): FoundingPartner[] {
    return this.partners;
  }
}

export const foundingPartnersProgram = new FoundingPartnersProgram();
