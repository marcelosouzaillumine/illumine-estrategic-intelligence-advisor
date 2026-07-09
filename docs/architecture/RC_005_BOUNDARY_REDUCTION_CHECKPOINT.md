# RC-005: Boundary Reduction Checkpoint (Mid-Flight)

## 1. Status Geral do Programa HCA-004
O **HCA-004** (*UI Boundary Extraction Program*) foi instituído com a meta de remover dependências diretas de persistência, banco de dados (Firebase/Firestore) e autenticação da camada visual, empurrando-as para a fronteira correta por meio de *Thin Adapters*.

- **Baseline Inicial (Legacy Threshold):** 297 violações diretas (UI → Firebase/Core).
- **Status Atual (Pós Batch 2H):** 229 violações.
- **Redução Efetiva Acumulada:** -68 violações.
- **Progresso Relativo:** ~23% da dívida original de acoplamento UI mapeada e extirpada.

## 2. Abordagem Metodológica Utilizada
A redução foi alcançada através de lotes atômicos (Batches 2A a 2H) aplicando a seguinte heurística restritiva:
- **Alvos Seguros (SAFE):** Pequenos componentes visuais periféricos (páginas de acesso simples, modais, formulários).
- **Thin Adapter Pattern:** Remoção do `useContext` e imports diretos (como `collection`, `query`, `getDocs`, `db`) substituindo por hooks locais puros em `src/adapters/ui/`.
- **Zero Visual Impact:** Toda refatoração foi estritamente não intrusiva. Layouts, comportamento visual e lógicas de negócios fiduciárias permaneceram intocáveis.
- **Guardrails Automatizados:** A cada lote, garantimos integridade plena via `npm run typecheck`, `npm test` (para resguardar o Temporal Fiduciary Framework) e validação contra o limite descendente com `validate:architecture`.

## 3. Benefícios Estruturais Imediatos
- **Desacoplamento Visual:** Mais de 68 imports diretos foram removidos das Views, aumentando a coesão.
- **Testabilidade:** Ao isolar os componentes UI, torna-se possível testá-los sem mockar inteiramente as conexões Firestore.
- **Governança:** Formulários e Modais passam a obedecer um pipeline rastreável através dos adapters, preparando terreno para o Application Service Canonicalization.

## 4. Próximos Passos Recomendados
Embora a redução contínua em pequenos lotes ainda apresente excelente rendimento, observamos que a camada visual superficial começa a ser higienizada por completo. 

- **Plano de Curto Prazo:** Manter o processo iterativo de UI Boundary Reduction (Batches 2I em diante) aproveitando a tração atual e o baixo risco das alterações, buscando uma **nova meta de ~200 violações**.
- **Plano de Médio Prazo (HCA-005):** Ao encostar no limite das 200 violações, o problema remanescente mudará de natureza: de *UI Direct Access* para *ViewModel/Application Service Boundary Issues*. Nesse momento, deverá ser aberto o **HCA-005 (Application Services Canonicalization)** para reorganizar a camada de orquestração interna.
