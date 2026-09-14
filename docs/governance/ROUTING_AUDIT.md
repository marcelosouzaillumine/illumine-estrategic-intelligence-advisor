# Routing Audit & Canonicalization Rules

**Date:** 2026-08-03
**Wave:** 2A.7 — International Routing Canonicalization & URL Architecture

Este documento consolida a auditoria e as regras finais estabelecidas para a arquitetura de roteamento internacional da Illumine, garantindo consistência, governança global e conformidade em SEO técnico.

---

## 1. Princípios Arquiteturais Globais

A Illumine adota a estratégia de roteamento de **Slugs Canônicos** combinada a **Diretórios de Idioma**, o que elimina slugs múltiplos para a mesma página.

### Regra de Ouro:
> **Os slugs não devem ser traduzidos.**
> O conteúdo é traduzido; a URL permanece canônica e previsível.

* **Incorreto:** `/pt/plataforma`, `/en/platform`, `/es/plataforma`
* **Correto:** `/pt/platform`, `/en/platform`, `/es/platform`

---

## 2. Padrão de URL

Toda URL da Public Experience (e das futuras extensões internacionais da plataforma) deve seguir rigorosamente a estrutura:

```
[Domínio]/[Locale]/[Slug-Canônico]
```

Exemplo: `https://illuminegovernance.com/pt/platform`

### Casos de Exceção e Redirecionamentos

1. **Acessos na Raiz (`/`)**: A aplicação verifica, em ordem:
   - Idioma salvo no `localStorage` (preferência de usuário).
   - `navigator.language` do browser.
   - Padrão `pt-BR`.
   *Ocorre um redirecionamento imediato para `/[locale]` correspondente (ex: `/pt`).*

2. **Acessos sem Prefixo de Idioma (`/platform`)**:
   - Interceptados na camada de `<Routes>` e redirecionados para a versão correspondente no idioma atual: `/[locale]/platform`.

---

## 3. Registro Canônico Oficial (RouteKeys)

As únicas chaves permitidas para a navegação pública e que estão documentadas no TypeScript (em `internationalRoutes.ts`) são:

| RouteKey            | Slug Canônico        | Contexto / Página correspondente            |
|---------------------|----------------------|---------------------------------------------|
| `HOME`              | `/`                  | InstitutionalHomePage                       |
| `MANIFESTO`         | `/manifesto`         | InstitutionalManifestoPage                  |
| `WHY`               | `/why-illumine`      | InstitutionalWhyPage                        |
| `PLATFORM`          | `/platform`          | InstitutionalPlatformPage                   |
| `DOMAINS`           | `/domains`           | InstitutionalDomainsPage                    |
| `GOVERNANCE`        | `/governance`        | InstitutionalGovernancePage                 |
| `GOVERNANCE_CENTER`| `/governance-center`| InstitutionalGovernanceCenterPage       |
| `ASSESSMENT`        | `/assessment`        | ExecutiveAssessmentPage                     |
| `CONTACT`           | `/contact`           | Contato Institucional / Form                |
| `PARTNERS`          | `/partners`          | Parceiros Globais (em roadmap)              |

**Todas as chamadas de navegação** (`Link`, `navigate`, etc) na Public Experience obrigatoriamente utilizam `getLocalizedRoute('KEY', lang)`.

---

## 4. Estratégia de Legacy Aliases (Compatibilidade)

Visando não comprometer o ranqueamento orgânico pré-existente e os links compartilhados externamente, os slugs originais em português (da V1) não respondem com `404`.

Eles foram registrados em um `legacyAliases` central que os intercepta via roteador e efetua o redirecionamento semântico (o que num ambiente Node SSR funcionaria como 301, e na SPA opera via `<Navigate replace />`).

**Mapa de Migração Ativa:**
- `/plataforma` → Redireciona para `/[locale]/platform`
- `/governanca` → Redireciona para `/[locale]/governance`
- `/dominios` → Redireciona para `/[locale]/domains`
- `/diagnostico` → Redireciona para `/[locale]/assessment`
- `/centro-de-inteligencia` → Redireciona para `/[locale]/governance-center`
- `/por-que-illumine` → Redireciona para `/[locale]/why-illumine`
- `/parceiros` → Redireciona para `/[locale]/partners`
- `/contato` → Redireciona para `/[locale]/contact`

*(Qualquer expansão desse pool herdado deve ser feita EXCLUSIVAMENTE modificando `legacyAliases` no registro global).*

---

## 5. Testes e Qualidade (Vitest)

A suíte de testes em `tests/i18n-routing.test.ts` implementada nesta Wave garante perpetuamente que a arquitetura não sofra regressões. Ela valida que:

1. Todas as rotas produzem links adequados para `pt-BR`, `en-US` e `es-ES`.
2. As tags canônicas do SEO são absolutas e invariáveis.
3. As Tags `hreflang` estão mapeadas universalmente e incluem o `x-default` apontando sempre para o inglês (`en`).
4. O ecossistema de Aliases resolve adequadamente para um `RouteKey` real.
5. Não ocorra acidentalmente a tradução de nenhum novo slug adicionado à plataforma.
