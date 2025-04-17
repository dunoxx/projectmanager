# Guia de Instalação no Easypanel

Este documento fornece instruções detalhadas para instalar o ProjectManager no Easypanel, uma plataforma de gerenciamento de contêineres Docker simples e intuitiva.

## Método 1: Instalação com Script Automatizado

A maneira mais simples de instalar o ProjectManager é usando nosso script de instalação automatizado.

### Requisitos
- Servidor com Easypanel instalado
- Acesso SSH ao servidor
- Domínio configurado para apontar para o servidor

### Passos

1. **Conecte-se ao servidor via SSH**:
   ```bash
   ssh usuario@seu-servidor
   ```

2. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/projectmanager.git
   cd projectmanager
   ```

3. **Execute o script de instalação**:
   ```bash
   chmod +x easy-install.sh
   ./easy-install.sh seu-dominio.com
   ```

4. **Acesse o Painel do Easypanel**:
   - Abra seu navegador e acesse o painel do Easypanel
   - Verifique se a aplicação ProjectManager aparece na lista de aplicações
   - Clique na aplicação para ver os detalhes e status dos contêineres

5. **Acesse sua aplicação**:
   - Após a conclusão da implantação, acesse `http://seu-dominio.com`
   - Use as credenciais padrão: 
     - Email: admin@example.com
     - Senha: senha123

## Método 2: Instalação Manual via Easypanel

Se preferir fazer a instalação manualmente, siga estes passos:

### Requisitos
- Servidor com Easypanel instalado
- Acesso ao painel do Easypanel

### Passos

1. **Prepare os arquivos**:
   - Clone o repositório em seu computador local:
     ```bash
     git clone https://github.com/seu-usuario/projectmanager.git
     cd projectmanager
     ```
   - Copie o arquivo `docker-compose.yml` e `.env.example` (renomeie para `.env`)
   - Edite o arquivo `.env` e configure as variáveis conforme necessário

2. **No painel do Easypanel**:
   - Acesse o painel administrativo do Easypanel
   - Clique em "Aplicações" > "Adicionar Aplicação"
   - Selecione "Importar Composição Docker"

3. **Configure a aplicação**:
   - Faça upload do arquivo `docker-compose.yml`
   - Defina as variáveis de ambiente (ou faça upload do arquivo `.env`)
   - Configure o domínio para sua aplicação
   - Defina portas e volumes conforme necessário

4. **Inicie a aplicação**:
   - Clique em "Implantar" ou "Iniciar"
   - Aguarde a conclusão da implantação (isso pode levar alguns minutos)

5. **Acesse sua aplicação**:
   - Após a conclusão da implantação, acesse `http://seu-dominio.com`
   - Use as credenciais padrão: 
     - Email: admin@example.com
     - Senha: senha123

## Configurações Avançadas

### Conexão com Plane e Outline Existentes

Se você já tem instâncias do Plane e Outline em execução, pode integrá-las com o ProjectManager:

1. **Edite o arquivo `.env`**:
   ```
   PLANE_URL=http://sua-instancia-plane.com/api
   OUTLINE_URL=http://sua-instancia-outline.com/api
   ```

2. **Reinicie a aplicação**:
   - No painel do Easypanel, vá para a aplicação ProjectManager
   - Clique em "Reiniciar"

### Segurança

1. **Altere as senhas padrão**:
   - Após o primeiro login, acesse as configurações do usuário
   - Altere a senha padrão para uma senha forte

2. **Configure HTTPS**:
   - No painel do Easypanel, vá para "Configurações" > "SSL/TLS"
   - Configure um certificado SSL para seu domínio

## Solução de Problemas

### Logs e Diagnóstico

Se encontrar problemas durante a instalação ou execução:

1. **Verifique os logs dos contêineres**:
   - No painel do Easypanel, acesse a aplicação ProjectManager
   - Clique em cada serviço (postgres, api, web) e verifique os logs

2. **Problemas comuns**:
   - **Erro de conexão com o banco de dados**: Verifique se o serviço postgres está em execução e se as credenciais estão corretas
   - **Erro na API**: Verifique se as migrações do Prisma foram executadas corretamente
   - **Frontend não carrega**: Verifique se a API está acessível e se a URL está configurada corretamente

### Suporte

Se precisar de ajuda adicional:
- Abra uma issue no GitHub: [github.com/seu-usuario/projectmanager/issues](https://github.com/seu-usuario/projectmanager/issues)
- Entre em contato com nossa equipe de suporte: suporte@example.com 