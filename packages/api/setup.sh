#!/bin/bash

# Script para configurar o ambiente de desenvolvimento

echo "Configurando ambiente de desenvolvimento para ProjectManager API..."

# Instalar dependências
echo "Instalando dependências..."
npm install

# Iniciar o banco de dados com Docker
echo "Iniciando banco de dados com Docker..."
docker-compose up -d

# Aguardar inicialização do banco de dados
echo "Aguardando inicialização do banco de dados..."
sleep 10

# Gerar cliente Prisma
echo "Gerando cliente Prisma..."
npm run prisma:generate

# Executar migrações
echo "Executando migrações do banco de dados..."
npm run prisma:migrate

# Executar seed
echo "Populando banco de dados com dados iniciais..."
npm run db:seed

echo "Ambiente de desenvolvimento configurado com sucesso!"
echo "Para iniciar a API em modo de desenvolvimento, execute: npm run dev"
echo "Para acessar o PgAdmin, abra: http://localhost:5050"
echo "Credenciais do PgAdmin: admin@admin.com / admin" 