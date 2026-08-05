# Arquitetura de Rotas e Localização

**Data:** Agosto 2026
**Wave:** 2A.5 / 2A.6
**Status:** Implementado

Este documento detalha a arquitetura internacional de rotas, SEO e localização adotada para o Illumine OS™.

## 1. Internacionalização Base (i18next)
O core de localização consome `react-i18next`. A aplicação trabalha com múltiplos namespaces (`common`, `institutional`, `seo`, etc) divididos em três diretórios:
- `pt-BR/`
- `en-US/`
- `es-ES/`

O `LocaleProvider` foi refatorado para inspecionar o prefixo da rota atual (ex: `/en`, `/pt`) antes de verificar o `localStorage`, garantindo que URLs compartilhadas renderizem no idioma correto no primeiro acesso.

## 2. Arquitetura de Rotas
A configuração de rotas é definida no arquivo `src/core/routing/internationalRoutes.ts`.
- Não utilizamos rotas estáticas `hardcoded` em inglês no `App.tsx`. 
- Todas as rotas base são prefixadas pelo respectivo idioma: `/pt`, `/en`, `/es`.
- Cada rota (ex: `platform`) possui sua variação idiomática: `/pt/plataforma`, `/en/platform`, `/es/plataforma`.

Isto garante aderência total às diretrizes de SEO global.

## 3. Arquitetura de SEO
Implementamos `react-helmet-async` como a engine principal para gerenciar o `<head>`, injetada globalmente via `SeoProvider`.
- O `SeoManager` atua como wrapper de negócio. 
- Ele recebe a `pageKey` correspondente à página atual e solicita ao hook dinâmico `useSeo.ts` as configurações traduzidas.
- É responsável pela injeção automática das meta tags `OpenGraph`, `Twitter Cards`, `Canonical` e `Hreflang`.

## 4. Brand Glossary
Termos proprietários são geridos pelo `brand-glossary.json`, evitando corrupção de marcas registradas durante processos de expansão idiomática, mantendo a consistência global.

## 5. Próximos Passos
- Geração estática (SSR/SSG) se for necessária, bastando migrar o renderizador de `<Helmet>` no Next.js (se houver migração de framework).
- Mapeamento dinâmico no Sitemap e injeção do JSON-LD no SeoManager via props.
