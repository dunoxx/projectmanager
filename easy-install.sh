#!/bin/bash

# Script para facilitar a instalação no Easypanel
# Autor: Equipe ProjectManager
# Uso: ./easy-install.sh [domínio]

# Verificar se o domínio foi fornecido
if [ -z "$1" ]; then
  echo "Por favor, forneça um domínio para a instalação."
  echo "Uso: ./easy-install.sh seu-dominio.com"
  exit 1
fi

DOMAIN=$1
INSTALL_DIR="/opt/easypanel/projectmanager"

echo "=== Iniciando instalação do ProjectManager no Easypanel ==="
echo "Domínio: $DOMAIN"
echo ""

# Criar diretório de instalação
echo "Criando diretório de instalação..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Copiar arquivos necessários
echo "Copiando arquivos de configuração..."
cp -r $(dirname "$0")/docker-compose.yml .
cp -r $(dirname "$0")/.env.example .env

# Configurar domínio
echo "Configurando domínio..."
sed -i "s/projectmanager.example.com/$DOMAIN/g" .env

# Gerar senha aleatória para o JWT
JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
echo "Gerando segredo JWT..."
sed -i "s/change-this-in-production/$JWT_SECRET/g" .env

# Importar no Easypanel
echo "Importando no Easypanel..."
/opt/easypanel/bin/easypanel app import --compose docker-compose.yml

echo ""
echo "=== Instalação concluída! ==="
echo "Acesse o painel do Easypanel para finalizar a configuração."
echo "A aplicação estará disponível em: http://$DOMAIN"
echo ""
echo "Credenciais padrão:"
echo "Email: admin@example.com"
echo "Senha: senha123" 