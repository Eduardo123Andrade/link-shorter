# Link Shorter - Server

Backend do encurtador de links construído com Fastify, Prisma e PostgreSQL.

## 🚀 Quick Start

### Opção 1: Script Automático (Recomendado)

```bash
./scripts/init-dev.sh
```

Este script irá:
- ✅ Iniciar containers Docker
- ✅ Instalar dependências
- ✅ Gerar Prisma Client
- ✅ Aplicar migrações
- ✅ Configurar banco de teste

### Opção 2: Passo a Passo Manual

```bash
# 1. Iniciar Docker
npm run docker:up

# 2. Instalar dependências
yarn install

# 3. Gerar Prisma Client
npm run prisma:generate

# 4. Aplicar migrações
npm run prisma:migrate

# 5. Configurar banco de teste
npm run test:setup
```

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia o servidor em modo watch
npm run build            # Compila o TypeScript
npm run start            # Inicia o servidor compilado
npm run setup            # Setup completo (docker + prisma)
```

### Prisma
```bash
npm run prisma:generate      # Gera o Prisma Client
npm run prisma:migrate       # Cria e aplica migrações (dev)
npm run prisma:migrate:test  # Aplica migrações no banco de teste
npm run prisma:studio        # Abre o Prisma Studio
```

### Testes
```bash
npm test                 # Executa todos os testes
npm run test:watch       # Executa testes em modo watch
npm run test:setup       # Configura o banco de dados de teste
```

### Docker
```bash
npm run docker:up        # Inicia os containers
npm run docker:down      # Para os containers
npm run docker:logs      # Exibe logs dos containers
npm run docker:restart   # Reinicia os containers
npm run docker:clean     # Remove containers e volumes
npm run docker:ps        # Lista containers em execução
```

## 🗄️ Banco de Dados

### Desenvolvimento
O banco de dados de desenvolvimento é configurado automaticamente via Docker:
- Host: `localhost:5432`
- Database: `link_shorter`
- User: `postgres`
- Password: `postgres`

### Testes
O banco de testes é separado e configurado via script:
- Host: `localhost:5432`
- Database: `link_shorter_test`
- User: `postgres`
- Password: `postgres`

## 🧪 Executando Testes

### Primeira vez

```bash
# Configure o banco de teste
npm run test:setup

# Execute os testes
npm test
```

### Testes em desenvolvimento

```bash
npm run test:watch
```

## 📁 Estrutura do Projeto

```
server/
├── prisma/
│   ├── migrations/          # Migrações do banco
│   └── schema.prisma        # Schema do Prisma
├── src/
│   ├── __tests__/           # Testes
│   │   ├── repository/      # Testes de integração
│   │   └── setup/           # Setup dos testes
│   ├── generated/           # Prisma Client gerado
│   ├── interfaces/          # Interfaces TypeScript
│   ├── lib/                 # Bibliotecas e configs
│   ├── repository/          # Camada de dados
│   ├── utils/               # Utilitários
│   └── server.ts            # Entrada da aplicação
├── scripts/                 # Scripts de setup
├── docker-compose.yml       # Configuração Docker
└── package.json
```

## 🔧 Variáveis de Ambiente

### `.env` (Desenvolvimento)
```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/link_shorter"
```

### `.env.test` (Testes)
```env
NODE_ENV=test
PORT=3334
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/link_shorter_test"
```

## 🐛 Troubleshooting

### Erro de conexão com o banco

```bash
# Verifique se o Docker está rodando
npm run docker:ps

# Reinicie os containers
npm run docker:restart
```

### Erro nas migrações

```bash
# Limpe e recrie o banco
npm run docker:clean
npm run setup
```

### Erro nos testes

```bash
# Reconfigure o banco de teste
npm run test:setup
npm test
```

## 📝 Licença

MIT
