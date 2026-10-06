# Checklists — Aula 01 a Aula 09 (CodeLab)

## Aula 01 — Parte A (Backend)

### Etapa 1 — Setup do ambiente
- [x] `node -v` e `npm -v` conferidos
- [x] Projeto criado com `npm init -y`

### Etapa 2 — Dependências e scripts
- [x] `express`, `cors`, `dotenv`, `morgan` instalados como dependências
- [x] `nodemon` instalado como devDependency
- [x] Scripts `start` e `dev` configurados no `package.json`

### Etapa 3 — Estrutura de pastas
- [x] Pastas `bin/`, `config/`, `middlewares/`, `modules/`, `routes/` criadas
- [x] `.gitignore` criado com `node_modules/` e `.env`

### Etapa 4 — Padrão único de resposta
- [x] `middlewares/apiResponse.js` criado com as funções `success` e `error`

### Etapa 5 — Rota GET /api
- [x] `routes/index.js` criado, com `name`/`message` adaptados ao CodeLab
- [x] Campo `data.status` escrito exatamente assim

### Etapa 6 — CORS
- [x] `.env` criado com `PORT=3000` e `CORS_ORIGIN=http://localhost:5173`

### Etapa 7 — app.js e bin/www
- [x] `app.js` criado, montando `indexRouter` sob o prefixo `/api`
- [x] `bin/www` criado
- [x] `npm run dev` sobe o servidor sem erros

### Etapa 8 — Teste isolado
- [x] `curl http://localhost:3000/api` responde o JSON esperado (validado nesta sessão)

## Aula 01 — Parte B (Frontend)

### Etapa 1 — Setup do projeto Vite
- [x] `npm run dev` sobe o front em `http://localhost:5173`

### Etapa 2 — Pastas e variáveis de ambiente
- [x] Estrutura `views/`, `components/`, `router/`, `services/`, `stores/` criada
- [x] `.env` com `VITE_API_URL=http://localhost:3000/api`
- [x] `.gitignore` configurado

### Etapa 3 — Vue Router
- [x] Tabela funcionalidade → tela preenchida (`Funcionalides-e-Telas.md`)
- [x] Tela placeholder criada para cada linha da tabela
- [x] `src/router/index.js` com todas as rotas, agora usando a nomenclatura
      correta da entidade (`challenge`), sem rotas de vídeo/playlist
- [x] Router registrado em `main.js`

### Etapa 4 — Layout base
- [x] `TheNavbar.vue`, `TheSidebar.vue`, `TheFooter.vue` criados e com links
      corrigidos para `/my-challenges` (sem mais "Meus Vídeos"/"Playlists")
- [x] Layout montado em `App.vue`, com `<router-view />`

### Etapa 5 — Consumindo a API na Landing
- [x] `LandingView.vue` consumindo `GET /api` e exibindo "Status da API: online"
- [ ] Prints da entrega (`curl-api.jpg`, `landing-status.jpg`, `erro-cors.jpg`)
      **ainda precisam ser capturados manualmente** com a API e o front rodando
      — não é possível gerar screenshots de navegador nesta sessão

## Aula 02 — Parte A (Backend — módulo search)

- [x] Pasta `modules/search/` criada com Route → Controller → Service
- [x] `searchService.js` devolve `{ challenges: [], users: [] }`
- [x] `searchController.js` lê `req.query.q`
- [x] `searchRoutes.js` com `router.get('/search', ...)`
- [x] `app.js` atualizado com `require` + `app.use('/api', searchRoutes)`
- [x] `curl ".../api/search?q=teste"` responde no formato esperado (validado
      nesta sessão)
- [x] `curl ".../api/search"` (sem `q`) responde com `query: ""`
- [x] `curl .../api` continua respondendo normalmente

## Aula 02 — Parte B (Frontend — camada de serviços)

- [x] `src/services/api.js` criado com `axios.create(...)` usando `VITE_API_URL`
- [x] Interceptor de resposta adicionado, com comentário no topo explicando os
      três ramos (sucesso / `error.response` / `error.request` / erro de
      configuração)
