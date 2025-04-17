# Project Manager

Uma solução integrada de gerenciamento de projetos que une a gestão de tarefas do Plane com a documentação colaborativa do Outline.

## Visão Geral

Este projeto implementa uma integração entre [Plane](https://plane.so) e [Outline](https://www.getoutline.com/) para fornecer uma experiência completa de gerenciamento de projetos, permitindo que as equipes tenham acesso à documentação diretamente dentro da interface de gerenciamento de tarefas.

### Características Principais

- Visualização de documentação do Outline dentro da interface do Plane
- Criação automática de áreas de documentação para novos projetos
- Sincronização de permissões entre projetos e documentação
- Interface unificada com autenticação única
- Experiência visual consistente entre as plataformas

## Arquitetura

O projeto é organizado como um monorepo com a seguinte estrutura:

```
projectmanager/
├── packages/
│   ├── api/              # Backend Node.js/Express
│   ├── web/              # Frontend React/Next.js
│   └── shared/           # Código compartilhado
└── docker/               # Configurações Docker
```

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
- **Frontend**: React, Next.js, TailwindCSS, ShadCN
- **Infraestrutura**: Docker, Nginx
- **Testes**: Jest, React Testing Library

## Instalação no Easypanel

### Requisitos

- Servidor com Easypanel instalado
- Docker e Docker Compose
- Git

### Passos para instalação

1. **Clone o repositório no servidor**:
   ```bash
   git clone https://github.com/seu-usuario/projectmanager.git
   cd projectmanager
   ```

2. **Configuração no Easypanel**:
   - Acesse o Easypanel
   - Clique em "Adicionar Aplicação" > "Importar Aplicação"
   - Selecione "Docker Compose"
   - Navegue até a pasta onde o repositório foi clonado
   - Selecione o arquivo `docker-compose.yml`
   - Configure as variáveis de ambiente (use `.env.example` como referência)
   - Clique em "Implantar"

3. **Pós-instalação**:
   - O Docker Compose irá iniciar automaticamente os serviços (postgres, api, web)
   - O serviço da API executará as migrações e o seed do banco de dados
   - Após a conclusão da implantação, acesse a aplicação através da URL configurada

### Acessando a aplicação

- **Frontend**: http://seu-dominio.com (ou porta configurada no Easypanel)
- **API**: http://seu-dominio.com:3001 (ou porta configurada)
- Credenciais padrão: admin@example.com / senha123

## Configuração do Ambiente de Desenvolvimento

### 1. Configuração do Banco de Dados

```bash
# Na pasta packages/api
docker-compose up -d
```

Isso iniciará um servidor PostgreSQL na porta 5432 e PgAdmin na porta 5050.

### 2. Configuração da API

```bash
# Na pasta packages/api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

### 3. Configuração do Frontend

```bash
# Na pasta packages/web
npm install
npm run dev
```

Após configurar, a aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **PgAdmin**: http://localhost:5050 (credenciais: admin@admin.com / admin)

## Funcionalidades de Documentação

### Visualizar Documentação de um Projeto

A documentação de um projeto pode ser acessada pela aba "Documentação" na página do projeto.

### Criar Documentação para um Projeto

Se um projeto não tiver documentação, será exibido um botão para criar uma nova área de documentação.

### Sincronizar Permissões

As permissões entre o projeto no Plane e a coleção no Outline podem ser sincronizadas a qualquer momento pelo botão "Sincronizar Permissões" na interface.

## Estrutura do Banco de Dados

O sistema utiliza o Prisma como ORM para gerenciar o banco de dados PostgreSQL. Os principais modelos incluem:

- `User`: Usuários do sistema
- `Organization`: Organizações que agrupam projetos
- `Project`: Projetos gerenciados pelo sistema
- `Task`: Tarefas associadas a projetos
- `IntegrationConfig`: Configurações de integração entre projetos e documentação

## Testes

Para executar os testes:

```bash
# Na pasta packages/api
npm test

# Na pasta packages/web
npm test
```

## Contribuição

Para contribuir com o projeto:

1. Faça um fork deste repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

# Project Manager - Guia de Implantação no Easypanel

Este guia fornece instruções para implantar o Project Manager no Easypanel.

## Arquitetura

O Project Manager é composto por vários serviços:

1. **web**: Frontend Next.js que serve como interface principal
2. **api**: Backend Node.js/Express que fornece APIs para o frontend
3. **plane**: Serviço de gerenciamento de projetos
4. **outline**: Serviço de documentação
5. **postgres**: Banco de dados PostgreSQL

## Requisitos

- Easypanel instalado e configurado
- Acesso ao repositório Git do projeto

## Instruções de Implantação

### 1. Preparação para o Easypanel

O Easypanel pode ter conflitos com a porta 80 ao tentar criar um container NGINX. Para evitar este problema, nosso arquivo docker-compose.yml já inclui uma definição especial de serviço NGINX que é efetivamente desabilitada.

### 2. Importe o Projeto no Easypanel

1. Acesse o painel do Easypanel
2. Selecione "Create Project" ou "Novo Projeto"
3. Escolha a opção "Docker Compose"
4. Selecione o repositório clonado
5. Verifique se o arquivo docker-compose.yml está sendo reconhecido
6. **IMPORTANTE**: Certifique-se que o Easypanel não esteja usando seu próprio container NGINX

### 3. Configure o Roteamento no Easypanel

Ao configurar o projeto no Easypanel:

1. Para cada serviço, verifique suas configurações de proxy
2. Certifique-se de que os caminhos correspondam às nossas configurações Traefik:
   - **web**: caminho `/` na porta `3000`
   - **api**: caminho `/api` na porta `3001`
   - **plane**: caminho `/plane` na porta `3000`
   - **outline**: caminho `/outline` na porta `3001`

### 4. Resolução de Problemas

Se você continuar encontrando o erro "Bind for 0.0.0.0:80 failed: port is already allocated", tente uma das seguintes soluções:

1. **Usando a UI do Easypanel**:
   - Acesse o serviço NGINX no painel do Easypanel
   - Remova explicitamente o serviço NGINX ou
   - Altere sua porta de 80 para outra porta disponível

2. **Alternativamente, você pode usar a CLI do Docker**:
   - Acesse o servidor via SSH
   - Execute `docker ps` para listar os containers
   - Identifique o container NGINX que está usando a porta 80
   - Execute `docker stop [id_do_container]` para parar o container

3. **Definição de portas alternativas**:
   - Se nada funcionar, modifique as configurações do Traefik no Easypanel
   - Configure-o para usar portas alternativas em vez da porta 80

### 5. Acessando a Aplicação

Após a implantação bem-sucedida:

- Frontend principal: `http://seu-dominio/`
- API: `http://seu-dominio/api`
- Plane: `http://seu-dominio/plane`
- Outline: `http://seu-dominio/outline`

## Manutenção

Para atualizar a aplicação:
1. Faça push das alterações para o repositório
2. No painel do Easypanel, selecione o projeto
3. Clique em "Rebuild" ou "Reconstruir"

## Configuração

### Portas

A aplicação utiliza as seguintes portas por padrão:

- **9080**: HTTP (NGINX)
- **9443**: HTTPS (NGINX)
- **9001**: API
- **9002**: Serviço Plane
- **9003**: Serviço Outline
- **9004**: Serviço Web (Frontend)
- **9432**: PostgreSQL
- **9379**: Redis

Para alterar as portas, defina as variáveis de ambiente correspondentes:

```bash
HTTP_PORT=9080
HTTPS_PORT=9443
API_PORT=9001
PLANE_PORT=9002
OUTLINE_PORT=9003
WEB_PORT=9004
POSTGRES_PORT=9432
REDIS_PORT=9379
```

### Execução

```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Inicie os serviços
docker-compose -f docker/docker-compose.yml up -d
```

### Acesso

Após a inicialização, acesse a aplicação em:

- http://localhost:9080
- https://localhost:9443 (quando SSL estiver configurado) 