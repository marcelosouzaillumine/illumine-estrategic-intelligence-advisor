import { ConsolidatedFinancialOutput, ConsolidationEntity } from '../types';
import { ConsolidatedExecutiveAdvisoryReport } from './advisoryTypes';
import { HoldingStructureInterpreter } from './HoldingStructureInterpreter';
import { IntercompanyDependencyAnalyzer } from './IntercompanyDependencyAnalyzer';
import { CrossEntityCausalityEngine } from './CrossEntityCausalityEngine';
import { GroupRiskPropagationEngine } from './GroupRiskPropagationEngine';
import { ConsolidatedConfidenceResolver } from './ConsolidatedConfidenceResolver';
import { ConsolidatedNarrativeEngine } from './ConsolidatedNarrativeEngine';

export class ConsolidatedAdvisoryOrchestrator {
  static run(
    financialOutput: ConsolidatedFinancialOutput, 
    entities: ConsolidationEntity[]
  ): ConsolidatedExecutiveAdvisoryReport {
    // 1 & 2. Receber e validar confidence herdada
    const baseConfidence = financialOutput.confidence;
    const baseViolations = financialOutput.violations;

    if (baseViolations.some(v => v.severity === 'CRITICAL')) {
      // Bloqueio imediato. Advisory não pode rodar sobre dados financeiramente corrompidos.
      return this.generateBlockedReport(financialOutput, 'Dados financeiros rejeitados por falha de integridade intercompany.');
    }

    // 3. Executar HoldingStructureInterpreter
    const structuralRoles = HoldingStructureInterpreter.analyze(entities, financialOutput);

    // 4. Executar IntercompanyDependencyAnalyzer
    const dependencies = IntercompanyDependencyAnalyzer.analyze(financialOutput);

    // 5. Executar CrossEntityCausalityEngine
    const causalities = CrossEntityCausalityEngine.analyze(financialOutput, dependencies, structuralRoles);

    // 6. Executar GroupRiskPropagationEngine
    const systemicRisks = GroupRiskPropagationEngine.analyze(financialOutput, dependencies, causalities);

    // 7. Executar ConsolidatedConfidenceResolver final
    const finalConfidence = ConsolidatedConfidenceResolver.recalibrate(baseConfidence, causalities, systemicRisks);

    // 8. Executar ConsolidatedNarrativeEngine
    const narrative = ConsolidatedNarrativeEngine.generate(causalities, systemicRisks, structuralRoles);

    // 9 & 10. Montar Report e Validar Bloqueios de Active Governance
    const strategicAlerts = systemicRisks.map(r => r.description).concat(causalities.map(c => c.description));

    // Se a confiança final for LOW por risco estrutural sistêmico, emitimos advisory de crise.
    const report: ConsolidatedExecutiveAdvisoryReport = {
      groupId: financialOutput.groupId,
      baseConfidence,
      finalConfidence,
      structuralRoles,
      dependencies,
      causalities,
      systemicRisks,
      narrative,
      strategicAlerts,
      violations: baseViolations
    };

    return report;
  }

  private static generateBlockedReport(financialOutput: ConsolidatedFinancialOutput, reason: string): ConsolidatedExecutiveAdvisoryReport {
    return {
      groupId: financialOutput.groupId,
      baseConfidence: financialOutput.confidence,
      finalConfidence: 'LOW',
      structuralRoles: [],
      dependencies: [],
      causalities: [],
      systemicRisks: [],
      narrative: `BLOCKED: O motor de aconselhamento executivo recusou a inferência. Razão: ${reason}`,
      strategicAlerts: [reason],
      violations: financialOutput.violations
    };
  }
}
