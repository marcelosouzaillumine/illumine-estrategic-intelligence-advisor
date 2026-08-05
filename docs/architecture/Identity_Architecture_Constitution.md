# Identity Architecture Constitution

## Princípio Fundamental
A identidade na plataforma Illumine está estritamente dividida em duas responsabilidades distintas: a **Identidade Técnica** e a **Identidade Executiva**. Jamais devemos misturar o ciclo de vida da autenticação com o contexto de negócios do usuário.

## 1. Definição de Usuário
Um Usuário na plataforma não é apenas um email com uma senha. Ele é um nó em uma rede de relações de negócio.
A plataforma reconhece o usuário através do seu identificador técnico primário (`uid`), mas este `uid` em si não concede acesso a nenhum dado de negócio isoladamente.

## 2. Sessão
A sessão de usuário é gerida em duas etapas:
1. **Sessão Técnica**: Gerida exclusivamente pelo Firebase Auth. Fornece tokens de acesso (JWT) e valida a criptografia, data de expiração e mecanismo de login.
2. **Sessão Executiva (Executive Context)**: Mantida em memória pela aplicação React (através do `ExecutiveContextProvider`), ela carrega a identidade de negócio após a autenticação. É o único objeto que a UI deve consultar para decisões.

## 3. Identidade Técnica vs Executiva

### Identidade Técnica (Firebase Auth)
- **Escopo:** Controle de credenciais, senhas, MFA, integração com provedores (Google, Apple).
- **Proibições:** Proibido armazenar regras de negócio, lista de clientes do usuário (tenants) ou roles empresariais nas Custom Claims do Firebase Auth (salvo exceção restrita de roles sistêmicos vitais para a segurança inicial da infraestrutura).

### Identidade Executiva (Domain Services)
- **Escopo:** Carregada pelo `IdentityService` a partir de `Persistence Contracts`. Detém o mapeamento real do perfil do usuário (`Profile`), os vínculos empresariais, as capacidades autorizadas e o contexto atual da sessão.
- **Integração:** Toda a UI interage com a Identidade Executiva via hook `useExecutiveContext()`. Nenhuma interface importa `firebase/auth` para tentar descobrir quem é o usuário em termos de negócio.

## 4. Responsabilidades do Firebase Auth
O Firebase Auth atua puramente como nosso "Identity Provider (IdP)" terceirizado.
- O único dado de negócio que pode "vazar" do Firebase Auth é o fato de que a pessoa "é quem diz ser".
- Quando o componente `<App />` monta, ele intercepta o evento `onAuthStateChanged`. Imediatamente, ele repassa o `uid` para o `IdentityService` iniciar o ciclo de Identidade Executiva.
- Se a conta for deletada, ela deve ser deletada primeiramente na camada executiva (soft delete ou remoção de vínculos), seguida do encerramento técnico via Firebase Admin.
