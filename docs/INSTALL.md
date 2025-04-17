# Guia de Instalação

Este guia explica como configurar e executar o Project Manager (integração Plane + Outline) em ambientes de desenvolvimento e produção.

## Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ e Yarn
- PostgreSQL 13+
- Redis 6+
- Git

## Configuração para Desenvolvimento

### 1. Clonar o Repositório

```bash
git clone https://github.com/sua-organizacao/projectmanager.git
cd projectmanager
```

### 2. Variáveis de Ambiente

Copie os arquivos de exemplo e configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Configure as seguintes variáveis principais:

```
# Configurações do banco de dados
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/projectmanager
DATABASE_URL_OUTLINE=postgresql://postgres:postgres@postgres:5432/outline

# Configuração Redis
REDIS_URL=redis://redis:6379

# Autenticação
SECRET_KEY=seu_secret_key_seguro_aqui
JWT_SECRET=seu_jwt_secret_aqui

# URLs dos serviços
PLANE_URL=http://localhost:3000
OUTLINE_URL=http://localhost:3001
```

### 3. Instalação de Dependências

```bash
# Instala todas as dependências do monorepo
yarn install
```

### 4. Executando com Docker Compose (Recomendado)

Para desenvolvimento, você pode usar o Docker Compose para iniciar todos os serviços:

```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

Isso iniciará:
- PostgreSQL
- Redis
- API integrada
- Serviço do Plane
- Serviço do Outline
- Frontend da aplicação

Acesse a aplicação em: http://localhost:3000

### 5. Desenvolvimento Local (Sem Docker)

Se preferir executar os serviços localmente:

```bash
# Terminal 1: API
cd packages/api
yarn dev

# Terminal 2: Frontend
cd packages/web
yarn dev

# Terminal 3: Serviço Outline modificado
cd packages/outline
yarn dev
```

## Configuração para Produção

### 1. Construir as Imagens

```bash
docker-compose -f docker/docker-compose.yml build
```

### 2. Configurar Variáveis de Ambiente de Produção

Crie um arquivo `.env.production` com as configurações de produção, incluindo:

```
NODE_ENV=production
DATABASE_URL=postgresql://usuario:senha@seu-db-host:5432/projectmanager
DATABASE_URL_OUTLINE=postgresql://usuario:senha@seu-db-host:5432/outline
REDIS_URL=redis://seu-redis-host:6379
```

### 3. Deploy com Docker Compose

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 4. Configurar Nginx como Proxy Reverso

Um exemplo de configuração do Nginx para produção está disponível em `infra/nginx/projectmanager.conf`.

## Migrações e Seed

### Inicializar o Banco de Dados

```bash
# Executar migrações
yarn workspace @projectmanager/api db:migrate

# Executar seed (dados iniciais)
yarn workspace @projectmanager/api db:seed
```

## Resolução de Problemas

Consulte o arquivo [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para problemas comuns e suas soluções.

## Atualizações

Para atualizar o sistema:

```bash
git pull
yarn install
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up -d
``` 