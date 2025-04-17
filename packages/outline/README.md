# Outline Adaptado

Este pacote contém uma versão modificada do [Outline](https://getoutline.com) para integração com o sistema Plane. As modificações permitem que o Outline funcione como uma funcionalidade embutida dentro do Plane, especificamente como uma aba de documentação dentro dos projetos.

## Modificações Principais

1. **Sistema de Autenticação**:
   - Adaptação para aceitar tokens JWT compartilhados com o Plane
   - Verificação de autoridade baseada em papéis do Plane

2. **Integração de Collections**:
   - Collections vinculadas a projetos do Plane
   - Criação automática de collections quando projetos são criados
   - Filtragem de interface para mostrar apenas a collection relevante para um projeto específico

3. **UI/UX**:
   - Modo de interface embutida para funcionar dentro de iframe
   - Adaptação de temas para corresponder ao estilo do Plane
   - Barra lateral simplificada quando em modo embutido
   - Remoção de elementos de navegação duplicados

4. **Comunicação entre Serviços**:
   - API para comunicação com o servidor de integração
   - Webhooks para eventos importantes (atualizações de documentos, etc.)
   - Sistema de mensagens entre iframe e página principal

## Como Usar

Este pacote não deve ser usado independentemente. Ele é parte da solução Project Manager e é gerenciado pelo monorepo principal.

### Desenvolvimento Local

Para desenvolvimento local:

```bash
cd packages/outline
yarn dev
```

Isso iniciará o servidor Outline modificado na porta 3001.

## Estrutura de Arquivos

```
outline/
├── src/                   # Código-fonte do Outline com modificações
│   ├── adapters/          # Adaptadores para Plane (autenticação, etc.)
│   ├── components/        # Componentes UI modificados
│   ├── embeddable/        # Modo de visualização embutida
│   ├── plane/             # Integrações específicas do Plane
│   └── ...                # Resto dos arquivos originais do Outline
├── Dockerfile             # Configuração Docker
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

## Diferenças do Outline Original

- Modo embutido para uso dentro de iframe/componente React
- Sistema de autenticação modificado para usar JWT compartilhado
- Integração direta com a API do Plane
- UI adaptada para corresponder ao visual do Plane
- Filtragem automática por Collection baseada no projeto atual

## Notas de Implementação

As mudanças feitas ao Outline original foram mantidas o mínimo possível para facilitar atualizações futuras do Outline. Utilizamos principalmente:

1. Injeção de adaptadores em pontos de extensão existentes
2. Wrapper components para componentes principais
3. Camada de compatibilidade para autenticação e autorização

## Licença

Este pacote respeita a licença BSL 1.1 do Outline original. 