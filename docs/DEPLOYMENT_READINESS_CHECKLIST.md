# Deployment Readiness Checklist (RC-1)

Este checklist garante que a fundação arquitetural da plataforma Illumine encontra-se testada, documentada e apta para as etapas de *Staging*, *Demonstração Executiva* e liberação de acesso controlado (*Beta/Piloto*).

### 🛠️ 1. Governança e Segurança Técnica
- [x] O `typecheck` e o `build` executam sem falhas ou _warnings_ críticos.
- [x] A auditoria `npm run governance:audit` retorna "100% Runtime-Compliant".
- [x] Nenhuma API Key ou secret (Firebase, OpenAI, etc) está preenchida ("hardcoded") nos repositórios.
- [x] O *Sandbox* do motor de cenários (*Scenario Intelligence*) garante o não-vazamento (mutação indevida) para os dados originais do Tenant.

### 🧪 2. Certificação Funcional e Testes (102 Golden Tests)
- [x] A simulação temporal atesta que *Deterioração de Caixa* prevê e calcula corretamente um colapso.
- [x] A *Intercompany Elimination Engine* prova a eliminação correta de transferências intragrupo.
- [x] A *Consolidated Stress Propagation Engine* transmite causais e rupturas entre entidades do grupo econômico sem gerar falso contágio.
- [x] Regras de Permissão garantem que não existe *Cross-Tenant Leakage* (Isolamento B2B) nos dados acessados em tempo de execução.
- [x] Nenhuma interface UI computa dados matemáticos diretamente no React (*Dummy Renderer Doctrine*).

### 🧑‍💼 3. Demonstração Executiva (Board Review)
- [ ] O *Systemic Heatmap UI* renderiza com sucesso as arestas e avisos de confiança (*Low Confidence / Unverified Dependency*).
- [ ] O painel *Executive Decision Advisory* reflete fielmente o output gerado via motor causal.
- [ ] A massa de dados para o roteiro de Demonstração (Mocks Específicos) está limpa e testável no ambiente isolado do Sandbox.
- [ ] Roteiro de demonstração end-to-end (Navegação baseada em *Storytelling* de resgate financeiro) documentado.

### 🌍 4. Deploy Infrastructure (Vercel / Netlify / AWS)
- [ ] Variáveis de ambiente configuradas no painel do provedor (Vite Env, API Endpoints, etc).
- [ ] Script de build atualizado no CI/CD para incluir `npm run governance:audit` e barrar pushes não governados.
- [ ] Redirecionamento de rotas tratadas no front-end para Single Page Application (SPA).

### 📅 5. Planejamento Próxima Release (Post-RC1)
- [ ] Realizar retrospectiva de Débito Técnico da Fase de Estabilização e mapear tickets.
- [ ] Iniciar arquitetura de *Onboarding Institucional* e *Setup do Cliente*.
- [ ] Esboçar *Design Review* das telas de Relatórios Preditivos.
