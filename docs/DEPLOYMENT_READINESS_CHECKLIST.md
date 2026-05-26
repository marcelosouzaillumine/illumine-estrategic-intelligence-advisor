# DEPLOYMENT_READINESS_CHECKLIST

Esta checklist garante que a baseline RC-1 esteja 100% pronta para ser ativada no ambiente de produção/staging com dados reais.

## 1. Configuração e Infraestrutura
- [ ] **Variáveis de Ambiente**: Todas as vars configuradas corretamente (Vite/Firebase, URLs de API).
- [ ] **Firebase/Config**: Regras de segurança (Firestore Rules) e configurações de Auth/Storage em conformidade.
- [ ] **Build Produtivo**: Executado `npm run build` com sucesso sem erros impeditivos de bundlesize ou dependências (Vite build OK).
- [ ] **Backups**: Política de backup ativada para o banco de dados antes da primeira inserção de dados reais.

## 2. Acesso e Governança
- [ ] **Autenticação**: Google SSO e fallback email/password funcinando e validados.
- [ ] **Permissões**: Hierarquia de acessos (`TenantExecutionContext`, RBAC) testada e sem vazamentos cross-tenant.

## 3. Experiência de Usuário (UI/UX)
- [ ] **Rotas**: Navegação de rotas, middlewares de proteção (Guardas de Rota) ativos e impedindo acessos indevidos.
- [ ] **EmptyStates**: Telas de estado vazio (quando não há dados) estão amigáveis e guiando o usuário para ações válidas (Onboarding/Staging).

## 4. Ingestão e Validação
- [ ] **Dados Reais**: Procedimento de ativação controlada desenhado. Staging validation path habilitado para receber os primeiros lotes de dados.
- [ ] **Smoke Tests**: Conjunto mínimo de testes de conectividade (login, upload, visualização básica) mapeado para execução pós-deploy.

## 5. Resiliência
- [ ] **Observabilidade**: Sistema capaz de registrar logs essenciais de erro, auditoria de governança (Governance Engine Log) e warnings críticos de performance.
- [ ] **Rollback**: Procedimento de rollback para a hash `19dbfdcb0076f0b6ec1fd835c53d41ff1d6c869b` testado e documentado.

---
**Status**: PENDENTE (Aguarda execução no ambiente de produção).
