#!/usr/bin/env bash

set -e

echo "🔄 Limpiando referencias remotas obsoletas (fetch -p)..."
git fetch -p

# Obtener ramas locales que apuntan a un remoto ya inexistente (: gone])
GONE_BRANCHES=$(git branch -vv | grep ': gone]' | awk '{print $1}' | grep -vE '^\*|main|dev|qa|staging' || true)

if [ -z "$GONE_BRANCHES" ]; then
  echo "✅ No hay ramas locales huérfanas para eliminar."
  exit 0
fi

echo "🔍 Se encontraron las siguientes ramas locales sin remoto:"
echo "$GONE_BRANCHES"
echo ""

read -p "⚠️  ¿Deseas eliminar estas ramas locales? (s/N): " CONFIRM
if [[ "$CONFIRM" =~ ^[sSyY]$ ]]; then
  echo "$GONE_BRANCHES" | xargs git branch -D
  echo "✨ Ramas locales eliminadas correctamente."
else
  echo "❌ Operación cancelada."
fi