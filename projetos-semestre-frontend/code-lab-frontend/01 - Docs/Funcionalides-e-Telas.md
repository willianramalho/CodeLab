# Funcionalidades e Telas — CodeLab

Tradução das funcionalidades da entrada "12. CodeLab – Plataforma de Desafios de
Programação" (Lista de Projetos) para as telas do front-end, entidade principal:
**Desafio** (`challenge`).

| Funcionalidade típica | Tela equivalente | Vale para o CodeLab? |
|---|---|---|
| Landing / página inicial | `LandingView.vue` | Sempre |
| Cadastro e autenticação | `auth/LoginView.vue`, `auth/RegisterView.vue` | Sempre |
| Exploração de desafios por nível de dificuldade (Feed) | `FeedView.vue` | Sempre — feed "Seguindo" e "Geral" |
| Envio de solução (upload de código-fonte) | `UploadView.vue` (`/challenges/upload`) | Sim — "upload de arquivo com código-fonte como solução do desafio" |
| Detalhe de um desafio | `ChallengeDetailView.vue` (`/challenges/:id`) | Sempre |
| Edição da minha submissão/solução | `EditChallengeView.vue` (`/challenges/:id/edit`) | Sim — usuário pode reenviar/editar a solução enviada |
| "Meus desafios" (favoritados/resolvidos pelo usuário) | `MyChallengesView.vue` (`/my-challenges`) | Sim — "favoritar desafios resolvidos" |
| Perfil próprio / perfil público | `profile/MyProfileView.vue`, `profile/PublicProfileView.vue` | Sim — projeto tem "seguir / deixar de seguir outros usuários" |
| Listas/favoritos personalizados | — | Não se aplica — favoritos já cobertos por `MyChallengesView`; CodeLab não tem coleções/playlists |
| Busca | `SearchView.vue` | Sim — módulo `GET /api/search` implementado na Aula 02 |
| Notificações | `NotificationsView.vue` | Opcional — não citado explicitamente na especificação, mantido como scaffold para curtidas/comentários/seguidores |
| Dashboard administrativo | `admin/AdminDashboardView.vue` | Sempre — "dashboard com estatísticas de desempenho dos usuários" |
| Denúncias / moderação | `admin/AdminReportsView.vue` | Sim — "moderação de conteúdos e controle de usuários" |
| Gerenciamento de usuários (admin) | `admin/AdminUsersView.vue` | Sempre |
| Gerenciamento do conteúdo principal (admin) | `admin/AdminChallengesView.vue` (`/admin/challenges`) | Sempre — "cadastro e gerenciamento de desafios e categorias" |
| Rota não encontrada | `NotFoundView.vue` | Sempre |

> Observação: diferente do template de referência (Shortz-App, entidade "vídeo"),
> o CodeLab não tem playlists/coleções — por isso essa linha foi removida das
> telas e das rotas do projeto.
