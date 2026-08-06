// src/core/runtime/esgim/ESGIMAssessmentEngine.ts

import { 
  ESGIMAssessment, 
  ESGIMMaturityLevel, 
  ESGIMDimensionResult, 
  ESGIMDimension, 
  ESGIMMode, 
  ESGIMScenario 
} from './esgimTypes';
import { esgGovernanceEngine } from '../compliance/ESGGovernanceEngine';
import { institutionalIntegrityEngine } from '../compliance/InstitutionalIntegrityEngine';
import { ESGIMGraphAdapter } from '../../knowledge-graph/adapters/ESGIMGraphAdapter';

export class ESGIMAssessmentEngine {
  private static instance: ESGIMAssessmentEngine;

  public static getInstance(): ESGIMAssessmentEngine {
    if (!ESGIMAssessmentEngine.instance) {
      ESGIMAssessmentEngine.instance = new ESGIMAssessmentEngine();
    }
    return ESGIMAssessmentEngine.instance;
  }

  /**
   * Calculates the unified ESGIM Institutional Assessment for a given client.
   */
  public calculateAssessment(
    clientId: string,
    mode: ESGIMMode = 'DEMO_SCENARIO',
    demoScenario: ESGIMScenario = 'STANDARD'
  ): ESGIMAssessment {
    const rulesApplied: string[] = [];
    const evidenceTrail: string[] = [];
    let details = 'Avaliação institucional realizada com base nos eixos ESGIM.';

    // 1. Fetch base data if available, otherwise default to a standard healthy profile
    let baseEnv = 82;
    let baseSoc = 91;
    let baseGov = 78;
    let baseInt = 85;
    let baseMis = 88;

    if (clientId) {
      try {
        const liveEsg = esgGovernanceEngine.getLatestScore(clientId);
        if (liveEsg) {
          baseEnv = liveEsg.environmentalScore || baseEnv;
          baseSoc = liveEsg.socialScore || baseSoc;
          baseGov = liveEsg.governanceScore || baseGov;
          evidenceTrail.push(`Métricas ESG ao vivo importadas da ESGGovernanceEngine (Consolidado: ${liveEsg.consolidatedScore} pts)`);
        } else {
          evidenceTrail.push('Nenhuma métrica ESG ao vivo encontrada. Utilizando base referencial do setor.');
        }

        // Live Integrity for Institutional
        const liveIntegrity = institutionalIntegrityEngine.generateIntegrityScore(clientId, []);
        if (liveIntegrity) {
          baseInt = liveIntegrity.integrityScore || baseInt;
          evidenceTrail.push(`Score de Integridade importado do InstitutionalIntegrityEngine (${liveIntegrity.integrityScore} pts)`);
        }
      } catch (err) {
        evidenceTrail.push('Usando dados de baseline estrutural (Incapaz de acessar Firestore em tempo real)');
      }
    }

    // Initialize flags
    let isConstitutionalBreach = false;
    let isFiduciaryFailure = false;
    let isMissionFailure = false;
    let isKeyPersonDependency = false;
    let isProspectiveFragility = false;

    // 2. Apply Demo Scenario Overrides if in DEMO_SCENARIO mode
    if (mode === 'DEMO_SCENARIO') {
      rulesApplied.push(`Modo de Simulação Ativo: ${demoScenario}`);
      
      switch (demoScenario) {
        case 'CONSTITUTIONAL_BREACH':
          baseGov = 30; // Capped to critical
          isConstitutionalBreach = true;
          rulesApplied.push('Trigger de Quebra Constitucional ativado na simulação.');
          evidenceTrail.push('Evidência Múltipla: Denúncia Crítica em Comitê de Ética e Violação de Alçadas Decisórias.');
          details = 'Simulação: A governança corporativa foi degradada após a detecção de quebra de regras éticas e desvio de alçadas constitutivas.';
          break;

        case 'LIQUIDITY_SHOCK':
          baseInt = 25; // Capped to critical
          isFiduciaryFailure = true;
          rulesApplied.push('Trigger de Risco Fiduciário / Insolvência ativado na simulação.');
          evidenceTrail.push('Evidência Múltipla: Exposição extrema a garantias fiscais e insolvência operacional de ciclo imediato.');
          details = 'Simulação: Risco crítico de colapso financeiro fiduciário ativado, impedindo a proteção de ativos institucionais.';
          break;

        case 'MISSION_STRESS':
          baseMis = 45; // Concern
          isMissionFailure = true;
          rulesApplied.push('Trigger de Desalinhamento Missional ativado na simulação.');
          evidenceTrail.push('Evidência Múltipla: Custos operacionais drenando o caixa da finalidade principal da organização.');
          details = 'Simulação: Conflito estrutural ativado entre a sustentabilidade da missão fundadora e a viabilidade financeira.';
          break;

        case 'FOUNDER_EXIT':
          baseInt = 62; // Concern/Developing
          isKeyPersonDependency = true;
          rulesApplied.push('Trigger de Fragilidade Institucional (Key Person Dependency) ativado.');
          evidenceTrail.push('Evidência Múltipla: Ausência de planos de sucessão estruturados para os principais executivos da holding.');
          details = 'Simulação: Teste de continuidade institucional revelou dependência excessiva dos fundadores com risco em transição de legado.';
          break;

        case 'MARKET_DISRUPTION':
          baseGov = 68; // Developing
          isProspectiveFragility = true;
          rulesApplied.push('Trigger de Fragilidade Prospectiva (Market Disruption) ativado.');
          evidenceTrail.push('Evidência Múltipla: Rigidez estratégica e baixa adaptabilidade a inovações de mercado.');
          details = 'Simulação: Conselho carece de ferramentas de inovação e flexibilidade adaptativa frente a mudanças rápidas de concorrência.';
          break;

        case 'STANDARD':
        default:
          rulesApplied.push('contexto Padrão Executado (Nenhum veto ou bloqueio ativo).');
          evidenceTrail.push('Evidência Múltipla: Conformidade documental, conselho plural atuante e margens saudáveis.');
          break;
      }
    } else {
      rulesApplied.push('Modo Diagnóstico de Dados Reais (LIVE_DATA) Ativo.');
    }

    // 3. Compute Consolidated Score
    // Weightings: E (15%), S (15%), G (25%), I (25%), M (20%)
    let rawOverallScore = Math.round(
      (baseEnv * 0.15) +
      (baseSoc * 0.15) +
      (baseGov * 0.25) +
      (baseInt * 0.25) +
      (baseMis * 0.20)
    );

    let overallScore = rawOverallScore;

    // 4. Enforce Cognitive Constitution Vetoes
    if (isConstitutionalBreach || isFiduciaryFailure) {
      overallScore = Math.min(overallScore, 39);
      rulesApplied.push(`VETO CONSTITUCIONAL: Score limitado a 39 devido a ${isConstitutionalBreach ? 'Quebra Constitucional' : 'Violação Fiduciária'}.`);
    } else if (isMissionFailure) {
      overallScore = Math.min(overallScore, 59);
      rulesApplied.push('RESTRIÇÃO DE MISSÃO: Score limitado a 59 devido a Falha de Sustentabilidade Missional.');
    } else if (isKeyPersonDependency) {
      overallScore = Math.min(overallScore, 89);
      rulesApplied.push('CEILING INSTITUCIONAL: Score limitado a 89 devido a Risco de Dependência de Pessoa-Chave.');
    } else if (isProspectiveFragility) {
      overallScore = Math.min(overallScore, 89);
      rulesApplied.push('CEILING PROSPECTIVO: Score limitado a 89 devido a Risco de Fragilidade Adaptativa.');
    }

    // 5. Determine Overall Maturity Level
    const maturityLevel = this.getMaturityLevel(overallScore);

    // 6. Map Dimension Results
    const dimensions: ESGIMDimensionResult[] = [
      {
        dimension: 'Environmental',
        score: baseEnv,
        status: this.getMaturityLevel(baseEnv),
        explanation: this.getDimensionExplanation('Environmental', baseEnv, false)
      },
      {
        dimension: 'Social',
        score: baseSoc,
        status: this.getMaturityLevel(baseSoc),
        explanation: this.getDimensionExplanation('Social', baseSoc, false)
      },
      {
        dimension: 'Governance',
        score: baseGov,
        status: this.getMaturityLevel(baseGov),
        explanation: this.getDimensionExplanation('Governance', baseGov, isConstitutionalBreach)
      },
      {
        dimension: 'Institutional',
        score: baseInt,
        status: this.getMaturityLevel(baseInt),
        explanation: this.getDimensionExplanation('Institutional', baseInt, isFiduciaryFailure || isKeyPersonDependency)
      },
      {
        dimension: 'Mission',
        score: baseMis,
        status: this.getMaturityLevel(baseMis),
        explanation: this.getDimensionExplanation('Mission', baseMis, isMissionFailure)
      }
    ];

    // 7. Dynamic Strengths & Vulnerabilities Detection
    const { strengths, vulnerabilities } = this.detectStrengthsAndVulnerabilities(dimensions, {
      isConstitutionalBreach,
      isFiduciaryFailure,
      isMissionFailure,
      isKeyPersonDependency,
      isProspectiveFragility
    });

    // 8. Generate Executive Narrative Summary
    const executiveSummary = this.generateExecutiveSummary(maturityLevel, {
      isConstitutionalBreach,
      isFiduciaryFailure,
      isMissionFailure,
      isKeyPersonDependency,
      isProspectiveFragility,
      overallScore
    });

    const timestamp = new Date().toISOString();
    const lineageHash = `LIN-ESGIM-${clientId || 'GLOBAL'}-${mode}-${demoScenario}-${Date.now()}`;

    const assessment: ESGIMAssessment = {
      overallScore,
      maturityLevel,
      dimensions,
      strengths,
      vulnerabilities,
      executiveSummary,
      mode,
      auditTrail: {
        auditId: `AUDIT-ESGIM-${Date.now()}`,
        timestamp,
        rulesApplied,
        evidenceTrail,
        details
      },
      lineageHash,
      createdAt: timestamp
    };

    // [Knowledge Graph Integration] Chamada Passiva
    ESGIMGraphAdapter.registerESGIMGraph(assessment).catch(err => {
      console.warn('[ESGIMGraphAdapter] Async error ignored:', err);
    });

    return assessment;
  }

