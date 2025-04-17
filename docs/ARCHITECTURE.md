# Arquitetura do Sistema

Este documento detalha a arquitetura da integração entre Plane e Outline, explicando como os componentes interagem e como o fluxo de dados acontece.

## Visão Geral da Arquitetura

A aplicação utiliza uma arquitetura de microserviços, onde o Plane e o Outline são componentes principais que se comunicam através de uma camada de serviços compartilhados. O frontend unificado fornece uma experiência integrada.

![Arquitetura](./images/architecture.png)

## Componentes Principais

### 1. Frontend Unificado (`packages/web`)

- **Tecnologia**: React, Next.js
- **Função**: Fornece uma interface única para acessar tanto as funcionalidades do Plane quanto do Outline
- **Características**:
  - Aba de documentação embutida dentro dos projetos
  - Compartilhamento do sistema de autenticação
  - Temas e estilos unificados

### 2. API de Integração (`packages/api`)

- **Tecnologia**: Node.js, Express
- **Função**: Gerencia a comunicação entre Plane e Outline, lidando com eventos que afetam ambos os sistemas
- **Principais Responsabilidades**:
  - Sincronização de usuários e permissões
  - Criação de collections no Outline quando projetos são criados no Plane
  - Gerenciamento de tokens JWT compartilhados

### 3. Serviço Plane

- Mantido praticamente intacto
- Expõe endpoints adicionais para integração com o Outline

### 4. Serviço Outline Adaptado (`packages/outline`)

- Adaptações do Outline original para suportar:
  - Autenticação via JWT compartilhado
  - Estrutura de collections vinculada a projetos
  - Renderização dentro de iframe/componente React

### 5. Camada de Autenticação Compartilhada (`packages/common`)

- **Tecnologia**: JWT, GoTrue (opcional)
- **Função**: Fornece autenticação unificada entre os serviços

## Modelo de Dados

### Entidades Principais e Relacionamentos

```
┌──────────────────────┐       ┌──────────────────────┐
│       PLANE          │       │       OUTLINE        │
├──────────────────────┤       ├──────────────────────┤
│ Organization         │       │                      │
│  │                   │       │                      │
│  └─── Project        │───────│ Collection           │
│        │             │       │  │                   │
│        └─── Issues   │       │  └─── Document       │
│                      │       │                      │
│ User                 │───────│ User                 │
│ Permission           │───────│ Permission           │
└──────────────────────┘       └──────────────────────┘
```

- **Mapeamento de Entidades**:
  - Organization (Plane) → Sem entidade correspondente no Outline
  - Project (Plane) → Collection (Outline)
  - User (Plane) → User (Outline) - mesmo usuário, sincronizado
  - Permission (Plane) → Permission (Outline) - mapeamento de papéis

## Fluxos de Comunicação

### 1. Criação de Projeto

```sequence
Frontend -> API: Criar Projeto
API -> Plane: Criar Projeto
Plane -> API: Projeto Criado (ID: xxx)
API -> Outline: Criar Collection com nome do projeto
Outline -> API: Collection Criada (ID: yyy)
API -> Database: Salvar mapeamento Project:Collection
API -> Frontend: Projeto criado com sucesso
```

### 2. Autenticação e Acesso a Documentos

```sequence
Usuario -> Frontend: Login
Frontend -> API: Autenticar (email/senha)
API -> Auth Service: Validar credenciais
Auth Service -> API: Token JWT
API -> Frontend: Token JWT
Frontend -> Plane API: Requisições com JWT
Frontend -> Outline API: Requisições com mesmo JWT
```

## Considerações Técnicas

### Proxy Reverso e Roteamento

O Nginx atua como proxy reverso, encaminhando requisições para os serviços apropriados com base na rota:

- `/` → Frontend principal
- `/api/plane/...` → API do Plane
- `/api/outline/...` → API do Outline
- `/org/:slug/project/:projectId/docs/...` → Outline embutido

### Armazenamento de Dados

- PostgreSQL compartilhado entre Plane e Outline
- Schemas separados para cada serviço
- Redis para cache e sessões

### Sincronização de Permissões

| Papel no Plane | Permissão no Outline |
|----------------|----------------------|
| Viewer         | Reader               |
| Member         | Reader               |
| Editor         | Editor               |
| Admin          | Admin                |
| Owner          | Admin                |

## Escalabilidade e Performance

- Cada serviço pode ser escalonado independentemente
- Redis para gerenciamento de sessões compartilhadas
- Caching de queries frequentes

## Segurança

- JWT com curta expiração
- Refresh tokens para renovação
- CSRF protection
- Rate limiting
- Sanitização de input
- Auditoria de acessos a documentos sensíveis 