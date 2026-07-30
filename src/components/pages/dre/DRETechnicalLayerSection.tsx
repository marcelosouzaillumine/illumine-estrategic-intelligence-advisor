import React from 'react';
import { Database, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../../lib/utils';
import { DRETechnicalLayerViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from '../../ui/executive-table';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveBadge } from '../../ui/executive-badge';

interface Props {
  viewModel: DRETechnicalLayerViewModel;
}

export function DRETechnicalLayerSection({ viewModel }: Props) {
  const { translateLabel } = useLanguage();

  const mockMemory = [
    { 
      name: 'Receita Líquida (ROL)', 
      formula: 'Receita Bruta - Deduções (Impostos, Devoluções, Abatimentos)', 
      rationale: 'Representa o volume de faturamento efetivamente retido pela operação.',
      objective: 'Medir a receita operacional efetiva e o ganho real após deduções.',
      interpretation: 'Crescimentos na ROL indicam escala ou aumento de preço. Quedas alertam sobre evasão de clientes ou pressão comercial.',
      application: 'Usada para calcular as margens relativas (%) e mensurar o crescimento real da operação.',
      limitations: 'Não reflete eficiência de custos ou geração de caixa. Uma ROL crescente com custos descontrolados corrói o resultado final.'
    },
    { 
      name: 'Margem de Contribuição', 
      formula: 'Receita Líquida - Custos Variáveis - Despesas Variáveis', 
      rationale: 'Capital que sobra após a venda para pagar a estrutura fixa e gerar lucro.',
      objective: 'Avaliar a rentabilidade intrínseca do modelo de negócio.',
      interpretation: 'Margens altas permitem crescer sem muito volume. Margens baixas exigem volume massivo (escala) para não dar prejuízo.',
      application: 'Decisões de preço, viabilidade de produtos e cálculo do ponto de equilíbrio.',
      limitations: 'Muitas vezes mascarada por má classificação contábil entre custos fixos e variáveis.'
    },
    { 
      name: 'Ponto de Equilíbrio (Break-Even)', 
      formula: 'Despesas Fixas / Índice de Margem de Contribuição', 
      rationale: 'Faturamento mínimo exigido para o resultado operacional ser R$ 0,00.',
      objective: 'Identificar a meta mínima de sobrevivência operacional.',
      interpretation: 'Estar acima do ponto de equilíbrio significa geração de lucro. Abaixo, significa consumo de reservas e risco de liquidez.',
      application: 'Metas comerciais, dimensionamento de equipes e testes de estresse econômico.',
      limitations: 'Ponto de Equilíbrio Econômico não significa Equilíbrio de Caixa (vide prazos de recebimento e passivos).'
    },
    { 
      name: 'EBITDA', 
      formula: 'Margem de Contribuição - Despesas Operacionais Fixas', 
      rationale: 'Potencial de geração de caixa operacional livre de amarras financeiras e tributárias.',
      objective: 'Medir a eficiência operacional primária e comparabilidade entre operações.',
      interpretation: 'Um EBITDA saudável indica capacidade orgânica de reinvestimento e atratividade a investidores.',
      application: 'Comparabilidade operacional, análise de eficiência, avaliação de geração de caixa econômica e suporte a decisões de reinvestimento.',
      limitations: 'Não considera juros bancários, capex, tributos e variações do capital de giro.'
    }
  ];

  return (
    <ExecutiveAccordion
      variant="analytics"
      icon={<Database />}
      title="Memória Analítica e Evidências Técnicas"
      subtitle="Métricas contábeis, fórmulas aplicadas e rastreabilidade metodológica."
      defaultExpanded
    >
      <ExecutiveSurface variant="transparent" padding="none" className="border-b border-border pb-6 mb-6">
        <ExecutiveHeading as="h4" variant="submoduleTitle">Memória Analítica Premium</ExecutiveHeading>
        <ExecutiveText as="div" variant="bodyStandard" className="mb-6">
          Fundamentação metodológica e rastreabilidade rigorosa das principais métricas do painel executivo.
        </ExecutiveText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockMemory.map((mem, i) => (
            <ExecutiveSurface key={i} variant="transparent" padding="md" className="border border-border/50 flex flex-col h-full rounded-md">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <FileText size={16} className="text-muted-foreground" />
                <ExecutiveText variant="bodyStandard">{mem.name}</ExecutiveText>
              </div>
              
              <div className="flex flex-col gap-3 flex-1">
                <ExecutiveSurface variant="transparent" padding="sm" className="bg-muted/20 border border-border/30 rounded-md mb-2 flex flex-col">
                  <ExecutiveText variant="microLabel" className="text-muted-foreground mb-1 block">Fórmula Canônica</ExecutiveText>
                  <ExecutiveText variant="microLabel" className="font-mono text-foreground font-medium">{mem.formula}</ExecutiveText>
                </ExecutiveSurface>
                
                <div>
                  <ExecutiveText variant="microLabel">Objetivo Gerencial</ExecutiveText>
                  <ExecutiveText variant="bodyStandard">{mem.objective}</ExecutiveText>
                </div>
                
                <div>
                  <ExecutiveText variant="microLabel">Interpretação Executiva</ExecutiveText>
                  <ExecutiveText variant="bodyStandard">{mem.interpretation}</ExecutiveText>
                </div>
                
                <div>
                  <ExecutiveText variant="microLabel">Aplicação Prática</ExecutiveText>
                  <ExecutiveText variant="bodyStandard">{mem.application}</ExecutiveText>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-border border-dashed">
                <ExecutiveText variant="microLabel" className="text-executive-secondary flex items-center gap-1">
                  Limitações Metodológicas
                </ExecutiveText>
                <ExecutiveText variant="microLabel" className="italic">{mem.limitations}</ExecutiveText>
              </div>
            </ExecutiveSurface>
          ))}
        </div>
      </ExecutiveSurface>

      <ExecutiveHeading as="h4" variant="submoduleTitle">Tabela Estrutural</ExecutiveHeading>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <ExecutiveHeading as="h5" variant="submoduleTitle" className="tracking-widest text-foreground">
            {translateLabel('Detalhamento da DRE')}
          </ExecutiveHeading>
          <ExecutiveBadge variant="info">
            {translateLabel('Análise Horizontal e Vertical')}
          </ExecutiveBadge>
        </div>
        
        <div className="overflow-x-auto">
          <ExecutiveTable>
            <ExecutiveTableHeader>
              <ExecutiveTableRow>
                <ExecutiveTableHead className="w-[300px]">{translateLabel('Conta')}</ExecutiveTableHead>
                <ExecutiveTableHead className="text-right">{translateLabel('Valor (R$)')}</ExecutiveTableHead>
                <ExecutiveTableHead className="text-right">{translateLabel('AV (%)')}</ExecutiveTableHead>
                <ExecutiveTableHead className="text-right">{translateLabel('AH (1 Ano)')}</ExecutiveTableHead>
                <ExecutiveTableHead className="text-right">{translateLabel('AH (2 Anos)')}</ExecutiveTableHead>
                <ExecutiveTableHead className="text-right">{translateLabel('AH (3 Anos)')}</ExecutiveTableHead>
              </ExecutiveTableRow>
            </ExecutiveTableHeader>
            <ExecutiveTableBody>
              {viewModel.rows.length > 0 ? (
                viewModel.rows.map((row, i) => (
                  <ExecutiveTableRow key={i} className={cn(row.isTotal ? 'bg-muted/10 font-medium' : '')}>
                    <ExecutiveTableCell>
                      <ExecutiveText
                        variant={row.isTotal ? "bodyStandard" : "microLabel"}
                        className={cn('block break-words overflow-visible', row.isTotal ? 'text-foreground font-medium' : 'text-foreground/70')}
                        style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 20}px` : '0px' }}
                      >
                        {row.level > 1 && (
                          <span className="inline-block w-2 h-2 border-b border-l border-border mr-2 mb-0.5" />
                        )}
                        {row.label}
                      </ExecutiveText>
                    </ExecutiveTableCell>
                    <ExecutiveTableCell className={cn("text-right font-mono", row.val < 0 ? "text-critical" : "text-foreground/80")}>
                      {formatCurrency(row.val)}
                    </ExecutiveTableCell>
                    <ExecutiveTableCell className="text-right text-foreground/70">
                      <ExecutiveText variant="microLabel">{row.av.toFixed(2)}%</ExecutiveText>
                    </ExecutiveTableCell>
                    <ExecutiveTableCell className={cn(
                      "text-right",
                      row.ah1 === null ? "text-foreground/50" : row.ah1 > 0 ? "text-success" : row.ah1 < 0 ? "text-critical" : "text-foreground/70"
                    )}>
                      {row.ah1 !== null ? (
                        <div className="flex items-center justify-end gap-1">
                          {row.ah1 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <ExecutiveText variant="microLabel">{Math.abs(row.ah1).toFixed(2)}%</ExecutiveText>
                        </div>
                      ) : '—'}
                    </ExecutiveTableCell>
                    <ExecutiveTableCell className={cn(
                      "text-right",
                      row.ah2 === null ? "text-foreground/50" : row.ah2 > 0 ? "text-success" : row.ah2 < 0 ? "text-critical" : "text-foreground/70"
                    )}>
                      {row.ah2 !== null ? (
                        <div className="flex items-center justify-end gap-1">
                          {row.ah2 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <ExecutiveText variant="microLabel">{Math.abs(row.ah2).toFixed(2)}%</ExecutiveText>
                        </div>
                      ) : '—'}
                    </ExecutiveTableCell>
                    <ExecutiveTableCell className={cn(
                      "text-right",
                      row.ah3 === null ? "text-foreground/50" : row.ah3 > 0 ? "text-success" : row.ah3 < 0 ? "text-critical" : "text-foreground/70"
                    )}>
                      {row.ah3 !== null ? (
                        <div className="flex items-center justify-end gap-1">
                          {row.ah3 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <ExecutiveText variant="microLabel">{Math.abs(row.ah3).toFixed(2)}%</ExecutiveText>
                        </div>
                      ) : '—'}
                    </ExecutiveTableCell>
                  </ExecutiveTableRow>
                ))
              ) : (
                <ExecutiveTableRow>
                  <ExecutiveTableCell colSpan={6} className="h-24 text-center">
                    <ExecutiveText variant="bodyStandard" className="text-foreground/60">Nenhum detalhamento estrutural encontrado.</ExecutiveText>
                  </ExecutiveTableCell>
                </ExecutiveTableRow>
              )}
            </ExecutiveTableBody>
          </ExecutiveTable>
        </div>
      </div>
    </ExecutiveAccordion>
  );
}
