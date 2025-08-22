# 🏥 Demarco Challenge - Sistema de Gestão de Atestados Médicos

> **Teste Técnico para Desenvolvedor Full-Stack**  
> Este projeto demonstra a implementação de um sistema completo de gestão de atestados médicos, incluindo autenticação, gerenciamento de usuários, upload de documentos e integração com APIs externas.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Executando o Projeto](#-executando-o-projeto)
- [API Documentation](#-api-documentation)
- [Funcionalidades](#-funcionalidades)
- [Pontos de Melhoria](#-pontos-de-melhoria)
- [Contribuição](#-contribuição)

## 🎯 Sobre o Projeto

O **Demarco Challenge** é um sistema completo de gestão de atestados médicos desenvolvido como teste técnico. O projeto demonstra habilidades em desenvolvimento full-stack, arquitetura de software, integração de APIs e boas práticas de desenvolvimento.

### Principais Características

- 🔐 **Autenticação JWT** com refresh tokens e gerenciamento de sessões
- 👥 **Gestão de Usuários** com validação de CPF e controle de status
- 📄 **Upload de Atestados** com verificação de integridade (SHA256)
- 🏥 **Integração ICD** com API da OMS para códigos de doenças
- 📊 **Dashboard** com métricas em tempo real
- 🗄️ **Persistência** com MongoDB e Redis
- ☁️ **Storage** com S3/MinIO via LocalStack
- 🐳 **Containerização** completa com Docker/Podman

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular baseada em monorepo:

```
demarco-challenge/
├── apps/
│   ├── app-frontend/     # Frontend Vue.js
│   └── resource-api/     # Backend NestJS
├── scripts/              # Scripts de automação
├── docker-compose.yml    # Orquestração de containers
└── env.example          # Variáveis de ambiente
```

### Padrões Arquiteturais

- **Monorepo** com pnpm workspace
- **Domain-Driven Design** no backend
- **Modular Architecture** com separação clara de responsabilidades
- **RESTful API** com documentação Swagger
- **SPA** no frontend com Vue Router

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Vue 3** com Composition API
- **TypeScript** para tipagem estática
- **Vite** para build e desenvolvimento
- **PrimeVue** para componentes UI
- **Tailwind CSS** para estilização
- **Pinia** para gerenciamento de estado
- **Vue Router** para roteamento

### Backend

- **NestJS** framework Node.js
- **TypeScript** para tipagem estática
- **MongoDB** com Mongoose ODM
- **Redis** para cache
- **JWT** para autenticação
- **Passport** para estratégias de auth
- **Swagger** para documentação da API
- **Class-validator** para validação

### Infraestrutura

- **Docker/Podman** para containerização
- **MongoDB** para banco de dados
- **Redis** para cache e sessões
- **LocalStack** para emulação S3
- **Nginx** para servir frontend

## 📁 Estrutura do Projeto

### Frontend (`apps/app-frontend/`)

```
src/
├── common/
│   ├── components/       # Componentes reutilizáveis
│   ├── layouts/          # Layouts da aplicação
│   ├── services/         # Serviços de API
│   └── types/            # Definições de tipos
├── modules/
│   ├── auth/             # Módulo de autenticação
│   ├── home/             # Módulo do dashboard
│   ├── users/            # Módulo de usuários
│   └── medical-certificates/ # Módulo de atestados
└── volt/                 # Biblioteca de componentes
```

### Backend (`apps/resource-api/`)

```
src/
├── common/               # Código compartilhado
│   ├── configs/          # Configurações
│   ├── decorators/       # Decorators customizados
│   ├── validators/       # Validadores
│   └── functions/        # Funções utilitárias
├── domain/               # Domínios da aplicação
│   ├── auth/             # Autenticação e sessões
│   ├── users/            # Gestão de usuários
│   ├── medical-certificates/ # Atestados médicos
│   ├── dashboard/        # Métricas e dashboard
│   ├── icd/              # Integração com OMS
│   └── health/           # Health checks
└── infrastructure/       # Infraestrutura
    ├── crypto/           # Criptografia
    └── stores/           # Storage (S3)
```

## ⚙️ Configuração

### Pré-requisitos

- **Node.js** 18+
- **pnpm** 8+
- **Podman** ou **Docker**
- **MongoDB** (opcional, pode usar container)
- **Redis** (opcional, pode usar container)

### Instalação

1. **Clone o repositório**:

   ```bash
   git clone <repository-url>
   cd demarco-challenge
   ```

2. **Instale as dependências**:

   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   cp env.example .env
   # Edite o arquivo .env com suas configurações
   ```

## 🔧 Variáveis de Ambiente

### Configurações da Aplicação

```bash
# Ambiente da aplicação
APP_ENV=develop

# Porta do backend
APP_PORT=3000
```

### Configurações JWT

```bash
# Chaves secretas para JWT (OBRIGATÓRIO - altere em produção)
JWT_SECRET=sua-chave-super-secreta-aqui
JWT_REFRESH_SECRET=sua-chave-refresh-super-secreta-aqui

# Tempo de expiração dos tokens
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

### Configurações do Frontend

```bash
# URL da API backend
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Configurações do Banco de Dados

```bash
# URI de conexão com MongoDB
MONGODB_URI=mongodb://localhost:27017/resource-api
```

### Configurações do Cache (Redis)

```bash
# Configurações do Cache (Redis)
CACHE_HOST=localhost
CACHE_PORT=6379
CACHE_PASSWORD=
CACHE_DB=0
CACHE_TTL=3600
```

### Configurações do Storage (S3/MinIO)

```bash
# Configurações do LocalStack/S3
STORE_URI=http://localhost:4566
STORE_BUCKET_NAME=demarco-challenge
STORE_PRESIGNED_URI_TTL=24
STORE_ACCESS_KEY_ID=test
STORE_SECRET_ACCESS_KEY=test
STORE_REGION=us-east-1
```

### Configurações ICD (OMS)

```bash
# URLs da API da OMS
ICD_API_URI=https://id.who.int/icd/entity
ICD_API_URI_FALLBACK=https://id.who.int/icd/entity

# Configurações OAuth2
ICD_OAUTH_TOKEN_URI=https://icdaccessmanagement.who.int/connect/token
ICD_OAUTH_CLIENT_ID=seu-client-id-da-oms
ICD_OAUTH_CLIENT_SECRET=seu-client-secret-da-oms
ICD_OAUTH_SCOPE=icdapi_access
ICD_OAUTH_GRANT_TYPE=client_credentials
```

> **⚠️ Importante**: Para obter credenciais da API da OMS, acesse [https://icd.who.int/icdapi](https://icd.who.int/icdapi) e registre-se.

## 🚀 Executando o Projeto

### Desenvolvimento Local

1. **Iniciar serviços de infraestrutura**:

   ```bash
   # Com Docker
   docker-compose up mongodb redis localstack -d

   # Com Podman
   podman-compose up mongodb redis localstack -d
   ```

2. **Executar aplicações em modo de desenvolvimento**:

   ```bash
   # Backend
   pnpm --filter resource-api start:dev

   # Frontend (em outro terminal)
   pnpm --filter app-frontend dev
   ```

### Produção com Containers

1. **Inicialização rápida**:

   ```bash
   # Com Docker
   docker-compose up --build

   # Com Podman
   podman-compose up --build
   ```

2. **Executar em background**:
   ```bash
   docker-compose up -d --build
   ```

### Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Executar testes
pnpm --filter resource-api test
pnpm --filter resource-api test:e2e

# Build das aplicações
pnpm --filter app-frontend build
pnpm --filter resource-api build

# Ver logs dos containers
docker-compose logs -f

# Parar todos os serviços
docker-compose down
```

## 📚 API Documentation

A documentação da API está disponível em:

- **Swagger UI**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/api/v1/health

### Principais Endpoints

#### Autenticação

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renovar token
- `DELETE /api/v1/auth/logout` - Logout
- `DELETE /api/v1/auth/logout-all` - Logout de todas as sessões

#### Usuários

- `GET /api/v1/users` - Listar usuários
- `POST /api/v1/users` - Criar usuário
- `GET /api/v1/users/:id` - Buscar usuário
- `PATCH /api/v1/users/:id` - Atualizar usuário
- `DELETE /api/v1/users/:id` - Deletar usuário

#### Atestados Médicos

- `GET /api/v1/medical-certificates` - Listar atestados
- `POST /api/v1/medical-certificates` - Criar atestado (com upload)
- `GET /api/v1/medical-certificates/:id` - Buscar atestado
- `PATCH /api/v1/medical-certificates/:id` - Atualizar atestado
- `DELETE /api/v1/medical-certificates/:id` - Deletar atestado

#### Dashboard

- `GET /api/v1/dashboard/metrics` - Métricas do sistema

#### ICD (OMS)

- `GET /api/v1/icd` - Buscar códigos CID
- `GET /api/v1/icd/:id` - Buscar CID específico

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação

- Login com email/senha
- JWT tokens com refresh automático
- Gerenciamento de múltiplas sessões
- Logout individual e global
- Validação de CPF

### 👥 Gestão de Usuários

- CRUD completo de usuários
- Validação de dados (CPF, email, senha forte)
- Controle de status (ativo/inativo)
- Busca e filtros avançados

### 📄 Atestados Médicos

- Upload de arquivos (PDF, JPEG, PNG)
- Verificação de integridade com SHA256
- Integração com códigos CID da OMS
- URLs pré-assinadas para download
- Relacionamentos com usuários

### 🏥 Integração ICD

- Busca de códigos CID-10 e CID-11
- Autenticação OAuth2 com a OMS
- Cache automático de tokens
- Tratamento de erros robusto

### 📊 Dashboard

- Métricas de usuários
- Estatísticas de sessões
- Dados de atestados médicos
- Atualização em tempo real

## 🎯 Pontos de Melhoria

### Funcionalidades Futuras

- [ ] **Notificações em tempo real** com WebSockets
- [ ] **Relatórios avançados** com gráficos e exportação
- [ ] **Sistema de auditoria** completo
- [ ] **API rate limiting** e throttling
- [ ] **Upload de múltiplos arquivos**
- [ ] **Assinatura digital** de atestados
- [ ] **Integração com sistemas hospitalares**
- [ ] **Mobile app** com React Native

### Melhorias Técnicas

- [ ] **Testes de integração** mais abrangentes
- [ ] **CI/CD pipeline** completo
- [ ] **Monitoramento** com Prometheus/Grafana
- [ ] **Logs estruturados** com ELK Stack
- [ ] **Cache distribuído** com Redis Cluster
- [ ] **Load balancing** para alta disponibilidade
- [ ] **Backup automático** do banco de dados
- [ ] **Deploy automatizado** com Kubernetes

### Segurança

- [ ] **2FA** (Two-Factor Authentication)
- [ ] **Auditoria de segurança** completa
- [ ] **Criptografia** de dados sensíveis
- [ ] **Rate limiting** por IP/usuário
- [ ] **Validação de arquivos** mais rigorosa
- [ ] **Sanitização** de inputs

### Performance

- [ ] **CDN** para arquivos estáticos
- [ ] **Compressão** de respostas
- [ ] **Lazy loading** de componentes
- [ ] **Database indexing** otimizado
- [ ] **Query optimization** no MongoDB

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código

- **TypeScript** com configurações estritas
- **ESLint** e **Prettier** para formatação
- **Conventional Commits** para mensagens
- **Testes unitários** obrigatórios
- **Documentação** atualizada

### Estrutura de Commits

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração de código
test: adiciona ou corrige testes
chore: tarefas de manutenção
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Leonardo Moraes** - Desenvolvedor Full-Stack

- **GitHub**: [@leonardo-moraes360](https://github.com/leonardo-moraes360)
- **Email**: leogm360.work@proton.me

---

> **Nota**: Este projeto foi desenvolvido como teste técnico para a empresa Demarco, demonstrando habilidades em desenvolvimento full-stack, arquitetura de software e boas práticas de desenvolvimento.