- [x] `authService.js`, `searchService.js` (`params: { q }`), `systemService.js`
      criados
- [x] `LandingView.vue` refatorada para usar `systemService` em vez de `fetch`
- [x] Console mostrou `Busca OK:` com `{ query: 'a', challenges: [], users: [] }`
      (print em `atividade02/print-console-busca-ok.jpg`)
- [x] Erro de rede provocado de propósito caiu na mensagem amigável do
      interceptor (print em `atividade02/print-erro-rede.jpg`)
- [x] Bloco de teste temporário (`search('a')` dentro do `onMounted` da
      Landing) removido — a função `search` continua em `searchService.js`

## Aula 03 — Parte A (Backend — persistência e cadastro real)

### Etapa 1 — Dependências
- [x] `sequelize`, `mysql2`, `bcryptjs`, `express-validator` instalados

### Etapa 2 — Banco de dados MySQL
- [x] Banco `codelab_db` criado no MySQL, nome anotado na ficha
- [x] `.env` atualizado com `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- [x] `config/database.js` criado

### Etapa 3 — config/constants.js
- [x] `config/constants.js` criado

### Etapa 4 — Módulo user
- [x] `userModel.js` criado, com o campo de contagem renomeado para `challengesCount`
- [x] `userValidator.js` criado
- [x] `userService.js` criado, com `getPublicProfile` também usando `challengesCount`
- [x] Nunca a senha (nem o hash) é devolvida em nenhuma resposta
- [x] `middlewares/asyncHandler.js` criado
- [x] `middlewares/errorHandler.js` criado
- [x] `userController.js` e `userRoutes.js` criados

### Etapa 5 — app.js
- [x] `userRoutes` e `errorHandler` importados e registrados em `app.js`, na ordem certa
- [x] Terminal exibe "Banco de dados sincronizado!" ao subir a API (validado nesta sessão)
- [x] No MySQL, a tabela `users` existe, com todas as colunas do Model

### Etapa 6 — Testando
- [x] Cadastro com sucesso responde `201` com `{ id, username, email }` (validado nesta sessão)
- [x] Senha curta responde `400` com a mensagem correta (validado nesta sessão)
- [x] Cadastro duplicado responde `500` (validado nesta sessão)
- [x] `GET /profile/:username` confirma os dados persistidos (validado nesta sessão)

## Aula 03 — Parte B (Frontend — tela de Registro)

### Etapa 2 — Navbar
- [x] Link "Criar Conta" (`/register`) adicionado em `TheNavbar.vue`

### Etapa 3 e 4 — Formulário e validação client-side
- [x] Formulário controlado com `v-model` em `RegisterView.vue`
- [x] `validate()` replica os mesmos limites de `config/constants.js` (username 3–20,
      email, senha ≥6, confirmPassword, fullName obrigatório)
- [x] Componente compila sem erros (validado via Vite nesta sessão)

### Etapa 5 — Integração com a API
- [x] `handleSubmit()` chama `authService.register()`, trata sucesso (redireciona
      para `/login`) e erro (`apiErrorMessage`)

## Aula 04 — Parte A (Backend — Login, JWT e Middleware de Autenticação)

### Checklist das tarefas
- [x] `jsonwebtoken` instalado
- [x] `.env` atualizado com `JWT_SECRET` e `JWT_EXPIRES_IN`
- [x] `config/jwt.js` criado, com `generateToken` e `verifyToken`
- [x] `middlewares/auth.js` criado (`isAuthenticated`)
- [x] `userService.js` atualizado com `loginUser` e `getUserProfile`
- [x] `userValidator.js` atualizado com `loginValidator`
- [x] `userController.js` atualizado com `login`, `logout`, `getMyProfile`
- [x] `userRoutes.js` atualizado, com `/profile/me` antes de `/profile/:username`

### Checklist dos testes
- [x] Login com sucesso devolve `token` e `user` (incluindo `isAdmin`) (validado nesta sessão via curl)
- [x] Senha errada devolve `500` com mensagem genérica (validado nesta sessão via curl)
- [x] `GET /profile/me` sem token devolve `401` (validado nesta sessão via curl)
- [x] `GET /profile/me` com token válido devolve os dados do usuário (validado nesta sessão via curl)
- [x] `GET /profile/me` com token inválido devolve `401` (validado nesta sessão via curl)

## Aula 04 — Parte B (Frontend — Login, Pinia e Proteção de Rotas)

### Checklist das tarefas
- [x] `createPinia()` registrado em `main.js`, antes de `.use(router)`
- [x] `stores/auth.js` criado, com persistência via `localStorage`
- [x] Interceptor de requisição anexando `Authorization` quando existe token
- [x] Interceptor de resposta limpando a sessão e redirecionando em qualquer `401`
- [x] Nomes de chave (`auth_token`, `auth_user`) batem entre a store e o interceptor
- [x] Bootstrap 5 (CSS) incluído via CDN em `index.html`
- [x] `assets/main.css` criado, com a cor de marca (`#198754`)
- [x] Tela de Login funcional, chamando `authStore.login(...)`
- [x] Destino padrão pós-login ajustado para a rota `feed`
- [x] Guarda de rota (`router.beforeEach`) bloqueando `requiresAuth: true`
- [x] `useAuthStore()` chamado dentro do callback do `beforeEach`, não no topo do arquivo
- [x] Navbar mostra links diferentes conforme o estado de login
- [x] Logout limpa a sessão e redireciona ao Login

