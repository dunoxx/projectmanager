# Guia de Desenvolvimento

Este guia contém instruções detalhadas para configurar um ambiente de desenvolvimento para o Project Manager.

## Pré-requisitos

- Node.js v18.x ou superior
- Yarn v1.22.x ou superior
- Docker e Docker Compose
- Git
- Acesso ao repositório do código
- PostgreSQL 13+ (se desenvolver sem Docker)
- Redis 6+ (se desenvolver sem Docker)

## Configuração do Ambiente

### 1. Clonar o Repositório

```bash
git clone https://github.com/sua-organizacao/projectmanager.git
cd projectmanager
```

### 2. Instalar Dependências

```bash
# Instalar dependências do monorepo
yarn install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

### 4. Iniciar Serviços de Desenvolvimento com Docker

A maneira mais simples de iniciar todos os serviços necessários é usando Docker Compose:

```bash
# Iniciar todos os serviços em modo de desenvolvimento
yarn docker:dev

# Ver logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Parar todos os serviços
yarn docker:down
```

### 5. Desenvolvimento Local (Sem Docker)

Se preferir desenvolver sem Docker:

#### 5.1. Iniciar PostgreSQL e Redis

```bash
# Você pode usar Docker apenas para os bancos de dados
docker-compose -f docker/docker-compose.dev.yml up -d postgres redis
```

#### 5.2. Executar Serviços Individualmente

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

## Estrutura do Código

```
projectmanager/
├── docs/               # Documentação
├── docker/             # Configurações Docker
├── infra/              # Configurações de infraestrutura
│   └── nginx/          # Configurações do Nginx
└── packages/           # Pacotes do monorepo
    ├── api/            # Backend da aplicação integrada
    │   ├── src/        # Código fonte da API
    │   └── ...
    ├── common/         # Componentes e funções compartilhadas
    │   ├── auth/       # Autenticação compartilhada
    │   ├── components/ # Componentes React compartilhados
    │   └── ...
    ├── outline/        # Outline modificado
    │   ├── src/        # Código fonte Outline com adaptações
    │   └── ...
    └── web/            # Frontend da aplicação
        ├── src/        # Código fonte do frontend
        └── ...
```

## Fluxo de Trabalho

1. **Iniciar os Serviços**: Use Docker Compose ou inicie os serviços individualmente
2. **Acessar a Aplicação**:
   - Frontend principal: http://localhost:8080
   - API: http://localhost:4000
   - Plane: http://localhost:3000
   - Outline: http://localhost:3001

3. **Fazer Alterações**: Edite o código, as alterações são aplicadas automaticamente com hot-reload

## Dicas de Desenvolvimento

### Hot Reloading

Todos os serviços têm hot-reloading configurado. As alterações devem ser aplicadas automaticamente ao salvar os arquivos.

### Dados de Desenvolvimento

Para carregar dados iniciais de desenvolvimento:

```bash
# Executar migrações
yarn db:migrate

# Carregar dados de exemplo
yarn db:seed
```

### Autenticação em Desenvolvimento

Em desenvolvimento, você pode usar estas credenciais padrão:

- **Email**: admin@example.com
- **Senha**: password123

### Depuração

Para depurar a API:

```bash
# Iniciar com inspetor Node.js
cd packages/api
yarn dev:debug
```

Para depurar o frontend:

- Use as ferramentas de desenvolvedor do navegador
- React DevTools está disponível em desenvolvimento

## Testes

```bash
# Executar todos os testes
yarn test

# Executar testes de um pacote específico
yarn workspace @projectmanager/api test
yarn workspace @projectmanager/web test

# Executar testes com watch mode
yarn workspace @projectmanager/api test:watch
```

## Lint e Formatação

```bash
# Verificar lint em todos os pacotes
yarn lint

# Formatar código
yarn format
```

## Solução de Problemas

### Erro de Conexão com o Banco de Dados

Se você estiver tendo problemas para conectar ao banco de dados:

1. Verifique se o serviço do PostgreSQL está em execução:
   ```bash
   docker-compose -f docker/docker-compose.dev.yml ps
   ```

2. Verifique as variáveis de ambiente no arquivo `.env`

### Problemas com Hot Reload

Se as alterações não estiverem sendo aplicadas automaticamente:

1. Verifique se o serviço está em execução e sem erros nos logs
2. Tente reiniciar o serviço específico

## Enviando Alterações

1. Crie um branch para suas alterações:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Adicione e commit suas alterações:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   ```

3. Envie para o repositório:
   ```bash
   git push origin feature/nome-da-feature
   ```

4. Crie um Pull Request no GitHub 