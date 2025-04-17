# Project Manager - Integração Plane + Outline

Esta aplicação unifica o sistema de gerenciamento de projetos [Plane.so](https://plane.so) com a plataforma de documentação colaborativa [Outline](https://getoutline.com), permitindo o gerenciamento completo de projetos, tarefas e documentação em um único lugar.

## Funcionalidades Principais

- **Estrutura unificada com organizações do Plane**
  - Organizações são criadas no Plane
  - Equipes, papéis e autenticação são centralizados

- **Projetos com documentação integrada**
  - Quando um projeto é criado, cria-se automaticamente:
    - Uma collection no Outline com o nome do projeto
    - Uma aba lateral `📄 Documentation` no projeto
    - Interface do Outline embutida via iframe/integração dentro do projeto

- **Documentação Embutida**
  - Toda funcionalidade do Outline disponível na aba Documentation:
    - Collections, documentos, hierarquia
    - Editor colaborativo 
    - Histórico de versões
    - Permissões por documento
    - Templates
    - Busca interna

- **Autenticação e Permissões Unificadas**
  - Login e autenticação únicos (JWT compartilhado/GoTrue)
  - Usuários geridos pelo Plane
  - Papéis refletidos entre Plane e Outline:
    - `Viewer` → Leitor no Outline
    - `Editor` → Editor no Outline
    - `Owner/Admin` → Admin da collection

## Estrutura do Projeto

```
project-manager/
├── docs/               # Documentação do projeto
├── docker/             # Arquivos Docker para desenvolvimento e produção
├── infra/              # Configurações de infraestrutura
└── packages/           # Pacotes do monorepo
    ├── api/            # Backend da aplicação integrada
    ├── common/         # Bibliotecas compartilhadas
    ├── web/            # Frontend da aplicação integrada
    └── outline/        # Adaptações do Outline para integração
```

## Stack Tecnológica

- **Frontend**: React (Next.js)
- **Backend**: Node.js (Express)
- **Autenticação**: JWT compartilhado ou GoTrue
- **Databases**: PostgreSQL
- **Comunicação**: REST/GraphQL
- **Deploy**: Docker Compose

## Instalação e Desenvolvimento

Consulte o arquivo [INSTALL.md](./docs/INSTALL.md) para instruções detalhadas de configuração, instalação e desenvolvimento.

## Licenças

Este projeto respeita e segue as licenças dos projetos originais:
- [Plane.so](https://github.com/makeplane/plane): AGPL-3.0
- [Outline](https://github.com/outline/outline): BSL 1.1 