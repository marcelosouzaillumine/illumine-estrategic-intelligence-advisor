// src/core/runtime/ExecutiveNarrativeOrchestrator.ts
import { InstitutionalFinancialThesisProfile } from './InstitutionalFinancialThesisEngine';
import { GlobalFiduciaryDistributionEnforcementEngine } from '../../capabilities/runtime/governance/fiduciary-enforcement/GlobalFiduciaryDistributionEnforcementEngine';
import { SurvivalConstraintPropagationEngine } from '../../capabilities/runtime/institutional-survival/SurvivalConstraintPropagationEngine';

export interface OrchestratedNarrative {
  title: string;
  leadParagraph: string;
  causalFlowSummary: string;
  thesisNarrative?: string;
  executiveSummary?: string;
  riskBriefing?: string;
}

export function orchestrateNarrative(
  thesisProfile: InstitutionalFinancialThesisProfile,
  dfcNarrative: string,
  dlpaNarrative: string,
  enforcementTriggered?: boolean,
  survivalActive?: boolean
): OrchestratedNarrative {
  
  if (!thesisProfile.isAvailable) {
    return {
      title: 'Perfil institucional indisponível',
      leadParagraph: 'A tese institucional não pode ser formulada devido à insuficiência de dados primários.',
      causalFlowSummary: 'Perfil institucional indisponível.',
      thesisNarrative: 'A tese institucional não pode ser formulada devido à insuficiência de dados primários.',
      executiveSummary: 'Perfil institucional indisponível.',
      riskBriefing: 'Avaliação de risco suspensa por ausência fiduciária.'
    };
  }

  // Thesis Narrative construction
  let thesis = '';
  if (thesisProfile.consolidatedSeverity === 'CRÍTICA') {
    thesis = 'A operação enfrenta severas pressões estruturais que ameaçam sua continuidade ou capacidade de geração orgânica de valor.';
  } else if (thesisProfile.consolidatedSeverity === 'ALTA') {
    thesis = 'O modelo de capital apresenta gargalos estruturais relevantes que limitam a sustentabilidade de longo horizonte.';
  } else if (thesisProfile.consolidatedSeverity === 'MODERADA') {
    thesis = 'A estrutura financeira é funcional, porém existem ineficiências em pontos críticos do ciclo institucional.';
  } else {
    thesis = 'A operação demonstra sólido alinhamento entre rentabilidade, liquidez e preservação patrimonial.';
  }

  // Executive Summary (Combining the contextual narratives from DFC and DLPA)
  let executiveSummary = `Visão Integrada do Capital:\n`;
  if (thesisProfile.components.hasDFC) executiveSummary += `- Dinâmica de Caixa: ${dfcNarrative}\n`;
  if (thesisProfile.components.hasDLPA) executiveSummary += `- Governança de Capital: ${dlpaNarrative}\n`;

  // Risk Briefing
  let riskBriefing = '';
  if (thesisProfile.structuralRisks.length > 0) {
    riskBriefing = 'Riscos Estruturais Ativos: ' + thesisProfile.structuralRisks.map(r => r.id.replace(/_/g, ' ')).join(', ') + '.';
  } else {
    riskBriefing = 'Ausência de riscos estruturais críticos detectados no escopo validado.';
  }

  const trigger = !!enforcementTriggered;
  const isSurvival = !!survivalActive || (thesisProfile.consolidatedSeverity === 'CRÍTICA' && trigger);

  let leadParagraphSan = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(thesis, trigger);
  leadParagraphSan = SurvivalConstraintPropagationEngine.sanitizeNarrative(leadParagraphSan, isSurvival);

  let causalFlowSummarySan = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(executiveSummary.trim(), trigger);
  causalFlowSummarySan = SurvivalConstraintPropagationEngine.sanitizeNarrative(causalFlowSummarySan, isSurvival);

  let riskBriefingSan = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(riskBriefing, trigger);
  riskBriefingSan = SurvivalConstraintPropagationEngine.sanitizeNarrative(riskBriefingSan, isSurvival);

  return {
    title: 'Análise de Narrativa Orquestrada',
    leadParagraph: leadParagraphSan,
    causalFlowSummary: causalFlowSummarySan,
    thesisNarrative: leadParagraphSan,
    executiveSummary: causalFlowSummarySan,
    riskBriefing: riskBriefingSan
  };
}