### Checklist de testes
- [x] Login funcional → redireciona à tela Feed (validado nesta sessão)
- [x] F5 na página logado → sessão persiste (validado nesta sessão)
- [x] Logout → acessar rota protegida deve redirecionar ao Login com `?redirect=...` (validado nesta sessão)
- [x] Login a partir da tela redirecionada → deve voltar à rota original (validado nesta sessão)
- [x] Editar o token no localStorage e recarregar rota protegida → logout automático (401) (validado nesta sessão)

## Aula 05 — Parte A (Backend — Upload de Arquivos com Multer)

> Esta seção documenta, retroativamente, o que já existia implementado no código
> (`middlewares/profileMulter.js`, `config/constants.js`, `PUT /profile/me`) mas nunca
> tinha sido registrado neste checklist — as evidências já existem em `atividade05/`.

- [x] Pasta `public/uploads/profiles/` com `default-profile.png`
- [x] `multer` instalado
- [x] `VALIDATION.BIO_MAX: 255` em `config/constants.js`
- [x] `middlewares/profileMulter.js` criado (`fileFilter` jpeg/png/webp, limite 5MB)
- [x] `express.static('/uploads', ...)` registrado em `app.js`, antes das rotas da API
- [x] `profileUpdateValidator`, `updateUserProfile`, `updateProfile` e a rota
      `PUT /profile/me` criados, na ordem correta (depois de `GET /profile/me`, antes de
      `GET /profile/:username`)

### Checklist dos testes
- [x] Atualização sem foto mantém a foto atual (evidência: `atividade05/perfil-carregado.jpg`)
- [x] Atualização com foto nova funciona e remove a antiga do disco (evidência:
      `atividade05/upload-multipart.jpg`, `atividade05/inspecionar_network.jpg`)
- [x] `GET /uploads/profiles/<arquivo>` responde `200`
- [ ] Bio acima de 255 caracteres recusada com `400` — sem evidência salva ainda,
      confirme/recapture se possível

## Aula 05 — Parte B (Frontend — Formulário Multipart e Tela de Meu Perfil)

- [x] Link "Meu Perfil" na Navbar, visível só quando logado (evidência:
      `atividade05/navbar-link-perfil.jpg`)
- [x] `.env` com `VITE_UPLOADS_BASE_URL`, `utils/media.js` criado
- [x] `updateProfile(formData)` em `authService.js` — única chamada a sobrescrever o
      `Content-Type` padrão (verdade até a Aula 05; na Aula 07 `createChallenge` em
      `challengeService.js` passou a ser a segunda, também por causa do multipart)
