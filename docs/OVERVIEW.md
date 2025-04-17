# Visão Geral do Projeto

## Objetivo

O Project Manager é uma aplicação que integra o sistema de gerenciamento de projetos [Plane.so](https://plane.so) com a plataforma de documentação colaborativa [Outline](https://getoutline.com). O objetivo principal é fornecer uma solução unificada onde a documentação do Outline é exibida e gerenciada diretamente dentro dos projetos do Plane.

## Componentes Implementados

### 1. Estrutura de Monorepo

O projeto foi estruturado como um monorepo gerenciado com Yarn Workspaces e Turborepo, consistindo em vários pacotes:

- `packages/api`: API de integração entre Plane e Outline
- `packages/web`: Frontend unificado
- `packages/common`: Bibliotecas e componentes compartilhados
- `packages/outline`: Versão adaptada do Outline

### 2. Integração de Documentação em Projetos

A principal funcionalidade implementada é a criação automática e exibição de documentação Outline dentro de projetos do Plane:

- Quando um projeto é criado no Plane, uma collection correspondente é criada no Outline
- Uma aba "📄 Documentation" é adicionada à interface do projeto
- Esta aba exibe a documentação do Outline relacionada ao projeto específico

### 3. Sistema de Autenticação Unificado

Para fornecer uma experiência integrada:

- Foi implementado um sistema de autenticação unificado via JWT
- As permissões do Plane são mapeadas automaticamente para permissões do Outline
- O mesmo usuário e sessão são usados em ambos os sistemas

### 4. API de Integração

Uma API foi desenvolvida para gerenciar a comunicação entre os sistemas:

- Webhooks para sincronizar eventos entre Plane e Outline
- Endpoints para criar collections no Outline quando projetos são criados
- Sincronização de permissões e usuários

### 5. Infraestrutura

A configuração de infraestrutura foi implementada usando:

- Docker e Docker Compose para desenvolvimento e produção
- Nginx como proxy reverso para unificar os serviços
- PostgreSQL compartilhado entre Plane e Outline
- Redis para cache e gerenciamento de sessões

## Arquitetura

O sistema segue uma arquitetura de microserviços, com componentes independentes que se comunicam através de APIs:

```
┌─────────────────┐     ┌──────────────────┐
│  Frontend Web   │────►│  Nginx (Proxy)   │
└─────────────────┘     └───────┬──────────┘
                               ┌▼─┐
                            ┌──┴──┴───┐
                 ┌─────────►│  API    │◄─────────┐
                 │          └──┬──┬───┘          │
                 │          ┌──▼──▼───┐          │
           ┌─────▼────┐     │         │    ┌─────▼────┐
           │  Plane   │◄────┤  Redis  │───►│ Outline  │
           └─────┬────┘     │         │    └─────┬────┘
                 │          └────┬────┘          │
                 │          ┌────▼────┐          │
                 └──────────► Postgres ◄──────────┘
                            └─────────┘
```

## Fluxos de Funcionamento

### Criação de Projeto

1. Usuário cria um projeto no Plane
2. Um webhook é enviado para a API de integração
3. A API cria uma collection correspondente no Outline
4. O mapeamento entre projeto e collection é armazenado
5. Um documento inicial é criado na collection

### Acesso à Documentação

1. Usuário acessa um projeto no Plane
2. Navega para a aba "📄 Documentation"
3. A interface do Outline é carregada dentro de um iframe
4. A API de integração filtra o conteúdo para mostrar apenas a collection relevante
5. O usuário pode interagir com a documentação sem sair do contexto do projeto

## Tecnologias Utilizadas

- **Frontend**: React, Next.js, TypeScript
- **Backend**: Node.js, Express
- **Databases**: PostgreSQL, Redis
- **Autenticação**: JWT
- **DevOps**: Docker, Nginx
- **Ferramentas**: Yarn, Turborepo

## Próximos Passos

- **Implementação Completa do Outline**: Finalizar a adaptação do Outline para integração perfeita
- **Melhorias na UI**: Aprimorar a transição entre Plane e Outline
- **Sincronização Bidirecional**: Implementar sincronização de metadados entre documentos e tarefas
- **Testes Automatizados**: Adicionar suítes de testes para componentes críticos
- **CI/CD**: Configurar pipeline de integração e entrega contínua 