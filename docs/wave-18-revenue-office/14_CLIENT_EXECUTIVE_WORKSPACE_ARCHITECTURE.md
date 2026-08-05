# Wave 18B.3.0 — Client Executive Workspace Architecture

## 1. Purpose
O **Client Executive Workspace™** não é uma "página web de proposta". É a primeira manifestação pública do **Executive Decision Room™**, um ambiente imersivo onde C-Levels consomem diagnóstico estratégico, avaliam o valor da solução Illumine e tomam decisões embasadas com alta governança visual.

## 2. Executive Journey
A jornada linear do prospect é controlada e rastreável:
`Proposal Published ➔ Secure Invitation ➔ Identity Validation (OTP) ➔ Executive Workspace ➔ Explore Value ➔ Review Investment ➔ Accept / Request Discussion`

## 3. Information Architecture (O Funil de Decisão)
1. **Executive Welcome:** Contextualização (Account, Advisor, Data). Foco em relação, não em preço.
2. **Current Reality:** Análise das dores e fricções mapeadas na plataforma.
3. **Strategic Opportunity:** O custo da inação e o valor projetado.
4. **Proposed Intelligence Solution:** Mapeamento de problemas vs. Capacidades da Illumine.
5. **Transformation Journey:** Roadmap e milestones (Implementation Plan).
6. **Investment & Terms:** O "Commitment" financeiro derivado do *Pricing Snapshot*.
7. **Executive Questions:** Canal seguro para dúvidas (embutido).
8. **Decision Center:** Aceite criptográfico, rejeição ou agendamento de reunião.

## 4. Component Mapping (Reuso do Design System)
A experiência utiliza o Arsenal Executivo já maduro:
- **Current Reality:** `ExecutiveStrategicTensions`, `ExecutiveExposureCard`
- **Solution Experience:** `ExecutiveSummaryCard`, `ExecutiveAccordion`
- **Transformation Journey:** `ExecutiveLineageTimeline`
- **Decision Center:** `ExecutiveDecisionTrace`, `ExecutiveActionSurface`

## 5. Security Model (Nenhum link aberto)
Acesso via tokenização estrita (ProposalAccessSession):
1. Advisor envia e-mail com Link Mágico.
2. Link possui Token Criptográfico Temporário.
3. C-Level insere seu e-mail para receber um OTP (One-Time Password) ou faz Login se já possuir tenant.
4. Geração de `Workspace Session` (Sessão rastreável).

## 6. Permission Model
- **Cliente:** Apenas `Read-Only` na proposta e `Write` exclusivamente no payload de Aceite (Decision Center).

## 7. i18n Strategy
Totalmente bindado ao *Locale* da versão da proposta. Se a proposta foi gerada em `es-ES`, o motor renderizará os namespaces `proposal_client_workspace.json` em espanhol automaticamente.

## 8. Acceptance Flow
O clique em "Aceitar" gera o evento oficial `ProposalAccepted` no banco, anexando o IP, Timestamp, Nome do Signatário e a Hash da proposta assinada, bloqueando edições futuras nesta versão.

## 9. Mobile Experience
Total prioridade mobile, dado o comportamento C-Level (visualização rápida de insights). Tabelas e Timelines devem ser otimizadas para leitura densa em telas pequenas.

## 10. Implementation Roadmap
- **18B.3.1:** Security & Routing Shell (Validação de Token).
- **18B.3.2:** Data Hydration (Conectar o Proposal Version carregado aos contextos).
- **18B.3.3:** Rendering (Implementar as seções visuais via Component Mapping).
- **18B.3.4:** Decision Engine (Formulário e disparo de Aceite).