- [x] Preview local da foto antes do envio, sem chamada de rede (evidência:
      `atividade05/preview-local.jpg`)

## Aula 06 — Checkpoint de Componentização

### Parte A (Backend — sem código novo)
- [x] `checkpoint-01.md` criado e respondido (`atividade06/checkpoint-01.md`), revisando
      o código real de `modules/search/` e `modules/user/`
- [x] Endpoints existentes continuam respondendo como esperado (nenhuma alteração de
      código feita durante a revisão)

### Parte B (Frontend)
- [x] `bootstrap-icons` incluído via CDN em `index.html`
- [x] Três componentes-base (`BaseInput`, `BaseButton`, `FormCard`) criados em
      `src/components/base/`
- [x] Registro, Login e Edição de Perfil refatorados para usar os componentes-base
- [x] Tela de Registro agora visualmente consistente com Login/Perfil, usando a cor de
      marca já existente (`#198754`), sem nenhuma cor nova introduzida
- [x] `composables/useAuth.js` criado (fachada sobre `useAuthStore`)
- [x] Guarda de rota (`router/index.js`) atualizado para usar `useAuth()`
- [x] Navbar atualizada para usar `useAuth()`, com classes reais de navbar Bootstrap
- [x] Sidebar atualizada para usar `useAuth()` — some por completo quando deslogado
- [x] Nenhum link novo aponta para funcionalidade que o projeto ainda não construiu
- [x] Bônus: corrigido bug em `utils/media.js` (usava `VITE_API_BASE_URL`, variável
      inexistente; agora usa `VITE_UPLOADS_BASE_URL`, que já existia no `.env`) — sem
      essa correção a foto de perfil aparecia quebrada

### Checklist de testes
- [x] Cadastro → redireciona ao Login, tela já estilizada (validado nesta sessão)
- [x] Login → redireciona à tela principal (validado nesta sessão)
- [x] Navbar → alterna corretamente entre logado/deslogado (validado nesta sessão)
- [x] Edição de Perfil → dados reais, edição e upload continuam funcionando com os
      componentes-base (validado nesta sessão: bio atualizada via API e persistida)
- [x] Guarda de rota → acesso direto deslogado redireciona ao Login (validado nesta sessão)
- [x] Console sem erros novos durante o teste (nenhum erro encontrado nesta sessão)

## Aula 07 — Parte A (Backend — Model, Associação e Upload)

> Ficha atualizada em `atividade07/ficha-preparacao.md`: model `Challenge`, tabela
> `challenges`, **Grupo B** (um arquivo só: `sourceCode`, código-fonte), sem capa,
> contagem em `challengesCount`.
>
> Observação: o enunciado diz que `DESCRIPTION_MAX` já existia em `config/constants.js`
> desde a Aula 05, mas no CodeLab ela nunca tinha sido criada (só `BIO_MAX`). Foi criada
> hoje, junto com `TITLE_MAX`, cada uma usada exatamente no seu campo.

### Checklist das tarefas
- [x] Pasta de upload da entidade criada (`public/uploads/challenges/`)
- [x] `TITLE_MAX` adicionado a `VALIDATION` (e `DESCRIPTION_MAX`, ver observação acima)
- [x] Model `Challenge` criado, com o campo de arquivo certo para o Grupo B (`sourceCode`)
- [x] `config/associations.js` criado (`User.hasMany(Challenge)` / `Challenge.belongsTo(User)`)
- [x] Middleware de upload `middlewares/challengeMulter.js` criado, coerente com o Grupo B
      (`.single('sourceCode')`)
- [x] `challengeValidator`, `challengeService`, `challengeController` e `challengeRoutes` criados
- [x] Ordem de middlewares na rota conferida (auth → multer → validator → controller)
- [x] Rota montada em `app.js` (`app.use('/api', challengeRoutes)`)
- [x] `config/associations` carregado antes do `sync`
- [x] Tabela `challenges` confirmada no banco, com FK `user_id` → `users(id)`
      (validado nesta sessão com `SHOW CREATE TABLE challenges`)

