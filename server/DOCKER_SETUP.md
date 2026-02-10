# Docker Compose - PostgreSQL

Este projeto utiliza Docker Compose para executar um banco de dados PostgreSQL.

## Pré-requisitos

- Docker e Docker Compose instalados

## Como usar

### 1. Copie o arquivo de variáveis de ambiente

```bash
cp .env.example .env
```

Você pode editar o `.env` para mudar credenciais, nome do banco, etc.

### 2. Inicie os serviços

```bash
docker-compose up -d
```

A opção `-d` executa em background. Remova se preferir ver os logs em tempo real.

### 3. Verifique o status

```bash
docker-compose ps
```

### 4. Acesse o banco de dados

Se quiser conectar diretamente ao PostgreSQL:

```bash
docker-compose exec postgres psql -U postgres -d link_shorter
```

## Dados de conexão

Por padrão:

- **Host:** localhost (ou `postgres` se conectar de outro container)
- **Porta:** 5432
- **Usuário:** postgres
- **Senha:** postgres
- **Banco:** link_shorter

## Gerenciar os containers

### Ver logs

```bash
docker-compose logs -f postgres
```

### Parar os serviços

```bash
docker-compose down
```

### Remover volumes (CUIDADO: deleta o banco)

```bash
docker-compose down -v
```

### Reiniciar

```bash
docker-compose restart
```
