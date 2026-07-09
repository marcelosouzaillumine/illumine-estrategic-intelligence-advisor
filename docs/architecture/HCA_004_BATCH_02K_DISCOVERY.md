# HCA-004 Batch 2K: Break the 200 Barrier - Discovery

## 1. Contexto e Diretriz
Seguindo a recomendação de realizar uma última incursão leve na camada de UI antes de iniciar o HCA-005 (Services), mapeamos os próximos ofensores diretos. O objetivo central é superar o marco de 200 violações remanescentes de maneira limpa e de baixíssimo risco.

- **Threshold Atual:** 206 violações.
- **Meta (Break the 200 Barrier):** < 200 violações.
- **Status:** **Discovery Mode** (Nenhum código foi alterado).

## 2. Radiografia Restante da Camada UI
Focamos em componentes que apresentam alto acoplamento sintático, mas cuja dependência do Firebase é simples ou até mesmo inexistente na prática.

| Componente UI | Violações | Complexidade / Severidade | Justificativa |
|---|---|---|---|
| `ControladoriaPage.tsx` | 3 | **SAFE** | Imports diretos do Firebase e `onSnapshot` constam no cabeçalho, mas **nunca são usados** no código. Refatoração trivial (remoção de dead code). |
| `DFCPage.tsx` | 3 | **SAFE** | Uso restrito da API do Firestore (`getDocs`, `deleteDoc`) na função `handleClearData`. A abstração é isolada. |
| `EFOSPage.tsx` | 3 | **SAFE** | Chamada isolada (`query`, `getDocs`) ao Firestore. Lógica simples extraível para adaptador. |
| `AxisDashboardPage.tsx` | 3 | **MEDIUM** | Múltiplos hooks institucionais e queries compostas. Fora do escopo. |
| `DashboardPage.tsx` | 3 | **HIGH** | Dashboard central; altíssima volumetria de queries e sub-componentes. Fora do escopo. |

## 3. Sugestão de Intervenção (Top 3 Alvos)
A intervenção nestes 3 arquivos garantirá uma descida de aproximadamente 9 violações de maneira limpa:

1. **`ControladoriaPage.tsx`**
   - *Escopo:* Apenas remover os imports não utilizados do Firebase.
2. **`DFCPage.tsx`**
   - *Escopo:* Isolar a deleção em massa (`handleClearData`) num adapter `useDFCPageAdapter`.
3. **`EFOSPage.tsx`**
   - *Escopo:* Extrair a query da coleção `financial_entries` para um adapter `useEFOSPageAdapter`.

**Impacto Projetado do Lote 2K:** 206 → ~197 violações.

## 4. Avaliação Rumo ao HCA-005
Ao executar este último Batch (2K), quebraremos definitivamente a barreira psicológica e técnica das 200 violações (originalmente eram 297). Teremos limpado todo o "low-hanging fruit" da camada de Apresentação de forma segura. Após a execução, o HCA-005 será o próximo marco óbvio.

---
*Aguardando aprovação explícita para executar a quebra da barreira das 200 violações!*
