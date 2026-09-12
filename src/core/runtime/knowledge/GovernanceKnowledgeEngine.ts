// src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts

import { 
  PrincipleMatch, 
  GovernanceKnowledgeResult, 
  ESGIMScenario 
} from '../../../capabilities/runtime/esgim/esgimTypes';
import { InstitutionalWisdomLibrary, IWLPrinciple } from './InstitutionalWisdomLibrary';
import { esgimAssessmentEngine } from '../../../capabilities/runtime/esgim/ESGIMAssessmentEngine';
import { decisionRegistryEngine } from '../../../capabilities/runtime/execution/DecisionRegistryEngine';

export type PAIMaturityLevel = 'EXCELLENT' | 'MATURE' | 'DEVELOPING' | 'CONCERN' | 'CRITICAL';

export class GovernanceKnowledgeEngine {
  private static instance: GovernanceKnowledgeEngine;

  public static getInstance(): GovernanceKnowledgeEngine {
    if (!GovernanceKnowledgeEngine.instance) {
      GovernanceKnowledgeEngine.instance = new GovernanceKnowledgeEngine();
    }
    return GovernanceKnowledgeEngine.instance;
  }

  /**
   * Calculates the Principle Adherence Index (PAI™) (0-100) and its maturity level.
   */
  public calculatePAI(clientId: string, scenario: ESGIMScenario): { score: number; level: PAIMaturityLevel } {
    // 1. Fetch GDTL execution index and ESGIM assessments
    const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);
    const esgim = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCENARIO', scenario);
    
    // Base formula: 60% GDTL execution (decisions made) + 40% ESGIM overall baseline
    const baseScore = Math.round((geiWeighted * 0.6) + (esgim.overallScore * 0.4));
    
