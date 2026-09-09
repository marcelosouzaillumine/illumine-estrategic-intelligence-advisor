# Navigation Evolution Strategy™ v1.0

A evolução da interface e da navegação na plataforma será conduzida de forma faseada para mitigar riscos de usabilidade e garantir a estabilidade das operações diárias. O objetivo final é construir uma navegação totalmente orientada à ontologia de Executive Offices.

## Estado Atual da Navegação (Monolítico)
O modelo atual opera sob a lógica clássica e acoplada:
Menu Principal
       ↓
     Página (ex: `/finance/dre`)
       ↓
    Módulo Front-end

## Estado Futuro da Navegação (Executive Workspace)
O modelo estruturalmente desejado operará sob a lógica fiduciária executiva:
Executive Office (ex: CFO Office)
       ↓
    Capability (ex: Financial Performance Governance)
       ↓
    Experience (ex: Margin Diagnosis)
       ↓
    Componentes Interativos

---

## Estratégia de Migração Gradual

### Fase 1: Legacy Navigation (Atual)
- A navegação reflete o estado monolítico (Módulos isolados como Financeiro, Clientes, Parceiros, RH).
- **Ação:** Criação do `Executive Office Registry`, `Capability Governance Model`, `Navigation Capability Map` (Concluído). As rotas e UI não sofrem alteração, apenas a fundação mental e documental.

### Fase 2: Hybrid Navigation (Wave 16B e Transição)
- Os componentes de infraestrutura são desenvolvidos "embaixo do capô".
- **Ação:** Criar em código o provedor central de navegação (`NavigationProvider`) amarrado aos contextos executivos e às `CAPABILITIES`. O usuário ainda verá menus tradicionais na UI, mas que internamente estão mapeando e respondendo já usando a nova taxonomia do Executive Office subjacente.
- Integração da roteirização e menus baseados na governança do `AuthorizationDecisionEngine`.

### Fase 3: Executive Workspace Navigation (Wave 17)
- Mudança total de UX/UI.
- **Ação:** Desativar a "sidebar" monolítica focada em ferramentas e ativar a nova interface orientada a **Espaços de Trabalho Executivo**.
- Em vez de um botão de navegação para "DRE", o executivo acessará o "CFO Office" e solicitará a "Financial Performance Governance".
- Ativação das dashboards unificadas que combinam múltiplos widgets operando na mesma linha de Capability sob os Domains.
