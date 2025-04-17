# ProjectManager

Uma plataforma integrada que combina gerenciamento de projetos (Plane) com documentação colaborativa (Outline).

## Características Principais

- Gerenciamento completo de projetos
- Documentação integrada por projeto
- Sem restrições de uso - todas as funcionalidades disponíveis para todos os usuários
- Fácil instalação via Easypanel
- Interface unificada e intuitiva

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Redis
- Docker (opcional, para instalação via Easypanel)

## Instalação via Easypanel

1. Acesse seu painel Easypanel
2. Adicione um novo projeto
3. Selecione "GitHub" como fonte
4. Cole a URL deste repositório
5. O sistema irá configurar automaticamente todos os componentes necessários

## Primeiro Acesso

- Usuário padrão: admin
- Senha padrão: admin
- **Importante**: Altere a senha no primeiro acesso

## Estrutura do Projeto

- `/apps/web` - Frontend principal
- `/apps/api` - Backend API
- `/apps/docs` - Módulo de documentação (Outline)
- `/packages` - Bibliotecas compartilhadas

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar ambiente de desenvolvimento
pnpm dev
```

## Licença

MIT 