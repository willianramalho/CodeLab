# Checklists — Aula 01 a Aula 06 (CodeLab)

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
      `Content-Type` padrão
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
