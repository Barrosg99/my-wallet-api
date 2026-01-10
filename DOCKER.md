# Como usar Docker com My Wallet API

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (ou use os valores padrão):

```env
PORT=3000
SRV_PORT=3000
DB_USER=postgres
DB_HOST=db
DB_PORT=5432
DB_DATABASE=mywallet
DB_PASSWORD=postgres
```

**Nota:** O `DB_HOST` deve ser `db` (nome do serviço no docker-compose) quando rodando com Docker.

## Executando o projeto

### Iniciar os containers

```bash
docker-compose up -d
```

### Ver os logs

```bash
docker-compose logs -f api
```

### Parar os containers

```bash
docker-compose down
```

### Parar e remover volumes (apaga os dados do banco)

```bash
docker-compose down -v
```

### Rebuild da imagem

```bash
docker-compose build
```

## Acessar a API

A API estará disponível em: `http://localhost:3000`

## Acessar o banco de dados

Para acessar o PostgreSQL diretamente:

```bash
docker-compose exec db psql -U postgres -d mywallet
```

Ou usando uma ferramenta externa:
- Host: `localhost`
- Port: `5432`
- User: `postgres` (ou o valor de `DB_USER`)
- Password: `postgres` (ou o valor de `DB_PASSWORD`)
- Database: `mywallet` (ou o valor de `DB_DATABASE`)

## Inicialização do banco

As tabelas são criadas automaticamente na primeira execução através do arquivo `docker-init.sql`.
