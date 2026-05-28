// src/core/runtime/ExecutiveNarrativeOrchestrator.ts
import { InstitutionalFinancialThesisProfile } from './InstitutionalFinancialThesisEngine';

export interface OrchestratedNarrative {
  thesisNarrative: string;
  executiveSummary: string;
  riskBriefing: string;
}

export function orchestrateNarrative(
  thesisProfile: InstitutionalFinancialThesisProfile,
  dfcNarrative: string,
  dlpaNarrative: string
): OrchestratedNarrative {
  
  if (!thesisProfile.isAvailable) {
    return {
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
    thesis = 'O modelo de capital apresenta gargalos estruturais relevantes que limitam a sustentabilidade de longo prazo.';
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

  return {
    thesisNarrative: thesis,
    executiveSummary: executiveSummary.trim(),
    riskBriefing
  };
}
