// src/core/runtime/capital-governance/CapitalGovernanceNarrativeComposer.ts
//
// Compositor de Narrativa Executiva — DLPA
// Ref: DLPA_GOVERNANCE_CURATION_PROTOCOL.md
//
// SEPARAÇÃO ESTRUTURAL DOS DOMÍNIOS:
//   Eixo 1: Performance Operacional (lucro/prejuízo)
//   Eixo 2: Política de Capital (distribuição/retenção)
//   Eixo 3: Preservação Patrimonial (evolução do PL)
//   Eixo 4: Governança Fiduciária (somente com evidência distributiva)
//
// A narrativa deve distinguir deterioração operacional de destruição distributiva.

import { CapitalGovernanceDiagnostics } from './capital-governance-types';

export function composeCapitalGovernanceNarrative(diagnostics: CapitalGovernanceDiagnostics): string {
  if (
    !diagnostics.isAvailable ||
    !diagnostics.retention ||
    !diagnostics.distribution ||
    !diagnostics.preservation ||
    !diagnostics.behavior
  ) {
    return 'DLPA/DMPL indisponível para análise institucional.';
  }

  const { retention, distribution, preservation, behavior } = diagnostics;
  const parts: string[] = [];

  // ── Eixo 3: Preservação Patrimonial ──────────────────────────────────────
  switch (preservation.preservationStatus) {
    case 'PRESERVAÇÃO_SAUDÁVEL':
      parts.push('O patrimônio institucional demonstra fortalecimento ao longo do ciclo, com preservação consistente do capital estrutural.');
      break;
    case 'EROSÃO_MODERADA':
      parts.push('Observa-se erosão patrimonial moderada no período, com redução contida do patrimônio líquido.');
      break;
    case 'EROSÃO_RELEVANTE':
      parts.push(
        `A análise da DLPA demonstra erosão patrimonial relevante no exercício` +
        (preservation.equityPreservationRatio > 0
          ? ` (índice de preservação: ${(preservation.equityPreservationRatio * 100).toFixed(1)}%)` : '') +
        `, decorrente predominantemente da incapacidade operacional de geração de resultado líquido positivo.`
      );
      break;
    case 'FRAGILIDADE_PATRIMONIAL':
      parts.push(
        'A deterioração patrimonial é severa no período, com redução superior a 50% do patrimônio líquido, indicando fragilidade estrutural relevante.'
      );
      break;
    case 'NEUTRO':
      parts.push('O patrimônio líquido manteve-se estável no período, sem variação patrimonial significativa.');
      break;
  }

  // ── Eixo 2: Política de Capital ────────────────────────────────────────────
  if (!distribution.hasDistributiveEvidence) {
    // Sem distribuição — não inferir pressão como "baixa"
    if (retention.retentionStatus === 'NÃO_APLICÁVEL_SEM_LUCRO') {
      parts.push(
        'Não foram identificadas distribuições de dividendos ou retiradas societárias no exercício. ' +
        'A ausência de resultado positivo naturalmente inviabiliza qualquer base distributiva — ' +
        'não havendo, portanto, evidência de comportamento predatório ou drenagem deliberada de capital.'
      );
    } else {
      parts.push(
        'Não foram identificadas distribuições de dividendos ou retiradas societárias no exercício, ' +
        'indicando postura conservadora na política de capital.'
      );
    }
  } else {
    // Com evidência distributiva — avaliar qualidade
    switch (distribution.distributionPressure) {
      case 'CRÍTICA':
        parts.push(
          `Foram identificadas distribuições (R$ ${distribution.totalDistributed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) ` +
          `incompatíveis com a capacidade de geração operacional, caracterizando pressão distributiva crítica sobre o patrimônio.`
        );
        break;
      case 'ALTA':
        parts.push(
          `As distribuições realizadas representam pressão distributiva elevada (payout: ${(distribution.distributionRatio * 100).toFixed(1)}%), ` +
          `comprometendo a capacidade de retenção para reinvestimento.`
        );
        break;
      case 'MODERADA':
        parts.push(
          `A política distributiva apresenta pressão moderada (payout: ${(distribution.distributionRatio * 100).toFixed(1)}%), ` +
          `compatível com a geração operacional do período.`
        );
        break;
      case 'BAIXA':
        parts.push(
          `A política distributiva é conservadora (payout: ${(distribution.distributionRatio * 100).toFixed(1)}%), ` +
          `com alta retenção de capital para reinvestimento.`
        );
        break;
    }
  }

  // ── Eixo 4: Governança Fiduciária ──────────────────────────────────────────
  switch (behavior.governanceMaturity) {
    case 'MATURA':
      parts.push('A disciplina de capitalização demonstra maturidade institucional na preservação e reinvestimento do patrimônio.');
      break;
    case 'EM_DESENVOLVIMENTO':
      parts.push('A governança de capital encontra-se em desenvolvimento, com indicadores que sinalizam trajetória de maturidade crescente.');
      break;
    case 'FRAGILIZADA':
      // Eixo 4 com causa operacional — sem acusação fiduciária
      parts.push(
        'A governança de capital encontra-se fragilizada, decorrente predominantemente de pressão operacional. ' +
        'A companhia demanda fortalecimento da governança financeira, melhoria de eficiência operacional, ' +
        'disciplina de capital e estruturação de políticas formais de retenção e preservação patrimonial.'
      );
      break;
    case 'EM_ESTRUTURAÇÃO':
      parts.push(
        'A governança de capital encontra-se em fase de estruturação, com baixa maturidade de retenção ' +
        'e ausência de políticas formais de preservação patrimonial.'
      );
      break;
    case 'FRÁGIL':
      parts.push(
        'A dinâmica entre geração e retenção de capital revela fragilidade estrutural, ' +
        'demandando disciplina de capital e revisão da política distributiva.'
      );
      break;
    case 'DESTRUTIVA':
      // Somente com hasDistributiveEvidence = true
      parts.push(
        'A dinâmica entre geração, retenção e distribuição revela comportamento fiduciariamente predatório: ' +
        'há evidência de distribuição incompatível com a capacidade operacional, ' +
        'comprometendo a sustentabilidade patrimonial e a saúde financeira estrutural da companhia.'
      );
      break;
  }

  return parts.join(' ');
}
