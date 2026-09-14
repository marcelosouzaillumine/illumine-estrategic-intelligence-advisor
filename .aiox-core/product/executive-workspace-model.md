# Executive Workspace Architecture Model

## 1. Definição
O **Executive Workspace** é a principal casca de experiência ("Shell") que hospeda as ferramentas e visões estratégicas de um `Executive Office`. 

Diferente de um dashboard estático que agrupa relatórios de forma plana, um Workspace é uma experiência viva que organiza contextos de decisão e permite a colaboração nativa com *AI Agents*.

## 2. Estrutura Canônica
Todo Executive Workspace deve aderir à seguinte topologia hierárquica:

```text
Executive Workspace
├── Office Context (Contexto Identitário, Metadata)
│
├── Executive Summary (KPIs macro e pulso do domínio)
│
├── Decision Governance (Visão orientada a anomalias e insights)
│
├── Performance Monitoring (Desdobramento clássico de resultados)
│
├── Governance Insights (Visões cruzadas propostas pelas Engines)
│
└── Actions & Recommendations (Próximos passos operacionais sugeridos)
```

## 3. Contrato Universal de Workspace
Para que a plataforma mantenha a escalabilidade e evite código "hardcoded" por persona (e.g. `if (role === 'CFO') render CFO_UI`), **todos os Workspaces compartilham a mesma definição estrutural em código**:

```typescript
export interface WorkspaceDefinition {
  officeId: string; // Ex: 'cfo-office'
  titleKey: string;
  subtitleKey: string;
  iconKey: string;
  defaultSurface: string; // Qual Surface carrega por padrão
  capabilities: SystemCapability[]; // Permissões requeridas
  supportedAgents: string[]; // Agentes habilitados neste contexto
  maturity: 'prototype' | 'beta' | 'production'; // Lifecycle
  surfaces: DecisionSurfaceDefinition[]; // Camadas de decisão filhas
}
```

## 4. O Componente Shell (`Workspace Loader`)
A aplicação nunca instancia `CfoWorkspace.tsx` diretamente. A experiência é orquestrada por um componente Shell (como `ExecutiveWorkspaceLab`), que carrega a definição estrutural do Workspace baseado na rota (`/workspace/:office`) e constrói a interface delegando o conteúdo de negócio às `Decision Surfaces`.

## 5. Princípio da Responsabilidade da Experiência
Para evitar dívida técnica imediata, a arquitetura de apresentação exige separação estrita:

1. **Surface**: Apenas Renderiza.
2. **Workspace (Shell)**: Apenas Organiza o Layout e Roteamento.
3. **Services**: Entregam Dados Brutos.
4. **Engines**: Interpretam Dados e geram Contextos.
5. **Agents**: Sugerem e Interagem.