export class ExecutiveNarrativeOrchestrator {
  public static orchestrate(
    report: any,
    thesisText: string,
    tensions: string[],
    dfcNarrative: string,
    dlpaNarrative: string
  ): OrchestratedNarrative {
    const segment = report.context?.segment || 'Geral';

    let title = `Tese de Governança de Capital — Setor: ${segment}`;
    let leadParagraph = thesisText || 'Tese sob análise estrutural.';
    let causalFlowSummary = '';

    if (dfcNarrative) causalFlowSummary += `Dinâmica de Caixa: ${dfcNarrative} `;
    if (dlpaNarrative) causalFlowSummary += `Governança de Capital: ${dlpaNarrative}`;

    // Evaluate enforcement status using report's capitalGovernanceReport
    const fiduciaryOutput = report.capitalGovernanceReport?.fiduciaryOutput;
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fiduciaryOutput);
    const trigger = enforcement.enforcementTriggered;
    const isSurvivalMode = report.survivalReport?.activeSurvivalMode === 'SURVIVAL_MODE';

    let leadParagraphSan = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(leadParagraph, trigger);
    leadParagraphSan = SurvivalConstraintPropagationEngine.sanitizeNarrative(leadParagraphSan, isSurvivalMode);

    let causalFlowSummarySan = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(causalFlowSummary.trim(), trigger);
    causalFlowSummarySan = SurvivalConstraintPropagationEngine.sanitizeNarrative(causalFlowSummarySan, isSurvivalMode);

    let riskBriefingSan = tensions.map(t => GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(t, trigger))
      .map(t => SurvivalConstraintPropagationEngine.sanitizeNarrative(t, isSurvivalMode))
      .join(', ');

    // IRRE Narrative Sanitization
    const recoveryReport = report.recoveryReport;
    const isEarlyRecovery = recoveryReport && recoveryReport.activeRecoveryStage && recoveryReport.activeRecoveryStage !== 'FULL_REAUTHORIZATION';
    
    if (isEarlyRecovery) {
      const sanitizeRecovery = (text: string) => {
        let san = text;
        san = san.replace(/empresa plenamente recuperada/gi, 'recuperação em consolidação');
        san = san.replace(/crescimento acelerado/gi, 'estabilização prioritária');
        san = san.replace(/expansão agressiva/gi, 'expansão restrita e seletiva');
        san = san.replace(/retomada total/gi, 'retomada progressiva monitorada');
        san = san.replace(/excesso de liquidez/gi, 'recomposição de reservas táticas');
        return san;
      };

      leadParagraphSan = sanitizeRecovery(leadParagraphSan);
      causalFlowSummarySan = sanitizeRecovery(causalFlowSummarySan);
      riskBriefingSan = sanitizeRecovery(riskBriefingSan);
    }

    // RRG Narrative Sanitization
    const regressionReport = recoveryReport?.regressionReport;
    if (regressionReport?.regressionDetected) {
      const sanitizeRegression = (text: string) => {
        let san = text;
        san = san.replace(/recuperação consolidada/gi, 'recuperação fragilizada');
        san = san.replace(/crescimento sustentável/gi, 'crescimento sob risco de recaída');
        san = san.replace(/estabilidade restaurada/gi, 'instabilidade institucional detectada');
        san = san.replace(/fase de expansão/gi, 'fase de contenção fiduciária');
        return san;
      };

      leadParagraphSan = sanitizeRegression(leadParagraphSan);
      causalFlowSummarySan = sanitizeRegression(causalFlowSummarySan);
      riskBriefingSan = sanitizeRegression(riskBriefingSan);
      
      causalFlowSummarySan += `\n[ALERTA RRG]: ${regressionReport.recoveryNarrativeAdjustment}`;
    }

    // IRAE Narrative Sanitization
    const resilienceReport = recoveryReport?.resilienceReport;
    if (resilienceReport) {
      const resilience = resilienceReport.resilienceClassification;
      
      const sanitizeResilience = (text: string) => {
        let san = text;
        if (resilience === 'INSTITUTIONALLY_FRAGILE') {
          san = san.replace(/resiliência( estrutural)?/gi, 'fragilidade estrutural persistente');
          san = san.replace(/estabilidade( consolidada)?/gi, 'estabilidade precária');
          san = san.replace(/antifragilidade/gi, 'vulnerabilidade');
        } else if (resilience === 'ANTIFRAGILE') {
          // If antifragile, enhance descriptions of recovery to include structural maturity
          san = san.replace(/recuperação( em consolidação)?/gi, 'recuperação evoluída em antifragilidade institucional');
          san = san.replace(/resiliência( estrutural)?/gi, 'resiliência estrutural plena e madura');
        }
        return san;
      };

      leadParagraphSan = sanitizeResilience(leadParagraphSan);
      causalFlowSummarySan = sanitizeResilience(causalFlowSummarySan);
      riskBriefingSan = sanitizeResilience(riskBriefingSan);
    }

    return {
      title,
      leadParagraph: leadParagraphSan,
      causalFlowSummary: causalFlowSummarySan,
      thesisNarrative: leadParagraphSan,
      executiveSummary: causalFlowSummarySan,
      riskBriefing: riskBriefingSan
    };
  }
}
