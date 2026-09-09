# I18N & Localization Compliance Policy
**Status**: ENFORCED 🔴
**Escopo**: UI Layer (`src/components/**`, `src/pages/**`, `src/workspace/**`)
**Aprovação**: Wave 2B.6 Architecture Stabilization & Adoption Gate

## 1. Visão Geral
A Internacionalização (i18n) e Localização (l10n) no Illumine Executive Workspace é uma **capability arquitetural isolada** regida por fronteiras estritas. Não é uma configuração cosmética, e o não cumprimento desta policy resultará em falha no CI/CD via **Adoption Gate**.

O modelo atual estabelece duas fronteiras intransponíveis para qualquer componente visual:
1. **Dynamic Data Boundary**: Separa os dados de back-end das formatações regionais e monetárias.
2. **Semantic Translation Boundary**: Isola termos de domínio e status do hardcode do componente.

---

## 2. Dynamic Data Boundary

### 🚫 PROIBIDO
Qualquer tentativa de acoplamento direto das APIs nativas do browser na Experience Layer é proibida.

Não faça isso em componentes visuais:
```ts
// ❌ Rejeitado no PR
const valor = revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const taxa = new Intl.NumberFormat('en-US').format(ratio);
const data = new Date().toLocaleDateString();
const hora = new Date().toLocaleTimeString();
```

### ✅ PERMITIDO
O formatador executivo centralizado é a única fonte da verdade. Ele já possui ciência do *Locale Context* e do *Tenant Configuration*.

Faça assim:
```ts
import { useExecutiveFormatter } from '@illumine/core/localization'; // (ou path relativo equivalente)

const formatter = useExecutiveFormatter();

// ✅ Aprovado
const revenueFormatado = formatter.currency(150000);
const dataFormatada = formatter.date(createdAt);
const percentual = formatter.percentage(0.45);
const score = formatter.score(87);
```

---

## 3. Semantic Translation Boundary

### 🚫 PROIBIDO
Termos operacionais, cognitivos ou taxonomia do Illumine **NÃO** podem ficar embutidos (*hardcoded*) como strings de domínio visual nos componentes.

Não faça isso:
```tsx
// ❌ Rejeitado no PR
<ExecutiveBadge variant="critical">
  Crítico
</ExecutiveBadge>

<ExecutiveBadge variant="healthy">
  Saudável
</ExecutiveBadge>

<p>Recomendação de Compra</p>
```

### ✅ PERMITIDO
Os domínios semânticos devem ser externalizados e consultados via i18n na UI, ou injetados pelos *Governance Engines* (que geram as chaves baseadas na Data Layer).

Faça assim:
```tsx
import { useTranslation } from 'react-i18next';

// ✅ Aprovado
const { t } = useTranslation('executive');

<ExecutiveBadge variant="critical">
  {t('status.critical')}
</ExecutiveBadge>

<ExecutiveBadge variant="healthy">
  {t('status.healthy')}
</ExecutiveBadge>
```

---

## 4. Auditoria Contínua (CI Gate)
Toda PR passa pelo script de validação (`npm run audit:i18n`). 
O script avalia as estruturas AST/Regex buscando ocorrências ilícitas na Experience Layer. Falhas nesta barreira bloquearão o Build automaticamente.

*Assinatura de Sistema (AIOX / Codex CLI)*
