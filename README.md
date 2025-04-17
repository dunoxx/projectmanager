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

### 1. Clone o Repositório

Clone o repositório do Project Manager:

```bash
git clone https://github.com/seu-usuario/projectmanager.git
cd projectmanager
```

### 2. Importe o Projeto no Easypanel

1. Acesse o painel do Easypanel
2. Selecione "Create Project" ou "Novo Projeto"
3. Escolha a opção "Docker Compose"
4. Selecione o repositório clonado
5. Verifique se o arquivo docker-compose.yml está sendo reconhecido

### 3. Configure o Domínio (Opcional)

Se deseja usar um domínio personalizado:
1. Na configuração do projeto, defina o domínio desejado
2. Certifique-se de que os registros DNS apontam para o servidor Easypanel

### 4. Inicie a Implantação

1. Revise todas as configurações
2. Clique em "Deploy" ou "Implantar"
3. Aguarde a conclusão do processo

## Solução de Problemas

Se encontrar o erro "port is already allocated":
- Certifique-se de que a porta 80 está disponível no servidor
- Verifique se não há outros serviços usando essa porta

Erros de conexão com o banco de dados:
- Verifique se as credenciais do PostgreSQL estão corretas
- Certifique-se de que o serviço postgres está em execução

## Acessando a Aplicação

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