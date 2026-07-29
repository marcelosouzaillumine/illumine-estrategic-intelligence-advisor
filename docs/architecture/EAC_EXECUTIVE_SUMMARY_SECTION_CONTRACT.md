# EAC ExecutiveSummarySection Contract

## 1. Responsabilidade
O componente `<ExecutiveSummarySection>` é um **orquestrador semântico e estrutural**. Sua função é delimitar formalmente a zona de síntese diagnóstica (o "veredicto") para que o executivo receba o panorama antes de ser submerso em KPIs analíticos.

**O que ele faz:**
- Governa a margem, espaçamento e posição cognitiva da síntese.
- Proporciona cabeçalho (heading) padronizado ("Resumo Executivo", "Tese Consolidada").
- Registra-se estruturalmente na árvore DOM/JSX para o Scanner V2.

**O que ele NÃO faz:**
- Não computa regras de negócio ou health scores.
- Não se comunica com bancos de dados.
- Não substitui as implementações internas (como `BalanceSheetExecutiveSynthesisSection`); ele as encapsula.

## 2. API Proposta

Baseada nas necessidades transversais, a API deve ser extremamente agnóstica para permitir injeção de qualquer domínio:

```tsx
export interface ExecutiveSummarySectionProps {
  /** 
   * Título da seção (Opcional). 
   * Fallback padrão: "Executive Summary" ou ignorado se o child renderizar o seu próprio.
   */
  title?: string;
  
  /** 
   * Subtítulo complementar descrevendo a natureza da tese.
   */
  description?: string;
  
  /**
   * Status global da tese (Opcional). Pode colorir a borda ou ícone.
   * Valores: 'healthy' | 'warning' | 'critical' | 'stable'
   */
  status?: ExecutiveStatusTone;

  /**
   * Elementos filhos, tipicamente o veredito em texto ou cards sumários de domínio.
   */
  children: React.ReactNode;
  
  /** 
   * Opcional: Actions rápidas exclusivas do contexto do sumário (ex: "Ver Detalhes do Risco")
   */
  actions?: React.ReactNode;
}
```

## 3. Relação com Page Identity
O `ExecutiveSummarySection` é estritamente sucessor do bloco de Controles e anterior aos KPIs.

```tsx
<PageHeader />
<ControlBar />
<ExecutiveSummarySection title="Diagnóstico de Caixa">
   <TextoDiagnostico {...} />
</ExecutiveSummarySection>
<ExecutiveKPISection />
```

## 4. Integração ao Scanner V2
- **Registry:** `ExecutiveSummarySection` será adicionado ao `EAC_COMPONENT_ARCHITECTURE_REGISTRY.json`.
- **Architectural Block:** `Executive Summary`.
- **Applicability:** ALL (com foco em Analytical e Board Mode).
