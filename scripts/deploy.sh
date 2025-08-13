#!/bin/bash

# Abrev.io Production Deployment Script
# Este script prepara e faz deploy da aplicação para produção

set -e # Exit on error

echo "🚀 Iniciando deploy do Abrev.io..."

# 1. Verificar branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Aviso: Você não está na branch main (atual: $CURRENT_BRANCH)"
    read -p "Deseja continuar? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 2. Verificar mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erro: Existem mudanças não commitadas"
    echo "Por favor, faça commit ou stash das mudanças antes do deploy"
    exit 1
fi

# 3. Instalar dependências
echo "📦 Instalando dependências..."
npm ci --production

# 4. Executar testes
echo "🧪 Executando testes..."
npm test -- --run

# 5. Build de produção
echo "🔨 Criando build de produção..."
npm run build

# 6. Verificar build
if [ ! -d "dist" ]; then
    echo "❌ Erro: Pasta dist não encontrada"
    exit 1
fi

# 7. Otimizar imagens (se houver)
echo "🖼️  Otimizando imagens..."
find dist -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -exec echo "Otimizando {}" \;

# 8. Criar arquivo de versão
VERSION=$(node -p "require('./package.json').version")
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "{\"version\":\"$VERSION\",\"buildDate\":\"$BUILD_DATE\"}" > dist/version.json

# 9. Comprimir arquivos
echo "📦 Comprimindo arquivos..."
tar -czf deploy-$VERSION.tar.gz dist/

echo "✅ Build concluído com sucesso!"
echo "📄 Arquivo gerado: deploy-$VERSION.tar.gz"
echo ""
echo "📋 Próximos passos:"
echo "1. Fazer upload do arquivo para o servidor"
echo "2. Extrair no diretório web"
echo "3. Configurar nginx/apache"
echo "4. Configurar SSL"
echo "5. Configurar variáveis de ambiente"
echo ""
echo "🎉 Deploy preparado com sucesso!"