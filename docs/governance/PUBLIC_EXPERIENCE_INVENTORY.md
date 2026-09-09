# Public Experience Inventory

Este documento serve como mapa arquitetural e de governança para as páginas de acesso público (não-autenticadas) da Illumine. Ele define o que é o novo padrão institucional, o que é legado e quais componentes estão autorizados a receber internacionalização na **Wave 2A**.

> **Regra Arquitetural da Wave 2A**: "Somente conteúdo institucional aprovado (V2) entra no sistema multilíngue. Páginas legadas, experimentais ou em redirecionamento não devem ser migradas, para evitar complexidade e perda de foco."

---

## 1. Novo Site Institucional (Public V2)
**Caminho Base**: `src/components/pages/public/v2/`
**Decisão**: **MIGRAR** para a infraestrutura i18next.

| Página / Componente | Caminho | Namespace Alvo | Prioridade |
|---|---|---|---|
| **InstitutionalLayout (Header/Footer)** | `/public/v2/InstitutionalLayout.tsx` | `navigation`, `footer` | Alta |
| **Home Institucional** | `/public/v2/InstitutionalHomePage.tsx` | `institutional` | Alta |
| **Manifesto (Tese)** | `/public/v2/InstitutionalManifestoPage.tsx` | `institutional` | Alta |
| **Por que Illumine** | `/public/v2/InstitutionalWhyPage.tsx` | `institutional` | Alta |
| **Plataforma** | `/public/v2/InstitutionalPlatformPage.tsx` | `platform` | Média |
| **Domínios (Governance)** | `/public/v2/InstitutionalDomainsPage.tsx` | `domains` | Média |
| **Governança** | `/public/v2/InstitutionalGovernancePage.tsx` | `governance` | Média |
| **Centro de Inteligência** | `/public/v2/InstitutionalGovernanceCenterPage.tsx` | `institutional` | Baixa |
| **Executive Assessment** | `/public/v2/ExecutiveAssessmentPage.tsx` | `institutional` | Baixa |
| **Evolution Timeline** | `/public/v2/EvolutionTimeline.tsx` | `institutional` | Baixa |
| **Thesis Page** | `/public/v2/InstitutionalThesisPage.tsx` | *Ver Manifesto* | - |

---

## 2. Área Pública Legada
**Caminho Base**: `src/components/pages/public/`
**Decisão**: **CONGELAR/AVALIAR** (Não aplicar internacionalização na Wave 2A).

| Página | Caminho | Status Atual | Decisão |
|---|---|---|---|
| **EmpresasPage** | `/public/EmpresasPage.tsx` | Legado | Congelar (Será substituída) |
| **DiagnosticoPage** | `/public/DiagnosticoPage.tsx` | Legado | Congelar |
| **ReferralProgramPage** | `/public/ReferralProgramPage.tsx` | Legado | Congelar |
| **ExecutiveAdvisorNetworkLandingPage** | `/public/ExecutiveAdvisorNetworkLandingPage.tsx` | Transição | Avaliar migração futura para `advisory` / `partners` |
| **ExecutivePlatformLandingPage** | `/public/ExecutivePlatformLandingPage.tsx` | Transição | Avaliar migração futura para `platform` |
| **HomePage (Old)** | `/public/HomePage.tsx` | Obsoleto | Remover/Redirecionar |
| **LoginPage** | `/public/LoginPage.tsx` | Ativo | Exceção: Migrar para namespace `common` |

---

## Namespaces da Área Pública

De acordo com o novo posicionamento, a arquitetura de tradução refletirá os pilares estratégicos da plataforma:

- **`institutional.json`**: Core messaging, Manifesto, Home e Why Illumine.
- **`platform.json`**: Arquitetura, módulos e visão de produto.
- **`domains.json`**: Áreas de inteligência (Cognitive, Fiduciary, etc).
- **`advisory.json`**: Posicionamento de Advisory e Executive Network.
- **`partners.json`**: Relacionamento com contadores e consultores.
- **`pricing.json`**: Oferta comercial, CTA e conversão.
- **`navigation.json`**: Menus, headers e rotas.
- **`footer.json`**: Rodapé, links legais e estrutura inferior.
- **`seo.json`**: Meta-tags, open-graph e titles estáticos.
