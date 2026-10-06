# Ficha de Preparação — CodeLab

| Dado | Seu valor |
|---|---|
| Nome do projeto | CodeLab – Plataforma de Desafios de Programação |
| Entidade principal | Desafio (`Challenge`) |
| Porta da API (back-end) | 3000 |
| Porta do front-end (Vue/Vite) | 5173 |
| Nome do campo de busca da entidade principal (plural, camelCase) | `challenges` |
| Nome do banco de dados MySQL do seu projeto | `codelab_db` |
| Nome do campo de contagem de itens publicados (plural, camelCase) | `challengesCount` |
| Cor de marca do seu projeto (hex) | `#198754` (verde) |
| Nome do model da sua entidade principal (singular, PascalCase) | `Challenge` |
| Nome da tabela (plural, snake_case) | `challenges` |
| Grupo (A ou B, conforme acima) | **B** |
| Nome do campo do arquivo principal | `sourceCode` |
| Nome do campo da capa — só se Grupo A | — (não se aplica: Grupo B) |
| Nome da coluna de contagem no `User` que será incrementada hoje | `challengesCount` |

> **Observação (Grupo B).** A frase da Lista de Projetos usada para definir o grupo do
> CodeLab é "Upload de arquivo com código-fonte como solução do desafio", que cita um
> único tipo de mídia — sem capa nem miniatura. Por isso o projeto usa
> `multer.single('sourceCode')`, um campo de arquivo só, e a linha "Nome do campo da
> capa" fica preenchida com "não se aplica".
>
> **Observação (divergência `DESCRIPTION_MAX`).** O enunciado da Atividade 07 afirma que
> o campo `description` / a constante `DESCRIPTION_MAX` "já existe em
> `config/constants.js` desde a Aula 05, reservado exatamente para hoje". No CodeLab essa
> constante **não existe** antes desta atividade — `config/constants.js` só tinha
> `USERNAME_MIN`, `USERNAME_MAX`, `PASSWORD_MIN` e `BIO_MAX`. Ela foi criada agora, uma
> única vez (`DESCRIPTION_MAX: 500`), junto com `TITLE_MAX` e a chave `UPLOAD`. A
> divergência também está registrada no `checklists.md`.
