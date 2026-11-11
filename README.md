# CodeLab – Plataforma de Desafios de Programação

Plataforma onde desenvolvedores publicam desafios de programação (com arquivo de código-fonte), exploram os desafios da comunidade e mantêm um perfil público.

Projeto da disciplina de Gerência de Configuração de Software. O repositório é tratado como item de configuração: veja [Gestão de Configuração](#-gestão-de-configuração-gcs).

## 🎯 Funcionalidades

| Situação | Funcionalidade |
|---|---|
| ✅ Pronto | Cadastro, login (JWT) e logout |
| ✅ Pronto | Perfil próprio e público, com foto e bio |
| ✅ Pronto | Upload de desafio com arquivo de código-fonte e barra de progresso |
| ✅ Pronto | Feed de desafios (paginado), detalhe do desafio, editar e excluir os próprios desafios |
| ✅ Pronto | Busca de desafios e usuários |
| 🚧 Em andamento | Comentários, curtidas e seguir usuários (feed "Seguindo") |
| 🚧 Planejado | Área de administração (dashboard, moderação de conteúdo e usuários) |

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 20.19+ (ou 22.12+) e npm — exigência do Vite 8
- MySQL 8 em execução

### 1. Banco de dados
Crie o banco vazio. As tabelas são criadas e atualizadas automaticamente pelos modelos Sequelize (`sequelize.sync({ alter: true })`) quando a API sobe; não há migrations.
```sql
CREATE DATABASE codelab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (API)
```bash
# na raiz do repositório
cp .env.example .env        # preencha DB_PASSWORD e JWT_SECRET; o .env nunca é versionado
npm install
npm run dev                 # ou: npm start
```
A API estará em `http://localhost:3000/api`. Teste rápido:
```bash
curl http://localhost:3000/api
```

### 3. Frontend
```bash
cd projetos-semestre-frontend/code-lab-frontend
cp .env.example .env
npm install
npm run dev
```
O frontend estará em `http://localhost:5173`. Para gerar o build de produção: `npm run build` (saída em `dist/`).

### Variáveis de ambiente

| Arquivo | Variável | Descrição |
|---|---|---|
| `.env` (raiz) | `PORT` | Porta da API (padrão `3000`) |
| | `CORS_ORIGIN` | Origem permitida do frontend (`http://localhost:5173`) |
| | `JWT_SECRET` / `JWT_EXPIRES_IN` | Segredo e validade do token. Use um segredo longo e aleatório |
| | `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASSWORD` | Conexão MySQL |
| `.env` (frontend) | `VITE_API_URL` | URL base da API (`http://localhost:3000/api`) |
| | `VITE_UPLOADS_BASE_URL` | URL base dos arquivos enviados (`http://localhost:3000`) |

Os arquivos `.env.example` listam todas as variáveis, sem valores reais.

## 🧪 Testes

Ainda **não há suíte de testes automatizados** (`npm test` não existe). Ela é o marco 2 do [Plano de GCS](docs/Plano_GCS_CodeLab.docx), junto com o pipeline de CI. Até lá, a verificação é manual, por `curl` na API e pelas telas do frontend. As evidências de cada atividade estão em `projetos-semestre-frontend/code-lab-frontend/01 - Docs/`.

## 🔌 Endpoints da API

Todos sob `/api`. Respostas no formato `{ success, message, data }`.

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/` | – | Status da API |
| GET | `/search?q=` | – | Busca de desafios e usuários |
| POST | `/register` | – | Cadastro |
| POST | `/login` | – | Login (retorna o JWT) |
| POST | `/logout` | – | Logout |
| GET / PUT | `/profile/me` | JWT | Ver / atualizar o próprio perfil (foto em multipart) |
| GET | `/profile/:username` | opcional | Perfil público |
| GET | `/feed` | JWT | Feed paginado de desafios |
| POST | `/challenges` | JWT | Publicar desafio (multipart, com arquivo) |
| GET | `/challenges/:id` | opcional | Detalhe do desafio |
| GET | `/challenges/:id/edit` | JWT | Dados para edição (somente o dono) |
| PUT / DELETE | `/challenges/:id` | JWT | Editar / excluir (somente o dono) |
| GET | `/my-challenges` | JWT | Desafios do usuário logado |

## 📁 Estrutura do Projeto

```
CodeLab/
├── app.js                 # Configuração do Express e sync do banco
├── bin/www                # Inicialização do servidor
├── config/                # Banco, JWT, constantes e associações Sequelize
├── middlewares/           # Auth, upload (Multer), erros e resposta padronizada
├── modules/               # Route → Controller → Service (+ Model e Validator)
│   ├── user/
│   ├── challenge/
│   └── search/
├── routes/                # GET /api
├── public/uploads/        # Arquivos enviados pelos usuários
├── docs/                  # Plano de Gerenciamento de Configuração
├── .github/               # CODEOWNERS e modelos de PR e Issue
└── projetos-semestre-frontend/code-lab-frontend/   # Frontend Vue 3 + Vite
    └── src/
        ├── views/         # Telas (auth, perfil, desafios, admin)
        ├── components/    # Componentes base, layout e de domínio
        ├── services/      # Chamadas HTTP (api.js = Axios com interceptor)
        ├── stores/        # Pinia (autenticação)
        ├── composables/   # useAuth, useClickOutside
        └── router/        # Vue Router com guardas de rota
```

## 🔧 Arquitetura

- **Backend:** cada módulo segue **Route → Controller → Service**. A rota mapeia o endpoint, o controller trata a requisição e formata a resposta, e o service concentra regra de negócio e acesso a dados (Sequelize).
- **Frontend:** nenhum componente chama `fetch`/`axios` diretamente. Tudo passa por `services/`, que usam a instância única do Axios em `api.js`, cujo interceptor normaliza os erros em `{ message, errors, status }`.

## 🛠️ Tecnologias

- **Backend:** Node.js, Express 5, Sequelize 6, MySQL, JWT, bcryptjs, Multer, express-validator, Morgan, CORS, dotenv
- **Frontend:** Vue 3, Vue Router, Pinia, Axios, Vite

## 🔧 Gestão de Configuração (GCS)

- Plano de Gerenciamento de Configuração (enfoque DevOps): [docs/Plano_GCS_CodeLab.docx](docs/Plano_GCS_CodeLab.docx)
- Fluxo: Issue → branch `feature/<issue>-<descricao>` → Pull Request (título em Conventional Commits) → revisão do par → merge por squash.
- A branch `main` é protegida: não aceita push direto, apenas Pull Request aprovado por outra pessoa. O par de revisão é `@WillianRamalhoTotvs` (revisor automático via [CODEOWNERS](.github/CODEOWNERS)).
- **Janela de resposta a PRs:** até 3 dias úteis.
- **Canal de comunicação:** [Issues](https://github.com/willianramalho/CodeLab/issues) e comentários nos Pull Requests do repositório.
- Ambientes (GitHub Environments): `staging` e `production`, este com revisor obrigatório.
- Modelos de PR e Issue: pasta [.github/](.github/).
- Segredos: nunca no código. O `.env` é local e está no `.gitignore`; no pipeline serão usados GitHub Secrets.

## 👤 Autor

**Willian Ramalho** – [@willianramalho](https://github.com/willianramalho)

Projeto acadêmico.
