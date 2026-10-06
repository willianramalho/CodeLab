# Checklist de Alcançabilidade — Atividade 07, Parte B (Etapa 4)

Resposta por escrito ao checklist de alcançabilidade pedido na Etapa 4 da Parte B,
juntando as regras já cobradas nas Aulas 03, 04, 05 e 06 e aplicadas à tela nova desta
atividade, "Enviar Desafio" (`/challenges/upload`).

## A tela nova (Enviar Desafio, `/challenges/upload`) é alcançável exclusivamente navegando a partir da LandingPage, sem digitar nenhuma URL? Qual é o caminho exato de cliques?

**Sim.** O caminho de cliques, partindo de `/` (LandingPage), sem nenhuma URL digitada:

1. `/` (Landing) → Navbar, link **"Entrar"**.
2. `/login` → preencher e-mail/senha (`teste@email.com` / `123456`) → botão **Entrar**.
3. Login bem-sucedido → redireciona para `/feed` (destino padrão pós-login,
   `LoginView.vue`).
4. Em `/feed` (ou em qualquer outra tela, já que a Navbar é global) → Navbar, link novo
   **"Enviar Desafio"**.
5. `/challenges/upload` — tela de envio, carregada sem reload.

Esse é o mesmo padrão exigido pela Aula 03 ("existe algum jeito de um visitante não
logado chegar até `/register` clicando em algo, não só digitando a URL?") e pela Aula 05
("Exclusivamente, navegando a partir da LandingPage, e sem digitar nenhuma URL
manualmente...").

## Onde fica o link, Navbar ou Sidebar, e por que esse lugar faz mais sentido no layout do CodeLab?

**Navbar.** Três motivos:

- É o mesmo padrão do link "Meu Perfil", adicionado na Aula 05: ações ligadas à conta e à
  autoria do próprio usuário ficam na Navbar, não na Sidebar.
- A Sidebar do CodeLab reúne destinos de navegação/consumo (Feed, Buscar, Meus Desafios,
  Notificações), e quase todos ainda são placeholders de aulas futuras. "Enviar Desafio"
  é uma **ação de criação de conteúdo**, hoje a única funcional de conteúdo no projeto —
  não um destino de consulta.
- A Navbar aparece em todas as telas do layout autenticado, inclusive nas próprias telas
  de formulário, então o link fica sempre visível e com um clique de distância, não
  importa em qual tela o usuário esteja.

O enunciado da Atividade 07 deixa essa escolha livre ("Navbar ou Sidebar, o que fizer
mais sentido no seu layout"); a Navbar foi a opção coerente com a decisão já tomada na
Aula 05.

## Quem vê o link? Ele aparece só para usuários autenticados?

**Sim.** O link fica dentro de `<template v-if="isAuthenticated">`, em
`src/components/layout/TheNavbar.vue`, no mesmo bloco onde já estava o link "Meu Perfil"
(Aula 05). `isAuthenticated` vem do composable `useAuth()` (Aula 06), que lê o estado da
store de autenticação. Para um visitante deslogado, a Navbar mostra só "Início",
"Entrar" e "Criar Conta" — nem o DOM do link "Enviar Desafio" é renderizado.

## O que acontece se um visitante deslogado digitar `/challenges/upload` direto na barra de endereço?

O guarda de rota global (`router.beforeEach`, em `src/router/index.js`), combinado com
`meta: { requiresAuth: true }` na rota, redireciona para
`/login?redirect=/challenges/upload`. Depois de um login bem-sucedido a partir dessa
tela, o fluxo volta exatamente para `/challenges/upload` — o mesmo comportamento que a
Aula 04 já exigia para toda rota protegida.

## Ao clicar no link, a URL muda sem recarregar a página? Como isso foi comprovado?

**Sim.** O link é um `<router-link :to="{ name: 'challenge-upload' }">`, que navega pela
History API do Vue Router (SPA), em vez de um `<a href>` comum. Prova sugerida no
roteiro (Bloco 16): no Console do DevTools, antes de clicar, rodar
`window.__semReload = 'ok'`; depois de clicar no link e a URL mudar para
`/challenges/upload`, rodar `window.__semReload` de novo — se ainda imprimir `'ok'`, a
página não recarregou (um reload de verdade apagaria essa variável, porque reinicia o
contexto JS). Complementarmente, a aba Network não deve mostrar nenhuma requisição do
tipo *document* no momento do clique.

## O link aponta para uma funcionalidade que já existe de ponta a ponta hoje (API + tela)?

**Sim.** Tanto `POST /api/challenges` (back-end) quanto a `UploadView.vue` funcional
(front-end, com formulário real, prévia de código, barra de progresso e mensagens de
sucesso/erro) nasceram nesta própria Atividade 07. O link não aponta para nenhuma
funcionalidade ainda inexistente, respeitando a regra da Aula 06 ("Nenhum link novo
aponta para uma funcionalidade que seu projeto ainda não construiu").

## Inventário: para cada rota do `router/index.js`, como chegar clicando hoje? Se ainda não há link ou é placeholder, qual é a aula futura nomeada?

| Rota | `name` | View | Proteção | Caminho de clique hoje | Situação | Aula futura nomeada |
|---|---|---|---|---|---|---|
| `/` | `landing` | `LandingView.vue` | pública | Navbar: marca "Code-Lab" e "Início" | funcional | — |
| `/login` | `login` | `auth/LoginView.vue` | pública | Navbar "Entrar" (deslogado) | funcional (Aula 04) | — |
| `/register` | `register` | `auth/RegisterView.vue` | pública | Navbar "Criar Conta" (deslogado) | funcional (Aulas 03 e 06) | — |
| `/feed` | `feed` | `FeedView.vue` | `requiresAuth` | Sidebar "Feed"; destino pós-login | placeholder ("Feed (Aula 08)") | **Aula 08** |
| `/challenges/upload` | `challenge-upload` | `UploadView.vue` | `requiresAuth` | **Navbar "Enviar Desafio" (novo, nesta atividade)** | **funcional (Aula 07)** | — |
| `/challenges/:id` | `challenge-detail` | `ChallengeDetailView.vue` | pública | sem link ainda (precisa de um `id` real) | placeholder ("Detalhe do Desafio (Aula 08)") | **Aula 08** |
| `/challenges/:id/edit` | `challenge-edit` | `EditChallengeView.vue` | `requiresAuth` | sem link ainda | placeholder ("Editar Desafio (Aula 09)") | **Aula 09** |
| `/my-challenges` | `my-challenges` | `MyChallengesView.vue` | `requiresAuth` | Sidebar "Meus Desafios" | placeholder ("Meus Desafios (Aula 09)") | **Aula 09** |
| `/profile/me` | `my-profile` | `profile/MyProfileView.vue` | `requiresAuth` | Navbar "Meu Perfil" | funcional (Aula 05) | — |
| `/profile/:username` | `public-profile` | `profile/PublicProfileView.vue` | pública | sem link ainda | placeholder ("Perfil Público (Aula 09)") | **Aula 09** |
| `/search` | `search` | `SearchView.vue` | pública (link só aparece logado, na Sidebar) | Sidebar "Buscar" | placeholder ("Busca (Aula 13)"); a API `GET /api/search` já existe desde a Aula 02 | **Aula 13** |
| `/notifications` | `notifications` | `NotificationsView.vue` | `requiresAuth` | Sidebar "Notificações" | placeholder ("Notificações (Aula 14)") | **Aula 14** |
| `/admin/dashboard` | `admin-dashboard` | `admin/AdminDashboardView.vue` | `requiresAuth` + `requiresAdmin` | sem link ainda | placeholder ("Dashboard Admin (Aula 15)") | **Aula 15** |
| `/admin/reports` | `admin-reports` | `admin/AdminReportsView.vue` | `requiresAuth` + `requiresAdmin` | sem link ainda | placeholder ("Denúncias (Aula 15)") | **Aula 15** |
| `/admin/users` | `admin-users` | `admin/AdminUsersView.vue` | `requiresAuth` + `requiresAdmin` | sem link ainda | placeholder ("Usuários (Aula 15)") | **Aula 15** |
| `/admin/challenges` | `admin-challenges` | `admin/AdminChallengesView.vue` | `requiresAuth` + `requiresAdmin` | sem link ainda | placeholder ("Desafios (Aula 15)") | **Aula 15** |
| `/:pathMatch(.*)*` | `not-found` | `NotFoundView.vue` | pública | nunca linkada (qualquer URL inexistente cai aqui) | funcional | — |

## Existe alguma tela alcançável só por URL digitada? Se sim, por quê, e quando ganha caminho de clique?

**Sim, e todas são justificadas:**

- `/challenges/:id` (Detalhe do Desafio) precisa de um `id` real para existir — o caminho
  de clique nasce na **Aula 08**, quando o Feed passa a renderizar cards de desafios com
  esse `id`.
- `/challenges/:id/edit` (Editar Desafio) e `/profile/:username` (Perfil Público) também
  precisam de um `id`/`username` concreto; o caminho de clique nasce na **Aula 09**.
- As 4 rotas de admin (`/admin/dashboard`, `/admin/reports`, `/admin/users`,
  `/admin/challenges`) ainda não têm nenhum link porque o painel administrativo é
  construído na **Aula 15**.
- `/:pathMatch(.*)*` (NotFound) por definição nunca é linkada — ela só existe para
  capturar qualquer URL que não bata com nenhuma rota.

Nenhum link hoje existente na Navbar ou na Sidebar aponta para uma tela sem aula futura
nomeada — os links da Sidebar para Feed (Aula 08), Meus Desafios (Aula 09), Buscar (Aula
13) e Notificações (Aula 14) já vêm do layout da Aula 01 e todos têm aula futura
registrada, seguindo o mesmo raciocínio da Aula 06 ("toda pendência precisa de uma aula
futura nomeada").

## Conclusão

A tela "Enviar Desafio" não repete o problema que a Aula 05 já corrigiu uma vez no
CodeLab (uma tela nova alcançável só por URL digitada): ela tem um link novo e visível na
Navbar, dentro do bloco de usuário autenticado, aponta para uma funcionalidade que já
existe de ponta a ponta nesta mesma atividade, e a navegação até ela é 100% feita por
clique a partir da LandingPage, sem nenhuma URL digitada manualmente e sem recarregar a
página. O acesso direto e deslogado continua protegido pelo guarda de rota, que
redireciona para o login com `?redirect=`. O restante do inventário de rotas segue a
mesma disciplina: toda tela ainda placeholder tem uma aula futura nomeada, e nenhum link
novo aponta para funcionalidade inexistente.
