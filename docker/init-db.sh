#!/bin/bash
set -e

# Script para criar múltiplos bancos de dados no PostgreSQL
# baseado na variável POSTGRES_MULTIPLE_DATABASES

function create_user_and_database() {
    local database=$1
    echo "  Criando banco de dados '$database'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE $database;
        GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Múltiplos bancos de dados são criados: $POSTGRES_MULTIPLE_DATABASES"
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        create_user_and_database $db
    done
    echo "Bancos de dados criados"
fi 