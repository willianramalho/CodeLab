# O que colocar nesta pasta (atividade02)

Depois de rodar a API e o front localmente e validar tudo (veja o passo a passo
que o Claude te enviou na conversa), salve aqui dentro:

1. `print-curl-search.png` — print do terminal rodando
   `curl "http://localhost:3000/api/search?q=teste"` respondendo corretamente.
2. `print-console-busca-ok.png` — print do Console do navegador (F12) mostrando
   `Busca OK:` com o objeto `{ query: 'a', challenges: [], users: [] }`.
3. `print-erro-rede.png` — print do erro de rede provocado de propósito (API
   desligada), mostrando a mensagem amigável do interceptor.

O comentário explicando os três ramos do interceptor já foi escrito no topo do
`src/services/api.js` (não precisa recriar, só conferir).