    // 2. Apply scenario-specific caps (Governance Knowledge overrides)
    let score = baseScore;
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      score = Math.min(score, 34); // Capped at 34 (CRITICAL) due to ethical/constitutional violations
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      score = Math.min(score, 48); // Capped at 48 (CONCERN) due to severe runway/stewardship stress
    } else if (scenario === 'MISSION_STRESS') {
      score = Math.min(score, 55); // Capped at 55 (DEVELOPING) due to purpose dilution
    }

    // 3. Map PAI to ranges
    let level: PAIMaturityLevel = 'CRITICAL';
    if (score >= 90) {
      level = 'EXCELLENT';
    } else if (score >= 75) {
      level = 'MATURE';
    } else if (score >= 50) {
      level = 'DEVELOPING';
    } else if (score >= 35) {
      level = 'CONCERN';
    } else {
      level = 'CRITICAL';
    }

    return { score, level };
  }

  /**
   * Automatically matches a text finding with principles from the IWL library.
   */
  public matchFinding(
    sourceId: string,
    sourceType: "ESGIM" | "IRI" | "BPE" | "GRE" | "GDTL" | "BMM",
    content: string
  ): GovernanceKnowledgeResult {
    const matchedPrinciples: IWLPrinciple[] = [];
    const textLower = content.toLowerCase();

    // Matching logic based on key terms
    const allPrinciples = InstitutionalWisdomLibrary.getAllPrinciples();

    allPrinciples.forEach(principle => {
      let isMatch = false;

      // Map keywords per principle ID
      if (principle.principleId === 'IWL-ETH-01' && (textLower.includes('ética') || textLower.includes('compliance') || textLower.includes('integridade') || textLower.includes('conduta'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-GOV-02' && (textLower.includes('alçada') || textLower.includes('limite') || textLower.includes('aprovac') || textLower.includes('regimento') || textLower.includes('estatuto'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-GOV-01' && (textLower.includes('transparen') || textLower.includes('contas') || textLower.includes('auditar') || textLower.includes('auditoria') || textLower.includes('accountability'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-BIB-01' && (textLower.includes('caixa') || textLower.includes('aporte') || textLower.includes('liquidez') || textLower.includes('financeiro') || textLower.includes('reserva') || textLower.includes('recurso'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-INS-01' && (textLower.includes('sucessao') || textLower.includes('sucessório') || textLower.includes('legado') || textLower.includes('perenidade') || textLower.includes('familiar') || textLower.includes('herança'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-LEA-01' && (textLower.includes('liderança') || textLower.includes('servidor') || textLower.includes('mentoria') || textLower.includes('treinamento') || textLower.includes('capacita'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-STR-01' && (textLower.includes('tecnologia') || textLower.includes('digital') || textLower.includes('inovação') || textLower.includes('disrup') || textLower.includes('obsolesc') || textLower.includes('concorrente'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-BAM-01' && (textLower.includes('missão') || textLower.includes('propósito') || textLower.includes('social') || textLower.includes('valores') || textLower.includes('impacto'))) {
        isMatch = true;
      }
      if (principle.principleId === 'IWL-BIB-02' && (textLower.includes('cuidado') || textLower.includes('burnout') || textLower.includes('remunera') || textLower.includes('justo') || textLower.includes('pessoas'))) {
        isMatch = true;
      }

      if (isMatch) {
        matchedPrinciples.push(principle);
      }
    });

    // Fallbacks if no match found
    if (matchedPrinciples.length === 0) {
      if (sourceType === 'ESGIM' || sourceType === 'IRI') {
        matchedPrinciples.push(InstitutionalWisdomLibrary.getPrinciple('IWL-ESG-01')!);
      } else if (sourceType === 'BPE' || sourceType === 'GRE') {
        matchedPrinciples.push(InstitutionalWisdomLibrary.getPrinciple('IWL-GOV-02')!);
      } else {
        matchedPrinciples.push(InstitutionalWisdomLibrary.getPrinciple('IWL-GOV-01')!);
      }
    }

    // Map to PrincipleMatch structures
    const principleMatches: PrincipleMatch[] = matchedPrinciples.map(p => {
      let explanation = `O princípio de ${p.title} justifica este item pois fundamenta as obrigações constitucionais de conformidade fiduciária.`;
      if (p.principleId === 'IWL-BIB-01') {
        explanation = 'A Mordomia Fiduciária sustenta a necessidade de prudência na gestão do caixa e reservas financeiras.';
      } else if (p.principleId === 'IWL-ETH-01') {
        explanation = 'A Integridade Incondicional exige o cumprimento irrefutável de normas éticas e limites estatutários.';
      } else if (p.principleId === 'IWL-GOV-02') {
        explanation = 'A Segregação de Alçadas garante que nenhuma decisão extraordinária ocorra sem dupla assinatura e chancela colegiada.';
      } else if (p.principleId === 'IWL-INS-01') {
        explanation = 'A Preservação de Legado fundamenta o planejamento sucessório preventivo das lideranças chave.';
      } else if (p.principleId === 'IWL-STR-01') {
        explanation = 'A Prontidão Adaptativa exige reciclagem estratégica e modernização tecnológica de portfólio.';
      }

      return {
        principleId: p.principleId,
        title: p.title,
        category: p.collection,
        explanation,
        relevanceScore: p.collection === 'BIBLICAL' || p.collection === 'ETHICAL' ? 95 : 85
      };
    });

    // Generate executive rationale
    const titles = principleMatches.map(pm => pm.title).join(', ');
    const executiveRationale = `Esta recomendação está epistemologicamente alinhada com os princípios de ${titles} do IWL™, garantindo que a decisão não seja meramente operacional, mas justificada pela cultura e valores da organização.`;

    const lineageHash = `LIN-GKL-${sourceType}-${sourceId}-${Date.now()}`;

    return {
      sourceId,
      sourceType,
      principleMatches,
      executiveRationale,
      lineageHash
    };
  }
}

export const governanceKnowledgeEngine = GovernanceKnowledgeEngine.getInstance();