### Checklist desta etapa
- [x] Upload completo funciona e `challengesCount` do usuário sobe (validado nesta sessão via
      curl: `201` e contagem 0 → 1)
- [x] Cada um dos quatro casos de erro é recusado com o status esperado (validado nesta
      sessão: sem token `401`, sem título `400`, sem arquivo `400`, formato inválido `400`)
- [x] Prints de cada curl salvos em `atividade07/` (`curl-upload-sucesso.jpg`,
      `curl-erro-sem-token.jpg`, `curl-erro-sem-titulo.jpg`, `curl-erro-sem-arquivo.jpg`,
      `curl-erro-formato-invalido.jpg`)

## Aula 07 — Parte B (Frontend — Formulário, Progresso e Alcançabilidade)

### Checklist das tarefas
- [x] Service `challengeService.js` criado, recebendo `onUploadProgress` como parâmetro
- [x] `.progress-bar` adicionada ao CSS (`.thumbnail-preview` não se aplica ao Grupo B;
      no lugar dela, `.code-preview` para a prévia do código)
- [x] Formulário completo em `UploadView.vue`, adaptado ao domínio (título, descrição,
      arquivo de código-fonte) e ao Grupo B
- [x] Barra de progresso funcionando (evidência: `atividade07/progresso-upload.jpg`)
- [x] Prévia de imagem: não se aplica ao Grupo B (arquivo de código); no lugar dela, prévia
      local do código (nome, tamanho e primeiras linhas), sem chamada de rede
- [x] Link "Enviar Desafio" adicionado na Navbar, visível só para usuários autenticados
- [x] Resposta ao checklist de alcançabilidade escrita (`atividade07/checklist-alcancabilidade.md`)

### Checklist desta etapa
- [x] Login → clique em "Enviar Desafio" → URL muda sem recarregar a página (validado nesta
      sessão no navegador: nenhuma requisição de documento nova; evidência: `atividade07/link-envio.jpg`)
- [x] Envio vazio → erros de campo obrigatório (título e arquivo), sem chamada à API
- [x] Se Grupo A: só um dos dois arquivos → erro pedindo o outro (não se aplica, Grupo B)
- [x] Arquivo escolhido → prévia aparece sem nenhuma chamada de rede (evidência:
      `atividade07/formulario-preenchido.jpg`)
- [x] Envio → barra de progresso avança (0% → 100%) → "Desafio enviado com sucesso!"
- [x] DevTools → Network mostra `Content-Type: multipart/form-data; boundary=...` (confirmado na
      requisição real; print em `atividade07/upload-multipart.jpg`)
- [x] Registro criado no banco e `challengesCount` subiu após o envio pela tela (5 → 6)


## Aula 08 — Parte A (Backend — Detalhe, Feed e Streaming)

> **Grupo B**: o bloco de streaming (`/stream`, `Range`, `206`, `Content-Type` de mídia) não se
> aplica. Adaptação: o arquivo do `Challenge` é código-fonte (não imagem), então o detalhe
> busca o arquivo estático em `/uploads/challenges/` e o exibe em um bloco `<pre>`.
> Feed (`getFeed`) fica em `userController.js` / `userRoutes.js`, delegando a consulta ao
> `challengeService`.

### Checklist das tarefas
- [x] `middlewares/optionalAuth.js` criado
- [x] `getChallengeDetails` / `getFeed` adicionados ao service
- [x] Controller e rota do detalhe criados, com `optionalAuth` (`GET /api/challenges/:id`)
- [x] Coluna de visualizações criada (`viewsCount` em `Challenge`)
- [x] Rota de streaming — não se aplica (Grupo B)
- [x] `Content-Type` de mídia — não se aplica (Grupo B)
- [x] `getFeed` adicionado a `userController.js` / `userRoutes.js` (`GET /api/feed`)

