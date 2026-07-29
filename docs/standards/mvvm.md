# MVVM & Clean Architecture Standards

**Norma de Separação de Camadas, Descoupling e Limites de Complexidade de Software**

---

## 1. Pipeline de Camadas
$$\text{View (.tsx)} \longleftrightarrow \text{ViewModel (use[Page]ViewModel.ts)} \longleftrightarrow \text{Services / Runtime Engines} \longleftrightarrow \text{Repositories / APIs}$$

---

## 2. Regras de Ouro MVVM (`MUST`)
1. **View Passiva**: A View apenas renderiza JSX e dispara callbacks do ViewModel.
2. **Zero API na View**: Proibido `fetch`, `axios` ou chamadas diretas de banco na View.
3. **Zero Cálculos na View**: Proibidas regras de eliminação contábil, somas ou agrupamentos na View.
4. **Limite de 500 Linhas**: Arquivos `.tsx` com mais de 500 linhas devem ser fatorados.
5. **Máximo 10 Hooks na View**: Agrupar estado e efeitos no ViewModel correspondente.