  private getMaturityLevel(score: number): ESGIMMaturityLevel {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 75) return 'MATURE';
    if (score >= 60) return 'DEVELOPING';
    if (score >= 40) return 'CONCERN';
    return 'CRITICAL';
  }

  private getDimensionExplanation(dimension: ESGIMDimension, score: number, isVetoed: boolean): string {
    if (isVetoed) {
      if (dimension === 'Governance') return 'Conformidade crítica devido a violação constitucional ou ética ativa no Board.';
      if (dimension === 'Institutional') {
        if (score <= 39) return 'Risco iminente de colapso financeiro fiduciário impedindo a continuidade.';
        return 'Resiliência institucional prejudicada por severa dependência de pessoas-chave sem planos de sucessão.';
      }
      if (dimension === 'Mission') return 'Sufocamento missional: finalidade institucional comprometida por pressões financeiras.';
    }

    switch (dimension) {
      case 'Environmental':
        if (score >= 90) return 'Resiliência excelente a riscos socioambientais com processos de descarbonização estruturados.';
        if (score >= 75) return 'Maturidade adequada em sustentabilidade operacional e conformidade com diretrizes ambientais.';
        if (score >= 60) return 'Desenvolvimento de práticas socioambientais em andamento, necessitando maior formalização.';
        if (score >= 40) return 'Atenção necessária em emissões e descarte de resíduos operacionais.';
        return 'Nível crítico de vulnerabilidade socioambientais com riscos regulatórios iminentes.';

      case 'Social':
        if (score >= 90) return 'Elevado capital relacional, eNPS destacado e programas sólidos de impacto comunitário.';
        if (score >= 75) return 'Clima organizacional saudável e boa retenção de talentos em áreas críticas.';
        if (score >= 60) return 'Práticas sociais em evolução, necessitando aprimorar engajamento interno.';
        if (score >= 40) return 'Riscos de turnover elevado e fragilidades de integração organizacional.';
        return 'Crise de clima organizacional com desmotivação crônica ou desvio de diretrizes trabalhistas.';

      case 'Governance':
        if (score >= 90) return 'Governança corporativa transparente, com auditoria ativa e alçadas bem segregadas.';
        if (score >= 75) return 'Estrutura formalizada e comitês atuantes na proteção de valor.';
        if (score >= 60) return 'Processos de tomada de decisão em profissionalização, com algumas alçadas centralizadas.';
        if (score >= 40) return 'Grave centralização decisória e comitês consultivos inoperantes.';
        return 'Completa ausência de governança formal com altos riscos de fraudes ou desvios.';

      case 'Institutional':
        if (score >= 90) return 'Excelente salvaguarda de marca, resiliência de imagem e plano de sucessão maduro.';
        if (score >= 75) return 'Estabilidade organizacional adequada e riscos de marca mitigados.';
        if (score >= 60) return 'Processo sucessório parcial e vulnerabilidades menores na proteção do legado.';
        if (score >= 40) return 'Fraca proteção institucional e ausência de substitutos para cargos críticos.';
        return 'Descontinuidade institucional eminente e vulnerabilidade máxima de imagem pública.';

      case 'Mission':
      default:
        if (score >= 90) return 'Forte alinhamento entre as decisões diárias e o propósito fundador da organização.';
        if (score >= 75) return 'Coerência missional adequada e liderança engajada na visão estratégica.';
        if (score >= 60) return 'Alinhamento missional em desenvolvimento, com desvios pontuais na operação.';
        if (score >= 40) return 'Desvio parcial de propósito com decisões priorizando metas de ciclo imediato.';
        return 'Completo desalinhamento missional com perda total da identidade fundadora.';
    }
  }

  private detectStrengthsAndVulnerabilities(
    dimensions: ESGIMDimensionResult[],
    flags: {
      isConstitutionalBreach: boolean;
      isFiduciaryFailure: boolean;
      isMissionFailure: boolean;
      isKeyPersonDependency: boolean;
      isProspectiveFragility: boolean;
    }
  ): { strengths: string[]; vulnerabilities: string[] } {
    const strengths: string[] = [];
    const vulnerabilities: string[] = [];

    // Prioritize flags first to alert the board
    if (flags.isConstitutionalBreach) {
      vulnerabilities.push('Quebra de Regras Constitucionais');
      vulnerabilities.push('Falta de Integridade nos Controles');
    }
    if (flags.isFiduciaryFailure) {
      vulnerabilities.push('Ruptura de Contrato Fiduciário');
      vulnerabilities.push('Pressão Extrema de Liquidez');
    }
    if (flags.isMissionFailure) {
      vulnerabilities.push('Conflito Missão-Econômico');
      vulnerabilities.push('Drenagem de Caixa por Desalinhamento');
    }
    if (flags.isKeyPersonDependency) {
      vulnerabilities.push('Dependência de Pessoa-Chave');
      vulnerabilities.push('Fragilidade no Plano de Sucessão');
    }
    if (flags.isProspectiveFragility) {
      vulnerabilities.push('Fragilidade Adaptativa');
      vulnerabilities.push('Baixa Prontidão Futura');
    }

    // Sort dimensions by score
    const sorted = [...dimensions].sort((a, b) => b.score - a.score);

    // Filter strengths (Score >= 75, and not vetoed)
    for (const d of sorted) {
      if (d.score >= 75) {
        if (d.dimension === 'Governance' && flags.isConstitutionalBreach) continue;
        if (d.dimension === 'Institutional' && (flags.isFiduciaryFailure || flags.isKeyPersonDependency)) continue;
        if (d.dimension === 'Mission' && flags.isMissionFailure) continue;

        // Map to executive label
        if (d.dimension === 'Environmental') strengths.push('Resiliência Socioambiental');
        if (d.dimension === 'Social') strengths.push('Elevado Capital Relacional');
        if (d.dimension === 'Governance') strengths.push('Disciplina de Governança');
        if (d.dimension === 'Institutional') strengths.push('Preservação do Legado');
        if (d.dimension === 'Mission') strengths.push('Forte Alinhamento Missional');
      }
    }

    // Add natural vulnerabilities if score < 75
    const unsortedLow = [...dimensions].sort((a, b) => a.score - b.score);
    for (const d of unsortedLow) {
      if (d.score < 75) {
        let label = '';
        if (d.dimension === 'Environmental') label = 'Fragilidade Socioambiental';
        if (d.dimension === 'Social') label = 'Rotatividade de Pessoal (eNPS)';
        if (d.dimension === 'Governance' && !flags.isConstitutionalBreach) label = 'Rigidez em Alçadas Decisórias';
        if (d.dimension === 'Institutional' && !flags.isFiduciaryFailure && !flags.isKeyPersonDependency) label = 'Processo de Sucessão Parcial';
        if (d.dimension === 'Mission' && !flags.isMissionFailure) label = 'Desvio Pontual de Propósito';

        if (label && !vulnerabilities.includes(label)) {
          vulnerabilities.push(label);
        }
      }
    }

    // Fallbacks if lists are empty
    if (strengths.length === 0) strengths.push('Estabilidade nos Processos Internos');
    if (vulnerabilities.length === 0) vulnerabilities.push('Ausência de Riscos Estruturais Iminentes');

    return {
      strengths: strengths.slice(0, 3),
      vulnerabilities: vulnerabilities.slice(0, 3)
    };
  }

  private generateExecutiveSummary(
    maturity: ESGIMMaturityLevel,
    flags: {
      isConstitutionalBreach: boolean;
      isFiduciaryFailure: boolean;
      isMissionFailure: boolean;
      isKeyPersonDependency: boolean;
      isProspectiveFragility: boolean;
      overallScore: number;
    }
  ): string {
    if (flags.isConstitutionalBreach) {
      return 'ALERTA DE CONFORMIDADE: A organização apresenta grave desalinhamento constitucional. Violações éticas críticas inviabilizam a consolidação de maturidade em governança, exigindo auditoria imediata de processos e alçadas decisórias.';
    }
    if (flags.isFiduciaryFailure) {
      return 'ALERTA FIDUCIÁRIO: Risco crítico de insolvência ou quebra de salvaguarda fiduciária detectada. A continuidade institucional está exposta a passivos exigíveis urgentes, exigindo plano imediato de recapitalização e proteção patrimonial.';
    }
    if (flags.isMissionFailure) {
      return 'ALERTA MISSIONAL: Há desalinhamento severo entre o cumprimento da missão e a saúde fiduciária. O caixa está sendo consumido sem sustentação econômica clara de longo horizonte, demandando adequação do modelo de captação.';
    }
    if (flags.isKeyPersonDependency) {
      return 'ALERTA DE CONTINUIDADE: A organização apresenta resultados consistentes, mas com resiliência de longo horizonte ameaçada por alta dependência de fundadores/lideranças chave sem sucessores mapeados.';
    }
    if (flags.isProspectiveFragility) {
      return 'ALERTA DE ADAPTAÇÃO: A organização possui solidez hoje, mas demonstra fragilidade e baixa prontidão estratégica para absorver choques ou inovações disruptivas de mercado.';
    }

    switch (maturity) {
      case 'EXCELLENT':
        return 'A organização apresenta excelência operacional e institucional de ponta. Apresenta forte alinhamento missional, governança transparente e alçadas bem segregadas, assegurando elevada resiliência em ciclos de transição.';
      case 'MATURE':
        return 'A organização apresenta forte alinhamento missional e elevado capital relacional. Entretanto, fragilidades institucionais relacionadas à sucessão e continuidade reduzem sua resiliência de longo horizonte.';
      case 'DEVELOPING':
        return 'A organização está em fase de estruturação e profissionalização de suas práticas. A governança e processos de controle começam a ser formalizados, mas necessitam de maior profundidade e mitigação de dependências operacionais.';
      case 'CONCERN':
        return 'A organização apresenta fragilidades preocupantes em sua sustentabilidade de missão e controles fiduciários. Recomenda-se focar na readequação orçamentária e blindagem reputacional.';
      case 'CRITICAL':
      default:
        return 'A organização opera sob elevado risco de descontinuidade ou desvio ético severo. Recomenda-se suspender planos de expansão agressivos e focar na integridade operacional e reestruturação financeira básica.';
    }
  }
}

export const esgimAssessmentEngine = ESGIMAssessmentEngine.getInstance();