### Checklist dos testes
- [x] Detalhe sem token → `200`, `isOwner: false`, views em `1` (evidência: `atividade08/curl-detalhe-sem-token.jpg`)
- [x] Detalhe com o token do dono → `200`, `isOwner: true`, views em `2` (evidência: `atividade08/curl-detalhe-dono.jpg`)
- [x] Detalhe de item inexistente → `404` (evidência: `atividade08/curl-detalhe-inexistente.jpg`)
- [x] `/stream` e `Range` — não se aplicam (Grupo B)
- [x] Feed sem token → `401` (evidência: `atividade08/curl-feed-sem-token.jpg`)
- [x] Feed com token, `?page=1&limit=1` → um item só (evidência: `atividade08/curl-feed-page1.jpg`)
- [x] Feed com token, `?page=2&limit=1` → o próximo item (evidência: `atividade08/curl-feed-page2.jpg`)
- [x] Prints de cada curl salvos em `atividade08/` (6 prints `curl-*.jpg`)

## Aula 08 — Parte B (Frontend — Feed e Detalhe com Dados Reais)

### Checklist das tarefas
- [x] `getChallengeFileUrl` adicionada a `utils/media.js` (caminho estático `/uploads`)
- [x] Classes de card/grade e `.code-view` adicionadas (sem classe de player: Grupo B)
- [x] `getChallengeById` e `getFeed` criadas em `challengeService.js` (o projeto não tem `userService.js`)
- [x] Componente `ChallengeCard.vue` criado
- [x] Tela de Feed com itens reais e "Carregar mais" (implementada; `vite build` ok)
- [x] Tela de Detalhe com o código real, sem player (implementada)
- [x] `isOwner` guardado no estado da tela

### Checklist desta etapa (validar no navegador)
- [x] Login → Feed na Sidebar → itens reais aparecendo (evidência: `atividade08/feed-real.jpg`)
- [x] Clique num card → detalhe sem recarregar a página (validado no navegador)
- [x] Streaming/206 — não se aplica (Grupo B)
- [x] Arquivo exibido por completo no detalhe (equivalente da "imagem em resolução real"; evidência: `atividade08/detalhe-real.jpg`)
- [x] Visualizações sobem a cada acesso ao detalhe (conferido via curl: 1 → 2 no desafio id 10)
- [x] Id inexistente na URL → "Desafio não encontrado." com link "Voltar ao feed", sem quebrar a tela (validado no navegador)
- [x] Prints `feed-real.jpg` e `detalhe-real.jpg` em `atividade08/`

## Aula 09 — Parte A (Backend)

> **Grupo B**: "capa/imagem" = `sourceCode` (único arquivo, código-fonte). No PUT, `multer.single('sourceCode')`
> é opcional e troca o arquivo; no DELETE, um arquivo é apagado.

### Checklist das tarefas
- [x] `reload()` no detalhe (feito na Aula 08; duas chamadas seguidas → views 1 e 2, validado via curl)
- [x] Verificação `404` antes de `403` (helper `findOwned` do `challengeService`, usado por edit/update/delete)
- [x] Ordem banco → disco respeitada (`updateChallenge` e `deleteChallenge`)
- [x] Contador do usuário decrementado na exclusão (`challengesCount`, validado: 9 → 10 → 9)
- [x] Quatro handlers no controller (`getMyChallenges`, `getChallengeForEdit`, `updateChallenge`, `deleteChallenge`)
- [x] Quatro rotas, com Multer antes do validador no `PUT`
- [x] `include` + `order` no nível de cima em `getPublicProfile`
- [x] `isOwner` devolvido no perfil público
- [x] `/profile/:username` com `optionalAuth`, depois de `/profile/me`
- [x] `errorHandler.js` limpa arquivos órfãos e continua sendo o último `app.use`

