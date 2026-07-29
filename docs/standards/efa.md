# Executive Functional Architecture (EFA) Standard

**Padrão Normativo de Layouts para Páginas Operacionais, CRUDs, Importação e Configurações**

---

## 1. Escopo de Aplicação (`MUST`)
Obrigatório para telas de cadastro de clientes, parceiros, usuários, upload de arquivos, plano de contas, preferências e atuações administrativas.

---

## 2. Layouts Canônicos EFA
- **`MasterDetailLayout`**: Lista Master pesquisável à esquerda + Workspace de Detalhes em abas à direita.
- **`SettingsLayout`**: Navegação vertical por abas + Autosave com feedback por Toast.
- **`PipelineLayout` / Dropzone**: Importação de arquivos com pré-validação de schema em tempo real.
- **`WizardLayout`**: Formulários guiados em etapas.
- **`SplitViewLayout`**: Leitura de atas/documentos + Edição lateral.
- **`TreeMapperLayout`**: Estrutura em árvore expansível para Plano de Contas e De-Para contábil.
