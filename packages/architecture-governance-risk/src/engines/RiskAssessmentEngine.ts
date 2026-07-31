import { RiskContext, ArchitectureRiskAssessment, RiskSignal, ExposureLevel, RiskFactor } from '../models/index';
import { RiskPolicyCatalog } from '../policies/RiskPolicyCatalog';
import { DependencyExposureAnalyzer, BoundaryExposureAnalyzer, EvolutionVolatilityAnalyzer, CertificationExposureAnalyzer } from '../analyzers/index';

export class RiskAssessmentEngine {
  private catalog = new RiskPolicyCatalog();
  private analyzers = [
    new DependencyExposureAnalyzer(this.catalog),
    new BoundaryExposureAnalyzer(this.catalog),
    new EvolutionVolatilityAnalyzer(this.catalog),
    new CertificationExposureAnalyzer(this.catalog)
  ];

  generateAssessment(context: RiskContext): ArchitectureRiskAssessment {
    const signals: RiskSignal[] = [];
    
    // Coleta determinística
    for (const analyzer of this.analyzers) {
      signals.push(...analyzer.analyze(context));
    }

    // Cálculo da exposição
    let totalMagnitude = 0;
    const factors: RiskFactor[] = [];
    
    for (const sig of signals) {
      totalMagnitude += sig.magnitude;
      const rule = this.catalog.getRuleForSignal(sig.category === 'DEPENDENCY' ? 'DEPENDENCY_EXPANSION' : 
                                                 sig.category === 'BOUNDARY' ? 'BOUNDARY_EXPANSION' : 
                                                 sig.category === 'EVOLUTION' ? 'EVOLUTION_ACCELERATION' : 'CERTIFICATION_DECAY');
      if (rule) {
        factors.push({
          id: `FCT-${sig.id}`,
          name: rule.name,
          description: `Exposure driven by ${sig.category} architecture signal`,
          magnitude: sig.magnitude
        });
      }
    }

    let exposureLevel: ExposureLevel = 'LOW';
    if (totalMagnitude > 7) exposureLevel = 'CRITICAL';
    else if (totalMagnitude > 4) exposureLevel = 'HIGH';
    else if (totalMagnitude > 2) exposureLevel = 'MODERATE';

    return {
      id: `ASSESS-${Date.now()}`,
      subject: context.targetSubject,
      exposureLevel,
      factors,
      evidence: signals.flatMap(s => s.evidence),
      policyVersion: this.catalog.version,
      generatedAt: new Date().toISOString()
    };
  }
}
