# CodeLab – Plataforma de Desafios de Programação

Uma plataforma interativa onde desenvolvedores podem resolver desafios de programação, acompanhar seu desempenho e interagir com a comunidade.

## 🎯 Funcionalidades

### Para Usuários
- ✅ Cadastro e autenticação
- ✅ Exploração de desafios organizados por níveis de dificuldade
- ✅ Submissão de soluções e acompanhamento de pontuação
- ✅ Favoritar desafios resolvidos
- ✅ Comentários e avaliação dos desafios
- ✅ Seguir / deixar de seguir outros usuários
- ✅ Curtir / descurtir soluções e comentários
- ✅ Feed "Seguindo" (soluções de quem você segue) e Feed "Geral" (todas as submissões)
- ✅ Upload de arquivo com código-fonte como solução do desafio

### Para Administradores
- 📊 Dashboard com estatísticas de desempenho dos usuários
- 🛠️ Cadastro e gerenciamento de desafios e categorias
- 🔒 Moderação de conteúdos e controle de usuários

## 🚀 Como Começar

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn
- Vue.js 3+
- Express.js

### Instalação

#### Backend (API)
```bash
cd /Users/willian/CodeLab
npm install
npm run dev
```
A API estará disponível em `http://localhost:3000`

#### Frontend
```bash
cd /Users/willian/CodeLab/projetos-semestre-frontend/code-lab-frontend
npm install
npm run dev
```
O frontend estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
CodeLab/
├── bin/                          # Arquivos de inicialização
├── config/                       # Configurações
├── middlewares/                  # Middlewares Express
│   └── apiResponse.js            # Helper de resposta padronizada
├── modules/                      # Módulos de domínio
│   └── search/                   # Módulo de busca
│       ├── searchService.js
│       ├── searchController.js
│       └── searchRoutes.js
├── routes/                       # Rotas principais
│   └── index.js                  # GET /api
├── app.js                        # Configuração principal Express
├── package.json                  # Dependências
└── .env                          # Variáveis de ambiente

projetos-semestre-frontend/code-lab-frontend/
├── src/
│   ├── views/
│   │   ├── LandingView.vue       # Página inicial
│   │   └── ...
│   ├── services/
│   │   ├── api.js                # Instância Axios com interceptor
│   │   ├── authService.js        # Serviço de autenticação
│   │   ├── searchService.js      # Serviço de busca
│   │   └── systemService.js      # Serviço de sistema
│   ├── components/
│   │   └── ...
│   └── router/
│       └── index.js              # Configuração Vue Router
├── package.json
├── .env
└── vite.config.js
```

## 🔌 Arquitetura

### Backend - Padrão de Camadas
Cada módulo segue a arquitetura **Route → Controller → Service**:

- **Route**: Define as rotas HTTP e mapeia para o controller
- **Controller**: Recebe parâmetros da requisição, chama o service e formata a resposta
- **Service**: Contém a lógica de negócio e acesso a dados

### Frontend - Serviços Centralizados
- **api.js**: Instância única do Axios com interceptor de erro centralizado
- **Services**: Abstraem as chamadas HTTP, nenhum componente faz fetch/axios direto
- **Componentes Vue**: Consomem apenas os services

## 🔄 Fluxo de Comunicação

```
Frontend Component
    ↓
Services (searchService, authService, etc)
    ↓
Axios Instance (com interceptor)
    ↓
Backend Routes
    ↓
Controllers
    ↓
Services
    ↓
Response (Normalizado)
    ↓
Interceptor (Processa erros)
    ↓
Frontend Component
```

## 📝 Variáveis de Ambiente

### Backend (.env)
```
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Testes

### Teste da Busca (Curl)
```bash
curl "http://localhost:3000/api/search?q=teste"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": null,
  "data": {
    "query": "teste",
    "challenges": [],
    "users": []
  }
}
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Express.js** - Framework web
- **Morgan** - Logger de requisições
- **CORS** - Controle de origem
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **Vue.js 3** - Framework progressivo
- **Vue Router 4** - Roteamento
- **Pinia 4** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## 📚 Padrões Utilizados

### Tratamento de Erros Centralizado
O Axios possui um interceptor que normaliza todos os erros no formato:
```javascript
{
  message: "Descrição do erro",
  errors: [],
  status: 400
}
```

Isso garante que todas as telas tratam erros de forma uniforme.

### Resposta Padronizada da API
```javascript
{
  success: boolean,
  message: string | null,
  data: object
}
```

## 🎓 Aulas e Atividades

- **Aula 01**: Configuração inicial, layout base e Landing Page
- **Aula 02**: Módulo de busca, camada de serviços e interceptor Axios

## 📄 Licença

Este projeto é parte de uma atividade acadêmica.

## 👤 Autor

**Willian Ramalho** - [@willianramalho](https://github.com/willianramalho)

---

**Status**: Em desenvolvimento 🚧