### Checklist dos testes (validados via curl nesta sessão)
- [x] `/my-challenges`: sem token `401`; com A lista (mais novo primeiro); com B `[]`
- [x] `/challenges/:id/edit`: sem token `401`; B `403`; inexistente `404`; A `200` (views não mudam)
- [x] PUT só texto → `200`, arquivo inalterado, pasta com 8 → 8 arquivos
- [x] PUT com arquivo novo → `200`, nome mudou, pasta 8 → 8
- [x] Órfãos: B com arquivo → `403` e A com título vazio → `400`, pasta 8 → 8
- [x] DELETE: B `403`; A `200`; GET `404`; arquivo sumiu (8 → 7); contador −1; repetir `404`
- [x] Perfil: anônimo `isOwner:false` com lista ordenada; dono `true`; B `false`; inexistente `404`
- [x] Prints de cada curl salvos em `atividade09/` (`curl-1-my-challenges.jpg` a `curl-7-perfil.jpg`; os testes 3, 4, 5 e 6 mostram a contagem de arquivos antes e depois)

## Aula 09 — Parte B (Frontend)

### Checklist das tarefas
- [x] `useClickOutside.js` criado
- [x] `BaseModal.vue` criado
- [x] `getMyChallenges`, `getChallengeForEdit`, `updateChallenge`, `deleteChallenge` criadas
- [x] `getPublicProfile` criada
- [x] Card sem `<a>` gigante, com autor clicável/opcional e slot `actions`
- [x] Feed sem alteração (usa o card com os mesmos props)
- [x] Menu do avatar (abre por clique, à direita, fecha fora/item/Esc) — implementado
- [x] Perfil Público com os três botões (dono / logado / visitante)
- [x] Meus Itens com modal fora do card, `busy` e remoção local
- [x] Editar Item com e sem arquivo novo
- [x] Autor clicável e botão "Editar" condicional no Detalhe
- [x] Link para Meus Itens na mensagem de sucesso do Upload

### Checklist dos testes (validados no navegador)
- [x] Menu do avatar: abre, fecha fora, fecha com Esc, fecha ao escolher um item (evidência: `atividade09/menu-avatar.jpg`)
- [x] "Ver Perfil" → próprio perfil com "Editar Perfil" e os itens (evidência: `atividade09/perfil-publico.jpg`); autor de card de outra conta → perfil com "Seguir", sem recarregar
- [x] Deslogado em `/profile/teste123` → sem "Seguir" e sem "Editar Perfil"; username inexistente → "Usuário não encontrado.", tela intacta
- [x] Meus Itens: com itens → grade com Editar/Excluir; modal abre sem navegar, centralizado; Cancelar/X/fora/Esc fecham; clique dentro não fecha (evidência: `atividade09/modal-exclusao.jpg`). Estado vazio com link "Enviar o primeiro" conferido no código (conta B sem itens: `/my-challenges` → `[]` no curl 1)
- [x] Exclusão confirmada: item some sem recarregar; pasta de uploads 9 → 8 arquivos; perfil 11 → 10 desafios
- [x] Edição: pré-preenchida (evidência: `atividade09/editar.jpg`); só texto → `PUT 200`, arquivo mantido; título vazio → "O título é obrigatório." sem nenhuma requisição na rede; troca de arquivo validada via curl (teste 4)
- [x] Network: o PUT é enviado como `multipart/form-data` (`updateChallenge` em `challengeService.js`; mesmo padrão já evidenciado em `atividade07/upload-multipart.jpg`)
- [x] Conta auditoria01 na URL de edição de item da teste123 → "Você não tem permissão para editar este desafio."; id inexistente → "Desafio não encontrado."
- [x] Deslogado em `/my-challenges` → `/login?redirect=/my-challenges` → após entrar volta para Meus Itens
- [x] "Editar" no Detalhe: visível para o dono, ausente para outros
- [x] Regressão: Feed, Detalhe, Upload, Meu Perfil, Login/Logout
- [x] Prints `menu-avatar.jpg`, `perfil-publico.jpg`, `modal-exclusao.jpg`, `editar.jpg` em `atividade09/`
