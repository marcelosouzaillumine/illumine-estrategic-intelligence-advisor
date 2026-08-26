import React from 'react';
import { ExecutiveSurface } from '../../../ui/executive-surface';
import { ExecutiveHeading } from '../../../ui/executive-heading';
import { ExecutiveText } from '../../../ui/executive-typography';
import { ExecutiveAnalyticalMissing } from '../../../ui/executive-analytical-missing';
import { ExecutiveQuestion } from '../../../../capabilities/financial/contracts/ExecutiveQuestion';

export const ExecutiveQuestionsRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  const questionsWrapper = pureViewModel?.executiveQuestions;

  if (!questionsWrapper || !questionsWrapper.available) {
    const fallbackReason = questionsWrapper?.availabilityReason || {
      type: "LOW_CONFIDENCE",
      title: "Sem Tópicos de Governança",
      explanation: "As evidências atuais não sugerem pontos de inflexão.",
      impact: "Dispensa formulação de questionamentos executivos."
    };
    return <ExecutiveAnalyticalMissing reason={fallbackReason} className="my-8" />;
  }

  const questions: ExecutiveQuestion[] = questionsWrapper.items;

  const intentMap: any = {
    'understand': 'Entendimento Estratégico',
    'evaluate': 'Avaliação Estratégica',
    'investigate': 'Investigação Profunda'
  };

  return (
    <div className="w-full my-12 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2 pb-2 border-b border-border">
        <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground leading-tight tracking-tight">
          Tópicos de Avaliação Fiduciária
        </ExecutiveHeading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {questions.map((q: ExecutiveQuestion, idx: number) => (
          <ExecutiveSurface key={idx} padding="md" radius="md" className="border shadow-md bg-card flex flex-col gap-4 hover:shadow-lg transition-shadow">
            <div>
              <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-primary mb-1">
                Questão Executiva
              </ExecutiveText>
              <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-foreground leading-snug">
                {q.question}
              </ExecutiveHeading>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border/50">
              <div>
                <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-medium text-executive-secondary mb-1">
                  Origem do Questionamento
                </ExecutiveText>
                <ExecutiveText variant="bodyStandard" className="text-foreground">
                  Referência: Sinal {q.originSignalId}
                </ExecutiveText>
              </div>

              <div>
                <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-medium text-executive-secondary mb-1">
                  Intenção
                </ExecutiveText>
                <div className="inline-flex items-center px-2 py-1 bg-surface-container rounded-md border border-border">
                  <ExecutiveText variant="label" className="text-foreground">
                    {intentMap[q.intent] || 'Entendimento Estratégico'}
                  </ExecutiveText>
                </div>
              </div>
            </div>
          </ExecutiveSurface>
        ))}
      </div>
    </div>
  );
};
