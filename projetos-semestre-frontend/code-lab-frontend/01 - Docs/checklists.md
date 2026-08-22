# Checklists — Aula 01 e Aula 02 (CodeLab)

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
      (print em `atividade02/print-console-busca-ok.png`)
- [x] Erro de rede provocado de propósito caiu na mensagem amigável do
      interceptor (print em `atividade02/print-erro-rede.png`)
- [x] Bloco de teste temporário (`search('a')` dentro do `onMounted` da
      Landing) removido — a função `search` continua em `searchService.js`

## Pendências que exigem ação manual (fora do alcance desta sessão)

- [ ] Capturar `curl-api.jpg`, `landing-status.jpg` e `erro-cors.jpg` (Aula 01)
      com a API e o front rodando ao mesmo tempo no seu ambiente
