# Decision Surface Architecture Model

## 1. Definição
Uma **Decision Surface** (Superfície de Decisão) é o elemento nuclear da nova arquitetura de visualização da Illumine. Ela substitui o conceito obsoleto de "Dashboard".

Enquanto um Dashboard se limita a plotar dados e apresentar KPIs (e.g. `EBITDA: R$ 500.000`), a Decision Surface encapsula inteligência ativa, combinando o dado com insight, contexto e ação.

## 2. A Evolução do Dashboard para Surface

**Modelo Legado (Dashboard)**
```text
[Métrica] EBITDA
[Valor] R$ 500 mil
[Gráfico de linha]
```
*(O usuário precisa interpretar o que isso significa)*

**Modelo Illumine (Decision Surface)**
```text
[Métrica] EBITDA
[Status] Atenção (Laranja)
[Insight] Margem caiu 8% no fechamento deste mês.
[Contexto Estrutural] Aumento do custo de matéria-prima no fornecedor A.
[Decisão Recomendada] Reavaliar política de compras e negociar contratos vigentes.
```
*(O usuário recebe apoio à decisão acionável)*

## 3. Contrato de Definição (Surface Registry)
No código, uma Decision Surface não é um emaranhado de regras. Ela é descrita por um contrato estrito, forçando-a a declarar de quais motores analíticos (Engines) e Agentes de IA ela depende.

```typescript
export interface DecisionSurfaceDefinition {
  id: string; // Ex: 'financial-health'
  officeId: string; // Vinculação ao Office (ex: 'cfo-office')
  titleKey: string;
  descriptionKey: string;
  intent: NavigationIntent; // monitor | analyze | decide | operate
  capability: SystemCapability; // Permissão necessária para renderizar
  supportedEngines: string[]; // Motores que alimentam esta Surface (ex: 'FinancialGovernanceEngine')
  supportedAgents: string[]; // Agentes habilitados na Surface
  widgetIds: string[]; // Peças visuais que a compõem
}
```

## 4. Integração Analítica Plugável
A Decision Surface é desenhada para já nascer com a Inteligência Artificial plugável. O fluxo de responsabilidade é:

1. **Surface**: Requisita "Me dê a visão de Saúde Financeira".
2. **Financial Governance Engine**: Computa KPIs, gera Insights.
3. **Surface**: Renderiza a tela baseada nos Insights (Status, Contexto).
4. **Agente (Executive Advisor)**: Observa o Contexto na Surface e inicia um diálogo sugerindo ações proativas ("Devo preparar um cenário de redução de custos?").
