export interface ROICaseStudy {
  clientName: string;
  industry: string;
  initialEbitdaMarginPercentage: number;
  finalEbitdaMarginPercentage: number;
  annualEbitdaGainBrl: number;
  evidenceVerified: boolean;
}

export class ROIEvidenceRepository {
  public static getCaseStudies(): ROICaseStudy[] {
    return [
      {
        clientName: 'Grupo Indústria Alfa',
        industry: 'INDUSTRIAL',
        initialEbitdaMarginPercentage: 14.0,
        finalEbitdaMarginPercentage: 19.0,
        annualEbitdaGainBrl: 2400000,
        evidenceVerified: true
      }
    ];
  }
}
