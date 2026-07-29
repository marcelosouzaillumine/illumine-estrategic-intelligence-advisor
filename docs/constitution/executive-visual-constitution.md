# Executive Visual Constitution (EVC) — Illumine OS™

**Norma Soberana de Identidade Visual, Design System e Interfaces C-Level**

---

## 1. Filosofia de Design ("Quiet Luxury")
- **Executive Operating System**: Interface unificada de nível enterprise para alta gestão.
- **Quiet Luxury**: Elegância contida, acabamento refinado, zero ruído decorativo.
- **Autoridade Institucional**: Confiança gerada via consistência e rigor tipográfico.
- **Clareza sobre Decoração**: A estética é 100% subordinada à função decisória.
- **Tipografia sobre Cor**: A hierarquia é estabelecida por contraste tipográfico e composição espacial.

---

## 2. Níveis Normativos RFC 2119
- **`MUST` (Obrigatório / Bloqueante)**: `ExecutivePageTemplate` em EAA, Tokens (`bg-white` proibido), `PageHeader`, Contraste 100% em subtítulos.
- **`SHOULD` (Fortemente Recomendado)**: `ExecutiveAccordion` para seções secundárias, alinhamento topo de cards (`items-start`).
- **`MAY` (Opcional)**: Animações sutis e microinterações por contexto.

---

## 3. Governança de Cores & Design Tokens (`MUST`)
- **Superfícies Neutras**: `--color-background` (`#FAFBFC` / `#0E1C2C`), `--color-surface` (`#F8FAFC` / `#111F30`), `--color-card` (`#FFFFFF` / `#111F30`), `--color-border` (`#E2E8F0` / `rgba(255,255,255,0.1)`).
- **Proibição de Tailwind Hardcoded**: É estritamente proibido o uso de `bg-white`, `text-gray-500`, `border-slate-200` ou HEX solto fora de `index.css`.
- **Regra do Laranja**: Permitido apenas para branding, CTAs estratégicos e acentos institucionais secundários. Proibido em backgrounds ou textos corridos.

---

## 4. Tipografia & Contraste Absoluto (`MUST`)
- **`text-executive-primary`**: Títulos H1-H3, KPIs e scores.
- **`text-executive-secondary`**: Subtítulos executivos, narrativas e resumos (100% opacidade exigida; opacidade artificial ou `text-muted` em textos de leitura é **proibida**).
- **`text-executive-muted`**: Metadados auxiliares, timestamps e breadcrumbs.

---

## 5. Ícones Canônicos ("Quiet Luxury Boxes")
- **Biblioteca**: Exclusivamente `lucide-react`.
- **Containers**: `w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20` (Página/Hero) e `w-10 h-10 rounded-xl` (Módulo).
- **Anti-Achatamento**: Classe `shrink-0` compulsória em todo ícone Flexbox.
