#!/bin/bash

echo "Script para resolver o problema de conflito de porta com NGINX no Easypanel"
echo "Este script deve ser executado no servidor que hospeda o Easypanel"
echo ""

# Listar containers que estão usando a porta 80
echo "Verificando containers que estão usando a porta 80..."
docker ps | grep -E '80/tcp|80->80' | grep nginx

echo ""
echo "Se houver containers NGINX listados acima, você pode:"
echo "1. Parar o container com: docker stop [ID_DO_CONTAINER]"
echo "2. Remover o container com: docker rm [ID_DO_CONTAINER]"
echo ""
echo "Ou pode modificar a configuração do docker-compose.override.yml gerado pelo Easypanel:"
echo "1. Localize o arquivo em /etc/easypanel/projects/[NOME_DO_PROJETO]/docker/docker-compose.override.yml"
echo "2. Modifique a porta do NGINX de 80 para outra porta disponível, como 8080"
echo "3. Reinicie o projeto com: docker compose -f /etc/easypanel/projects/[NOME_DO_PROJETO]/docker/docker-compose.yml -f /etc/easypanel/projects/[NOME_DO_PROJETO]/docker/docker-compose.override.yml -p [NOME_DO_PROJETO] up -d"
echo ""
echo "Alternativamente, você pode desativar o proxy reverso do Easypanel e usar apenas o Traefik:"
echo "1. Acesse a interface do Easypanel"
echo "2. Vá para Configurações"
echo "3. Desative a opção de proxy reverso ou altere a porta padrão" 