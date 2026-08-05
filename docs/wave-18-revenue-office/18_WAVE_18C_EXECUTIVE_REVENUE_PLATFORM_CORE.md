# Wave 18C — Executive Revenue Platform™ Core

## 1. Executive Revenue Vision
A transição da *Executive Commercial Platform* (Lead ➔ Decision) para a *Executive Revenue Platform* (Contract ➔ CustomerActivated). Esta wave não constrói um "Billing Engine" isolado, mas a espinha dorsal financeira e operacional (o Core) que sustentará toda a monetização e distribuição da Illumine.

## 2. Revenue Domains & 3. Bounded Contexts
A arquitetura repousa sobre a estrita separação de responsabilidades. Um domínio não faz o trabalho do outro.
- **Contract:** Contrato, cláusulas, SLA, assinatura.
- **Subscription:** Plano, recorrência, MRR/ARR, upgrade/cancelamento.
- **Billing:** Invoice, cobrança, gateway, impostos.
- **Licensing:** Ativação, seats, limites temporais.
- **Entitlement:** Capabilities liberadas, módulos funcionais acessíveis.
- **Provisioning:** Criação do tenant físico, workspace, admin inicial, onboarding.

## 4. Aggregate Roots
Cada Bounded Context possuirá seu Aggregate Root próprio e inviolável (ex: `Contract`, `Subscription`, `Invoice`, `License`, `TenantProfile`).

## 5. Event Bridge
A orquestração assíncrona que move o cliente através do funil:
`DecisionAccepted` ➔ `ContractCreated` ➔ `ContractActivated` ➔ `SubscriptionCreated` ➔ `SubscriptionActivated` ➔ `InvoiceGenerated` ➔ `PaymentPending` ➔ `PaymentConfirmed` ➔ `LicenseIssued` ➔ `EntitlementsGranted` ➔ `TenantProvisioned` ➔ `OnboardingStarted` ➔ `CustomerActivated`.

## 6. Firestore Collections
Separação física de dados para escalabilidade, compliance e auditoria:
- `revenue_platform/contracts/`
- `revenue_platform/subscriptions/`
- `revenue_platform/billing/`
- `revenue_platform/payments/`
- `revenue_platform/licenses/`
- `revenue_platform/entitlements/`
- `revenue_platform/provisioning/`

## 7. Integration Rules & 8. Dependency Rules
**Regra de Ouro:** A dependência é estritamente linear e unidirecional. 
`Commercial ➔ Decision ➔ Contract ➔ Subscription ➔ Billing ➔ Licensing ➔ Entitlement ➔ Provisioning`.
Nenhum domínio pode importar diretamente modelos ou funções de um domínio anterior na cadeia (para evitar dependência circular). A comunicação *upstream* acontece **exclusivamente via eventos**.
Os pacotes em `packages/domain/*` **nunca** importarão UI (`packages/features/*` ou `src/components/*`).

## 9. Capability Map & 10. Future Integrations
Essa malha prepara a fundação direta para a Wave 18D (Automated Provisioning), Wave 18E (Partner Revenue Network) e integrações sistêmicas pesadas (ERPs globais, gateways de pagamento, plataformas de Customer Success).
