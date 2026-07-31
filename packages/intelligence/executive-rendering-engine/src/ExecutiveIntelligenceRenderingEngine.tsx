import React from 'react';
import { ExecutiveResponseContract } from '../../executive-advisor-runtime/src/ExecutiveResponseContract';
// Estes componentes serão criados no Registry (packages/ui/executive-components)
import { 
  ExecutiveInsightCard, 
  ExecutiveRiskCard, 
  ExecutiveRecommendationCard, 
  ExecutiveDecisionCard, 
  ExecutiveActionCard 
} from '../../../../packages/ui/executive-components/src';

export class ExecutiveIntelligenceRenderingEngine {
  /**
   * Converte o Contrato Semântico em uma Árvore de Componentes Institucionais.
   * Elimina completamente a necessidade de "Markdown parser" no front-end.
   */
  static render(contract: ExecutiveResponseContract): React.ReactNode[] {
    const elements: React.ReactNode[] = [];
    let keyIndex = 0;

    if (contract.executiveSummary) {
      elements.push(
        <ExecutiveInsightCard 
          key={`summary-${keyIndex++}`}
          title="Resumo Executivo"
          content={contract.executiveSummary}
        />
      );
    }

    if (contract.currentSituation) {
      elements.push(
        <ExecutiveInsightCard 
          key={`situation-${keyIndex++}`}
          title={contract.currentSituation.title || "Situação Atual"}
          content={contract.currentSituation.content}
        />
      );
    }

    if (contract.intelligenceInterpretation) {
      elements.push(
        <ExecutiveInsightCard 
          key={`interpretation-${keyIndex++}`}
          title={contract.intelligenceInterpretation.title || "Interpretação Estratégica"}
          content={contract.intelligenceInterpretation.content}
        />
      );
    }

    if (contract.risks && contract.risks.length > 0) {
      contract.risks.forEach(risk => {
        elements.push(
          <ExecutiveRiskCard 
            key={`risk-${risk.id}`}
            title={risk.type}
            severity={risk.severity}
            description={risk.description}
          />
        );
      });
    }

    if (contract.recommendations && contract.recommendations.length > 0) {
      contract.recommendations.forEach(rec => {
        elements.push(
          <ExecutiveRecommendationCard 
            key={`rec-${rec.id}`}
            title={rec.title}
            urgency={rec.urgency}
            description={rec.description}
          />
        );
      });
    }

    if (contract.decisionsRequired && contract.decisionsRequired.length > 0) {
      contract.decisionsRequired.forEach(dec => {
        elements.push(
          <ExecutiveDecisionCard 
            key={`dec-${dec.id}`}
            question={dec.question}
            context={dec.context}
            options={dec.options}
          />
        );
      });
    }

    if (contract.nextActions && contract.nextActions.length > 0) {
      contract.nextActions.forEach(act => {
        elements.push(
          <ExecutiveActionCard 
            key={`act-${act.id}`}
            label={act.label}
            intent={act.intent}
            requiresConfirmation={act.requiresConfirmation}
          />
        );
      });
    }

    return elements;
  }
}
