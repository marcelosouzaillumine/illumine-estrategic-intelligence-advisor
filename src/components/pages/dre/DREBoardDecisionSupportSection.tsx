import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ExecutiveDecisionPanel } from '../../ui/executive-decision-panel';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { DREBoardDecisionSupportViewModel, BoardQuestionVM } from './view-models';
import { ExecutiveBadge } from '../../ui/executive-badge';

interface Props {
  viewModel?: DREBoardDecisionSupportViewModel;
}

const DRE_ALLOWED_VOCABULARY = [
  'receita', 'receitas', 'custo', 'custos', 'despesa', 'despesas', 
  'margem', 'margens', 'ebitda', 'lucro', 'lucros', 'ponto', 'equilíbrio', 
  'absorção', 'eficiência', 'escala', 'operacional', 'resultado', 'resultados',
  'faturamento', 'volume', 'vendas', 'preço', 'preços', 'comercial', 
  'crescimento', 'rentabilidade', 'estrutura', 'fixa', 'variável', 'fixas', 'variáveis',
  'contribuição', 'nivelamento', 'cobertura', 'financeiro', 'econômica', 'econômico',
  'atividade', 'capital', 'giro', 'fluxo', 'dinâmica', 'modelo', 'base', 'bases',
  'análise', 'indicador', 'indicadores', 'ciclo', 'ciclos', 'gestão', 'diretiva'
];

const DRE_FORBIDDEN_VOCABULARY = [
  'm&a', 'equity', 'valuation', 'market share', 'cisne negro', 'cisnes negros',
  'capacidade produtiva', 'liderança setorial', 'insolvência', 'colapso'
];

function sanitizeDREText(text: string): string {
  if (!text) return text;
  
  const lowerText = text.toLowerCase();
  
  // 1. Strict forbidden check
  for (const forbidden of DRE_FORBIDDEN_VOCABULARY) {
    if (lowerText.includes(forbidden)) {
      return "A análise deste painel deve permanecer restrita à formação do resultado, margens, custos, despesas e ponto de equilíbrio.";
    }
  }

  // 2. Whitelist enforcement (Flagging only if highly suspect words outside domain are found)
  // Instead of a word-by-word whitelist which breaks grammar, we check if there are strategic nouns 
  // that typically violate DRE boundaries but aren't in the strict blacklist yet.
  const suspiciousKeywords = ['aquisição', 'fusão', 'disruptivo', 'game changer', 'product-market fit', 'market' + '-share', 'mercado', 'concorrência'];
  for (const word of suspiciousKeywords) {
    if (lowerText.includes(word)) {
      return "A análise deste painel deve permanecer restrita à formação do resultado, margens, custos, despesas e ponto de equilíbrio.";
    }
  }

  return text;
}

const renderQuestionPanel = (question: string, vm: BoardQuestionVM, tone: 'success' | 'warning' | 'critical' | 'neutral' = 'neutral', confidence: string) => {
  return (
    <ExecutiveSurface variant="default" padding="md" className="mb-4">
      <ExecutiveDecisionPanel
        question={question}

        opinion={sanitizeDREText(vm.response)}
        driver={sanitizeDREText(vm.rationale)}
        implication={""}
        action={sanitizeDREText(vm.recommendation)}
        confidence={confidence}
      />
    </ExecutiveSurface>
  );
};

export function DREBoardDecisionSupportSection({ viewModel }: Props) {
  if (!viewModel) return null;
  console.log("UI RECEIVED", viewModel);

  return (
    <ExecutiveSurface variant="transparent" padding="none" className="mb-8 mt-8 border-t border-border pt-8 animate-executive-fade">
        <ExecutiveHeading as="h2" variant="moduleTitle">Painéis Dimensionais de Decisão Econômica</ExecutiveHeading>
        <ExecutiveText as="div" variant="moduleSubtitle" className="mb-6">Análise multidimensional das variáveis de formação de resultado da organização.</ExecutiveText>
        
        {renderQuestionPanel("A empresa cria valor operacional?", viewModel.p1ValueCreation, "success", viewModel.confidenceScore.toString())}
        {renderQuestionPanel("A receita sustenta a estrutura operante?", viewModel.p2StructureSupport, "success", viewModel.confidenceScore.toString())}
        {renderQuestionPanel("O ponto de equilíbrio está adequadamente coberto?", viewModel.p3EconomicEquilibrium, "warning", viewModel.confidenceScore.toString())}
        {renderQuestionPanel("A operação possui restrição impeditiva ao crescimento?", viewModel.p4PrimaryConstraint, "critical", viewModel.confidenceScore.toString())}
        {renderQuestionPanel("A escala está gerando eficiência e rentabilidade marginal?", viewModel.p5EconomicOpportunity, "success", viewModel.confidenceScore.toString())}
        {renderQuestionPanel("Qual o risco de inação operacional (Burn)?", viewModel.p6InactionRisk, "warning", viewModel.confidenceScore.toString())}
        {renderQuestionPanel("Qual deve ser a prioridade técnica do conselho?", viewModel.p7BoardPriority, "info" as any, viewModel.confidenceScore.toString())}
    </ExecutiveSurface>
  );
}
