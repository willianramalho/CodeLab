#!/usr/bin/env bash
# Atividade 08 - Etapa 5 (Parte A): roda cada curl numa tela limpa e tira o
# print da propria janela do Terminal (.jpg) direto em "01 - Docs/atividade08".
# Uso:  bash curls-atividade08.sh
# Arquivo auxiliar: NAO entra nos .zip de entrega.
API=http://localhost:3000/api
DIR="$(cd "$(dirname "$0")/.." && pwd)/01 - Docs/atividade08"
mkdir -p "$DIR"

json() { node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.stringify(JSON.parse(s),null,2))}catch(e){console.log(s)}})'; }
field() { node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);console.log(eval("o."+process.argv[1])??"")})' "$1"; }

read -p "E-mail de login: " EMAIL
read -s -p "Senha: " SENHA; echo
LOGIN=$(curl -s -X POST "$API/login" -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$SENHA\"}")
unset SENHA
TOKEN=$(echo "$LOGIN" | field "data.token")
MEU_ID=$(echo "$LOGIN" | field "data.user.id")
[ -z "$TOKEN" ] && { echo "Login falhou:"; echo "$LOGIN" | json; exit 1; }

# Escolhe um desafio SEU com viewsCount = 0 (o feed nao incrementa views).
ID=$(curl -s "$API/feed?page=1&limit=50" -H "Authorization: Bearer $TOKEN" | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const it=JSON.parse(s).data.items.filter(c=>c.userId==process.argv[1]&&c.viewsCount===0);console.log(it.length?it[0].id:"")})' "$MEU_ID")
[ -z "$ID" ] && { echo "Nenhum desafio seu com viewsCount = 0. Envie um desafio novo pela tela de upload e rode de novo."; exit 1; }

# Janela maior para caber o JSON inteiro.
printf '\e[8;48;130t'; sleep 1

if [ "$TERM_PROGRAM" = "Apple_Terminal" ]; then
  WIN=$(osascript -e 'tell application "Terminal" to id of front window')
fi
print() { # $1 = nome do arquivo
  sleep 1
  if [ -n "$WIN" ]; then screencapture -x -o -t jpg -l "$WIN" "$DIR/$1"
  else screencapture -x -t jpg "$DIR/$1"; fi
}

run() { # $1 = arquivo, $2 = titulo, $3.. = argumentos do curl
  local arq="$1" titulo="$2"; shift 2
  clear
  echo "### Atividade 08 - $titulo"
  echo "\$ curl $*" | sed -E 's/(Bearer )[A-Za-z0-9._-]+/\1<token>/'
  echo
  curl -s -w '\n__HTTP__%{http_code}' "$@" > /tmp/a08.out
  sed '$d' /tmp/a08.out | json
  echo; echo "HTTP $(tail -n1 /tmp/a08.out | sed 's/__HTTP__//')"
  print "$arq"
}

run curl-detalhe-sem-token.jpg   "Detalhe SEM token (200, isOwner:false, views 1)" "$API/challenges/$ID"
run curl-detalhe-dono.jpg        "Detalhe COM token do dono (200, isOwner:true, views 2)" "$API/challenges/$ID" -H "Authorization: Bearer $TOKEN"
run curl-detalhe-inexistente.jpg "Detalhe de id inexistente (404)" "$API/challenges/999999"
run curl-feed-sem-token.jpg      "Feed SEM token (401)" "$API/feed"
run curl-feed-page1.jpg          "Feed COM token, page=1&limit=1 (um item so)" "$API/feed?page=1&limit=1" -H "Authorization: Bearer $TOKEN"
run curl-feed-page2.jpg          "Feed COM token, page=2&limit=1 (proximo item)" "$API/feed?page=2&limit=1" -H "Authorization: Bearer $TOKEN"

clear
echo "Pronto! Desafio usado: id=$ID. Prints salvos em:"
echo "$DIR"; ls -1 "$DIR"
