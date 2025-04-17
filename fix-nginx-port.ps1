Write-Host "Script para resolver o problema de conflito de porta com NGINX no Easypanel" -ForegroundColor Cyan
Write-Host "Este script deve ser executado no servidor que hospeda o Easypanel" -ForegroundColor Cyan
Write-Host ""

# Listar containers que estão usando a porta 80
Write-Host "Verificando containers que estão usando a porta 80..." -ForegroundColor Yellow
docker ps | Select-String -Pattern "80/tcp|80->80" | Select-String -Pattern "nginx"

Write-Host ""
Write-Host "Se houver containers NGINX listados acima, você pode:" -ForegroundColor Green
Write-Host "1. Parar o container com: docker stop [ID_DO_CONTAINER]" -ForegroundColor White
Write-Host "2. Remover o container com: docker rm [ID_DO_CONTAINER]" -ForegroundColor White
Write-Host ""
Write-Host "Ou pode modificar a configuração do docker-compose.override.yml gerado pelo Easypanel:" -ForegroundColor Green
Write-Host "1. Localize o arquivo em /etc/easypanel/projects/[NOME_DO_PROJETO]/docker/docker-compose.override.yml" -ForegroundColor White
Write-Host "2. Modifique a porta do NGINX de 80 para outra porta disponível, como 8080" -ForegroundColor White
Write-Host "3. Reinicie o projeto com: docker compose -f /etc/easypanel/projects/[NOME_DO_PROJETO]/docker/docker-compose.yml -f /etc/easypanel/projects/[NOME_DO_PROJETO]/docker/docker-compose.override.yml -p [NOME_DO_PROJETO] up -d" -ForegroundColor White
Write-Host ""
Write-Host "Alternativamente, você pode desativar o proxy reverso do Easypanel e usar apenas o Traefik:" -ForegroundColor Green
Write-Host "1. Acesse a interface do Easypanel" -ForegroundColor White
Write-Host "2. Vá para Configurações" -ForegroundColor White
Write-Host "3. Desative a opção de proxy reverso ou altere a porta padrão" -ForegroundColor White 