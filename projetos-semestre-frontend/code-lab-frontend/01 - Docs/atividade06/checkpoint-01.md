# Checkpoint-01 — Atividade 06, Parte A (Backend)

Revisão de consistência dos módulos `modules/search/` e `modules/user/`, feita **sem
nenhuma linha de código nova** — o código abaixo é o estado real do projeto, já com
Login/JWT (Aula 04) e upload de foto de perfil (Aula 05) implementados.

## Alguma rota (`*Routes.js`) contém lógica de negócio, em vez de só declarar verbo + caminho + middlewares + controller?

**Não**, com uma observação. `searchRoutes.js` só tem
`router.get('/search', searchController.search)`. `userRoutes.js` declara as 6 rotas
(`register`, `login`, `logout`, `GET /profile/me`, `PUT /profile/me`,
`GET /profile/:username`) como verbo + caminho + middlewares + controller, sem nenhuma
regra de negócio inline.

A única função extra no arquivo é `uploadProfilePhoto`, um wrapper síncrono em volta do
`profileMulter.single('photo')` que converte o erro de callback do Multer em
`next(err)` com `.status = 400`. Isso não é lógica de negócio — é adaptação de uma API de
callback (Multer) para o fluxo de middleware do Express, o tipo de "cola" que
naturalmente vive na camada de rota, junto dos outros middlewares. Vale mencionar por
transparência, mas não é uma violação do padrão.

## Algum Controller consulta o Model diretamente, sem passar pelo Service?

**Não.** Nenhum método de `userController.js` ou `searchController.js` importa
`userModel`/`User`. Todos delegam ao respectivo `Service` (`userService.registerUser`,
`loginUser`, `getMyProfile` → `getUserProfile`, `updateProfile` → `updateUserProfile`,
`getPublicProfile`).

## Algum Service faz referência a `req` / `res`?

**Não.** `userService.js` recebe só parâmetros primitivos (`email, password`,
`userId, { fullName, bio, photoFilename }`) — inclusive o `updateUserProfile` recebe
`photoFilename` (uma string) em vez do objeto `req.file` inteiro, porque é o
`userController.js` quem extrai `req.file.filename` antes de chamar o Service. Isso
mantém o Service livre de qualquer forma de objeto do Express. `searchService.js`
recebe só `query` (string).

## Todo Controller usa `success()` / `error()` de `apiResponse.js`?

**Sim**, para sucesso: todos os 6 métodos de `userController.js` e o `search` de
`searchController.js` retornam via `success(res, ...)`. Nenhum controller chama
`error()` diretamente — erros de negócio são sempre um `Error` lançado (com `.status`
quando aplicável) e tratados centralmente pelo `errorHandler.js`. O middleware
`isAuthenticated` (`middlewares/auth.js`) também lança `Error` com `.status = 401` (não
chama `error()` diretamente) — como é síncrono, o Express 5 já captura esse `throw` e
encaminha automaticamente para o `errorHandler`, então o padrão único de resposta é
preservado de ponta a ponta, mesmo fora de um controller.

## Toda rota que chama uma função `async` está envolvida em `asyncHandler`?

**Sim.** As 6 rotas de `userRoutes.js` cujo handler final é `async`
(`register`, `login`, `logout`, `getMyProfile`, `updateProfile`, `getPublicProfile`)
estão com `asyncHandler(...)`. A rota `GET /search` é síncrona e não usa. O middleware
`isAuthenticated` também é síncrono (`jsonwebtoken.verify` é síncrono) — corretamente não
usa `asyncHandler`, e por isso depende da captura automática de exceções síncronas do
Express 5 (mencionada acima) para chegar ao `errorHandler`.

## Toda validação de entrada usa `express-validator`, sem nenhum `if` manual escondido?

**Sim, com uma exceção esperada e isolada.** `registerValidator`, `loginValidator` e
`profileUpdateValidator` cobrem todos os campos de texto do corpo da requisição via
`express-validator`. Os únicos `if`s manuais no código são regra de negócio no Service
(duplicidade de e-mail/usuário, usuário não encontrado, comparação de senha) — no lugar
certo, fora da camada de validação de formato.

A exceção é a checagem de tipo de arquivo da foto, em
`middlewares/profileMulter.js` (`fileFilter`): `express-validator` valida
`req.body`/`req.query`/`req.params`, não `req.file` — não há como validar um upload
binário com ele. Essa responsabilidade é do próprio Multer (`fileFilter` +
`limits.fileSize`), que é o padrão de mercado para esse caso, e fica isolada num
middleware dedicado de upload, não misturada com a lógica de negócio.

## `config/constants.js` não tem nenhuma constante solta sem uso, nem nenhum valor de validação fora dela?

**Correto.** Conteúdo atual:

```js
module.exports = {
    VALIDATION: {
        USERNAME_MIN: 3,
        USERNAME_MAX: 20,
        PASSWORD_MIN: 6,
        BIO_MAX: 255
    }
};
```

As 4 constantes são usadas: `USERNAME_MIN`/`USERNAME_MAX`/`PASSWORD_MIN` em
`registerValidator`, `BIO_MAX` em `profileUpdateValidator`. Nenhum valor de validação
está hardcoded fora deste arquivo no backend (o limite de tamanho de upload do Multer,
`5 * 1024 * 1024`, está hardcoded em `profileMulter.js` — não é uma "validação de
campo de entrada" no sentido do checklist, mas é um ponto que poderia virar constante
numa próxima rodada de limpeza; não é um problema do padrão de camadas em si).

## A constante de limite da bio (Aula 05) é usada exatamente uma vez, no lugar certo?

**Sim.** `VALIDATION.BIO_MAX` é importado uma vez em `userValidator.js` (junto com o
resto de `VALIDATION`) e usado uma única vez, dentro de `profileUpdateValidator`
(`body('bio').optional({ checkFalsy: true }).isLength({ max: VALIDATION.BIO_MAX })`).
É uma chave própria, dentro do mesmo objeto `VALIDATION` de sempre, sem reaproveitar
`USERNAME_MAX` ou qualquer constante pensada para outro campo — exatamente o erro sutil
que a Aula 05 pedia para evitar.

## Conclusão

O padrão de camadas (Route → Controller → Service → Model) se manteve firme desde a
Aula 01, inclusive depois de login (JWT) e upload de foto (Aula 05) terem sido
adicionados. Nenhuma linha de código foi alterada durante esta revisão — apenas leitura
e análise dos arquivos reais do projeto.
