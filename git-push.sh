#!/usr/bin/env bash
# git-push.sh — Push seguro para o repositório do manual (ivannhabilis/manual_atenderbem)
#
# Usa o GITHUB_TOKEN do arquivo de credenciais (~/.hermes/.env).
# Prefere token CLASSIC (ghp_) — com escopo "repo" e escrita confirmada;
# se não houver, usa qualquer GITHUB_TOKEN disponível.
#
# Uso: ./git-push.sh [mensagem de commit opcional]
#   - Se houver mudanças não commitadas, faz commit com a mensagem informada
#     (ou "docs: atualizacao manual" por padrão) e envia.
#   - Se não houver mudanças, apenas envia o que estiver pendente.

set -euo pipefail
cd "$(dirname "$0")"

ENV_FILE="${HOME}/.hermes/.env"
REPO_URL="https://github.com/ivannhabilis/manual_atenderbem.git"

# Prefere token classic (ghp_); senão usa o primeiro GITHUB_TOKEN disponível
TOKEN=""
if [ -f "$ENV_FILE" ]; then
  TOKEN=$(grep '^GITHUB_TOKEN' "$ENV_FILE" | sed 's/^GITHUB_TOKEN=//' | grep -E '^ghp_' | head -1 || true)
  if [ -z "$TOKEN" ]; then
    TOKEN=$(grep '^GITHUB_TOKEN' "$ENV_FILE" | head -1 | sed 's/^GITHUB_TOKEN=//' || true)
  fi
fi
if [ -z "$TOKEN" ]; then
  echo "ERRO: GITHUB_TOKEN não encontrado em $ENV_FILE" >&2
  echo "Crie um token classic com escopo 'repo' e adicione em GITHUB_TOKEN no arquivo de credenciais" >&2
  exit 1
fi

# Commit se houver mudanças e mensagem fornecida
if [ -n "${1:-}" ] && [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "$1"
fi

echo "Enviando para o GitHub (branch main)..."
git push "${REPO_URL/\/\/github.com/\/\/x-access-token:${TOKEN}@github.com}" main
echo "OK: push concluído."
