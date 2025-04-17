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