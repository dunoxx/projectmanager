# Componentes e Funções Compartilhadas

Este pacote contém componentes, tipos, utilitários e funções compartilhadas que são usados em vários pacotes da aplicação Project Manager (integração Plane + Outline).

## Conteúdo

### 1. Autenticação

Implementações compartilhadas para autenticação, incluindo:

- Geração e validação de tokens JWT
- Middleware de autenticação
- Utilitários para mapeamento de permissões entre Plane e Outline

### 2. Tipos de Dados

Definições de tipos TypeScript compartilhados:

- Interfaces para projetos, collections e documentos
- Tipos para mapeamento entre entidades do Plane e Outline
- Tipos para eventos e mensagens entre componentes

### 3. Componentes React

Componentes React compartilhados:

- Cabeçalhos e rodapés consistentes
- Componentes de navegação
- Botões, campos de formulário e componentes de UI padronizados
- Modais e diálogos

### 4. Utilitários

Funções utilitárias:

- Formatação de datas
- Manipulação de strings
- Processamento de URLs
- Manipulação de cores e temas

### 5. Hooks

Hooks React personalizados:

- `useAuth` - Hook para autenticação
- `useTheme` - Hook para temas compartilhados
- `useOutlineInProject` - Hook para integrações Outline-Plane
- `useNotifications` - Hook para sistema de notificações

## Como Usar

### Instalar

Você não precisa instalar este pacote manualmente, pois ele é instalado automaticamente como dependência dos outros pacotes no monorepo.

### Importar

```typescript
// Importar tipos
import { ProjectWithCollection, UserPermissions } from '@projectmanager/common/types';

// Importar utilitários
import { createJwtToken, validateJwtToken } from '@projectmanager/common/auth';

// Importar componentes
import { Button, TextField } from '@projectmanager/common/components';

// Importar hooks
import { useAuth } from '@projectmanager/common/hooks';
```

## Desenvolvimento

Para adicionar novas funcionalidades ou componentes:

1. Crie os arquivos dentro da pasta apropriada
2. Exporte-os no arquivo de índice da pasta
3. Adicione testes quando aplicável
4. Documente o uso com exemplos

```bash
# Executar testes
yarn test

# Construir o pacote
yarn build
```

## Regras de Contribuição

1. Mantenha as funções e componentes simples e focados
2. Documente todas as funções exportadas
3. Adicione tipos TypeScript para todas as exportações
4. Evite dependências externas desnecessárias
5. Teste todos os componentes e funções críticos 