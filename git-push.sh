#!/usr/bin/env bash
# git-push.sh — Push seguro para o repositório do manual (ivannhabilis/manual_atenderbem)
#
# MOTIVO: ~/.hermes/.env contém DOIS GITHUB_TOKEN:
#   1º (github_pat_...)  fine-grained SEM permissão de escrita -> push 403
#   2º (ghp_...)         classic com escopo "repo"             -> push OK
# Este script escolhe o token CLASSIC (ghp_) automaticamente.
#
# Uso: ./git-push.sh [mensagem de commit opcional]
#   - Se houver mudanças não commitadas, faz commit com a mensagem informada
#     (ou "docs: atualizacao manual" por padrão) e envia.
#   - Se não houver mudanças, apenas envia o que estiver pendente.

set -euo pipefail
cd "$(dirname "$0")"

ENV_FILE="${HOME}/.hermes/.env"
REPO_URL="https://github.com/ivannhabilis/manual_atenderbem.git"

# Escolhe o token classic (ghp_) — o único com escrita confirmada
TOKEN=""
if [ -f "$ENV_FILE" ]; then
  TOKEN=$(grep '^GITHUB_TOKEN' "$ENV_FILE" | sed 's/^GITHUB_TOKEN=//' | grep -E '^ghp_' | head -1 || true)
fi
if [ -z "$TOKEN" ]; then
  echo "ERRO: token classic (ghp_) não encontrado em $ENV_FILE" >&2
  echo "Crie um token classic com escopo 'repo' e adicione/ajuste em GITHUB_TOKEN no .env" >&2
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
